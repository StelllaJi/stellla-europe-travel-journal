window.GAME_DATA = {
  // 测试期为 60 秒；正式版改成 3600 即为一小时。
  tripDurationSeconds: 60,
  postcardSeconds: [12, 38],
  finaleRequirements: { memories: 8, fragmentKinds: 3 },
  notes: [
    { id: "ordinary-city", text: "小狗说：不是每一段值得记住的生活，都需要先成为景点。", tags: ["city", "train", "home"] },
    { id: "late-words", text: "小狗把一句没说完的话压在杯子下面，决定下次见面再继续。", tags: ["night", "conversation", "bar"] },
    { id: "old-light", text: "老房子、旧石头和熟悉的歌，好像都很擅长替人保管时间。", tags: ["old-town", "nostalgia", "music"] },
    { id: "shared-table", text: "旅行里最好吃的东西，常常不是菜单上最贵的那一道。", tags: ["friends", "celebration", "surprise"] },
    { id: "weather", text: "今天的风很大，但小狗觉得，有人可以讲天气也是一件好事。", tags: ["sunny", "rain", "water"] },
    { id: "next-time", text: "有些地方已经去过了，有些故事要等下一次同行才会发生。", tags: ["far", "rare", "home"] }
  ],
  pastries: [
    { id: "madeleine", name: "玛德琳", art: "assets/items/pastry-madeleine-cutout-v2.png", note: "容易唤醒旧日回忆", tags: ["nostalgia", "home"] },
    { id: "canele", name: "可露丽", art: "assets/items/pastry-canele-cutout-v2.png", note: "偏爱老城与雨天", tags: ["old-town", "rain"] },
    { id: "paris-brest", name: "巴黎布雷斯特", art: "assets/items/pastry-paris-brest-cutout-v2.png", note: "提高远行与火车概率", tags: ["train", "far"] },
    { id: "lemon-tart", name: "柠檬挞", art: "assets/items/pastry-lemon-tart-cutout-v2.png", note: "偏爱河边与明亮午后", tags: ["water", "sunny"], unlockCost: { "spring-petal": 1 } },
    { id: "opera", name: "歌剧院蛋糕", art: "assets/items/pastry-opera-cutout-v2.png", note: "寻找音乐与深夜灯光", tags: ["music", "night"], unlockCost: { "midnight-whisper": 1 } },
    { id: "saint-honore", name: "圣多诺黑", art: "assets/items/pastry-saint-honore-cutout-v2.png", note: "稀有，但结果难以预测", tags: ["rare", "surprise"], unlockCost: { "old-stone": 1, "home-key": 1 } }
  ],
  cocktails: [
    { id: "negroni", name: "Negroni", art: "assets/items/cocktail-negroni-cutout-v2.png", note: "昏黄夜色与酒吧故事", tags: ["night", "bar"] },
    { id: "old-fashioned", name: "Old Fashioned", art: "assets/items/cocktail-old-fashioned-cutout-v2.png", note: "怀旧建筑与慢故事", tags: ["nostalgia", "old-town"] },
    { id: "french-75", name: "French 75", art: "assets/items/cocktail-french-75-cutout-v2.png", note: "音乐、庆祝与高光时刻", tags: ["music", "celebration"], unlockCost: { "table-taste": 1 } },
    { id: "aperol-spritz", name: "Aperol Spritz", art: "assets/items/cocktail-aperol-spritz-cutout-v2.png", note: "露台、朋友和日落", tags: ["friends", "sunny"] },
    { id: "manhattan", name: "Manhattan", art: "assets/items/cocktail-manhattan-cutout-v2.png", note: "车站与城市游荡", tags: ["train", "city"], unlockCost: { "city-light": 1 } },
    { id: "espresso-martini", name: "Espresso Martini", art: "assets/items/cocktail-espresso-martini-cutout-v2.png", note: "通宵聊天与咖啡因", tags: ["night", "conversation"], unlockCost: { "home-key": 1, "midnight-whisper": 1 } }
  ],
  fragments: [
    { id: "city-light", name: "城市灯光", art: "assets/fragments/fragment-city-light.png", note: "从车窗和雨地里拾到的光。", tags: ["city", "train"] },
    { id: "old-stone", name: "旧石回声", art: "assets/fragments/fragment-old-stone.png", note: "老城墙记住了经过的人。", tags: ["old-town", "rain"] },
    { id: "table-taste", name: "餐桌余味", art: "assets/fragments/fragment-table-taste.png", note: "一顿饭结束以后留下的细节。", tags: ["friends", "bar", "surprise"] },
    { id: "midnight-whisper", name: "深夜私语", art: "assets/fragments/fragment-midnight-whisper.png", note: "天亮以前还没有说完的话。", tags: ["night", "conversation"] },
    { id: "home-key", name: "回家钥匙", art: "assets/fragments/fragment-home-key.png", note: "有些地方不是旅馆，是家。", tags: ["home", "nostalgia"] },
    { id: "spring-petal", name: "春日花瓣", art: "assets/fragments/fragment-spring-petal.png", note: "颜色、河水与重新开始。", tags: ["sunny", "water", "celebration", "music", "rare"] }
  ],
  memories: [
    { id: "lux-hamilius", city: "Luxembourg", title: "Hamilius 的电车声", text: "市中心不是景点，是一天真正开始和结束的地方。", tags: ["city", "train"], art: "assets/generated/postcard-lux-hamilius-v1.png", status: "illustrated" },
    { id: "lux-gare", city: "Luxembourg", title: "Gare：赶上与错过", text: "小狗在站牌下看了三遍时间，还是决定先买点吃的。", tags: ["train", "city"], art: "assets/generated/postcard-lux-gare-v1.png", status: "illustrated" },
    { id: "lux-auchan", city: "Luxembourg", title: "欧尚采购事件", text: "真正的欧洲生活，也包括推着购物车认真比较一排甜点。", tags: ["home", "city"], art: "assets/generated/postcard-lux-auchan-v1.png", status: "illustrated" },
    { id: "lux-gelle-fra", city: "Luxembourg", title: "金色女神像下", text: "风从山谷吹上来，小狗在广场边停了一会儿。", tags: ["old-town", "sunny"], art: "assets/generated/postcard-lux-gelle-fra-v1.png", status: "illustrated" },
    { id: "lux-roma", city: "Luxembourg", title: "Restaurant Roma", text: "一顿饭留下的细节，有时比一整条街更清楚。", tags: ["friends", "nostalgia"], art: "assets/generated/postcard-lux-roma-v1.png", status: "illustrated" },
    { id: "lux-liquid", city: "Luxembourg", title: "Liquid Bar 的夜晚", text: "酒杯上的水汽和没有讲完的话，都被夜色留下了。", tags: ["bar", "night"], art: "assets/generated/postcard-lux-liquid-bar-v1.png", status: "illustrated" },
    { id: "lux-dudelange", city: "Dudelange", title: "朋友家的门后", text: "地图上不标门牌，只记得门打开以后，那是一段被接住的生活。", tags: ["friends", "home"], art: "assets/generated/postcard-lux-dudelange-home-v1.png", status: "illustrated", private: true },
    { id: "lux-alvisse", city: "Luxembourg", title: "回到 Alvisse", text: "对游客是酒店，对小狗来说是回家。", tags: ["home", "nostalgia"], art: "assets/generated/home-room-v1.png", status: "illustrated" },
    { id: "lux-ck-tennis", city: "Kockelscheuer", title: "室内球场", text: "灯亮起来，网球落地的声音把一天切成一拍一拍。", tags: ["surprise", "friends"], art: "assets/generated/postcard-lux-ck-tennis-v1.png", status: "illustrated" },
    { id: "lux-onerepublic", city: "Luxembourg", title: "OneRepublic 之夜", text: "熟悉的歌响起时，陌生人突然拥有同一段记忆。", tags: ["music", "celebration", "night"], art: "assets/generated/postcard-lux-onerepublic-v1.png", status: "illustrated" },
    { id: "lux-toro-oyster", city: "Luxembourg", title: "Toro 与生蚝", text: "一口很浓，一口像海；小狗认真把它们记成两枚味觉碎片。", tags: ["rare", "friends"], art: "assets/generated/postcard-lux-toro-oyster-v1.png", status: "illustrated" },
    { id: "lux-uni-boardgame", city: "Belval", title: "讨论室不讨论", text: "卢大图书馆的讨论室里，今天讨论的是谁会输掉这局桌游。", tags: ["friends", "surprise"], art: "assets/generated/postcard-lux-uni-boardgame-v1.png", status: "illustrated" },

    { id: "nancy-stanislas", city: "Nancy", title: "金色广场", text: "Place Stanislas 的门饰在傍晚发亮，像一张过分精美的邀请函。", tags: ["old-town", "celebration"], art: "assets/generated/postcard-nancy-stanislas-v1.png", status: "illustrated" },
    { id: "nancy-tree-playground", city: "Nancy", title: "钻进树桩", text: "在 Pépinière 的木头游乐场里，大人也可以暂时不太像大人。", tags: ["surprise", "sunny"], art: "assets/generated/postcard-nancy-tree-playground-v2.png", status: "illustrated" },
    { id: "nancy-animal-space", city: "Nancy", title: "公园里的动物朋友", text: "Pépinière 的小动物区像旅行途中临时刷新的支线。", tags: ["friends", "sunny"], art: "assets/generated/postcard-nancy-animals-v1.png", status: "illustrated" },
    { id: "nancy-fine-arts", city: "Nancy", title: "美术馆里的慢时间", text: "有些画需要站久一点，才肯把故事交出来。", tags: ["nostalgia", "old-town"], art: "assets/generated/postcard-nancy-fine-arts-v2.png", status: "illustrated" },
    { id: "nancy-amorino", city: "Nancy", title: "花瓣冰淇淋", text: "Amorino 把冰淇淋做成花，小狗犹豫先吃哪一瓣。", tags: ["sunny", "celebration"], art: "assets/generated/postcard-nancy-amorino-v1.png", status: "illustrated" },

    { id: "trier-cathedral", city: "Trier", title: "最大的教堂", text: "特里尔主教座堂的石头很沉，光却从高处轻轻落下来。", tags: ["old-town", "nostalgia"], art: "assets/generated/postcard-trier-cathedral-v1.png", status: "illustrated" },
    { id: "trier-marx", city: "Trier", title: "马克思故居", text: "小狗认真参观思想家的房子，然后对纪念品商店产生了兴趣。", tags: ["old-town", "surprise"], art: "assets/generated/postcard-trier-marx-v1.png", status: "illustrated" },
    { id: "trier-palastgarten", city: "Trier", title: "Palastgarten", text: "宫殿花园适合散步，也适合让一句话故意晚一点说出口。", tags: ["sunny", "conversation"], art: "assets/generated/postcard-trier-palastgarten-v1.png", status: "illustrated" },

    { id: "ams-vintage", city: "Amsterdam", title: "Vintage 寻宝", text: "旧衣服已经拥有过一段人生，现在又被重新挑中。", tags: ["city", "surprise"], art: "assets/generated/postcard-ams-vintage-v1.png", status: "illustrated" },
    { id: "ams-canals", city: "Amsterdam", title: "运河边慢慢走", text: "水把房子的灯拉得很长，城市像是在轻轻晃动。", tags: ["water", "nostalgia"], art: "assets/generated/postcard-ams-canals-v1.png", status: "illustrated" },
    { id: "ams-vangogh", city: "Amsterdam", title: "梵高博物馆", text: "看完青蓝色天空里的杏花，走到街上以后，春天也变得不太一样。", tags: ["nostalgia", "rare"], art: "assets/generated/postcard-ams-vangogh-v3.png", status: "illustrated" },
    { id: "ams-herring", city: "Amsterdam", title: "一起吃生鲱鱼", text: "小狗先看了看鱼，又看了看你，最后决定勇敢一次。", tags: ["friends", "surprise"], art: "assets/generated/postcard-ams-herring-v1.png", status: "illustrated" },
    { id: "ams-red-light", city: "Amsterdam", title: "红灯区的夜", text: "霓虹落进水里，热闹背后藏着许多互不相识的人生。", tags: ["night", "city"], art: "assets/generated/postcard-ams-red-light-v1.png", status: "illustrated" },
    { id: "ams-allnight-talk", city: "Amsterdam", title: "天亮前还没聊完", text: "有些旅行真正记住的不是地点，是一场不舍得结束的谈话。", tags: ["night", "conversation", "rare"], art: "assets/generated/postcard-ams-allnight-talk-v1.png", status: "illustrated" },
    { id: "ams-bottle-return", city: "Amsterdam", title: "回收空瓶支线", text: "最不起眼的任务，也可能成为后来笑得最久的一段。", tags: ["city", "surprise"], art: "assets/generated/postcard-ams-bottle-return-v1.png", status: "illustrated" },
    { id: "ams-han-studio", city: "Amsterdam", title: "热得睡不着的 Studio", text: "房间很小、天气很热，却因为有人在而显得格外温馨。", tags: ["home", "friends", "conversation"], art: "assets/generated/postcard-ams-han-studio-v1.png", status: "illustrated", private: true },
    { id: "ams-flower-market", city: "Amsterdam", title: "花卉市场", text: "一整排颜色浮在运河边，小狗带回一枚没有枯萎的花瓣碎片。", tags: ["water", "sunny"], art: "assets/generated/postcard-ams-flower-market-v1.png", status: "illustrated" }
  ]
};
