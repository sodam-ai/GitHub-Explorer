# GitHub AI Explorer

> GitHubのリポジトリ、コード、イシューをAIの自然言語で検索 — デスクトップから直接。

[English](./README.md) | [Korean (한국어)](./README.ko.md) | [Chinese (中文)](./README.zh.md)

---

## これは何ですか？

**GitHub AI Explorer**は、キーワードの代わりに日常の言葉でGitHubを検索できるデスクトップアプリです。

`react drag drop library stars:>1000` のような複雑な検索の代わりに：
> 「Reactのドラッグ＆ドロップライブラリで、スターが多くて最近更新されたもの」

このように自然言語で入力すると、AIが最適な結果を見つけてくれます。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| AI検索 | 自然言語で入力すると、リポジトリ、コード、イシューからスマートに検索 |
| AI要約 | 検索結果の上部にAIが要約を生成 |
| オートコンプリート | 入力中に履歴+人気トピックから候補を表示 |
| キーボード操作 | j/kで結果を移動、Enterでプレビュー |
| リポジトリプレビュー | README、統計、トピックをモーダルで確認 |
| 健全性分析 | 活動性/コミュニティ/ドキュメント基準のスコア |
| リポジトリ比較 | 2〜3個のリポジトリを並べて比較 |
| コードQ&A | リポジトリのコードについてAIに質問 |
| コレクション | お気に入りをフォルダ+メモで管理 |
| トレンド | 今日/今週の人気リポジトリ |
| 統計ダッシュボード | 検索パターン、キーワード、活動グラフ |
| ダーク/ライトモード | テーマ切替 + 6色カスタム |
| オンボーディング | 初回起動時の3ステップガイド |
| システムトレイ | 最小化時にトレイに常駐 |
| 多言語 | 韓国語、英語、日本語UI |
| コードスニペット保存 | Q&Aのコードをドロワーに保存 |
| オフラインモード | キャッシュデータでオフライン検索 |
| ローカルAI | Ollamaで無料ローカルAI |
| 設定 | GitHubトークン、AIキー、テーマ、言語を一か所で管理 |

---

## スクリーンショット

> UI完成後にスクリーンショットが追加される予定です。

---

## インストールと実行方法

### 事前に必要なもの

始める前に、以下のプログラムがコンピュータにインストールされている必要があります：

| ツール | 役割 | インストール方法 |
|--------|------|-----------------|
| **Node.js 20+** | フロントエンド実行 | [nodejs.org](https://nodejs.org/) からダウンロード |
| **Rust** | バックエンド実行 | [rustup.rs](https://rustup.rs/) からインストール |
| **Git** | コード管理 | [git-scm.com](https://git-scm.com/) からダウンロード |

### ステップバイステップ設定

**ステップ1: プロジェクトのダウンロード**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**ステップ2: パッケージのインストール**
```bash
npm install
```

**ステップ3: アプリの実行**
```bash
npm run tauri dev
```

> 初回実行時はRustのコンパイルのため5〜10分かかります。2回目以降は数秒で起動します。

**ステップ4: APIキーの設定**

1. アプリが開いたら右上の歯車アイコン（設定）をクリック
2. **OpenAI APIキー**を入力（[platform.openai.com/api-keys](https://platform.openai.com/api-keys) で発行）
3. （任意）**GitHubトークン**を入力してAPIリミットを増加（[github.com/settings/tokens](https://github.com/settings/tokens) で発行）
4. 「保存」をクリック

**ステップ5: 検索！**

検索バーに何でも入力してEnterを押してください。例：
- 「Reactテーブルライブラリ、ソート機能付き」
- 「Python FastAPI 認証の例」
- 「TypeScript 状態管理 2026」

---

## キーボードショートカット

| ショートカット | 機能 |
|---------------|------|
| `Ctrl+K` | コマンドパレット（クイック検索） |
| `Ctrl+,` | 設定を開く |

---

## 技術スタック

| 分類 | 技術 |
|------|------|
| デスクトップフレームワーク | Tauri 2.0（Rustバックエンド） |
| フロントエンド | React 19 + TypeScript |
| スタイリング | Tailwind CSS 4 |
| 状態管理 | Zustand |
| ローカルデータベース | SQLite（rusqlite） |
| AI | OpenAI API（gpt-4o-mini） |
| ビルドツール | Vite 8 |
| アイコン | Lucide React |

---

## プロジェクト構造

```
github-ai-explorer/
├── src/                    # フロントエンド（React）
│   ├── components/         # UIコンポーネント
│   ├── pages/              # ページ（ホーム、検索）
│   ├── stores/             # 状態管理（Zustand）
│   ├── lib/                # APIクライアント（GitHub、AI、Tauriブリッジ）
│   └── types/              # TypeScript型定義
├── src-tauri/              # バックエンド（Rust）
│   ├── src/                # Rustソース（コマンド、データベース）
│   └── tauri.conf.json     # Tauri設定
├── PRD/                    # デザインドキュメント（6ファイル）
└── .env                    # APIキー（GitHubにアップロードされません）
```

---

## 開発フェーズ

| フェーズ | 機能 | 状態 |
|---------|------|------|
| Phase 1（MVP） | AI検索、AI要約、タブ、履歴、ショートカット、ダークモード、設定、SQLite、GitHub認証 | **完了**（11/11） |
| Phase 2 | コードQ&A、ブックマーク、コレクション、健全性分析、比較、スマートフォルダ、コードビューア、フィルタ | **完了**（9/9） |
| Phase 3 | ローカルAI（Ollama）、オフラインモード、トレンドダッシュボード、エクスポート、自動更新、キャッシュ | **完了**（8/8） |

---

## セキュリティ

- APIキーは**お使いのコンピュータにのみ**ローカル保存されます（SQLiteデータベース）
- `.env`ファイルは`.gitignore`に含まれ、**GitHubにアップロードされません**
- GitHub APIとOpenAI API以外にはデータを送信しません
- すべてのコードはオープンソース — 直接確認可能

---

## ライセンス

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

詳細は[LICENSE](./LICENSE)をご覧ください。

---

## サポート

質問やバグを発見した場合は、[GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues)に登録してください。
