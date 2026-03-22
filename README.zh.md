# GitHub AI Explorer

> 用AI自然语言搜索GitHub仓库、代码和Issue — 直接在桌面端使用。

[English](./README.md) | [Korean (한국어)](./README.ko.md) | [Japanese (日本語)](./README.ja.md)

---

## 这是什么？

**GitHub AI Explorer** 是一款桌面应用，让你用日常语言代替关键词来搜索GitHub。

不需要输入 `react drag drop library stars:>1000` 这样复杂的搜索词：
> "React拖拽库，Star多的，最近更新过的"

这样用自然语言输入，AI就会为你找到最佳结果。

---

## 主要功能

| 功能 | 说明 |
|------|------|
| AI搜索 | 用自然语言输入，从仓库、代码、Issue中智能搜索结果 |
| AI摘要 | 搜索结果顶部由AI生成摘要 |
| 标签分类 | 结果按仓库 / 代码 / Issue标签整理 |
| 书签 | 保存喜欢的仓库（Phase 2计划中） |
| 命令面板 | 按 `Ctrl+K` 可在应用任何位置快速搜索 |
| 暗色/亮色模式 | 切换暗色和亮色主题 |
| 本地数据库 | 搜索历史和设置保存在本地电脑上 |
| GitHub认证 | 连接GitHub账户提高API限额（每小时60次 → 5,000次） |
| 设置界面 | 在一个地方管理GitHub令牌和AI API密钥 |

---

## 截图

> UI完成后将添加截图。

---

## 安装和运行方法

### 前置要求

开始之前，请确保电脑上已安装以下程序：

| 工具 | 用途 | 安装方法 |
|------|------|----------|
| **Node.js 20+** | 运行前端 | 从 [nodejs.org](https://nodejs.org/) 下载 |
| **Rust** | 运行后端 | 从 [rustup.rs](https://rustup.rs/) 安装 |
| **Git** | 代码管理 | 从 [git-scm.com](https://git-scm.com/) 下载 |

### 分步设置

**第1步：下载项目**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**第2步：安装依赖包**
```bash
npm install
```

**第3步：运行应用**
```bash
npm run tauri dev
```

> 首次运行因Rust编译需要5-10分钟。之后只需几秒即可启动。

**第4步：设置API密钥**

1. 应用打开后点击右上角齿轮图标（设置）
2. 输入 **OpenAI API密钥**（在 [platform.openai.com/api-keys](https://platform.openai.com/api-keys) 获取）
3. （可选）输入 **GitHub令牌** 提高API限额（在 [github.com/settings/tokens](https://github.com/settings/tokens) 获取）
4. 点击"保存"

**第5步：搜索！**

在搜索栏输入任何内容并按回车。例如：
- "React表格库，带排序功能"
- "Python FastAPI认证示例"
- "TypeScript状态管理 2026"

---

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+K` | 打开命令面板（快速搜索） |
| `Ctrl+,` | 打开设置 |

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 桌面框架 | Tauri 2.0（Rust后端） |
| 前端 | React 19 + TypeScript |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 本地数据库 | SQLite（rusqlite） |
| AI | OpenAI API（gpt-4o-mini） |
| 构建工具 | Vite 8 |
| 图标 | Lucide React |

---

## 项目结构

```
github-ai-explorer/
├── src/                    # 前端（React）
│   ├── components/         # UI组件
│   ├── pages/              # 页面（首页、搜索）
│   ├── stores/             # 状态管理（Zustand）
│   ├── lib/                # API客户端（GitHub、AI、Tauri桥接）
│   └── types/              # TypeScript类型定义
├── src-tauri/              # 后端（Rust）
│   ├── src/                # Rust源码（命令、数据库）
│   └── tauri.conf.json     # Tauri配置
├── PRD/                    # 设计文档（6个文件）
└── .env                    # API密钥（不会上传到GitHub）
```

---

## 开发阶段

| 阶段 | 功能 | 状态 |
|------|------|------|
| Phase 1（MVP） | AI搜索、AI摘要、标签、历史、快捷键、暗色模式、设置、SQLite、GitHub认证 | **已完成**（11/11） |
| Phase 2 | 代码问答、书签、收藏夹、健康度分析、比较、智能文件夹 | 计划中 |
| Phase 3 | 本地AI（Ollama）、智能推荐、趋势仪表盘、自动更新 | 计划中 |

---

## 安全性

- API密钥**仅保存在您的电脑上**（SQLite数据库）
- `.env`文件包含在`.gitignore`中 — **永远不会上传到GitHub**
- 除GitHub API和OpenAI API外，不会向任何服务器发送数据
- 所有代码开源 — 可直接验证

---

## 许可证

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

详情请参阅 [LICENSE](./LICENSE)。

---

## 支持

如有问题或发现Bug，请在 [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues) 提交。
