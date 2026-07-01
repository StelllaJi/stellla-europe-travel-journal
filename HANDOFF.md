# stellla 的欧洲旅行手记：完整交接文档

> 给下一位 Codex / 新账号：请先完整阅读本文件，再阅读 `README.md`、`docs/memory-map.md`、`docs/art-direction.md` 和 `assets/manifest.json`。不要重新发明产品方向，也不要覆盖现有生成图。继续工作时应先检查真实文件，再修改代码。

## 1. 项目概览

- 项目名称：**stellla 的欧洲旅行手记**
- 英文氛围名：**A Little Life in Europe**
- 项目目录：`europe-postcard-game/`
- 产品形态：手机优先的静态网页放置小游戏。
- 在线地址：`https://stelllaji.github.io/stellla-europe-travel-journal/`
- GitHub 仓库：`https://github.com/StelllaJi/stellla-europe-travel-journal`
- 核心用途：记录用户在卢森堡及欧洲周边的真实生活，作为一份可以分享给朋友、家人或特别对象的私人旅行手记。
- 主要情绪：惦记、等待、意外收到消息、慢慢进入另一个人的生活。
- 灵感来源：《旅行青蛙》的“准备行囊—角色自行出发—等待—收到照片—带回纪念品”循环。
- 边界：借鉴玩法结构与等待感，**不得复制《旅行青蛙》的青蛙角色、具体美术、原 UI、文案或资产**。

## 2. 用户已经明确的要求

以下均为已确定需求，除非用户主动改变，不要再次询问：

1. 主角是一只萌萌的小狗。
2. 用户已从四个方案中选择了**右上角的奶油白梗犬**。
3. 游戏正式插画全部使用 Imagegen 生成；不要用网络素材、图库照片或从别的游戏抄图。
4. 不再等待用户提供照片，先根据文字描述绘制；以后仍允许追加地点、经历和图片。
5. 用户喜欢法甜，旅行食物需要大量法国甜点。
6. 原本的旅行工具改为各种经典鸡尾酒“灵感卡”。小狗不饮酒，鸡尾酒只是影响旅行气质与事件概率的符号道具。
7. 当前是测试阶段，单次旅行默认 **1 分钟**，不是 1 小时。
8. 正式版以后再把旅行时长改回约 1 小时。
9. 用户主要生活区域是卢森堡，还去过 Nancy、Trier 和 Amsterdam。
10. 游戏重点不是标准景点介绍，而是用户的独特生活细节与回忆杀。
11. 首次打开必须有 Intro，明确说明西高地代表并收藏 stellla 的美丽记忆。
12. 主游戏采用单一全屏游戏界面，不做需要纵向下拉的落地页；只有回忆册等弹窗内部允许滚动。
13. 玩家必须先在房间主页点击“准备一次旅行”，才进入法甜与灵感卡选择。
14. 小狗在家与出发后必须有明确视觉差异：在家使用 `home-room-v1.png`，旅行中使用空房 `home-room-away-v1.png`。
15. 小狗回家后必须可直接“再次出发”，清除的只是当前旅行，已收藏的明信片、碎片与已解锁道具必须保留。
16. Collection 指全部 29 张地点明信片记忆，不以 8 张结局门槛作为收藏总数；碎片是独立的辅助系统。

## 3. 核心游戏循环

```text
小狗在家
  ↓
玩家选择一份法甜 + 一张鸡尾酒灵感卡
  ↓
小狗自行决定目的地（物品只影响概率，不完全决定）
  ↓
第 12 秒收到第一张明信片
  ↓
第 38 秒收到第二张明信片
  ↓
第 60 秒小狗回家，带回旅行碎片
  ↓
碎片进入回忆册，并在未来用于解锁新食物、卡片、摆件或隐藏事件
```

测试时间配置位于 `js/data.js`：

```js
tripDurationSeconds: 60,
postcardSeconds: [12, 38],
```

正式恢复一小时时，将 `tripDurationSeconds` 改为 `3600`，并把明信片时间改成例如 `[720, 2280]`。

## 4. 玩法原则

### 4.1 概率而不是确定答案

- 法甜和鸡尾酒卡通过标签提高某些回忆出现的概率。
- 玩家不能直接选择目的地。
- 相同组合也可能得到不同照片。
- 小狗应显得有自己的生活，而不是执行按钮命令的工具。

### 4.2 私人生活优先

优先级应为：

1. 荒谬、温暖或独特的私人经历。
2. 日常地点，例如车站、超市、图书馆讨论室和朋友家。
3. 经典景点。

“回收空瓶子”“热得睡不着的 studio”“讨论室里打桌游”等内容，比普通旅游宣传更重要。

### 4.3 被分享者的体验

- 不要把游戏做成考核对方是否了解用户的答题游戏。
- 对方扮演的是“替小狗准备、等待小狗消息的人”。
- 文案应温暖、亲密但不默认暧昧关系，让朋友、家人或特别对象都能自然进入用户的生活。
- 最终使用开放式同行邀请：“下一站，要不要一起走走？”；不要把它写成仅适用于约会对象的表白。

## 5. 已选定主角

### 5.1 外观

- 小型奶油白梗犬。
- 略微蓬乱、偏硬质感的浅奶油色毛发。
- 直立三角耳。
- 深棕色温柔眼睛，黑色鼻头。
- 四肢短而结实，正常小狗比例，不做夸张大头。
- 固定服装：苔藓绿短旅行外套，黄铜扣。
- 固定配饰：棕色皮革斜挎小包。
- 性格感受：萌、认真、好奇、略带一点担忧世界的表情。

### 5.2 角色文件

- 四选一原始设定页：`assets/references/dog-character-options-v1.png`
- 右上角选中角色裁剪：`assets/references/dog-selected-reference.png`
- 正式转面与表情：`assets/generated/dog-character-turnaround-v1.png`

后续所有场景必须引用选中角色或正式转面图，锁定脸、耳朵、毛色、外套和旅行包。禁止逐张自由发挥导致角色漂移。

## 6. 美术方向

- 原创精致欧洲旅行绘本。
- 手绘水粉、水彩和少量彩铅细节。
- 有细微纸张纹理，但不要脏旧滤镜。
- 电影式自然光线，温暖而不幼稚。
- 不要做成塑料感 3D、照片写实或夸张 Q 版。
- 主色：苔藓绿、奶油白、勃艮第红、旧金色、暖木色。
- 场景图不要生成文字；地点、标题和文案由网页覆盖。
- 不要出现品牌 Logo；真实餐厅可通过环境气质表达。
- 详细规范见 `docs/art-direction.md`。

### 6.1 已生成基础资产

| 文件 | 内容 | 状态 |
|---|---|---|
| `assets/generated/dog-character-turnaround-v1.png` | 小狗转面、动作与表情 | 已完成 |
| `assets/generated/pastry-items-sheet-v1.png` | 六款法甜设定页 | 已完成 |
| `assets/generated/cocktail-cards-sheet-v1.png` | 六款鸡尾酒卡设定页 | 已完成 |
| `assets/generated/home-room-v1.png` | 小狗在 Alvisse“家中”整理行李 | 已完成并接入首页 |
| `assets/generated/home-room-away-v1.png` | 小狗旅行后的同一间空房 | 已完成并接入旅行状态 |
| `assets/generated/intro-memory-trunk-v1.png` | 小狗打开记忆箱、明信片与城市片段涌出的 Intro 封面 | 已完成并接入 Intro |
| `assets/generated/travel-fragments-sheet-v1.png` | 六枚旅行碎片设定页 | 已完成并拆分接入 |
| `assets/generated/final-invitation-v1.png` | 卢森堡黄昏的开放式同行邀请 | 已完成并接入结局 |
| `assets/generated/postcard-envelope-v1.png` | 奶油纸、勃艮第封口与西高地封蜡信封 | 已完成透明抠图并接入拆信弹窗 |

这些是生产资产，不要只留在 `$CODEX_HOME/generated_images`；当前副本已经放入项目。

## 7. 法甜系统

当前代码已有六款基础法甜：

| 法甜 | 标签/效果方向 |
|---|---|
| 玛德琳 | 怀旧、家、旧日回忆 |
| 可露丽 | 老城、雨天 |
| 巴黎布雷斯特 | 火车、远途 |
| 柠檬挞 | 河边、阳光 |
| 歌剧院蛋糕 | 音乐、夜晚 |
| 圣多诺黑 | 稀有、意外事件 |

用户喜欢法甜，后续可扩展：马卡龙、千层酥、苹果塔、蒙布朗、布列塔尼酥饼、闪电泡芙等。

当前设定页排列为 3×2：

```text
玛德琳 | 可露丽 | 巴黎布雷斯特
柠檬挞 | 歌剧院蛋糕 | 圣多诺黑
```

六张独立卡图已经由设定页无损拆分并接入选择按钮，其中三款为初始物品、三款通过碎片商店解锁。

## 8. 鸡尾酒灵感卡系统

当前代码已有六张基础卡：

| 鸡尾酒 | 标签/效果方向 |
|---|---|
| Negroni | 酒吧、昏黄夜色 |
| Old Fashioned | 怀旧、旧建筑 |
| French 75 | 音乐、庆祝、高光时刻 |
| Aperol Spritz | 朋友、露台、日落 |
| Manhattan | 车站、城市游荡 |
| Espresso Martini | 深夜、通宵聊天 |

注意：这是旅行灵感卡，不是让狗喝酒。文案和画面都不要出现动物饮酒。

当前设定页排列为 3×2：

```text
Negroni | Old Fashioned | French 75
Aperol Spritz | Manhattan | Espresso Martini
```

六张鸡尾酒卡也已拆分并接入 UI，其中三张为初始卡、三张通过碎片商店解锁。

## 9. 地点与私人经历

### 9.1 Luxembourg / 周边

1. **Hamilius**：日常市中心、电车声、一天开始与结束。
2. **Luxembourg Gare**：出发、回家、赶上或错过。
3. **Auchan / 欧尚**：日常采购，在货架前认真比较甜点。
4. **Gëlle Fra / 金色女神像**：广场、山谷风、城市地标。
5. **Restaurant Roma**：一顿饭的私人细节，菜品和同行者尚待补充。
6. **Liquid Bar**：鸡尾酒、夜晚、没有说完的话。
7. **Dudelange 的朋友家**：等待曾计划提供的照片，但用户现在希望先按描述绘制。只允许写“朋友家”，不得显示或保存门牌。
8. **Parc Hotel Alvisse**：用户称这里是自己的家。首页主场景已经据此画成“酒店房间逐渐成为私人公寓”的感觉，不要出现酒店 Logo。
9. **CK Sportcenter, Kockelscheuer**：室内网球场、灯光、网球落地声。
10. **OneRepublic 演唱会**：用户说“去 theater 看 OneRepublic”；具体场馆没有确认，不要擅自标错，可先画成不带场馆识别信息的演出夜。
11. **吃 toro 和生蚝**：味觉碎片；餐厅尚未确认。
12. **卢大图书馆讨论室打桌游**：可能是 Belval 的 Luxembourg Learning Centre，但未经用户确认。重点笑点是“讨论室不讨论，讨论谁输桌游”。

### 9.2 Nancy

1. **Place Stanislas**：用户称“非物质文化遗产的广场”。准确说法应是 UNESCO 世界文化遗产建筑群，不要在游戏里纠正用户，只正常使用地点名。
2. **Parc de la Pépinière 木质游乐区**：用户记得一个像树桩、可以从中间爬过去的设施。已核对，公园游乐区确有树主题木质设施。
3. **Espace Animalier, Parc de la Pépinière**：用户说“车站旁边的动物园”；实际是 Pépinière 公园里的免费小动物区。画面可做成旅行支线。
4. **Musée des Beaux-Arts de Nancy**：美术馆、慢时间。
5. **Amorino**：花瓣形冰淇淋，口味尚未补充。

### 9.3 Trier

1. **Trier Cathedral / 特里尔主教座堂**：用户说“最大的那个教堂”。画高大石墙与从高处落下的光。
2. **Karl Marx House / 马克思故居博物馆**：可以加入小狗认真参观、最后被纪念品吸引的轻幽默。
3. **Palastgarten**：宫殿花园、散步、晚一点说出口的话。

### 9.4 Amsterdam

1. **Vintage 店**：店名未确认；旧衣服拥有过另一段人生。
2. **运河区**：水面拉长灯光，适合怀旧路线。
3. **Van Gogh Museum**：看完浓烈颜色后，街上的天空也变了。
4. **一起吃生鲱鱼**：重点是两人一起尝试和第一反应，不需要精确摊位。
5. **红灯区 / De Wallen**：可以画霓虹与运河，但保持克制，不色情化。
6. **通宵聊天**：最重要的不是地点，而是不舍得结束的谈话。
7. **回收空瓶子**：荒谬而真实的生活支线，很适合稀有明信片。
8. **韩老师很热但温馨的小 studio**：私人住宅；不要记录或展示地址。重点是小、热、睡不着，却因为有人在而温馨。
9. **Bloemenmarkt / 花卉市场**：颜色、运河、不会枯萎的花瓣碎片。

上述内容已经录入 `js/data.js` 与 `docs/memory-map.md`。

## 10. 隐私边界

必须遵守：

- 用户曾提供 Dudelange 朋友家的精确住址。该地址**不得写入项目、插画、文案、地图或对外游戏**。
- 当前仓库中只记录“Dudelange 的朋友家”。已经搜索确认项目未保留该门牌。
- 韩老师的 studio 同样不得加入地址或可识别门牌。
- 私人住宅插画应重构氛围，不应精准复原可定位外观。
- 如果未来公开部署，应再次检查图片元数据、文本和代码中是否存在住址。

## 11. 当前代码结构

```text
europe-postcard-game/
├── HANDOFF.md
├── README.md
├── index.html
├── styles.css
├── js/
│   ├── data.js          # 时长、法甜、鸡尾酒、地点与回忆数据
│   └── app.js           # 选择、概率、倒计时、明信片、回忆册和存档
├── docs/
│   ├── art-direction.md
│   └── memory-map.md
└── assets/
    ├── manifest.json
    ├── references/
    │   ├── dog-character-options-v1.png
    │   └── dog-selected-reference.png
    └── generated/
        ├── dog-character-turnaround-v1.png
        ├── pastry-items-sheet-v1.png
        ├── cocktail-cards-sheet-v1.png
        └── home-room-v1.png
```

## 12. 已实现功能

- 手机优先响应式单页 UI。
- 首次访问 Intro：使用“小狗打开记忆箱”的独立封面，说明西高地是 stellla 美丽记忆的载体。
- 主界面已重构为固定 `100dvh` 的全屏游戏状态，不再要求纵向下拉。
- 房间主页点击“准备一次旅行”后才显示横向行囊界面。
- 小狗出发后自动切换为空房插画，并显示半透明旅行 HUD。
- 法甜六选一。
- 鸡尾酒卡六选一。
- 基于标签权重随机挑选回忆。
- 一分钟旅行倒计时。
- 第 12 秒和第 38 秒解锁途中明信片。
- 第 60 秒解锁回家碎片。
- 浏览器关闭后根据真实时间继续结算。
- 使用 `localStorage` 保存当前旅行和回忆册。
- 回忆册弹窗。
- 顶部入口与收藏弹窗统一命名为“我的明信片／我的明信片记忆”，收藏进度为已收藏数 / 29。
- 旅行回家后恢复有小狗的房间画面，HUD 按钮改为“再次出发”，点击直接重开行囊且保留收藏。
- 明信片不再从灰卡原地变成图片：到达时自动弹出封蜡信封，玩家点击拆开后才显示完整插画并收入回忆册；积压时会依次弹出。
- 明信片弹窗与回忆册统一显示明确的“国家 · 城市”，例如“法国 · Nancy”“荷兰 · Amsterdam”。
- 完整文案校对索引位于 `docs/copy-review.md`，UI、便签、道具、碎片和 29 张明信片均有稳定编号。
- 重置本次旅行按钮。
- 首页已引用 `assets/generated/home-room-v1.png`。
- 29 个回忆地点均已有可用插画并接入随机旅行池。
- 12 件法甜与鸡尾酒已拆成独立方形卡图并接入选择界面。
- 12 件法甜与鸡尾酒已从 Imagegen 原始设定页按真实物体边界重新取景，导出透明 RGBA、奶油白描边与柔和阴影的 `*-cutout-v2.png`，避免旧版网格硬裁切。
- 6 枚旅行碎片已生成独立卡图，回家时会按行囊标签抽取、累计并显示在回忆册。
- 回忆册内已加入旅行小商店，可消耗指定碎片永久解锁 3 款法甜与 3 张鸡尾酒灵感卡。
- 每次完成旅行会出现一张按行囊标签抽取的隐藏便签。
- 收集 8 张明信片与 3 种不同碎片后解锁“同行邀请”，支持系统分享或复制链接；碎片即使消费，历史发现进度也不会倒退。
- 最终同行邀请插画为 `assets/generated/final-invitation-v1.png`，适用于朋友、家人或特别对象，不预设关系。
- 梵高博物馆使用《盛开的杏花》场景版本 `postcard-ams-vangogh-v3.png`。
- Nancy 树桩设施已按用户纠正改为横置中空木桩隧道版本 v2。

## 13. 当前未完成与已知问题

### 高优先级

1. 加入可解锁房间摆件，让首页随着收集进度产生视觉变化。
2. 增加偶尔空手而归、只带一句话或触发稀有支线的旅行结果。
3. 公网 HTTPS 版本已部署；页面内分享按钮在线上会分享永久地址。
4. 页面已加入 Web App manifest、iOS meta、安全区和 390×844 手机视口样式；仍建议在用户真实 iPhone/Android 与微信内置浏览器中手动看一遍。

### 技术与验证

1. 当前环境没有 `node` 命令，因此没有运行 `node --check`。
2. 已通过 `python -m http.server 8000` 和无界面 Chrome 完成真实页面自动化交互测试；可复用验收脚本为 `tests/browser_smoke.py`。
3. 2026-07-01 最新验收覆盖：强制 390×844 CSS 手机视口、Intro、全屏无页面滚动、点击后才进入行囊、出发后空房、两封明信片依次弹出、拆封后进入回忆册、隐藏便签、回家后“再次出发”在视口内可见且收藏保留、碎片历史发现、余额归零不反锁结局、同行邀请弹窗和结局插画加载，均通过。
4. 启动本地服务器在沙箱里可能需要权限批准。
5. Google Fonts 通过网络加载；离线时会回退到系统字体。正式分享可考虑自托管字体或接受回退。
6. 项目目录已初始化为 Git 仓库，`main` 跟踪 GitHub 远端；修改完成后提交并推送即可触发 Pages 自动更新。

## 14. 下一步建议顺序

### 第一阶段：让现有原型真正“有图可玩”

此阶段已于 2026-06-30 完成：全部地点、法甜和鸡尾酒图均已接入。

一分钟完整流程和商店解锁已于 2026-07-01 完成浏览器验收。

### 第二阶段：地点明信片

此阶段已完成。`js/data.js` 中 29 个地点的 `art` 引用均指向现有文件。

### 第三阶段：丰富游戏

1. 增加“普通碎片、稀有碎片、心事碎片”。
2. 法甜与鸡尾酒卡解锁已完成；下一步可加入可解锁的房间摆件。
3. 增加偶尔空手而归或只带一句话的情况。
4. 增加旅行称号与轻微概率加成。
5. 开放式同行邀请卡已完成；后续可让用户自行选择更亲密或更朋友向的分享文案。
6. 根据用户反馈将旅行时长从 1 分钟调整到正式时长。

## 15. 本地运行

```bash
cd "/Users/zhaomumu/Desktop/jst自己的日常/python test/心理疗愈/relationship-analysis/europe-postcard-game"
python -m http.server 8000
```

浏览器访问：

```text
http://localhost:8000
```

清除测试存档：打开浏览器开发者工具，执行：

```js
localStorage.removeItem("little-dog-europe-v1")
```

或点击页面上的“重新体验这次旅行”。后者保留已经收集到的回忆册。

## 16. Imagegen 工作规范

1. 使用内置 Imagegen 工具。
2. 每一个独立资产使用独立生成请求；不要用一个请求假装生成不同用途的多个最终资产。
3. 角色参考文件：`assets/references/dog-selected-reference.png` 或正式转面图。
4. 每次生成后把选定结果复制进项目 `assets/generated/`，不要只留在 `$CODEX_HOME/generated_images/`。
5. 不覆盖旧版本；迭代使用 `-v2`、`-v3`。
6. 场景图为横向 4:3 或 3:2；网页首页使用 3:2，明信片使用 4:3。
7. 图中不生成标题、说明文字、品牌或水印。
8. 生成后用 `view_image` 检查角色一致性、手脚、耳朵、包带和场景地标。
9. 如果用户要求透明道具图，遵循 Imagegen 技能的透明背景流程，不要擅自切换模型。

## 17. 推荐的地点图通用 Prompt 骨架

```text
Use case: illustration-story
Asset type: collectible postcard illustration for a cozy travel web game
Input image: exact protagonist identity reference
Primary request: Paint [地点 + 用户经历]
Subject: the exact cream-white terrier with upright triangular ears,
moss-green travel coat and small brown leather crossbody satchel
Style/medium: exquisite original European picture-book illustration,
hand-painted gouache and watercolor with delicate colored-pencil detail,
subtle paper grain, sophisticated animation-film finish
Composition: landscape 4:3, readable at mobile size, one clear story beat
Lighting/mood: [具体时间、天气与情绪]
Constraints: preserve exact dog identity; no text; no logos; no watermark;
do not copy any existing game or animation character
```

每张地点图还应加入具体环境细节，不能只替换地名。

## 18. 给新账号的第一条指令

可以把下面这段原样发给新的 Codex：

> 请打开当前工作区里的 `europe-postcard-game/HANDOFF.md`，完整阅读后再查看 README、memory-map、art-direction、assets/manifest.json 和现有代码。不要重做已完成资产，不要改变已锁定的小狗设计。29 个地点、12 件道具、6 种碎片、隐藏便签和开放式同行邀请均已接入。下一步优先实现房间摆件或更多隐藏事件。所有新插画必须使用 Imagegen，并保持现有角色和绘本风格。

## 19. 交接完成标准

下一位 Codex 应能仅凭本文件完成以下判断：

- 这是什么项目、给谁玩、想产生什么情绪。
- 哪些产品决定已经锁定。
- 小狗长什么样。
- 已有哪四张基础图。
- 用户去过哪些地点、发生过什么。
- 哪些信息必须保密。
- 当前代码能做什么、缺什么。
- 下一步应先做什么，而不是重新问用户一遍。

如实际文件与本交接文档冲突，以**实际文件 + 用户最新明确指令**为准，并及时更新本交接文档。
