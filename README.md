# stellla 的欧洲旅行手记

受“准备行囊—等待—收到照片—带回纪念品”的放置旅行循环启发，记录用户在卢森堡及欧洲周边的真实生活。

在线游玩：<https://stelllaji.github.io/stellla-europe-travel-journal/>

新账号或新会话接手时，请先阅读 [`HANDOFF.md`](HANDOFF.md)。

## 本地预览

在项目目录运行：

```bash
python -m http.server 8000
```

访问 `http://localhost:8000`。当前测试版默认一分钟完成旅行：第 12 秒和第 38 秒收到途中照片，第 60 秒回家。

手机与电脑连接同一 Wi-Fi 时，也可在手机浏览器访问电脑的局域网地址进行开发预览。对外分享请使用上面的公网 HTTPS 地址。

## 发布更新

公开仓库：<https://github.com/StelllaJi/stellla-europe-travel-journal>

GitHub Pages 从 `main` 分支根目录自动发布。以后修改并测试完成后，提交并推送到 `main`，原在线链接会自动更新，无需重新创建网址。

正式发布时，把 `js/data.js` 中的 `tripDurationSeconds` 从 `60` 改为 `3600`，并相应调整 `postcardSeconds` 即可。

## 内容扩展

- 地点、法甜、鸡尾酒卡：`js/data.js`
- 真实回忆整理：`docs/memory-map.md`
- 美术规范：`docs/art-direction.md`
- 生成插画：`assets/generated/`

游戏使用浏览器 `localStorage` 保存旅行开始时间和回忆册。正式分享版无需服务器数据库。

当前测试版包含 29 个地点回忆、12 件行囊物品和 6 种可累计旅行碎片。完成旅行会获得碎片，碎片可在回忆册的小商店中解锁新的法甜与鸡尾酒灵感卡。

每次回家还会带回一张按旅途气质抽取的隐藏便签。收集 8 张生活明信片和 3 种不同碎片后，会解锁一个适合分享给朋友、家人或特别对象的开放式“同行邀请”，不预设收件人与用户的关系。

12 件行囊物品已从 Imagegen 设定图重新按真实边界取景，并处理为透明背景、奶油白描边和柔和阴影。明信片到达时会自动弹出封蜡信封，玩家拆开后才显示插画并收入回忆册。
