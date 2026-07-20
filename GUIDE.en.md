# Beginner's Guide — GitHub AI Explorer

> Written so that even someone who has never used a computer, AI, or a smartphone before can follow along step by step. Whenever a technical term appears, it is explained in plain words right next to it.

[한국어 가이드](./GUIDE.md) · [Back to the main README](./README.en.md)

---

## Table of Contents

1. [What Does This Program Do](#1-what-does-this-program-do)
2. [What You Need Before Starting](#2-what-you-need-before-starting)
3. [How to Download (Step by Step)](#3-how-to-download-step-by-step)
4. [How to Install (Step by Step)](#4-how-to-install-step-by-step)
5. [The First Time You Open It](#5-the-first-time-you-open-it)
6. [Basic Usage — Finding Repositories](#6-basic-usage--finding-repositories)
7. [Saving Things You Like (Bookmarks)](#7-saving-things-you-like-bookmarks)
8. [What Is the AI Feature, and How Do I Turn It On](#8-what-is-the-ai-feature-and-how-do-i-turn-it-on)
9. [Confusing Terms Explained](#9-confusing-terms-explained)
10. [When Something Goes Wrong](#10-when-something-goes-wrong)
11. [FAQ](#11-faq)
12. [Am I Allowed to Use This (License)](#12-am-i-allowed-to-use-this-license)

---

## 1. What Does This Program Do

**GitHub** is a huge website where developers all over the world store the source code (think of it like a blueprint) for the programs they build. But there's so much on it — hundreds of millions of items — that it's hard to find what you want.

**GitHub AI Explorer** helps you find things in that huge collection **by typing what you want in plain, everyday language**. For example, typing "React drag-and-drop library" will find things related to that. Think of it like using a search engine (e.g. Google), but focused on GitHub.

- **This is a program you install on your computer, not a website** (like KakaoTalk or Chrome — you install it and then use it)
- You can use most of it without AI at first, and turn on AI features later if you want
- This program does not send your personal information anywhere (see Section 13 for details)

---

## 2. What You Need Before Starting

| What you need | Is it required? | Explanation |
|---|---|---|
| A Windows, Mac, or Linux computer | Yes, required | This does not work on a phone or tablet |
| An internet connection | Yes, required | You need Wi-Fi or a cable connected to the internet |
| A GitHub account | No, not required | You can make one later if you want |

**"I don't know if my computer is Windows or Mac"** — you can tell by the logo. Windows has a blue window-shaped logo (four squares) usually in the bottom-left of the screen; Mac has an apple-shaped logo usually at the top of the screen.

---

## 3. How to Download (Step by Step)

"Downloading" means bringing a file from the internet onto your own computer.

1. Open your internet browser (Chrome, Edge, Safari — whatever program you use to browse the internet)
2. Click the address bar at the top and type in this address, then press Enter:
   ```
   https://github.com/sodam-ai/GitHub-Explorer
   ```
3. Find and click the button that says **"Releases"** — usually on the right side of the page
4. Click the item at the very top of the list (the newest version)
5. Click the file that matches your computer type to download it
   - If you use Windows → a file ending in `.msi` or `.exe`
   - If you use Mac → a file ending in `.dmg`
6. Once the download finishes, you can usually find it at the bottom of your browser window, or in your computer's "Downloads" folder

> ⚠️ **Please note**: Whether a downloadable file actually exists on this repository at the time you read this must be checked directly in step 3 above. If nothing appears under "Releases," a finished distributable file may not exist yet — in that case, contact the developer.

---

## 4. How to Install (Step by Step)

"Installing" means turning the file you downloaded into something you can actually use on your computer.

1. Find the file you downloaded and **double-click** it (click your mouse twice quickly)
2. An installation wizard window appears. Most of the time, clicking **"Next"**, **"I Agree"**, and **"Install"** in that order is all you need
3. **If a blue Windows warning screen appears**: you may see "Windows protected your PC." This does not mean something dangerous — it's a standard warning for programs that aren't yet widely recognized. Click **"More info"** and then **"Run anyway"** to continue
4. When installation finishes, click "Finish"
5. You can now find **"GitHub AI Explorer"** in your list of installed programs
   - Windows: click the Start button (bottom-left) and search for the program name
   - Mac: look in Launchpad (the rocket-shaped icon)

---

## 5. The First Time You Open It

The first time you launch the program, a short walkthrough screen appears.

- Clicking **"Next"** shows you example searches one at a time
- Clicking **"Skip"** takes you straight to the main screen

Either choice is fine. This walkthrough is remembered — it won't automatically appear again after the first time.

---

## 6. Basic Usage — Finding Repositories

Click the **search box** in the middle of the screen and type what you're looking for as a sentence.

**Example searches**:
- `React drag-and-drop library`
- `Python web crawler tool`
- `to-do list app`

After typing, press the **Enter key** on your keyboard, or click the **"Search"** button next to it.

Once results appear:
- There are three tabs at the top: **"Repositories" / "Code" / "Issues."** "Repositories" refers to the individual projects we're looking for.
- Clicking an item shows more detail — a description, the number of "stars" (⭐, a measure of how popular something is), and recent updates.

**What if I don't have internet?** No problem — you can still search within results you looked at before. New searches, however, require an internet connection.

---

## 7. Saving Things You Like (Bookmarks)

If you want to save a repository to look at again later:

1. Click the **bookmark icon** on the repository card (the item shown in the results list)
2. If this is your first time, choose "Create new collection" and give it a name (e.g., "Look at later")
3. You can optionally add a memo (any web address typed into the memo automatically becomes a clickable link)
4. View everything you've saved under the **"Collections"** menu at the top of the screen

---

## 8. What Is the AI Feature, and How Do I Turn It On

The program's basic search works completely without AI. But things like "summarize these search results for me" or "explain what this code does" need help from AI (artificial intelligence).

### To use AI, you need a "key" (API key)

The AI services referred to here are provided by companies like OpenAI (makers of ChatGPT), Anthropic (makers of Claude), and Google (Gemini). To use these services, you need something called an "API key" — **a long string of characters that works like a secret password.** You get this by signing up on each company's own website; this program does not create one for you.

**A way to skip needing an API key**: if you install a separate program called "Ollama" or "LM Studio" on your own computer, AI runs entirely on your computer (no internet or key needed). However, you need to install these programs yourself, and your computer needs to meet certain hardware requirements.

### How to set it up

1. Click the **gear-shaped icon** (Settings) in the top-right corner of the program
2. Under the section labeled **"AI Provider,"** paste your API key into the box next to the service you want to use
3. Click the **"Save"** button
4. In the **dropdown (selection box)** below that, choose which service to actually use — **skipping this step means the key won't actually be used, even if you entered it**

---

## 9. Confusing Terms Explained

| Term | Plain explanation |
|---|---|
| Repository (often shortened to "repo") | A single folder containing a program's source code |
| API key | A "secret pass" string needed to use a certain service |
| Download | Bringing a file from the internet onto your computer |
| Install | Turning a downloaded program into something you can actually run on your computer |
| Cache | Content that was previously viewed and briefly saved on your computer (lets you view it again without internet) |
| Offline | The state of not being connected to the internet |
| UI | The buttons, text, and other elements you see and click on screen |
| Local | Means "inside my own computer." "Local AI" refers to AI running on your own computer rather than on an internet server |
| Commit / version | Developer terms you don't need to know to use this program |

---

## 10. When Something Goes Wrong

**"It won't launch"**
→ Check that installation completed correctly. Try Section 4 again.

**"I searched but got no results"**
→ Check your internet connection. Make sure Wi-Fi is on and other websites load fine.

**"I don't see an AI summary"**
→ Refer to Section 8 — make sure you entered an API key AND selected which service to use in the dropdown.

**"Strange English error messages keep appearing"**
→ Take a screenshot and keep a record — it helps with diagnosing the cause. Most of these are related to internet connectivity or the AI service itself.

**Still not resolved?**
→ You can report the issue via the "Issues" menu on this program's GitHub page (`https://github.com/sodam-ai/GitHub-Explorer`).

---

## 11. FAQ

**Q. Do I have to pay?**
A. The program itself is free. However, if you use a paid AI service like OpenAI, that company may charge you separately. Local AI (Ollama, etc.) is free.

**Q. Does my information leak out anywhere?**
A. There's no path for your information to reach the person who made this program. Searches go only to GitHub, and AI questions go only to the AI company you personally chose.

**Q. Does it work on a smartphone?**
A. No. It's for computers only (Windows/Mac/Linux).

**Q. What happens if I accidentally delete something?**
A. Everything you've saved lives on your own computer, so it may still be there even if you reinstall the program. To be safe, it's recommended to make a backup file ahead of time via "Settings → Data → Export Collections."

---

## 12. Am I Allowed to Use This (License)

> This section is not legal advice. Consult an attorney for an accurate determination.

**Taking this program's source code (its blueprint) to use elsewhere, or using it to make money (commercial use), is not clearly permitted as of when this document was written.** This is because the repository does not yet have a usage-permission document (a license).

**Simply downloading and using the program for personal use** is fine regardless of this issue. What becomes an issue is something like "taking the source code and using it to build a different program." If you want to do something like that, ask the person who created the repository first.

---

<sub>This document was written as of 2026-07-20.</sub>
