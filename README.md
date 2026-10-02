# 秀场视频转换 / Show Champ Converter

浏览器本机转换为 H.264 MP4（AAC），支持裁剪、三档画质、成品预览、下载、返回秀场。

## Cloudflare Pages 发布

1. 新建 GitHub 仓库，例如 show-champ-converter。上传本项目源码和 package-lock.json，保留 src、scripts、public、tests 的目录结构。不要上传 node_modules、dist、public/core。
2. Cloudflare 创建 **Pages** 项目，连接这个仓库。
3. 项目名称填 show-champ-converter；构建命令 npm run build；输出目录 dist；根目录留空。建议 Node.js 22。
4. 部署后访问 https://show-champ-converter.pages.dev/。

转换内核在构建时从 npm 包复制并拆成静态小文件，首次转换时由用户浏览器加载，无需 API 密钥、D1、R2 或服务器转码。

## 接入秀场

秀场项目覆盖 src/video-editor.jsx、src/converter-embed.jsx、src/feed.css、public/_headers，并添加 public/video-converter.json。

默认配置为 https://show-champ-converter.pages.dev/。若项目使用别的域名：修改秀场 public/video-converter.json 和 public/_headers 的 frame-src；转换器 src/convert.js 中 trustedParents、public/_headers 中 frame-ancestors 需包含你的秀场正式域名。

秀场发布短视频页面点击“使用视频格式转换工具”。已有原片会传给转换器；转换完成点击“使用这个视频，返回秀场”，确认秀场最终预览后发布。原片和成品通过受来源及随机会话编号校验的 postMessage 传递，不经服务器上传。

如果嵌入失败，点击“单独打开”，下载 MP4 后返回秀场选择成品。手机实际可用性需要在目标 iPhone 上验证。

## 限制

原片最多100MB，片段最长60秒，输出最多20MB。超出限制请剪短或选择省流画质。转换运行最多5分钟，超时可缩短片段重试。

常见 MOV、MP4、MKV、AVI、WebM 等由 FFmpeg 尝试解码，不保证所有编码、损坏文件或加密内容可用。软件解码增加格式覆盖，但手机内存不足仍可能失败。采用单线程内核，便于嵌入，不要求启用跨域隔离；转换速度可能较慢。

## 本地

```sh
npm ci
npm run build
npm run preview
npm test
```

## 开源组件

ffmpeg.wasm wrapper 使用 MIT 许可；FFmpeg 内核包括 FFmpeg/x264 等组件，适用其对应 LGPL/GPL 条款。组件版本、许可证与源码链接见 public/THIRD-PARTY-NOTICES.md。项目功能免费使用不代表云托管或流量无限免费。

官方参考：https://ffmpegwasm.netlify.app/docs/getting-started/usage/
