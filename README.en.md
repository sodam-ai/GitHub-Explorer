# GitHub AI Explorer

> A personal desktop app for searching GitHub repositories in plain language, asking AI about code, and collecting repositories you like.

[한국어](./README.md)

---

## Table of Contents

1. [What Is This Program](#1-what-is-this-program)
2. [Prerequisites / Required Programs](#2-prerequisites--required-programs)
3. [How to Download](#3-how-to-download)
4. [How to Install](#4-how-to-install)
5. [Quick Start](#5-quick-start-3-minutes)
6. [How to Run](#6-how-to-run)
7. [How to Use](#7-how-to-use)
8. [Command Reference](#8-command-reference)
9. [Update Summary](#9-update-summary)
10. [File / Document Locations](#10-file--document-locations)
11. [Workflow](#11-workflow-how-things-happen-inside-the-app)
12. [Architecture](#12-architecture)
13. [Security and Data Flow](#13-security-and-data-flow)
14. [Troubleshooting](#14-troubleshooting)
15. [FAQ](#15-faq)
16. [License / Copyright / Commercial Use](#16-license--copyright--commercial-use)

---

## 1. What Is This Program

**GitHub AI Explorer** is a **personal desktop program** that lets you search open-source projects on GitHub using everyday language, like "React drag-and-drop library." It is not a website — it's a standalone desktop application (Windows/Mac/Linux) you install on your computer.

- **All core features work without AI**: searching repositories, code, issues, bookmarking, and viewing trending repos all work without any AI setup.
- **AI is optional**: only search-result summaries and code Q&A ("what does this code do?") use AI. You can choose any AI service you like (OpenAI, Anthropic, Google Gemini, Groq) or a local AI running on your own computer (Ollama, LM Studio).
- **Your data stays on your computer**: search history, saved collections, and API keys are all stored locally. There is no account signup and nothing is sent to any server operated by this project.

---

## 2. Prerequisites / Required Programs

### Just using the app (general users)

| Item | Required? | Notes |
|---|---|---|
| Windows 10/11, macOS, or Linux | Required | One of these three |
| Internet connection | Required | Needed for GitHub search and AI calls (fully offline use only works against cached data) |
| GitHub account | Optional | Not required; a token from your account only increases the search rate limit |
| AI service account / API key | Optional | Only needed if you use AI summary / code Q&A |

### Building from source (developers)

| Item | Version verified in this project's dev environment | How to check |
|---|---|---|
| [Node.js](https://nodejs.org) | Verified with v22.19.0 (an LTS release is recommended) | `node --version` |
| [Rust](https://www.rust-lang.org/tools/install) | Verified with 1.94.1 (requires `rust-version = "1.77.2"` or later, as declared in `src-tauri/Cargo.toml`) | `rustc --version` |
| [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) | Visual Studio C++ Build Tools on Windows, Xcode Command Line Tools on macOS, webkit2gtk etc. on Linux | Follow the official docs (platform-specific — this project does not declare these itself, so the official Tauri documentation is the accurate source) |
| npm (bundled with Node.js) | Included automatically with Node.js | `npm --version` |

> **Only verified facts stated**: This project's `package.json` has no `engines` field enforcing a Node version. The versions above are "verified in the actual dev environment," not "required."

---

## 3. How to Download

### Option A. Download a pre-built installer

1. Go to: **https://github.com/sodam-ai/GitHub-Explorer**
2. Click **Releases** on the right side of the page
3. Download the file matching your OS from the latest release
   - Windows: a file ending in `.msi` or `.exe`
   - macOS: a file ending in `.dmg`
   - Linux: a file ending in `.AppImage` or `.deb`

> ⚠️ **Needs verification**: Whether release files actually exist for this repository at the time you read this must be checked directly on the Releases page. If none are published, use Option B below to build from source.

### Option B. Get the source code and build it yourself (developers, continued in section 4)

```bash
git clone https://github.com/sodam-ai/GitHub-Explorer.git
cd GitHub-Explorer
```

---

## 4. How to Install

### If you used Option A (installer)

1. Double-click the downloaded installer file
2. Follow the on-screen wizard, clicking "Next" as prompted
3. If Windows shows "Windows protected your PC," this is a standard warning for unsigned independently-distributed apps, not a sign of danger. Click **"More info" → "Run anyway"** to continue
4. Once installation finishes, launch "GitHub AI Explorer" from your Start Menu / Applications folder

### If you used Option B (build from source)

```bash
# 1) Move into the project folder (skip if you already cd'd in section 3)
cd GitHub-Explorer

# 2) Install frontend dependencies
npm install

# 3) Build the desktop app (the finished installer appears under src-tauri/target/release/bundle/)
npm run tauri:build
```

The build may take several minutes depending on your machine (it compiles the Rust code from scratch).

---

## 5. Quick Start (3 minutes)

1. Launch the app
2. On first launch, click "Next" to see a short walkthrough, or "Skip" to go straight in
3. Type what you're looking for in plain language into the search box (e.g. "React drag-and-drop library")
4. Press Enter or click the Search button
5. Click a repository in the results to see details; use the bookmark icon in the top corner to save it

**To also enable AI features**: click the gear icon (Settings) → enter an API key under "AI Provider" → Save → choose which provider to actually use from the dropdown below it.

---

## 6. How to Run

| Situation | How |
|---|---|
| Installed via installer | Launch "GitHub AI Explorer" from Start Menu (Windows) / Launchpad (macOS) / app list (Linux) |
| Just want to preview the UI while developing | See "Web dev mode" below |
| Run as an actual desktop app from source | `npm run tauri:dev` (opens a real desktop window including Rust; first run takes a few minutes to compile) |

### Web dev mode (developers, quick UI preview in a browser)

```bash
npm run dev
```

Open `http://127.0.0.1:7719` in a browser. **Note**: this mode is only for quickly previewing the UI. Desktop-only features such as API key storage (OS keychain) and collection storage (SQLite) do not work in browser mode (they fail safely without errors, but nothing is actually persisted).

---

## 7. How to Use

### 7-1. Searching repositories

- Search in natural language or keywords → view results across the Repositories / Code / Issues tabs
- Use "Filters" to narrow by language, license, minimum stars, recent updates, etc.
- If you're offline, the app automatically switches to offline mode and searches only within previously cached results

### 7-2. Viewing repository details

Clicking a repository opens a preview panel with an automatically generated summary based on the README (no AI required), plus star/fork/issue counts and recent releases.

### 7-3. Bookmarking (Collections)

- Click the bookmark icon on a repository card → create a new collection or add to an existing one, with an optional memo
- View everything you've saved under the "Collections" menu at the top
- Any URL typed into a memo automatically becomes a clickable link

### 7-4. Using AI summary / code Q&A

1. Settings (⚙️) → enter your API key under "AI Provider" and save
2. In the same section, choose which provider to actually use from the "Provider used for search summary / code Q&A" dropdown (**entering a key alone is not enough — you must also select it here**)
3. To use local AI (Ollama, LM Studio), no key is needed — just select it from the dropdown (the corresponding program must be running on your computer)
4. Ask freely in "Ask about the code" on a repository's detail screen

Supported AI providers: **OpenAI, Anthropic (Claude), Google Gemini, Groq** (require an API key) / **Ollama, LM Studio** (run locally, no key needed)

### 7-5. Trending repositories

Check today's / this week's / this month's trending repositories under the "Trending" menu. Star growth is calculated from daily snapshots recorded automatically while you use the app, so **on the very first day of use there is no prior data to compare against, and it will show "Aggregating."** This is expected behavior, not an error — actual growth numbers appear once data accumulates for a day or more.

### 7-6. Exporting / Importing collections

- Settings → Data → "Export Collections": saves all your collections as a JSON file (for backup or moving to another computer)
- Settings → Data → "Import": select a previously exported JSON file to restore your collections. **Imports always create new collections and never overwrite existing ones.** Importing the same file twice creates duplicate collections.

### 7-7. Theme / Accessibility

- Change dark/light mode and accent color (6 options) in Settings
- If your OS has "Reduce Motion" enabled, animations throughout the app are automatically reduced

---

## 8. Command Reference

### 8-1. In-app keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Open the command palette (quick navigation, search, theme toggle, etc.) |

### 8-2. Developer commands (from `package.json`, listing only scripts that actually exist)

| Command | Action |
|---|---|
| `npm run dev` | Run the browser-based dev server (`http://127.0.0.1:7719`) |
| `npm run build` | Type-check (`tsc -b`) and build the frontend for production (`vite build`) |
| `npm run lint` | Run ESLint (`eslint .`) |
| `npm run preview` | Preview the production build |
| `npm run tauri` | Run the Tauri CLI directly |
| `npm run tauri:dev` | Run the desktop app in dev mode (includes Rust) |
| `npm run tauri:build` | Build the desktop app installer |

### 8-3. Rust backend commands (run inside `src-tauri`)

| Command | Action |
|---|---|
| `cargo check` | Quickly verify the code compiles |
| `cargo clippy` | Rust static analysis (code quality checks) |
| `cargo build --release` | Optimized release build |

> This project has **no automated unit tests configured** (no `test` script in `package.json`, no test framework installed, no `*.test.ts`/`*.spec.ts` files — verified, not assumed). `npm test` is not a valid command here.

---

## 9. Update Summary

<details>
<summary><b>Security hardening — API keys moved to the OS keychain</b></summary>

- API keys/tokens that could previously be stored in plaintext within app settings are now moved to a **secure OS-provided store** (e.g., Windows Credential Manager).
- Users who had already entered keys are migrated automatically on next launch.
- Added a minimum interval between search API calls to prevent excessive rapid requests.
</details>

<details>
<summary><b>Multi-provider AI support</b></summary>

- Search summary and code Q&A, previously tied to OpenAI only, now support **Anthropic (Claude), Google Gemini, Groq, local Ollama, and local LM Studio** — six providers total.
- If no provider is selected in Settings, the app defaults to OpenAI as before, so existing users see no behavior change.
- Added a model-name override field in case a default model name becomes outdated.
</details>

<details>
<summary><b>Trending data integrity improvement</b></summary>

- Removed the random-number placeholder that used to represent "stars gained today," replacing it with **daily usage snapshots that are actually compared**.
- When there's no prior snapshot to compare against, the app honestly shows "Aggregating" instead of a fabricated number.
</details>

<details>
<summary><b>Repository core summary (no AI required)</b></summary>

- Added a feature that parses a repository's README — stripping headers, badges, images, and tables — to extract just the core description paragraph. Works via rules, no AI call involved.
</details>

<details>
<summary><b>Automatic URL hyperlinking</b></summary>

- URLs typed into collection memos or code Q&A conversations are automatically turned into clickable links.
</details>

<details>
<summary><b>Collection import wired up</b></summary>

- The export feature existed, but the import button previously did nothing. It is now fully functional, with clear error messages if a corrupted or incompatible file is selected.
</details>

<details>
<summary><b>Accessibility improvements</b></summary>

- The OS's "Reduce Motion" setting is now automatically applied to all app animations
- Added screen-reader labels (aria-label) to icon-only buttons that previously had none
- Screen readers are now informed while the AI is generating a response
- Fixed input fields in Settings that visually showed a label but were not actually linked to it, so screen readers couldn't read them
</details>

<details>
<summary><b>Reliability improvements — preventing infinite waits and adding error messages</b></summary>

- Fixed an issue where the screen could hang indefinitely if a local AI server (e.g. Ollama) stopped responding (added a 60-second timeout)
- Export/Import failures that previously failed silently now show a clear error message to the user
</details>

---

## 10. File / Document Locations

| Type | Location |
|---|---|
| This document (Korean README) | `README.md` (project root) |
| English README | `README.en.md` |
| HTML versions of the above | `README.html`, `README.en.html` |
| Next-step plan / checkpoint | `CHECKPOINT.md` |
| Planning documents (PRD) | `.PRD/` folder (`01_PRD.md`, `02_DATA_MODEL.md`, `03_PHASES.md`, `04_PROJECT_SPEC.md`, `05_WIREFRAMES.md`) — ⚠️ these are early planning documents and may differ from the actual implementation in places. This README and the source code are the source of truth for actual behavior. |
| Frontend source code | `src/` |
| Rust backend source code | `src-tauri/src/` |
| App icons | `src-tauri/icons/` |
| Tauri configuration | `src-tauri/tauri.conf.json` |
| Frontend dependency manifest | `package.json` |
| Rust dependency manifest | `src-tauri/Cargo.toml` |

---

## 11. Workflow (how things happen inside the app)

### 11-1. Search flow

```
User types a search query
   │
   ▼
Check internet connection
   ├─ Online → search repos/code/issues via GitHub API simultaneously → cache results
   │              │
   │              ▼
   │        If an AI provider is configured → generate a summary of results (otherwise show a hint message)
   │
   └─ Offline → search only within previously cached results (offline mode notice shown)
```

### 11-2. AI call flow

```
User requests an AI summary or asks a code question
   │
   ▼
Check the provider selected in Settings
   │
   ├─ OpenAI/Anthropic/Gemini/Groq → load the saved API key from the OS keychain and call that service
   ├─ Ollama/LM Studio → call the local server on your computer (e.g. localhost:11434)
   │
   ▼
Auto-cancel with an error if no response within 60 seconds
Show the result on success
```

### 11-3. Data storage flow

```
User action (search history / bookmark / settings change, etc.)
   │
   ▼
Only inside the desktop app (Tauri) → call a Rust backend command → save to a local SQLite file on your computer
※ This storage step does not run in browser dev mode (it fails safely and is skipped)
```

---

## 12. Architecture

### 12-1. Tech stack

| Layer | Technology |
|---|---|
| Desktop app framework | Tauri 2.10.3 |
| Frontend | React 19.2.4 + TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.2.2 |
| State management | Zustand 5.0.12 |
| Animation | Framer Motion 12.38.0 |
| Build tool | Vite 8 |
| Backend (local) | Rust + rusqlite 0.32 (SQLite bundled into the app, no separate install needed) |
| Secure key storage | Rust `keyring` crate (Windows Credential Manager / macOS Keychain / Linux Secret Service) |

### 12-2. Structure overview

```
GitHub-Explorer/
├── src/                      # Frontend (React)
│   ├── components/           # Screen-level components
│   ├── lib/                  # API calls, AI adapters, utilities
│   ├── stores/                # Zustand global state
│   └── App.tsx / main.tsx    # Entry point
├── src-tauri/                # Backend (Rust)
│   ├── src/
│   │   ├── commands.rs       # 20 commands callable from the frontend
│   │   ├── db/mod.rs         # SQLite schema and initialization
│   │   └── lib.rs            # App entry point, tray icon, command registration
│   └── tauri.conf.json       # App configuration (name/version/window size, etc.)
└── .PRD/                     # Planning documents
```

### 12-3. Notable design facts (honest gaps between planning docs and actual implementation)

- **The frontend calls the GitHub API and AI APIs directly.** The original planning document (`.PRD/04_PROJECT_SPEC.md`) specified a principle of "no direct external API calls from the frontend — always go through a Rust command," but the actual implementation does not follow this; the frontend calls `fetch` directly. API keys themselves are still safely stored in the OS keychain via Rust commands, so keys are not exposed in code, but this design deviation is stated plainly here.
- **GitHub authentication uses a Personal Access Token (PAT)**, not the OAuth App flow originally planned — the user pastes in a token generated directly on GitHub's website.
- **Auto-update is configured but incomplete.** `tauri.conf.json` has an update server endpoint, but the public key (`pubkey`) required to verify signed updates is empty, so it likely does not actually function.

---

## 13. Security and Data Flow

### 13-1. What is stored, and where

| Data | Storage location | Stored in plaintext? |
|---|---|---|
| GitHub token, OpenAI/Anthropic/Gemini/Groq API keys | OS keychain (e.g. Windows Credential Manager) | No — managed and encrypted by the OS |
| Search history, collections, conversation history, theme settings | A local SQLite file on your computer / browser localStorage (only for non-sensitive settings like theme) | This data is not sensitive, so it is not encrypted, but it never leaves your computer |

### 13-2. Data sent externally

| Destination | What is sent | When |
|---|---|---|
| GitHub API (`api.github.com`) | Search query, (if configured) GitHub token | When searching or viewing repository details |
| Your chosen AI provider (OpenAI/Anthropic/Gemini/Groq servers, or Ollama/LM Studio on your own computer) | Repository info being summarized, code question content, (for cloud providers) API key | Only when using AI summary / code Q&A |

There is no separate server operated for this app. In other words, there is no path by which the developer of this project collects your search terms or conversation content (though your chosen AI provider and GitHub each have their own privacy policies that apply independently).

### 13-3. Known security-related limitations (stated honestly)

- The desktop app's Content Security Policy (CSP) is disabled (`null`), which allows flexible external API calls but forgoes the web-standard CSP defense layer.
- With no automated unit tests, security-related regressions rely on manual verification.

---

## 14. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Windows protected your PC" warning appears | Standard SmartScreen warning for unsigned distributed files | Click "More info" → "Run anyway" |
| AI summary only shows "Enter an API key in Settings to use AI summary" | API key not entered, or provider not selected | Enter and save a key under Settings → AI Provider **and** select the actual provider to use in the dropdown (entering a key alone does not activate it) |
| Selected Ollama/LM Studio but got no response | The local AI program isn't running | Launch the program first and confirm its server is running (default addresses: Ollama `localhost:11434`, LM Studio `localhost:1234`) |
| Trending screen only shows "Aggregating" instead of numbers | No prior data to compare against yet (not an error) | Check again after using the app for a day or more |
| Too few search results / frequent rate-limit messages | GitHub API rate limit (60 requests/hour without a token) | Enter a GitHub Personal Access Token in Settings (raises the limit to 5,000/hour) |
| "Not a valid backup file" when importing | The file wasn't exported from this app, or is corrupted | Confirm it's a `.json` file created via this app's "Export Collections" |
| Rust build errors | Toolchain issue or corrupted build cache | Run `cd src-tauri && cargo clean` and retry |
| `npm run tauri:dev` is very slow to start | First run compiles all Rust code from scratch | Expected — wait a few minutes (subsequent runs are much faster) |

---

## 15. FAQ

**Q. Is this program free?**
A. Using the program itself is free. However, using a cloud AI provider's API key (e.g. OpenAI) is subject to that provider's own pricing. Local AI (Ollama, LM Studio) incurs no cost.

**Q. Can I use it without internet?**
A. You can search within previously cached results offline. New searches and AI features require an internet connection.

**Q. Is my search history or API key sent anywhere?**
A. There is no path to the developers of this program. GitHub searches go only to GitHub's servers, and AI features go only to the AI provider you personally selected (see Section 13).

**Q. Do I need a GitHub account?**
A. No. You can search, bookmark, and view trending repos without one. Adding a token from your account only raises the search rate limit.

**Q. Can I use multiple AI services at once?**
A. You can store multiple keys at once, but only **one** provider — the one selected in Settings — is actually used for search summary / code Q&A at any given time.

**Q. Does this work on mobile (phone/tablet)?**
A. No. This is a desktop program for Windows/macOS/Linux only — there is no mobile version (verified fact).

**Q. Does it auto-update?**
A. Currently, auto-update is only configured and likely does not actually function yet (see Section 12-3). It's recommended to check the GitHub Releases page directly for the latest version.

**Q. Can I use this commercially?**
A. Please read Section 16 (License) carefully first.

---

## 16. License / Copyright / Commercial Use

> ⚠️ **Disclaimer**: This section is not legal advice and carries no legal guarantee. Consult a qualified attorney for any actual business or legal decision. The content below is guidance based on verified facts.

### 16-1. Verified fact

**This repository currently has no LICENSE file.** (Verified by directly checking the project's root folder at the time this document was written — this is not a guess.)

### 16-2. What this means (general copyright law principle)

For software with no explicit license, the fact that a repository is public and its code is viewable is **entirely separate** from whether you may use, copy, modify, distribute, or commercially exploit that code. Under widely recognized copyright law principles, the absence of an explicit license generally means the **original author retains all rights ("All rights reserved")**, and use, copying, modification, distribution, or commercial use by third parties may be restricted without the original author's explicit permission.

### 16-3. What to check before use

- Personally reading the code for reference or learning purposes is different from actually taking the code, redistributing it, or using it commercially.
- If you are considering commercial use, redistribution, or creating derivative works, **contact the repository owner (sodam-ai) directly to obtain explicit permission, or check the contents of a LICENSE file that may be added in the future.**
- This project uses various third-party open-source libraries (React, Tauri, the Rust `keyring` crate, and many more — see `package.json` / `src-tauri/Cargo.toml` for the full list). Each library carries **its own separate license**, and those terms must be checked in each library's own repository.

### 16-4. Trademark and GitHub-related notice

"GitHub" is a trademark of GitHub, Inc. This project is not an official GitHub product; it is an independent third-party tool that uses GitHub's public API.

---

<sub>This document was written by directly examining the actual source code and configuration files as of 2026-07-20. As the project is updated, this document and actual behavior may diverge.</sub>
