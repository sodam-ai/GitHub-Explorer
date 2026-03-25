# GitHub AI Explorer

> 用 AI 自然语言搜索 GitHub 仓库、代码和 Issue — 直接在桌面端使用。

[English](./README.md) | [Korean (한국어)](./README.ko.md) | [Japanese (日本語)](./README.ja.md) | [Chinese (中文)](./README.zh.md)

---

## 这是什么？

**GitHub AI Explorer** 是一款桌面应用，让您可以用日常语言代替关键词来搜索 GitHub。

无需输入 `react drag drop library stars:>1000` 这样复杂的搜索词：
> "React 拖拽库，星标多的，最近有更新的"

只需用自然语言输入，AI 会自动为您找到最佳结果。

---

## 主要功能

| 功能 | 说明 |
|------|------|
| AI 搜索 | 用自然语言输入，从仓库、代码、Issue 中智能检索结果 |
| AI 摘要 | 每次搜索结果顶部自动生成 AI 摘要 |
| 标签页 | 结果按仓库 / 代码 / Issue 标签页分类整理 |
| 书签 | 将喜欢的仓库保存到收藏集 |
| 命令面板 | 按 `Ctrl+K` 在应用任何位置快速搜索 |
| 自动补全 | 输入时根据历史记录 + 热门话题推荐候选 |
| 键盘导航 | 用 `j/k` 移动结果，`Enter` 预览 |
| 仓库预览 | 悬停或按 Enter 查看 README、统计信息和话题标签 |
| 健康度评分 | AI 分析每个仓库的活跃度、社区和文档并打分 |
| 仓库对比 | 并排比较 2~3 个仓库的详细统计数据 |
| 代码问答 | 向 AI 提问仓库代码相关的问题 — 附带文件引用回答 |
| 收藏集 | 用文件夹 + 备注管理收藏的仓库 |
| 趋势 | 今日 / 本周热门仓库 + 星标增长量 |
| 统计面板 | 搜索模式、关键词、活动图表 |
| 深色 / 浅色模式 | 主题切换 + 6 种自定义强调色 |
| 引导向导 | 首次启动时的 3 步设置引导 |
| 系统托盘 | 最小化后驻留托盘，双击恢复 |
| 多语言 | 韩语、英语、日语界面 |
| 代码片段保存 | 将问答中的代码保存到持久化抽屉 |
| 离线模式 | 无网络时搜索已缓存的仓库 |
| 本地 AI | 通过 Ollama 在本机使用免费、私密的 AI |
| 设置 | 在同一处管理 GitHub 令牌、AI 密钥、主题和语言 |

---

## 截图

> UI 完成后将添加截图。

---

## 安装与运行方法

### 前置要求

开始之前，请确保您的电脑已安装以下程序：

| 工具 | 用途 | 安装方法 |
|------|------|----------|
| **Node.js 20+** | 运行前端 | 从 [nodejs.org](https://nodejs.org/) 下载 |
| **Rust** | 运行后端 | 从 [rustup.rs](https://rustup.rs/) 安装 |
| **Git** | 代码管理 | 从 [git-scm.com](https://git-scm.com/) 下载 |

### 分步设置

**第 1 步：下载项目**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**第 2 步：安装依赖包**
```bash
npm install
```

**第 3 步：运行应用（开发模式）**
```bash
npm run tauri dev
```

> 首次运行时，由于 Rust 需要编译，大约需要 5~10 分钟。之后启动只需几秒钟。

**或者构建安装包：**
```bash
npm run tauri build
# 安装文件: src-tauri/target/release/bundle/msi/GitHub AI Explorer_0.3.0_x64_en-US.msi
```

**第 4 步：设置 API 密钥**

1. 打开应用后，点击右上角的齿轮图标（设置）
2. 输入 **OpenAI API 密钥**（在 [platform.openai.com/api-keys](https://platform.openai.com/api-keys) 获取）
3. （可选）输入 **GitHub 令牌** 以提高 API 限额（在 [github.com/settings/tokens](https://github.com/settings/tokens) 获取）
4. 点击"保存"

**第 5 步：开始搜索！**

在搜索栏中输入任意内容，然后按 Enter。例如：
- "React 表格库 带排序功能"
- "Python FastAPI 认证示例"
- "TypeScript 状态管理 2026"

---

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+K` | 命令面板（快速搜索） |
| `Ctrl+,` | 打开设置 |

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 桌面框架 | Tauri 2.0 (Rust 后端) |
| 前端 | React 19 + TypeScript |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 本地数据库 | SQLite (rusqlite) |
| AI | OpenAI API + Ollama (本地) |
| 语法高亮 | Prism.js |
| 构建工具 | Vite 8 |
| 图标 | Lucide React |

---

## 项目结构

```
github-ai-explorer/
├── src/                    # 前端 (React)
│   ├── components/         # UI 组件
│   ├── pages/              # 页面 (首页、搜索)
│   ├── stores/             # 状态管理 (Zustand)
│   ├── lib/                # API 客户端 (GitHub, AI, Tauri 桥接)
│   └── types/              # TypeScript 类型定义
├── src-tauri/              # 后端 (Rust)
│   ├── src/                # Rust 源码 (命令、数据库)
│   └── tauri.conf.json     # Tauri 配置
├── PRD/                    # 设计文档 (6 个文件)
└── .env                    # API 密钥 (不会上传到 GitHub)
```

---

## 开发阶段

| 阶段 | 功能 | 状态 |
|------|------|------|
| Phase 1 (MVP) | AI 搜索、AI 摘要、标签页、历史记录、快捷键、深色模式、设置、SQLite、GitHub 认证 | **已完成** (11/11) |
| Phase 2 | 代码问答、书签、收藏集、健康度分析、对比、智能文件夹、代码查看器、筛选器 | **已完成** (9/9) |
| Phase 3 | 本地 AI (Ollama)、离线模式、趋势面板、导出、自动更新、缓存策略 | **已完成** (8/8) |

---

## 安全性

- API 密钥仅存储在 **您的电脑本地**（SQLite 数据库）
- `.env` 文件已包含在 `.gitignore` 中 — **绝不会上传到 GitHub**
- 除 GitHub API 和 OpenAI API 外，不会向任何服务器发送数据
- 所有代码均为开源 — 您可以自行查看验证

---

## 许可证

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

详情请参阅 [LICENSE](./LICENSE)。

---

## 支持

如有疑问或发现 Bug，请在 [GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues) 中提交。
