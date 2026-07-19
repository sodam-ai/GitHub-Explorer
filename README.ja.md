# GitHub AI Explorer

> GitHub リポジトリ、コード、イシューを AI 自然言語で検索 — デスクトップからすぐに。

[English](./README.md) | [Korean (한국어)](./README.ko.md) | [Japanese (日本語)](./README.ja.md) | [Chinese (中文)](./README.zh.md)

---

## これは何ですか？

**GitHub AI Explorer** は、キーワードの代わりに普段の言葉で GitHub を検索できるデスクトップアプリです。

`react drag drop library stars:>1000` のような複雑な検索の代わりに：
> 「React のドラッグ＆ドロップライブラリで、スターが多くて最近更新されたもの」

このように自然言語で入力すると、AI が最適な結果を見つけてくれます。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| AI 検索 | 自然言語で入力すると、リポジトリ・コード・イシューからスマートに結果を検索 |
| AI 要約 | 検索結果の上部に AI が要約を生成 |
| タブ | 結果をリポジトリ / コード / イシュータブに整理 |
| ブックマーク | お気に入りのリポジトリをコレクションに保存 |
| コマンドパレット | `Ctrl+K` でアプリのどこからでも素早く検索 |
| オートコンプリート | 入力中に履歴 + 人気トピックから候補を推薦 |
| キーボード操作 | `j/k` で結果を移動、`Enter` でプレビュー |
| リポジトリプレビュー | ホバーまたは Enter で README、統計、トピックを確認 |
| ヘルススコア | AI がリポジトリのアクティビティ・コミュニティ・ドキュメントを分析してスコア付け |
| リポジトリ比較 | 2〜3 個のリポジトリを詳細な統計で並べて比較 |
| コード Q&A | リポジトリのコードについて AI に質問 — ファイル参照付きで回答 |
| コレクション | お気に入りリポジトリをフォルダ + メモで管理 |
| トレンド | 今日 / 今週の人気リポジトリ + スター増加量 |
| 統計ダッシュボード | 検索パターン、キーワード、アクティビティグラフ |
| ダーク / ライトモード | テーマ切替 + 6 種類のカスタムアクセントカラー |
| オンボーディング | 初回起動時の 3 ステップ設定ガイド |
| システムトレイ | 最小化時にトレイに常駐、ダブルクリックで復元 |
| 多言語対応 | 韓国語、英語、日本語 UI |
| コードスニペット保存 | Q&A セッションのコードを永続的なドロワーに保存 |
| オフラインモード | インターネットなしでキャッシュされたリポジトリを検索 |
| ローカル AI | Ollama で無料・プライベートな AI をローカルで利用 |
| 設定 | GitHub トークン、AI キー、テーマ、言語を一箇所で管理 |

---

## スクリーンショット

> UI 完成後にスクリーンショットが追加される予定です。

---

## インストールと実行方法

### 事前に必要なもの

始める前に、以下のプログラムがパソコンにインストールされている必要があります：

| ツール | 役割 | インストール方法 |
|--------|------|-----------------|
| **Node.js 20+** | フロントエンドの実行 | [nodejs.org](https://nodejs.org/) からダウンロード |
| **Rust** | バックエンドの実行 | [rustup.rs](https://rustup.rs/) からインストール |
| **Git** | コード管理 | [git-scm.com](https://git-scm.com/) からダウンロード |

### ステップバイステップのセットアップ

**ステップ 1：プロジェクトをダウンロード**
```bash
git clone https://github.com/sodam-ai/github-ai-explorer.git
cd github-ai-explorer
```

**ステップ 2：パッケージをインストール**
```bash
npm install
```

**ステップ 3：アプリを実行（開発モード）**
```bash
npm run tauri dev
```

> 初回実行時は Rust のコンパイルのため 5〜10 分かかります。2 回目以降は数秒で起動します。

**または、インストーラーをビルド：**
```bash
npm run tauri build
# インストーラー: src-tauri/target/release/bundle/msi/GitHub AI Explorer_0.3.0_x64_en-US.msi
```

**ステップ 4：API キーの設定**

1. アプリが開いたら、右上の歯車アイコン（設定）をクリック
2. **OpenAI API キー** を入力（[platform.openai.com/api-keys](https://platform.openai.com/api-keys) で取得）
3. （任意）**GitHub トークン** を入力して API 上限を増加（[github.com/settings/tokens](https://github.com/settings/tokens) で取得）
4. 「保存」をクリック

**ステップ 5：検索！**

検索バーに何でも入力して Enter を押してください。例：
- 「React テーブルライブラリ ソート機能付き」
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
| デスクトップフレームワーク | Tauri 2.0 (Rust バックエンド) |
| フロントエンド | React 19 + TypeScript |
| スタイリング | Tailwind CSS 4 |
| 状態管理 | Zustand |
| ローカルデータベース | SQLite (rusqlite) |
| AI | OpenAI API + Ollama (ローカル) |
| シンタックスハイライト | Prism.js |
| ビルドツール | Vite 8 |
| アイコン | Lucide React |

---

## プロジェクト構成

```
github-ai-explorer/
├── src/                    # フロントエンド (React)
│   ├── components/         # UI コンポーネント
│   ├── pages/              # ページ (ホーム、検索)
│   ├── stores/             # 状態管理 (Zustand)
│   ├── lib/                # API クライアント (GitHub, AI, Tauri ブリッジ)
│   └── types/              # TypeScript 型定義
├── src-tauri/              # バックエンド (Rust)
│   ├── src/                # Rust ソース (コマンド、データベース)
│   └── tauri.conf.json     # Tauri 設定
├── PRD/                    # 設計ドキュメント (6 ファイル)
└── .env                    # API キー (GitHub にはアップロードされません)
```

---

## 開発フェーズ

| フェーズ | 機能 | 状態 |
|---------|------|------|
| Phase 1 (MVP) | AI 検索、AI 要約、タブ、履歴、ショートカット、ダークモード、設定、SQLite、GitHub 認証 | 主要機能は動作* |
| Phase 2 | コード Q&A、ブックマーク、コレクション、ヘルススコア、比較、スマートフォルダ、コードビューアー、フィルター | 大部分は動作、一部未完成* |
| Phase 3 | ローカル AI (Ollama)、オフラインモード、トレンドダッシュボード、エクスポート、自動アップデート、キャッシュ | 主要機能は動作、一部未実装* |

\* GitHub 認証は OAuth App ではなく Personal Access Token 方式です。コード Q&A はベクトル検索(RAG)ではなく README・ファイル一覧ベースで動作します。スマートレコメンド機能と自動アップデートは未実装です。（2026-07-20 コード監査時点）

---

## セキュリティ

- API キーは **お使いのパソコンの OS キーチェーン**（Windows Credential Manager など）にのみ保存されます（DB やブラウザストレージには保存しません）
- `.env` ファイルは `.gitignore` に含まれており — **GitHub にはアップロードされません**
- GitHub API と OpenAI API 以外のサーバーにはデータを送信しません
- すべてのコードはオープンソース — ご自身で確認できます

---

## ライセンス

Copyright (c) 2026 SoDam AI Studio. All rights reserved.

詳細は [LICENSE](./LICENSE) をご参照ください。

---

## サポート

ご質問やバグを発見された場合は、[GitHub Issues](https://github.com/sodam-ai/github-ai-explorer/issues) に登録してください。
