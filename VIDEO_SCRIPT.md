# 2-Minute Video Presentation Script & Walkthrough Guide

This guide provides a structured, second-by-second walkthrough script to record the required **2-minute video presentation with Picture-in-Picture (PiP)** demonstrating the Medical & Travel Expense Request application.

---

## 🎥 Recording Checklist & Requirements

- **Tooling**: Use OBS Studio, Loom, Clipchamp, or QuickTime.
- **Picture-in-Picture (PiP)**: Position your webcam face feed in the bottom-right or top-right corner of the screen recording.
- **Duration**: Exactly 2 minutes (120 seconds).
- **Audio**: Clear narration explaining the points outlined below.
- **Submission**: Host the video in your GitHub repository (either directly as `demo.mp4` or linked in the `README.md`).

---

## ⏱ Second-by-Second Video Script

### 0:00 – 0:25 | Introduction & Requirement Analysis
- **On Screen**: Browser showing the default view (`index.html`) with Preset 1 loaded, displaying the 2-page WCB Expense Report.
- **Narration**:
  > *"Hello everyone. Today I'm presenting my solution for Assignment 1: generating a pixel-perfect, dynamic Medical & Travel Expense Request form for the Workers Compensation Board of Manitoba using HTML5, CSS3, and JavaScript.*
  >
  > *My objective was to reproduce all aspects of the official 2-page PDF—including the vector WCB logo, contact header, claim box, 6 expense tables, privacy notice, and dynamic footers. I identified key dynamic fields such as claimant name, claim number, dates, individual line items, and dynamic total page counts."*

---

### 0:25 – 0:40 | Assumptions Made
- **On Screen**: Scrolling smoothly through Page 1 and Page 2 in the browser preview.
- **Narration**:
  > *"Some key assumptions I made include: standard Letter (8.5x11 inch) print geometry, maintaining official WCB statutory disclaimers under Mileage and Taxi sections, and implementing a smart pagination engine so the document dynamically scales from 1 page to multiple pages based on item count."*

---

### 0:40 – 1:15 | Dynamic Execution & Multi-Dataset Demonstration
- **On Screen**: 
  1. Switch dropdown from *Preset 1* to *Preset 2: Multi-Item Stress Test (10+ items / 3+ Pages)*. Show the document automatically re-paginating to 3 pages with footers reading `Page 1 of 3`, `Page 2 of 3`, and `Page 3 of 3`.
  2. Click **Edit Form Data** to open the sidebar drawer.
  3. Modify the claimant name to your own name.
  4. Click **+ Add Prescription Item** and **+ Add Bus/Taxi Record**. Observe live recalculation on screen.
  5. Switch to the **JSON** tab and show live JSON synchronization.
- **Narration**:
  > *"Now let's see the dynamic behavior in action. When I switch to Preset 2 with over 10 items per category, the smart pagination engine dynamically recalculates the content heights and creates 3 pages, updating all footers automatically to 'Page 1 of 3', 'Page 2 of 3', and 'Page 3 of 3'.*
  >
  > *Opening the Live Editor drawer, I can change the claimant name, add new prescription drugs or taxi trips in real-time, and watch the document re-render and re-paginate instantly."*

---

### 1:15 – 1:40 | Code Walkthrough & Architecture
- **On Screen**: Quick switch to VS Code / Editor showing `js/renderer.js`, `js/data.js`, and `css/print.css`.
- **Narration**:
  > *"Looking at the codebase:*
  > - *`data.js` defines our structured models and presets.*
  > - *`renderer.js` houses our smart pagination algorithm which calculates section weights and renders modular page containers.*
  > - *`document.css` and `print.css` use strict `@media print` and `@page` rules to ensure that clicking 'Print / Export PDF' produces an exact physical PDF identical to the original form."*

---

### 1:40 – 2:00 | Challenges Faced, AI Transparency & Conclusion
- **On Screen**: Click **Print / Export PDF** in the browser to show the clean print preview dialog, then return to the main view.
- **Narration**:
  > *"The main challenge was achieving accurate dynamic pagination across table rows without clipping borders. I solved this by designing a weighted layout engine that dynamically distributes sections.*
  >
  > *I utilized AI coding assistance during development, and the full prompt history is documented in `PROMPT_HISTORY.md` in the repository.*
  >
  > *Thank you!"*

---

## 📌 Video Submission Format

In your submission WhatsApp message:
```text
<Your Name> - <GitHub Repository Link>
```
Ensure your README has a link to the video or has `demo.mp4` committed to the repository root.
