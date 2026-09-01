# Workers Compensation Board of Manitoba (WCB) - Dynamic PDF Claims & Reporting Suite

A high-fidelity, dynamic web application engineered with pure **HTML5, CSS3, and modern Vanilla JavaScript (ES6+)** that reproduces the official forms of the **Workers Compensation Board of Manitoba (WCB)**:
1. **Exercise 1: Medical & Travel Expense Request**
2. **Exercise 2: Worker Progress Report (WP)** 

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Key Features Catalog](#-key-features-catalog)
4. [How to Run the Project](#-how-to-run-the-project)
5. [Printing & Exporting to PDF](#-printing--exporting-to-pdf)
6. [🤖 AI Usage & Smart Automation Suite](#-ai-usage--smart-automation-suite)
7. [🎥 Video Hub & Webcam Video Check-in Recorder](#-video-hub--webcam-video-check-in-recorder)
8. [Dynamic Data & Multi-Dataset Demonstrations](#-dynamic-data--multi-dataset-demonstrations)
9. [Architecture & Project Structure](#-architecture--project-structure)


---

## 🚀 Project Overview

This project satisfies all requirements for dynamic document generation, transforming static government PDF forms into interactive, print-ready, responsive web applications.

### Core Highlights:
- **Pixel-Perfect Document Fidelity**: Exact typography (`Times New Roman` serif body, `Arial` headers), bordered Claim Number headers, contact blocks, table grids, checkmark boxes, and vector WCB logo.
- **Smart Dynamic Pagination Engine**: Proportional layout budgeting algorithm that automatically distributes items across pages (`Page 1 of 2`, `Page 1 of 3`, etc.) with running headers and dynamic footers.
- **Two-Way Live Synchronization**: Edit any claimant data, line items, or treatment notes via the GUI Drawer or raw JSON editor and watch the PDF document update in real time.
- **Native Print & PDF Export**: Strict `@page { size: letter portrait; margin: 0; }` CSS rules producing clean PDF documents directly via the browser's native print engine (`Ctrl+P` or **Print / Export PDF**).

---

## 🛠 Tech Stack

- **HTML5**: Semantic document structure, accessible input forms, and dynamic page containers.
- **CSS3**: Strict print styles (`@page`, `@media print`), flexbox & grid UI layout, responsive styling, and A4/Letter viewport emulation.
- **JavaScript (ES6+)**: Modular client-side rendering engines, data state management, dynamic DOM pagination, two-way input binding, and JSON serialization.
- **Zero External Dependencies**: Pure vanilla implementation — runs standalone in any browser with zero installation or build steps.

---

## 🌟 Key Features Catalog

### 1. Exercise 1: Medical & Travel Expense Request
- **Prescription Drugs Table**: Drug name, prescription date, purchase date, doctor name, and paid amount.
- **Over-the-Counter Drugs Table**: Medication name, purchase date, amount paid, pharmacy seller name, and injury reason.
- **Bandages, Braces & Medical Supplies**: Prescribed flag (Yes/No), item name, provider, amount, and seller.
- **Parking for Medical Appointments**: Facility address, date, paid amount, meter used flag, and meter ticket number.
- **Mileage to Medical Appointments**: Appointment date, healthcare facility address, regular workplace address, and round-trip kilometers (incorporating WCB excess commute rules).
- **Bus or Taxi Fare**: Starting point address, destination clinic, transit mode (Bus/Taxi), pre-approval indicators, and fare amounts.
- **Total Calculation & Statistics**: Real-time sum calculation across all expense categories.

### 2. Exercise 2: Worker Progress Report (WP)
- **Header & Claim Box**: Dual-column box showing Claim Number and form code (`WP`).
- **Return-to-Work Tracker**:
  - Return status (`Not missed time`, `Not returned`, `Returned on date`).
  - Duty classification (`Full duties / regular hours`, `Full duties / reduced hours`, `Modified duties / regular hours`, `Modified duties / reduced hours`, `Other`).
  - Narrative textareas: Return-to-work progress remarks, expected return dates, employer contacts, and concerns.
- **Recovery & 1-10 Visual Pain Scale**:
  - Recovery declaration (`Fully recovered` / `Not fully recovered`).
  - Interactive 1–10 pain rating selector with semantic severity indicators.
- **Medical & Treatment Log**:
  - Ongoing treatment status and medical provider type.
  - Last & next appointment dates and healthcare provider names.
  - Chiropractor & Physiotherapy frequency tracking.
  - Prescription medication regimen log.
  - Home rehabilitation exercises list.
- **Legal Declarations & Verification**: Statutory certification checkboxes, Worker App ID generation, and submission timestamps.

---

## 💻 How to Run the Project

The application requires **zero npm installs or build steps**. Choose any of the convenient methods below:

### Method 1: Direct File Open (Fastest)
1. Double-click on `index.html` or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox**.

### Method 2: One-Click Launch Scripts
- **Windows**: Double-click `start-app.bat`
- **macOS / Linux**: Run `bash start-app.sh`

diona-internship.vercel.app
### Method 4: Node.js / NPX Serve
```bash
# In the project directory:
npx -y serve -l 3000 .
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 5: VS Code Live Server
Right-click `index.html` inside VS Code and select **Open with Live Server**.

---

## 🖨️ Printing & Exporting to PDF

Click the **Print / Export PDF** button in the top navigation bar or press `Ctrl + P` (`Cmd + P` on Mac).

### Recommended Print Settings:
| Setting | Recommended Value |
| :--- | :--- |
| **Destination** | *Save as PDF* / Your physical printer |
| **Paper Size** | *Letter* (8.5" x 11") |
| **Margins** | *Default* or *None* |
| **Scale** | *100%* / *Default* |
| **Options** | ✅ **Background graphics** (Checked) |
| **Headers/Footers** | ❌ **Headers and footers** (Unchecked - application renders exact official footers) |

---

## 🤖 AI Usage & Smart Automation Suite

Click the **AI Assistant** button in the top toolbar to access the integrated AI Suite:

1. **📄 Smart Receipt & Invoice OCR Extractor**:
   - Paste raw pharmacy receipts, medical supply bills, parking tickets, or taxi dispatch text.
   - Click **Parse & Extract Data** to automatically extract dates, amounts, vendors, and line items.
   - Click **Auto-Add Line Item to Active Claim** to append the parsed item directly into the active WCB expense form.
2. **📋 Clinical & Recovery Summarizer**:
   - Synthesizes the claimant's return-to-work duties, pain rating (1-10), treatment frequency, and rehabilitation exercises into an executive case summary formatted for WCB Adjudicators.
   - Offers one-click **Insert into Progress Notes** or **Copy to Clipboard**.
3. **🛡️ WCB Policy & Anomaly Auditor**:
   - Scans active claims for compliance against official WCB Manitoba guidelines (flags unapproved taxi fares, missing prescribing doctor names, high mileage trips > 50km, and missing declarations).
4. **💬 Interactive WCB Claims Chatbot**:
   - Real-time conversational assistant providing instant answers regarding eligible expenses, taxi pre-approval rules, modified duty classifications, and submission deadlines.

---

## 🎥 Video Hub & Webcam Video Check-in Recorder

Click the **Video Hub** button in the top toolbar to access the multimedia module:

1. **▶️ Interactive Video Demonstration Player**:
   - Canvas-based interactive demo and chapter-by-chapter walkthrough (Overview, Expense Request, Progress Report, Multi-Page Stress Test, and PDF Export).
2. **📹 In-Browser Webcam Video Check-in Recorder**:
   - Utilizes the browser's `MediaRecorder` API allowing claimants to record a 30–120 second video demonstrating mobility or rehab exercises.
   - Features live camera feed preview, recording timer, instant video playback review, and direct `.webm`/`.mp4` download.
3. **📜 2-Minute Video Presentation Script (`VIDEO_SCRIPT.md`)**:
   - Complete, second-by-second narration script with Picture-in-Picture (PiP) layout instructions for recording project submission videos.

---

## 📊 Dynamic Data & Multi-Dataset Demonstrations

The top **Dataset Preset** dropdown provides instant switching between test cases:

| Preset | Purpose | Behavior |
| :--- | :--- | :--- |
| **Preset 1: Exact PDF Replica** | Ground Truth match | Renders the exact reference PDF values byte-for-byte. |
| **Preset 2: Multi-Page Stress Test** | Scalability demonstration | Injects 10+ items per section; the smart pagination engine automatically splits items across 3+ pages with dynamic `Page X of Y` footers. |
| **Preset 3: Minimal Single-Item Case** | Edge case testing | Tests single-item compact rendering without empty row artifacts. |

---

## 🏗 Architecture & Project Structure

```
wcb-expense-pdf-app/
├── index.html              # Main application shell & UI controls
├── start-app.bat           # One-click Windows launch script
├── start-app.sh            # One-click Mac/Linux launch script
├── .gitignore              # Git ignore configuration
├── css/
│   ├── styles.css          # Application layout, toolbar, drawer, and buttons
│   ├── document.css        # Pixel-perfect WCB document layout & typography
│   ├── modals.css          # AI Assistant, Video Hub, and Stats bar styling
│   └── print.css           # Strict @media print CSS for Letter PDF output
├── js/
│   ├── data.js             # Data schemas and multi-dataset presets
│   ├── renderer-expense.js # Exercise 1 (Medical & Travel Expenses) renderer
│   ├── renderer-progress.js# Exercise 2 (Worker Progress Report) renderer
│   ├── ai-assistant.js     # AI OCR parser, summarizer, auditor, and chatbot
│   ├── video-hub.js        # Video demo player and webcam video recorder
│   └── app.js              # Application state controller and two-way sync
├── README.md               # Comprehensive documentation
├── VIDEO_SCRIPT.md         # 2-Minute narrated presentation script
└── PROMPT_HISTORY.md       # AI prompt and development history log
```

---





---

## 📄 License & Attribution

Designed and developed for the **Workers Compensation Board of Manitoba (WCB)** document generation specification. Built with pure HTML5, CSS3, and JavaScript.
