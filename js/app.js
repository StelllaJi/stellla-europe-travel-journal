(() => {
  const data = window.GAME_DATA;
  const durationMs = data.tripDurationSeconds * 1000;
  const postcardOffsets = data.postcardSeconds.map(seconds => seconds * 1000);
  const storageKey = "little-dog-europe-v1";
  const introStorageKey = "stellla-europe-intro-seen-v1";
  const pastryAliases = { "paris-brest": "macaron" };
  const cocktailAliases = { negroni: "pina-colada", "old-fashioned": "mojito", manhattan: "margarita" };
  const itemAliases = { ...pastryAliases, ...cocktailAliases };
  const $ = id => document.getElementById(id);
  const locationLabels = {
    Luxembourg: "卢森堡 · Luxembourg City",
    Dudelange: "卢森堡 · Dudelange",
    Kockelscheuer: "卢森堡 · Kockelscheuer",
    Belval: "卢森堡 · Belval",
    Nancy: "法国 · Nancy",
    Trier: "德国 · Trier",
    Amsterdam: "荷兰 · Amsterdam"
  };

  const elements = {
    art: $("sceneArt"), kicker: $("sceneKicker"), title: $("sceneTitle"), text: $("sceneText"),
    pastry: $("pastryChoices"), cocktail: $("cocktailChoices"), depart: $("departButton"),
    packing: $("packingPanel"), journey: $("journeyPanel"), status: $("statusCard"),
    timer: $("timer"), statusTitle: $("statusTitle"), postcards: $("postcardList"), hint: $("journeyHint"),
    albumButton: $("albumButton"), albumDialog: $("albumDialog"), albumGrid: $("albumGrid"), albumCount: $("albumCount"),
    fragmentGrid: $("fragmentGrid"), shopGrid: $("shopGrid"),
    collectionProgress: $("collectionProgress"), finalePanel: $("finalePanel"),
    inviteDialog: $("inviteDialog"), shareStatus: $("shareStatus"),
    postcardDialog: $("postcardDialog"), postcardDialogContent: $("postcardDialogContent"),
    homeActions: $("homeActions"), introDialog: $("introDialog")
  };

  const music = {
    context: null, master: null, dry: null, reverb: null, wet: null,
    enabled: false, timer: null, nextNoteTime: 0, step: 0
  };

  let state = loadState();
  let selectedPastry = null;
  let selectedCocktail = null;
  let resetAllArmed = false;
  let resetAllTimer = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || { album: [], fragments: {} };
      const validMemoryIds = new Set(data.memories.map(memory => memory.id));
      saved.album = (saved.album || []).filter(id => validMemoryIds.has(id));
      saved.fragments ||= {};
      saved.unlockedItems ||= [];
      saved.recentMemoryIds = (saved.recentMemoryIds || []).filter(id => validMemoryIds.has(id)).slice(-10);
      saved.unlockedItems = [...new Set(saved.unlockedItems.map(id => itemAliases[id] || id))];
      saved.discoveredFragments ||= Object.keys(saved.fragments).filter(id => saved.fragments[id] > 0);
      if (saved.trip && !saved.trip.fragmentId) {
        saved.trip.fragmentId = "city-light";
        saved.trip.memoryIds = (saved.trip.memoryIds || []).slice(0, 2);
      }
      if (saved.trip && !saved.trip.noteId) saved.trip.noteId = data.notes[0].id;
      if (saved.trip) {
        saved.trip.pastryId = pastryAliases[saved.trip.pastryId] || saved.trip.pastryId;
        saved.trip.cocktailId = cocktailAliases[saved.trip.cocktailId] || saved.trip.cocktailId;
        saved.trip.openedPostcards ||= [...(saved.trip.collected || [])];
        saved.trip.announcedPostcards ||= [...saved.trip.openedPostcards];
        const keptMemoryIds = (saved.trip.memoryIds || []).filter(id => validMemoryIds.has(id));
        const replacements = data.memories
          .map(memory => memory.id)
          .filter(id => !keptMemoryIds.includes(id))
          .slice(0, Math.max(0, 2 - keptMemoryIds.length));
        saved.trip.memoryIds = [...keptMemoryIds, ...replacements].slice(0, 2);
        saved.trip.openedPostcards = saved.trip.openedPostcards.filter(id => saved.trip.memoryIds.includes(id));
        saved.trip.announcedPostcards = saved.trip.announcedPostcards.filter(id => saved.trip.memoryIds.includes(id));
        saved.trip.collected = (saved.trip.collected || []).filter(id => saved.trip.memoryIds.includes(id));
      }
      return saved;
    }
    catch { return { album: [], fragments: {}, unlockedItems: [], discoveredFragments: [] }; }
  }

  function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }

  function displayArt(path) {
    return path.startsWith("assets/generated/")
      ? path.replace("assets/generated/", "assets/optimized/").replace(/\.png$/, ".jpg")
      : path;
  }

  function preloadMemories(ids) {
    ids.forEach(id => {
      const memory = data.memories.find(item => item.id === id);
      if (!memory) return;
      const image = new Image();
      image.src = displayArt(memory.art);
    });
  }

  function formatLocation(memory) {
    return locationLabels[memory.city] || memory.city;
  }

  function midiFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function prepareMusic() {
    if (music.context) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    music.context = new AudioContextClass();
    music.master = music.context.createGain();
    music.dry = music.context.createGain();
    music.reverb = music.context.createConvolver();
    music.wet = music.context.createGain();
    const impulse = music.context.createBuffer(2, music.context.sampleRate * 1.8, music.context.sampleRate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const samples = impulse.getChannelData(channel);
      for (let index = 0; index < samples.length; index += 1) {
        samples[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / samples.length, 2.4);
      }
    }
    music.reverb.buffer = impulse;
    music.master.gain.value = 0.0001;
    music.dry.gain.value = .82;
    music.wet.gain.value = .2;
    music.dry.connect(music.master);
    music.reverb.connect(music.wet).connect(music.master);
    music.master.connect(music.context.destination);
    return true;
  }

  function playMusicNote(note, time, duration, volume, type = "triangle") {
    const oscillator = music.context.createOscillator();
    const envelope = music.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(midiFrequency(note), time);
    envelope.gain.setValueAtTime(.0001, time);
    envelope.gain.exponentialRampToValueAtTime(volume, time + .035);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(music.dry);
    envelope.connect(music.reverb);
    oscillator.start(time);
    oscillator.stop(time + duration + .06);
  }

  function scheduleMusic() {
    if (!music.enabled) return;
    const melody = [72, 76, 79, 76, 74, 77, 81, 77, 71, 74, 79, 74, 72, 76, 81, 79, 77, 74];
    const bass = [48, 53, 55, 48, 45, 55];
    while (music.nextNoteTime < music.context.currentTime + .35) {
      const step = music.step % melody.length;
      playMusicNote(melody[step], music.nextNoteTime, .72, .055);
      if (step % 3 === 0) playMusicNote(bass[Math.floor(step / 3)], music.nextNoteTime, 1.45, .035, "sine");
      music.nextNoteTime += .62;
      music.step += 1;
    }
  }

  function updateMusicButton() {
    const button = $("musicButton");
    button.classList.toggle("music-on", music.enabled);
    button.setAttribute("aria-pressed", String(music.enabled));
    button.setAttribute("aria-label", music.enabled ? "关闭背景音乐" : "播放背景音乐");
    button.textContent = music.enabled ? "♫" : "♪";
  }

  async function toggleMusic() {
    if (!prepareMusic()) return;
    if (music.enabled) {
      music.enabled = false;
      clearInterval(music.timer);
      music.master.gain.cancelScheduledValues(music.context.currentTime);
      music.master.gain.setTargetAtTime(.0001, music.context.currentTime, .08);
      updateMusicButton();
      return;
    }
    await music.context.resume();
    music.enabled = true;
    music.step = 0;
    music.nextNoteTime = music.context.currentTime + .06;
    music.master.gain.cancelScheduledValues(music.context.currentTime);
    music.master.gain.setTargetAtTime(.075, music.context.currentTime, .12);
    scheduleMusic();
    music.timer = setInterval(scheduleMusic, 120);
    updateMusicButton();
  }

  function openPacking() {
    elements.homeActions.hidden = true;
    elements.journey.hidden = true;
    elements.packing.hidden = false;
  }

  function closePacking() {
    elements.packing.hidden = true;
    elements.homeActions.hidden = false;
  }

  function isUnlocked(item) {
    return !item.unlockCost || state.unlockedItems.includes(item.id);
  }

  function renderChoices(items, container, type) {
    const selectedId = type === "pastry" ? selectedPastry?.id : selectedCocktail?.id;
    container.innerHTML = items.map(item => {
      const unlocked = isUnlocked(item);
      return `
      <button class="choice-card ${selectedId === item.id ? "selected" : ""} ${unlocked ? "" : "locked-choice"}" data-type="${type}" data-id="${item.id}" ${unlocked ? "" : "disabled"}>
        <span class="choice-art"><img src="${item.art}" alt="" loading="lazy"></span>
        <span class="choice-copy">
          <strong>${item.name}</strong>
          <small>${unlocked ? item.note : "在回忆册的小商店里解锁"}</small>
        </span>
      </button>`;
    }).join("");
  }

  function selectChoice(event) {
    const button = event.target.closest(".choice-card");
    if (!button) return;
    const { type, id } = button.dataset;
    document.querySelectorAll(`[data-type="${type}"]`).forEach(el => el.classList.toggle("selected", el === button));
    if (type === "pastry") selectedPastry = data.pastries.find(item => item.id === id);
    if (type === "cocktail") selectedCocktail = data.cocktails.find(item => item.id === id);
    elements.depart.disabled = !(selectedPastry && selectedCocktail);
    if (!elements.depart.disabled) elements.depart.textContent = `带上 ${selectedPastry.name} 与 ${selectedCocktail.name} 出发`;
  }

  function weightedPick(tags, excluded = []) {
    const pool = data.memories.filter(memory => !excluded.includes(memory.id));
    const recent = new Set(state.recentMemoryIds || []);
    const collected = new Set(state.album || []);
    const weighted = pool.map(memory => {
      const base = 1 + memory.tags.filter(tag => tags.includes(tag)).length * 4 + (memory.tags.includes("rare") ? Math.random() * 2 : 0);
      const recentFactor = recent.has(memory.id) ? .12 : 1;
      const discoveryFactor = collected.has(memory.id) ? 1 : 1.35;
      return { memory, score: base * recentFactor * discoveryFactor };
    });
    const total = weighted.reduce((sum, item) => sum + item.score, 0);
    let cursor = Math.random() * total;
    for (const item of weighted) {
      cursor -= item.score;
      if (cursor <= 0) return item.memory;
    }
    return weighted[0].memory;
  }

  function weightedFragmentPick(tags) {
    const weighted = data.fragments.map(fragment => ({
      fragment,
      score: 1 + fragment.tags.filter(tag => tags.includes(tag)).length * 4
    }));
    const total = weighted.reduce((sum, item) => sum + item.score, 0);
    let cursor = Math.random() * total;
    for (const item of weighted) {
      cursor -= item.score;
      if (cursor <= 0) return item.fragment;
    }
    return weighted[0].fragment;
  }

  function weightedNotePick(tags) {
    const ranked = data.notes.map(note => ({ note, score: 1 + note.tags.filter(tag => tags.includes(tag)).length * 3 }));
    const total = ranked.reduce((sum, item) => sum + item.score, 0);
    let cursor = Math.random() * total;
    for (const item of ranked) {
      cursor -= item.score;
      if (cursor <= 0) return item.note;
    }
    return ranked[0].note;
  }

  function beginJourney() {
    const tags = [...selectedPastry.tags, ...selectedCocktail.tags];
    const first = weightedPick(tags);
    const second = weightedPick(tags, [first.id]);
    const fragment = weightedFragmentPick(tags);
    const note = weightedNotePick(tags);
    state.trip = {
      startedAt: Date.now(), pastryId: selectedPastry.id, cocktailId: selectedCocktail.id,
      memoryIds: [first.id, second.id], fragmentId: fragment.id, noteId: note.id,
      collected: [], openedPostcards: [], announcedPostcards: [], rewardClaimed: false
    };
    state.recentMemoryIds = [...(state.recentMemoryIds || []), first.id, second.id].slice(-10);
    saveState();
    preloadMemories(state.trip.memoryIds);
    render();
  }

  function tripProgress() {
    if (!state.trip) return { elapsed: 0, returned: false, unlocked: 0 };
    const elapsed = Date.now() - state.trip.startedAt;
    return {
      elapsed,
      returned: elapsed >= durationMs,
      unlocked: postcardOffsets.filter(offset => elapsed >= offset).length
    };
  }

  function collectUnlocked(progress) {
    const count = progress.returned ? 2 : progress.unlocked;
    const opened = state.trip.openedPostcards || [];
    const album = new Set([...(state.album || []), ...opened]);
    state.album = [...album];
    state.trip.collected = [...opened];
    if (progress.returned && !state.trip.rewardClaimed) {
      const id = state.trip.fragmentId;
      state.fragments[id] = (state.fragments[id] || 0) + 1;
      if (!state.discoveredFragments.includes(id)) state.discoveredFragments.push(id);
      state.trip.rewardClaimed = true;
    }
    saveState();
  }

  function renderTrip() {
    const progress = tripProgress();
    collectUnlocked(progress);
    const pastry = data.pastries.find(item => item.id === state.trip.pastryId);
    const cocktail = data.cocktails.find(item => item.id === state.trip.cocktailId);
    const remaining = Math.max(0, durationMs - progress.elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);

    elements.packing.hidden = true;
    elements.homeActions.hidden = true;
    elements.journey.hidden = false;
    elements.status.hidden = false;
    elements.journey.classList.toggle("returned", progress.returned);
    elements.art.classList.toggle("away", !progress.returned);
    elements.timer.textContent = progress.returned ? "已回家" : `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    elements.statusTitle.textContent = progress.returned ? "小狗回来了，还带着新的碎片" : `带着 ${pastry.name} 与 ${cocktail.name} 旅行中`;
    elements.kicker.textContent = progress.returned ? "WELCOME HOME" : "SOMEWHERE IN EUROPE";
    elements.title.textContent = progress.returned ? "门外传来了熟悉的脚步声" : "小狗暂时不在家";
    elements.text.textContent = progress.returned ? "它把沿途收集的东西摊在桌上，想把旅途的故事讲给你听。" : "不用一直等在这里。离开一会儿，下一张明信片会在该来的时候抵达。";
    const resetButton = $("resetButton");
    resetButton.textContent = progress.returned ? "再次出发" : "结束本次旅行";
    resetButton.classList.toggle("primary-button", progress.returned);
    resetButton.classList.toggle("secondary-button", !progress.returned);

    const memoryCards = state.trip.memoryIds.map((id, index) => {
      const memory = data.memories.find(item => item.id === id);
      const hasArrived = index < (progress.returned ? 2 : progress.unlocked);
      const isOpened = state.trip.openedPostcards.includes(memory.id);
      const role = `第 ${index + 1} 张明信片`;
      return isOpened ? `
        <article class="postcard">
          <div class="postcard-image" style="background-image:url('${displayArt(memory.art)}')"></div>
          <div class="postcard-copy"><span class="label">${formatLocation(memory)} · ${role}</span><strong>${memory.title}</strong><p>${memory.text}</p></div>
        </article>` : hasArrived ? `
        <article class="postcard arrived-card">
          <div class="postcard-image envelope-pattern"><span>✉</span></div>
          <div class="postcard-copy"><span class="label">POST HAS ARRIVED</span><strong>一张明信片到了</strong><p>小狗没有在信封上写地点。</p><button data-open-postcard="${memory.id}">拆开看看</button></div>
        </article>` : `
        <article class="postcard locked">
          <div class="postcard-image"></div>
          <div class="postcard-copy"><span class="label">ON THE WAY</span><strong>还在路上的消息</strong><p>小狗没有透露这一站去了哪里。</p></div>
        </article>`;
    }).join("");
    const fragment = data.fragments.find(item => item.id === state.trip.fragmentId);
    const note = data.notes.find(item => item.id === state.trip.noteId) || data.notes[0];
    const fragmentCard = progress.returned ? `
      <article class="postcard fragment-card">
        <div class="postcard-image" style="background-image:url('${fragment.art}')"></div>
        <div class="postcard-copy"><span class="label">带回的旅行碎片</span><strong>${fragment.name}</strong><p>${fragment.note}</p></div>
      </article>` : `
      <article class="postcard locked">
        <div class="postcard-image"></div>
        <div class="postcard-copy"><span class="label">SOUVENIR</span><strong>背包里似乎还有东西</strong><p>等小狗回家以后再打开。</p></div>
      </article>`;
    const noteCard = progress.returned ? `
      <article class="travel-note">
        <span class="label">背包夹层里的便签</span>
        <p>${note.text}</p>
      </article>` : "";
    elements.postcards.innerHTML = memoryCards + fragmentCard + noteCard;
    elements.hint.textContent = progress.returned ? "本次旅行已经完成" : `${progress.unlocked}/2 张途中明信片已送达`;
    checkPostcardArrivals(progress);
  }

  function availablePostcards(progress) {
    const count = progress.returned ? 2 : progress.unlocked;
    return state.trip.memoryIds.slice(0, count);
  }

  function checkPostcardArrivals(progress = tripProgress()) {
    if (!state.trip || elements.postcardDialog.open) return;
    const nextId = availablePostcards(progress).find(id => !state.trip.announcedPostcards.includes(id));
    if (!nextId) return;
    state.trip.announcedPostcards.push(nextId);
    saveState();
    showPostcardEnvelope(nextId);
  }

  function showPostcardEnvelope(memoryId) {
    const memory = data.memories.find(item => item.id === memoryId);
    if (!memory) return;
    elements.postcardDialogContent.innerHTML = `
      <section class="mail-arrival">
        <p class="label">A POSTCARD HAS ARRIVED</p>
        <button class="sealed-envelope" data-reveal-postcard="${memory.id}" aria-label="拆开新到的明信片">
          <span class="envelope-flap"></span><span class="wax-seal">S</span>
        </button>
        <h2>小狗寄来了一封信</h2>
        <p>轻轻点一下信封，看看它去了哪里。</p>
      </section>`;
    if (!elements.postcardDialog.open) elements.postcardDialog.showModal();
  }

  function revealPostcard(memoryId) {
    const memory = data.memories.find(item => item.id === memoryId);
    if (!memory) return;
    if (!state.trip.openedPostcards.includes(memoryId)) state.trip.openedPostcards.push(memoryId);
    collectUnlocked(tripProgress());
    renderAlbum();
    renderPostcardDetail(memory, "收进回忆册");
    renderTrip();
  }

  function renderPostcardDetail(memory, closeLabel = "合上明信片") {
    const hasBack = Boolean(memory.photo || memory.photoNote);
    const back = memory.photo
      ? `<div class="postcard-memory-face postcard-memory-photo" style="--memory-photo:url('${memory.photo}')">
          <img src="${memory.photo}" alt="${memory.title}那一天的真实照片">
          <span class="photo-caption">那一天的真实照片</span>
        </div>`
      : memory.photoNote
        ? `<div class="postcard-memory-face postcard-memory-note">
            <span class="label">NO PHOTOGRAPH</span>
            <p>${memory.photoNote}</p>
          </div>`
        : "";
    elements.postcardDialogContent.innerHTML = `
      <article class="postcard-reveal">
        <div class="postcard-memory-stage">
          <div class="postcard-memory-card" data-memory-card>
            <div class="postcard-memory-face postcard-reveal-art" style="background-image:url('${displayArt(memory.art)}')"></div>
            ${back}
          </div>
        </div>
        <div class="postcard-reveal-copy">
          <span class="label">${formatLocation(memory)} · FROM THE ROAD</span>
          <h2>${memory.title}</h2><p>${memory.text}</p>
          ${hasBack ? `<button class="memory-flip-button" data-flip-postcard aria-pressed="false">翻到那一天</button>` : ""}
          <button class="primary-button" data-close-postcard>${closeLabel}</button>
        </div>
      </article>`;
  }

  function handlePostcardDialog(event) {
    const reveal = event.target.closest("[data-reveal-postcard]");
    if (reveal) return revealPostcard(reveal.dataset.revealPostcard);
    const flip = event.target.closest("[data-flip-postcard]");
    if (flip) {
      const card = elements.postcardDialogContent.querySelector("[data-memory-card]");
      const flipped = card.classList.toggle("is-flipped");
      flip.setAttribute("aria-pressed", String(flipped));
      flip.textContent = flipped ? "回到插画" : "翻到那一天";
      return;
    }
    if (event.target.closest("[data-close-postcard]")) {
      elements.postcardDialog.close();
      setTimeout(() => checkPostcardArrivals(), 220);
    }
  }

  function handleJourneyPostcard(event) {
    const button = event.target.closest("[data-open-postcard]");
    if (button) showPostcardEnvelope(button.dataset.openPostcard);
  }

  function renderAlbum() {
    const memories = (state.album || []).map(id => data.memories.find(item => item.id === id)).filter(Boolean);
    const fragmentKinds = state.discoveredFragments.length;
    const requirements = data.finaleRequirements;
    const finaleUnlocked = memories.length >= requirements.memories && fragmentKinds >= requirements.fragmentKinds;
    elements.albumCount.textContent = memories.length;
    elements.collectionProgress.innerHTML = `
      <div><span>已收藏的明信片记忆</span><strong>${memories.length}/${data.memories.length}</strong></div>`;
    elements.albumGrid.innerHTML = memories.length ? memories.map(memory => `
      <article class="postcard">
        <img class="postcard-image" src="${displayArt(memory.art)}" alt="" loading="lazy" decoding="async">
        <div class="postcard-copy"><span class="label">${formatLocation(memory)}</span><strong>${memory.title}</strong><p>${memory.text}</p>
          <button class="memory-open-button" data-open-memory="${memory.id}">${memory.photo || memory.photoNote ? "翻看这段回忆" : "查看明信片"}</button>
        </div>
      </article>`).join("") : `<p class="album-empty">还没有收到明信片。先送小狗出一次门吧。</p>`;
    elements.fragmentGrid.innerHTML = data.fragments.map(fragment => {
      const count = state.fragments?.[fragment.id] || 0;
      const discovered = state.discoveredFragments.includes(fragment.id);
      return `<article class="fragment-item ${discovered ? "owned" : ""}">
        <img src="${fragment.art}" alt="">
        <div><strong>${fragment.name}</strong><small>${count ? `拥有 ${count} 枚` : discovered ? "发现过 · 当前 0 枚" : "尚未发现"}</small></div>
      </article>`;
    }).join("");
    const shopItems = [...data.pastries, ...data.cocktails].filter(item => item.unlockCost);
    elements.shopGrid.innerHTML = shopItems.map(item => {
      const unlocked = isUnlocked(item);
      const costs = Object.entries(item.unlockCost).map(([id, amount]) => {
        const fragment = data.fragments.find(entry => entry.id === id);
        const owned = state.fragments?.[id] || 0;
        return `<span class="shop-cost ${owned >= amount ? "ready" : ""}">${fragment.name} ${owned}/${amount}</span>`;
      }).join("");
      const affordable = Object.entries(item.unlockCost).every(([id, amount]) => (state.fragments?.[id] || 0) >= amount);
      return `<article class="shop-item ${unlocked ? "unlocked" : ""}">
        <img src="${item.art}" alt="">
        <div class="shop-copy"><strong>${item.name}</strong><small>${unlocked ? item.note : costs}</small></div>
        <button data-unlock-id="${item.id}" ${unlocked || !affordable ? "disabled" : ""}>${unlocked ? "已解锁" : "解锁"}</button>
      </article>`;
    }).join("");
    elements.finalePanel.className = `finale-panel ${finaleUnlocked ? "unlocked" : ""}`;
    elements.finalePanel.innerHTML = finaleUnlocked ? `
      <div><p class="label">A NEW PAGE</p><h3>小狗留了一张没有目的地的票</h3><p>这次不回头看旧照片了。去看看下一段会发生什么。</p></div>
      <button class="primary-button" data-open-invite>打开同行邀请</button>` : `
      <div><p class="label">LOCKED PAGE</p><h3>回忆册的最后一页还没打开</h3><p>收集 ${requirements.memories} 张明信片和 ${requirements.fragmentKinds} 种碎片后，小狗会把压在箱底的信交给你。</p></div>`;
  }

  function openAlbumMemory(event) {
    const button = event.target.closest("[data-open-memory]");
    if (!button) return;
    const memory = data.memories.find(item => item.id === button.dataset.openMemory);
    if (!memory) return;
    elements.albumDialog.close();
    renderPostcardDetail(memory);
    elements.postcardDialog.showModal();
  }

  function openInvite(event) {
    if (!event.target.closest("[data-open-invite]")) return;
    elements.albumDialog.close();
    elements.inviteDialog.showModal();
  }

  async function shareGame() {
    const shareData = { title: "stellla 的欧洲旅行手记", text: "这是一些我在欧洲生活过的地方，也许你会喜欢其中的一段。", url: location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        elements.shareStatus.textContent = "已经打开分享菜单。";
      } else {
        await navigator.clipboard.writeText(location.href);
        elements.shareStatus.textContent = "链接已复制，可以发给朋友啦。";
      }
    } catch (error) {
      if (error.name !== "AbortError") elements.shareStatus.textContent = "暂时无法自动分享，可以复制浏览器地址。";
    }
  }

  function unlockItem(event) {
    const button = event.target.closest("[data-unlock-id]");
    if (!button) return;
    const item = [...data.pastries, ...data.cocktails].find(entry => entry.id === button.dataset.unlockId);
    if (!item || isUnlocked(item)) return;
    const affordable = Object.entries(item.unlockCost).every(([id, amount]) => (state.fragments?.[id] || 0) >= amount);
    if (!affordable) return;
    Object.entries(item.unlockCost).forEach(([id, amount]) => { state.fragments[id] -= amount; });
    state.unlockedItems.push(item.id);
    saveState();
    renderChoices(data.pastries, elements.pastry, "pastry");
    renderChoices(data.cocktails, elements.cocktail, "cocktail");
    renderAlbum();
  }

  function resetTrip() {
    state.trip = null;
    selectedPastry = null;
    selectedCocktail = null;
    saveState();
    elements.depart.disabled = true;
    elements.depart.textContent = "请先收拾行囊";
    renderChoices(data.pastries, elements.pastry, "pastry");
    renderChoices(data.cocktails, elements.cocktail, "cocktail");
    render();
    openPacking();
  }

  function disarmFullReset() {
    clearTimeout(resetAllTimer);
    resetAllArmed = false;
    const button = $("resetAllButton");
    button.classList.remove("armed");
    button.textContent = "清空我的进度";
    $("resetAllStatus").textContent = "只会清除当前浏览器里的明信片、碎片与道具。";
  }

  function resetAllProgress() {
    if (!resetAllArmed) {
      resetAllArmed = true;
      const button = $("resetAllButton");
      button.classList.add("armed");
      button.textContent = "再点一次，确认清空";
      $("resetAllStatus").textContent = "此操作无法撤销；其他人和其他浏览器的进度不会受影响。";
      resetAllTimer = setTimeout(disarmFullReset, 6000);
      return;
    }
    clearTimeout(resetAllTimer);
    localStorage.removeItem(storageKey);
    location.reload();
  }

  function checkSceneArt() {
    const image = new Image();
    image.onload = () => elements.art.classList.remove("no-art");
    image.onerror = () => elements.art.classList.add("no-art");
    image.src = "assets/optimized/home-room-v1.jpg";
  }

  function render() {
    renderAlbum();
    if (state.trip) {
      renderTrip();
    } else {
      elements.packing.hidden = true;
      elements.journey.hidden = true;
      elements.journey.classList.remove("returned");
      elements.status.hidden = true;
      elements.homeActions.hidden = false;
      elements.art.classList.remove("away");
      elements.kicker.textContent = "LUXEMBOURG · HOME";
      elements.title.textContent = "西高地今天还在家";
      elements.text.textContent = "它替 stellla 收藏着那些美丽的欧洲记忆。准备好行囊以后，它会自己决定下一站。";
    }
  }

  renderChoices(data.pastries, elements.pastry, "pastry");
  renderChoices(data.cocktails, elements.cocktail, "cocktail");
  elements.pastry.addEventListener("click", selectChoice);
  elements.cocktail.addEventListener("click", selectChoice);
  $("prepareButton").addEventListener("click", openPacking);
  $("closePacking").addEventListener("click", closePacking);
  elements.depart.addEventListener("click", beginJourney);
  $("resetButton").addEventListener("click", resetTrip);
  elements.albumButton.addEventListener("click", () => { renderAlbum(); elements.albumDialog.showModal(); });
  elements.albumGrid.addEventListener("click", openAlbumMemory);
  $("closeAlbum").addEventListener("click", () => { disarmFullReset(); elements.albumDialog.close(); });
  $("resetAllButton").addEventListener("click", resetAllProgress);
  elements.shopGrid.addEventListener("click", unlockItem);
  elements.postcards.addEventListener("click", handleJourneyPostcard);
  elements.postcardDialogContent.addEventListener("click", handlePostcardDialog);
  elements.finalePanel.addEventListener("click", openInvite);
  $("closeInvite").addEventListener("click", () => elements.inviteDialog.close());
  $("shareButton").addEventListener("click", shareGame);
  $("introButton").addEventListener("click", () => elements.introDialog.showModal());
  $("musicButton").addEventListener("click", toggleMusic);
  $("enterGameButton").addEventListener("click", () => {
    localStorage.setItem(introStorageKey, "yes");
    elements.introDialog.close();
  });

  checkSceneArt();
  render();
  if (!localStorage.getItem(introStorageKey)) elements.introDialog.showModal();
  setInterval(() => { if (state.trip) renderTrip(); }, 1000);
})();
