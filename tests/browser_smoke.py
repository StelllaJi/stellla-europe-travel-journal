"""CDP smoke test for the one-minute trip and open invitation ending.

Start the site on port 8000 and Chrome remote debugging on port 9225, then run
this file. The test uses an isolated browser profile and never touches a user's
normal browser storage.
"""

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


target = request_json(f"http://127.0.0.1:{CDP_PORT}/json/new?{GAME_URL}", "PUT")
socket = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=5)
message_id = 0


def evaluate(expression):
    global message_id
    message_id += 1
    socket.send(json.dumps({
        "id": message_id,
        "method": "Runtime.evaluate",
        "params": {"expression": expression, "returnByValue": True},
    }))
    while True:
        message = json.loads(socket.recv())
        if message.get("id") == message_id:
            result = message["result"]["result"]
            if "exceptionDetails" in message.get("result", {}):
                raise RuntimeError(message["result"]["exceptionDetails"])
            return result.get("value")


def wait_for_reload():
    time.sleep(1)


wait_for_reload()
evaluate("""
  const last = setTimeout(() => {}, 0);
  for (let id = 1; id <= last; id += 1) clearInterval(id);
  localStorage.removeItem('little-dog-europe-v1');
  location.reload();
  'reloading';
""")
wait_for_reload()

trip = evaluate("""
  document.querySelector('[data-id="madeleine"]').click();
  document.querySelector('[data-id="negroni"]').click();
  document.querySelector('#departButton').click();
  JSON.parse(localStorage.getItem('little-dog-europe-v1')).trip;
""")
assert trip["noteId"] and trip["fragmentId"]
assert trip["openedPostcards"] == []

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

first_postcard = evaluate("""
  (() => {
    const reveal = document.querySelector('[data-reveal-postcard]');
    const dialogOpen = document.querySelector('#postcardDialog').open;
    reveal.click();
    const hasArt = getComputedStyle(document.querySelector('.postcard-reveal-art'))
      .backgroundImage.includes('postcard-');
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

print(json.dumps({"trip": trip, "firstPostcard": first_postcard, "secondPostcard": second_postcard, "returned": returned, "finale": finale}, ensure_ascii=False))
socket.close()
