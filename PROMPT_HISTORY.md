# AI Prompt & Development History Log

As required by the assignment criteria, this document records the prompt history, AI assistance workflow, and design iterations used to build the Medical & Travel Expense Request PDF Generator application.

---

## 📝 Prompt 1: Initial Requirement Analysis & PDF Decomposition

**User Prompt**:
> "Write code to generate content similar to the two PDFs attached. Both the exercises should be complete in all aspects—image, header, footer, page numbers, dynamic data, etc. Tech stack: HTML, CSS, Javascript."

**AI Response / Actions Taken**:
1. Analyzed the visual and semantic elements of the attached 2-page Workers Compensation Board of Manitoba (WCB) PDF document:
   - Header: WCB vector branding, Manitoba office contact info, title "Medical & Travel Expense Request", bordered Claim Number box.
   - Six structured expense tables: Prescription Drugs, OTC Drugs, Bandages & Medical Supplies, Parking, Mileage (with excess travel disclaimer), Bus/Taxi Fare (with pre-approval note).
   - Footer: Worker App ID, Submission timestamp, dynamic `Page X of Y`.
   - Privacy consent checkbox statement.
2. Formulated a standalone web architecture using pure HTML5, CSS3, and modern JavaScript without heavy dependencies or build steps.

---

## 📝 Prompt 2: Dynamic Data Modeling & Smart Pagination Engine

**Design Goal**:
> "Execute the solution in the browser, demonstrating dynamic behavior based on the data. For example, a table may have 1 element or 10 elements, so provide different data sets and show that the page works as expected. Analyse the PDF and identify the various data elements that can be dynamic."

**AI Response / Actions Taken**:
1. Structured `js/data.js` containing three distinct presets:
   - `exactPdf`: Byte-for-byte replica of the 2-page reference document.
   - `stressTest`: Multi-item dataset with 10+ items per category spanning 3+ pages.
   - `minimal`: Compact single-item dataset.
2. Built `js/renderer.js` with an automated page-budget calculation algorithm:
   - Calculates cumulative component weights.
   - Splits content across `.pdf-page` containers dynamically.
   - Recalculates and stamps dynamic footers (`Page ${i} of ${totalPages}`).

---

## 📝 Prompt 3: UI Controls, Live Editor & Print-to-PDF Stylesheet

**Design Goal**:
> "Ensure pixel-perfect rendering, interactive sidebar drawer for real-time data editing, preset switching, zoom scaling, and direct 1-click PDF printing."

**AI Response / Actions Taken**:
1. Developed `index.html` and `css/styles.css` with a PDF reader stage background, toolbar controls, and tabbed sidebar editor.
2. Implemented `css/print.css` with strict `@page { size: letter portrait; margin: 0; }` rules, hiding application UI and enforcing clean page breaks.
3. Created `js/app.js` with two-way data binding, dynamic card creation, row deletion, and raw JSON editor synchronization.

---

## 📝 Prompt 4: Video Presentation Guide & Documentation

**Design Goal**:
> "Prepare complete 2-minute video presentation script with Picture-in-Picture instructions, challenge resolutions, and project report."

**AI Response / Actions Taken**:
1. Created `README.md` containing architectural walkthrough, dynamic data inventory, and setup instructions.
2. Created `VIDEO_SCRIPT.md` with second-by-second narration timestamps for recording the 2-minute demonstration video.
