"""CDP smoke test for the one-minute trip and open invitation ending.

Start the site on port 8000 and Chrome remote debugging on port 9225, then run
this file. The test uses an isolated browser profile and never touches a user's
normal browser storage.
"""

import base64
import json
import os
import time
import urllib.request

import websocket


CDP_PORT = os.getenv("CDP_PORT", "9225")
GAME_URL = os.getenv("GAME_URL", "http://127.0.0.1:8000/")


def request_json(url, method="GET"):
    request = urllib.request.Request(url, method=method)
    with urllib.request.urlopen(request, timeout=5) as response:
        return json.load(response)


def close_target(target_id):
    with urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json/close/{target_id}", timeout=5):
        pass


for open_target in request_json(f"http://127.0.0.1:{CDP_PORT}/json"):
    if open_target.get("type") == "page":
        close_target(open_target["id"])
target = request_json(f"http://127.0.0.1:{CDP_PORT}/json/new?{GAME_URL}", "PUT")
print("[smoke] target opened", flush=True)
socket = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=5)
message_id = 0


def command(method, params=None):
    global message_id
    message_id += 1
    socket.send(json.dumps({
        "id": message_id,
        "method": method,
        "params": params or {},
    }))
    while True:
        message = json.loads(socket.recv())
        if message.get("id") == message_id:
            return message.get("result", {})


def evaluate(expression, user_gesture=False):
    response = command("Runtime.evaluate", {"expression": expression, "returnByValue": True, "userGesture": user_gesture})
    result = response["result"]
    if "exceptionDetails" in response:
        raise RuntimeError(response["exceptionDetails"])
    return result.get("value")


def wait_for_reload():
    time.sleep(1.5)


command("Emulation.setDeviceMetricsOverride", {
    "width": 390,
    "height": 844,
    "deviceScaleFactor": 1,
    "mobile": True,
})
wait_for_reload()
print("[smoke] initial page loaded", flush=True)
evaluate("""
  const last = setTimeout(() => {}, 0);
  for (let id = 1; id <= last; id += 1) clearInterval(id);
  localStorage.removeItem('little-dog-europe-v1');
  localStorage.removeItem('stellla-europe-intro-seen-v1');
  location.reload();
  'reloading';
""")
wait_for_reload()
print("[smoke] clean state reloaded", flush=True)

if os.getenv("INTRO_SCREENSHOT"):
    screenshot = command("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
    with open(os.environ["INTRO_SCREENSHOT"], "wb") as image_file:
        image_file.write(base64.b64decode(screenshot["data"]))

intro = evaluate("""
  (() => {
    const dialog = document.querySelector('#introDialog');
    const heading = dialog.querySelector('h2').textContent;
    const wasOpen = dialog.open;
    const rect = dialog.getBoundingClientRect();
    const copy = dialog.querySelector('.intro-copy');
    const actionsRect = document.querySelector('.topbar-actions').getBoundingClientRect();
    document.querySelector('#enterGameButton').click();
    document.querySelector('#prepareButton').click();
    return {
      wasOpen,
      heading,
      viewport: window.innerWidth,
      dialogRect: {left: rect.left, right: rect.right, width: rect.width},
      copyWidth: {client: copy.clientWidth, scroll: copy.scrollWidth},
      topbarFitsViewport: actionsRect.right <= window.innerWidth && actionsRect.left >= 0,
      packingVisible: !document.querySelector('#packingPanel').hidden,
      pageFitsViewport: document.documentElement.scrollHeight <= window.innerHeight
    };
  })()
""")
assert intro["wasOpen"] and intro["heading"] == "欢迎来到stellla的珍贵记忆匣子"
assert intro["packingVisible"] and intro["pageFitsViewport"] and intro["topbarFitsViewport"]
print("[smoke] intro and packing passed", flush=True)

evaluate("document.querySelector('#musicButton').click(); 'music requested';", user_gesture=True)
time.sleep(.25)
music_on = evaluate("({pressed: document.querySelector('#musicButton').getAttribute('aria-pressed'), active: document.querySelector('#musicButton').classList.contains('music-on')})")
assert music_on == {"pressed": "true", "active": True}
evaluate("document.querySelector('#musicButton').click(); 'music stopped';", user_gesture=True)
time.sleep(.1)
assert evaluate("document.querySelector('#musicButton').getAttribute('aria-pressed')") == "false"
print("[smoke] music toggle passed", flush=True)

trip = evaluate("""
  document.querySelector('[data-id="madeleine"]').click();
  document.querySelector('[data-id="pina-colada"]').click();
  document.querySelector('#departButton').click();
  JSON.parse(localStorage.getItem('little-dog-europe-v1')).trip;
""")
assert trip["noteId"] and trip["fragmentId"]
assert trip["openedPostcards"] == []
away_room = evaluate("getComputedStyle(document.querySelector('#sceneArt')).backgroundImage.includes('home-room-away-v1.png')")
assert away_room
print("[smoke] departure and away room passed", flush=True)

evaluate("""
  const state = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
  state.trip.startedAt = Date.now() - 61000;
  const last = setTimeout(() => {}, 0);
  for (let id = 1; id <= last; id += 1) clearInterval(id);
  localStorage.setItem('little-dog-europe-v1', JSON.stringify(state));
  location.reload();
  'reloading';
""")
wait_for_reload()
print("[smoke] returned state loaded", flush=True)

first_postcard = evaluate("""
  (() => {
    const reveal = document.querySelector('[data-reveal-postcard]');
    const dialogOpen = document.querySelector('#postcardDialog').open;
    reveal.click();
    const hasArt = getComputedStyle(document.querySelector('.postcard-reveal-art'))
      .backgroundImage.includes('assets/');
    document.querySelector('[data-close-postcard]').click();
    return { dialogOpen, hasArt };
  })()
""")
assert first_postcard["dialogOpen"] and first_postcard["hasArt"]
time.sleep(.4)

second_postcard = evaluate("""
  (() => {
    const reveal = document.querySelector('[data-reveal-postcard]');
    const dialogOpen = document.querySelector('#postcardDialog').open;
    reveal.click();
    document.querySelector('[data-close-postcard]').click();
    const state = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
    return { dialogOpen, opened: state.trip.openedPostcards.length, album: state.album.length };
  })()
""")
assert second_postcard == {"dialogOpen": True, "opened": 2, "album": 2}
print("[smoke] postcard queue passed", flush=True)

returned = evaluate("""
  (() => {
    const state = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
    return {
      note: document.querySelector('.travel-note p')?.textContent,
      discovered: state.discoveredFragments,
      fragmentId: state.trip.fragmentId,
      rewardClaimed: state.trip.rewardClaimed
    };
  })()
""")
assert returned["note"] and returned["rewardClaimed"]
assert returned["fragmentId"] in returned["discovered"]
print("[smoke] return rewards passed", flush=True)

repeat_trip = evaluate("""
  (() => {
    const before = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
    const collectionText = document.querySelector('#collectionProgress').textContent;
    const button = document.querySelector('#resetButton');
    const buttonText = button.textContent;
    const buttonRect = button.getBoundingClientRect();
    const buttonVisible = buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;
    const roomIsHome = !getComputedStyle(document.querySelector('#sceneArt')).backgroundImage.includes('home-room-away-v1.png');
    button.click();
    const after = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
    return {
      buttonText,
      buttonVisible,
      roomIsHome,
      collectionText,
      albumBefore: before.album.length,
      albumAfter: after.album.length,
      tripCleared: after.trip === null,
      packingVisible: !document.querySelector('#packingPanel').hidden
    };
  })()
""")
assert repeat_trip["buttonText"] == "再次出发"
assert repeat_trip["buttonVisible"] and repeat_trip["roomIsHome"] and repeat_trip["tripCleared"] and repeat_trip["packingVisible"]
assert repeat_trip["albumBefore"] == repeat_trip["albumAfter"] == 2
assert "2/29" in repeat_trip["collectionText"]
print("[smoke] repeat trip and postcard collection passed", flush=True)

evaluate("""
  (() => {
    const state = JSON.parse(localStorage.getItem('little-dog-europe-v1'));
    state.album = window.GAME_DATA.memories.slice(0, 8).map(item => item.id);
    state.discoveredFragments = window.GAME_DATA.fragments.slice(0, 3).map(item => item.id);
    state.fragments = Object.fromEntries(state.discoveredFragments.map(id => [id, 0]));
    const last = setTimeout(() => {}, 0);
    for (let id = 1; id <= last; id += 1) clearInterval(id);
    localStorage.setItem('little-dog-europe-v1', JSON.stringify(state));
    location.reload();
    return 'reloading';
  })()
""")
wait_for_reload()

finale = evaluate("""
  (() => {
    const button = document.querySelector('[data-open-invite]');
    const fragmentText = document.querySelector('.fragment-item.owned small')?.textContent;
    button.click();
    return {
      dialogOpen: document.querySelector('#inviteDialog').open,
      heading: document.querySelector('#inviteDialog h2').textContent,
      fragmentText,
      imageLoaded: getComputedStyle(document.querySelector('.invite-art'))
        .backgroundImage.includes('final-invitation-v1.png')
    };
  })()
""")
assert finale["dialogOpen"] and finale["imageLoaded"]
assert "一起走走" in finale["heading"]
assert "当前 0 枚" in finale["fragmentText"]
print("[smoke] finale passed", flush=True)

reset_confirmation = evaluate("""
  (() => {
    document.querySelector('#closeInvite').click();
    document.querySelector('#albumButton').click();
    const button = document.querySelector('#resetAllButton');
    button.click();
    return {
      armed: button.classList.contains('armed'),
      text: button.textContent,
      saveStillPresent: Boolean(localStorage.getItem('little-dog-europe-v1'))
    };
  })()
""")
assert reset_confirmation["armed"] and reset_confirmation["saveStillPresent"]
assert "确认清空" in reset_confirmation["text"]
evaluate("document.querySelector('#resetAllButton').click(); 'reloading';")
wait_for_reload()
reset_result = evaluate("""
  ({
    saveCleared: localStorage.getItem('little-dog-europe-v1') === null,
    albumCount: document.querySelector('#albumCount').textContent,
    introRemembered: localStorage.getItem('stellla-europe-intro-seen-v1') === 'yes'
  })
""")
print(f"[smoke] reset result: {reset_result}", flush=True)
assert reset_result == {"saveCleared": True, "albumCount": "0", "introRemembered": True}
print("[smoke] two-step local reset passed", flush=True)

print(json.dumps({"intro": intro, "musicOn": music_on, "trip": trip, "awayRoom": away_room, "firstPostcard": first_postcard, "secondPostcard": second_postcard, "returned": returned, "repeatTrip": repeat_trip, "finale": finale, "resetConfirmation": reset_confirmation, "resetResult": reset_result}, ensure_ascii=False))
socket.close()
close_target(target["id"])
