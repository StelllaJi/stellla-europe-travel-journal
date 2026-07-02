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
    { id: "macaron", name: "马卡龙", art: "assets/items/pastry-macaron-cutout-v1.png", note: "颜色、朋友与明亮小店", tags: ["friends", "sunny", "celebration"] },
    { id: "lemon-tart", name: "柠檬挞", art: "assets/items/pastry-lemon-tart-cutout-v2.png", note: "偏爱河边与明亮午后", tags: ["water", "sunny"], unlockCost: { "spring-petal": 1 } },
    { id: "opera", name: "歌剧院蛋糕", art: "assets/items/pastry-opera-cutout-v2.png", note: "寻找音乐与深夜灯光", tags: ["music", "night"], unlockCost: { "midnight-whisper": 1 } },
    { id: "saint-honore", name: "圣多诺黑", art: "assets/items/pastry-saint-honore-cutout-v2.png", note: "稀有，但结果难以预测", tags: ["rare", "surprise"], unlockCost: { "old-stone": 1, "home-key": 1 } }
  ],
  cocktails: [
    { id: "pina-colada", name: "椰林飘香", art: "assets/items/cocktail-pina-colada-cutout-v1.png", note: "海风、朋友与慵懒午后", tags: ["water", "friends", "sunny"] },
    { id: "mojito", name: "莫吉托", art: "assets/items/cocktail-mojito-cutout-v1.png", note: "绿意、河边与清爽晴天", tags: ["water", "sunny", "city"] },
    { id: "french-75", name: "法国75", art: "assets/items/cocktail-french-75-cutout-v2.png", note: "音乐、庆祝与高光时刻", tags: ["music", "celebration"], unlockCost: { "table-taste": 1 } },
    { id: "aperol-spritz", name: "阿佩罗气泡酒", art: "assets/items/cocktail-aperol-spritz-cutout-v2.png", note: "露台、朋友和日落", tags: ["friends", "sunny"] },
    { id: "margarita", name: "玛格丽特", art: "assets/items/cocktail-margarita-cutout-v1.png", note: "老城、夜晚与一点冒险", tags: ["old-town", "night", "surprise"], unlockCost: { "city-light": 1 } },
    { id: "espresso-martini", name: "浓缩咖啡马天尼", art: "assets/items/cocktail-espresso-martini-cutout-v2.png", note: "通宵聊天与咖啡因", tags: ["night", "conversation"], unlockCost: { "home-key": 1, "midnight-whisper": 1 } }
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
    { id: "lux-hamilius", city: "Luxembourg", title: "Hamilius 的电车声", text: "欢迎来到stellla的公司和活动区！在这里喝了很多很多杯酒，和同事聊了很多天。", tags: ["city", "train"], art: "assets/generated/postcard-lux-hamilius-v1.png", photo: "assets/photos/lux-hamilius.jpg", status: "illustrated" },
    { id: "lux-gare", city: "Luxembourg", title: "Gare：赶上与错过", text: "stellla曾经一个周末来了四趟gare，是出发的美丽起点。", tags: ["train", "city"], art: "assets/generated/postcard-lux-gare-v1.png", photo: "assets/photos/lux-gare.jpg", status: "illustrated" },
    { id: "lux-roma", city: "Luxembourg", title: "Restaurant Roma", text: "美丽的生日记忆！很好吃的饭和很可爱的蛋糕", tags: ["friends", "nostalgia"], art: "assets/generated/postcard-lux-roma-v1.png", photo: "assets/photos/lux-roma.jpg", status: "illustrated" },
    { id: "lux-liquid", city: "Luxembourg", title: "Liquid Bar 的夜晚", text: "酒杯上的水汽和没有讲完的话，都被夜色留下了。", tags: ["bar", "night"], art: "assets/generated/postcard-lux-liquid-bar-v1.png", photo: "assets/photos/lux-liquid.jpg", status: "illustrated" },
    { id: "lux-dudelange", city: "Dudelange", title: "朋友家的门后", text: "第一次在这里遇见了朋友们，从此我的卢森堡生活开始幸福", tags: ["friends", "home"], art: "assets/generated/postcard-lux-dudelange-home-v1.png", photo: "assets/photos/lux-dudelange.jpg", status: "illustrated", private: true },
    { id: "lux-alvisse", city: "Luxembourg", title: "回到 Alvisse", text: "回家回家！", tags: ["home", "nostalgia"], art: "assets/generated/home-room-v1.png", photo: "assets/photos/lux-alvisse.jpg", status: "illustrated" },
    { id: "lux-ck-tennis", city: "Kockelscheuer", title: "室内球场", text: "网球真是太！好！玩！了！", tags: ["surprise", "friends"], art: "assets/generated/postcard-lux-ck-tennis-v1.png", photo: "assets/photos/lux-ck-tennis.jpg", status: "illustrated" },
    { id: "lux-onerepublic", city: "Luxembourg", title: "OneRepublic 之夜", text: "感谢卢森堡的纳税人们让我听到数星星！", tags: ["music", "celebration", "night"], art: "assets/generated/postcard-lux-onerepublic-v1.png", photo: "assets/photos/lux-onerepublic.jpg", status: "illustrated" },
    { id: "lux-toro-oyster", city: "Luxembourg", title: "Toro 与生蚝", text: "好吃好吃好吃香香", tags: ["rare", "friends"], art: "assets/generated/postcard-lux-toro-oyster-v1.png", photo: "assets/photos/lux-toro-oyster.jpg", status: "illustrated" },
    { id: "lux-uni-boardgame", city: "Belval", title: "讨论室不讨论", text: "卢大图书馆的讨论室里，今天讨论的是谁会输掉这局桌游", tags: ["friends", "surprise"], art: "assets/generated/postcard-lux-uni-boardgame-v1.png", photo: "assets/photos/lux-uni-boardgame.jpg", status: "illustrated" },

    { id: "nancy-stanislas", city: "Nancy", title: "金色广场", text: "Place Stanislas 的门饰在傍晚发亮，像一张过分精美的邀请函", tags: ["old-town", "celebration"], art: "assets/generated/postcard-nancy-stanislas-v1.png", photo: "assets/photos/nancy-stanislas.jpg", status: "illustrated" },
    { id: "nancy-tree-playground", city: "Nancy", title: "钻进树桩", text: "在 Pépinière 的木头游乐场里，大人也可以暂时不太像大人", tags: ["surprise", "sunny"], art: "assets/generated/postcard-nancy-tree-playground-v2.png", photo: "assets/photos/nancy-tree-playground.jpg", status: "illustrated" },
    { id: "nancy-animal-space", city: "Nancy", title: "公园里的动物朋友", text: "每次见到小动物就会哈特软软", tags: ["friends", "sunny"], art: "assets/generated/postcard-nancy-animals-v1.png", photo: "assets/photos/nancy-animal-space.jpg", status: "illustrated" },
    { id: "nancy-fine-arts", city: "Nancy", title: "美术馆里的慢时间", text: "非常美丽的美术馆，法国佬品味真不错", tags: ["nostalgia", "old-town"], art: "assets/generated/postcard-nancy-fine-arts-v2.png", photo: "assets/photos/nancy-fine-arts.jpg", status: "illustrated" },
    { id: "nancy-amorino", city: "Nancy", title: "花瓣冰淇淋", text: "Amorino 把冰淇淋做成花，pistachio味道的有点咸", tags: ["sunny", "celebration"], art: "assets/generated/postcard-nancy-amorino-v1.png", photo: "assets/photos/nancy-amorino.jpg", status: "illustrated" },

    { id: "trier-cathedral", city: "Trier", title: "最大的教堂", text: "特里尔主教座堂的石头很沉，光却从高处轻轻落下来。", tags: ["old-town", "nostalgia"], art: "assets/generated/postcard-trier-cathedral-v1.png", photo: "assets/photos/trier-cathedral.jpg", status: "illustrated" },
    { id: "trier-marx", city: "Trier", title: "马克思故居", text: "在马斯克上市之际去看望马克思", tags: ["old-town", "surprise"], art: "assets/generated/postcard-trier-marx-v1.png", photo: "assets/photos/trier-marx.jpg", status: "illustrated" },
    { id: "trier-palastgarten", city: "Trier", title: "Palastgarten", text: "德国的宫殿花园有点土", tags: ["sunny", "conversation"], art: "assets/generated/postcard-trier-palastgarten-v1.png", photo: "assets/photos/trier-palastgarten.jpg", status: "illustrated" },

    { id: "ams-vintage", city: "Amsterdam", title: "Vintage 寻宝", text: "stellla在阿姆度过了花花绿绿的一日！融入当地ootd", tags: ["city", "surprise"], art: "assets/generated/postcard-ams-vintage-v1.png", photo: "assets/photos/ams-vintage.jpg", status: "illustrated" },
    { id: "ams-canals", city: "Amsterdam", title: "运河边慢慢走", text: "水把房子的灯拉得很长，城市像是在轻轻晃动。", tags: ["water", "nostalgia"], art: "assets/generated/postcard-ams-canals-v1.png", photo: "assets/photos/ams-canals.jpg", status: "illustrated" },
    { id: "ams-vangogh", city: "Amsterdam", title: "梵高博物馆", text: "画在我儿时素描本上青蓝色天空里的杏花，又见面了", tags: ["nostalgia", "rare"], art: "assets/generated/postcard-ams-vangogh-v3.png", photo: "assets/photos/ams-vangogh.jpg", status: "illustrated" },
    { id: "ams-herring", city: "Amsterdam", title: "一起吃生鲱鱼", text: "我也要吃这种东西吗？？！！", tags: ["friends", "surprise"], art: "assets/generated/postcard-ams-herring-v1.png", photo: "assets/photos/ams-herring.jpg", status: "illustrated" },
    { id: "ams-red-light", city: "Amsterdam", title: "红灯区的夜", text: "什么时候能看到男人在橱窗里呢", tags: ["night", "city"], art: "assets/generated/postcard-ams-red-light-v1.png", photoNote: "这里不允许拍照，所以没有留下照片。那一晚只好留在记忆里。", status: "illustrated" },
    { id: "ams-allnight-talk", city: "Amsterdam", title: "通宵畅聊", text: "有些旅行真正记住的不是地点，是一场不舍得结束的谈话。", tags: ["night", "conversation", "rare"], art: "assets/generated/postcard-ams-allnight-talk-v1.png", photo: "assets/photos/ams-allnight-talk.jpg", status: "illustrated" },
    { id: "ams-bottle-return", city: "Amsterdam", title: "回收空瓶支线", text: "韩老师教我财富密码", tags: ["city", "surprise"], art: "assets/generated/postcard-ams-bottle-return-v1.png", photo: "assets/photos/ams-bottle-return.jpg", status: "illustrated" },
    { id: "ams-han-studio", city: "Amsterdam", title: "热得睡不着的 Studio", text: "韩老师的可爱小家，但是为什么我洗完澡就开始出汗", tags: ["home", "friends", "conversation"], art: "assets/generated/postcard-ams-han-studio-v1.png", photo: "assets/photos/ams-han-studio.jpg", status: "illustrated", private: true },
    { id: "ams-flower-market", city: "Amsterdam", title: "花卉市场", text: "诶我怎么两手空空地离开了", tags: ["water", "sunny"], art: "assets/generated/postcard-ams-flower-market-v1.png", photo: "assets/photos/ams-flower-market.jpg", status: "illustrated" }
  ]
};
