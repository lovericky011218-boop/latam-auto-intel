# Strategic Market Auto Intelligence Dashboard

东风主要战略市场中国汽车品牌竞品车型交互看板，覆盖南美、欧洲、澳新与东南亚市场。

看板按国家、集团、子品牌、能源形式和驱动形式筛选车型，并展示配置价格、人民币换算、尺寸、轴距、能耗、续航、电池容量与碰撞安全信息。数据条目附有公开来源链接；未能从当地官方渠道确认的信息会标记为待核验或未公布。

## 在线访问

- [GitHub Pages](https://lovericky011218-boop.github.io/latam-auto-intel/)
- [Sites 版本](https://latam-auto-intel.lovericky011218.chatgpt.site/)

## 本地运行

需要 Node.js `>=22.13.0` 与 pnpm。

```bash
pnpm install
pnpm dev
```

## 验证与构建

```bash
pnpm test
```

推送到 `main` 分支后，`.github/workflows/pages.yml` 会自动生成静态版本并发布到 GitHub Pages。原有 Sites 配置保留在 `.openai/hosting.json`。
