/**
 * WCB PDF Generation Suite - Unified Application Controller
 * Handles Exercise Switching, Preset Management, Live Form Synchronization, Document Rendering,
 * AI Assistant Suite, Video Hub & Recorder, and Real-Time Statistics.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentExercise: 'expenseRequest', // 'expenseRequest' | 'workerProgressReport'
    currentPresetKey: 'exactPdf',      // 'exactPdf' | 'stressTest' | 'minimal'
    activeData: null,
    zoomLevel: 1.0,
    activeTabId: 'general',
    drawerOpen: false,
    parsedOcrResult: null
  };

  // Expose state globally for AIAssistant integration
  window.state = state;

  // DOM Elements Cache
  const elements = {
    // Toolbar & Navigation
    tabExercise1: document.getElementById('tabExercise1'),
    tabExercise2: document.getElementById('tabExercise2'),
    badgeEx1Pages: document.getElementById('badgeEx1Pages'),
    badgeEx2Pages: document.getElementById('badgeEx2Pages'),
    presetSelect: document.getElementById('presetSelect'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    btnZoomReset: document.getElementById('btnZoomReset'),
    zoomLevelDisplay: document.getElementById('zoomLevelDisplay'),
    btnToggleEditor: document.getElementById('btnToggleEditor'),
    btnPrint: document.getElementById('btnPrint'),
    pageWrapperScale: document.getElementById('pageWrapperScale'),
    documentContainer: document.getElementById('documentContainer'),
    // Stats Bar
    statClaimant: document.getElementById('statClaimant'),
    statClaimNo: document.getElementById('statClaimNo'),
    statPageCount: document.getElementById('statPageCount'),
    statTotalExpense: document.getElementById('statTotalExpense'),
    statExpenseContainer: document.getElementById('statExpenseContainer'),
    statAppId: document.getElementById('statAppId'),
    // Drawer
    sidebarDrawer: document.getElementById('sidebarDrawer'),
    drawerTitle: document.getElementById('drawerTitle'),
    btnCloseDrawer: document.getElementById('btnCloseDrawer'),
    drawerNav: document.getElementById('drawerNav'),
    drawerContent: document.getElementById('drawerContent'),
    toastMsg: document.getElementById('toastMsg'),
    // AI Assistant Modal
    btnOpenAI: document.getElementById('btnOpenAI'),
    aiAssistantModal: document.getElementById('aiAssistantModal'),
    btnCloseAIModal: document.getElementById('btnCloseAIModal'),
    btnCloseAIModalFooter: document.getElementById('btnCloseAIModalFooter'),
    aiOcrInput: document.getElementById('aiOcrInput'),
    btnAiParseReceipt: document.getElementById('btnAiParseReceipt'),
    btnAiClearOcr: document.getElementById('btnAiClearOcr'),
    aiOcrPreviewCard: document.getElementById('aiOcrPreviewCard'),
    aiOcrFieldsGrid: document.getElementById('aiOcrFieldsGrid'),
    btnAiApplyToClaim: document.getElementById('btnAiApplyToClaim'),
    btnAiGenerateSummary: document.getElementById('btnAiGenerateSummary'),
    aiSummaryOutput: document.getElementById('aiSummaryOutput'),
    btnCopySummary: document.getElementById('btnCopySummary'),
    btnApplySummaryToReport: document.getElementById('btnApplySummaryToReport'),
    btnAiRunAudit: document.getElementById('btnAiRunAudit'),
    aiAuditResultsList: document.getElementById('aiAuditResultsList'),
    aiChatHistory: document.getElementById('aiChatHistory'),
    aiChatInput: document.getElementById('aiChatInput'),
    btnAiChatSend: document.getElementById('btnAiChatSend'),
    // Video Hub Modal
    btnOpenVideo: document.getElementById('btnOpenVideo'),
    videoHubModal: document.getElementById('videoHubModal'),
    btnCloseVideoModal: document.getElementById('btnCloseVideoModal'),
    btnCloseVideoModalFooter: document.getElementById('btnCloseVideoModalFooter'),
    videoDemoCanvas: document.getElementById('videoDemoCanvas'),
    btnVideoPlayPause: document.getElementById('btnVideoPlayPause'),
    btnVideoNextCh: document.getElementById('btnVideoNextCh'),
    videoCurrentTimeDisplay: document.getElementById('videoCurrentTimeDisplay'),
    videoChaptersList: document.getElementById('videoChaptersList'),
    webcamPreviewEl: document.getElementById('webcamPreviewEl'),
    recIndicator: document.getElementById('recIndicator'),
    recTimerText: document.getElementById('recTimerText'),
    btnStartCamera: document.getElementById('btnStartCamera'),
    btnStartRec: document.getElementById('btnStartRec'),
    btnStopRec: document.getElementById('btnStopRec'),
    btnDownloadRec: document.getElementById('btnDownloadRec'),
    recReviewContainer: document.getElementById('recReviewContainer'),
    recordedPlaybackEl: document.getElementById('recordedPlaybackEl')
  };

  /**
   * Deep clone helper
   */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Show Toast Notification
   */
  function showToast(message) {
    if (!elements.toastMsg) return;
    elements.toastMsg.textContent = message;
    elements.toastMsg.classList.add('show');
    setTimeout(() => {
      elements.toastMsg.classList.remove('show');
    }, 2500);
  }

  /**
   * Set Zoom Level
   */
  function setZoom(level) {
    state.zoomLevel = Math.max(0.4, Math.min(2.0, level));
    if (elements.pageWrapperScale) {
      elements.pageWrapperScale.style.transform = `scale(${state.zoomLevel})`;
    }
    if (elements.zoomLevelDisplay) {
      elements.zoomLevelDisplay.textContent = `${Math.round(state.zoomLevel * 100)}%`;
    }
  }

  /**
   * Update Quick Statistics Bar
   */
  function updateStatsBar() {
    const data = state.activeData;
    if (!data) return;

    if (elements.statClaimant) {
      elements.statClaimant.textContent = data.claimantName || 'N/A';
    }
    if (elements.statClaimNo) {
      elements.statClaimNo.textContent = data.claimNo || 'N/A';
    }
    if (elements.statAppId) {
      elements.statAppId.textContent = data.workerAppId || 'N/A';
    }

    // Page count from DOM
    const renderedPages = elements.documentContainer ? elements.documentContainer.querySelectorAll('.pdf-page').length : 1;
    if (elements.statPageCount) {
      elements.statPageCount.textContent = `${renderedPages} Page${renderedPages > 1 ? 's' : ''}`;
    }

    if (state.currentExercise === 'expenseRequest') {
      if (elements.statExpenseContainer) elements.statExpenseContainer.style.display = 'flex';
      let total = 0;
      const parseAmt = (amtStr) => {
        if (!amtStr) return 0;
        const num = parseFloat(String(amtStr).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
      };

      (data.prescriptionDrugs || []).forEach(i => total += parseAmt(i.paidAmount));
      (data.overTheCounterDrugs || []).forEach(i => total += parseAmt(i.paidAmount));
      (data.medicalSupplies || []).forEach(i => total += parseAmt(i.paidAmount));
      (data.parking || []).forEach(i => total += parseAmt(i.paidAmount));
      (data.busOrTaxi || []).forEach(i => total += parseAmt(i.totalFare));

      if (elements.statTotalExpense) {
        elements.statTotalExpense.textContent = `$${total.toFixed(2)}`;
      }
      if (elements.badgeEx1Pages) {
        elements.badgeEx1Pages.textContent = `${renderedPages} Page${renderedPages > 1 ? 's' : ''}`;
      }
    } else {
      if (elements.statExpenseContainer) elements.statExpenseContainer.style.display = 'none';
      if (elements.badgeEx2Pages) {
        elements.badgeEx2Pages.textContent = `${renderedPages} Page${renderedPages > 1 ? 's' : ''}`;
      }
    }
  }

  /**
   * Render Active Document based on current exercise and state data
   */
  function renderDocument() {
    if (!state.activeData || !elements.documentContainer) return;

    if (state.currentExercise === 'expenseRequest') {
      ExpenseRequestRenderer.paginateAndRender(state.activeData, elements.documentContainer);
    } else if (state.currentExercise === 'workerProgressReport') {
      ProgressReportRenderer.paginateAndRender(state.activeData, elements.documentContainer);
    }

    updateStatsBar();
  }

  // Expose renderDocument globally
  window.renderDocument = renderDocument;

  /**
   * Load a Preset for the current exercise
   */
  function loadPreset(presetKey) {
    state.currentPresetKey = presetKey;
    const exercisePresets = APP_DATA[state.currentExercise];
    if (exercisePresets && exercisePresets[presetKey]) {
      state.activeData = deepClone(exercisePresets[presetKey]);
      renderDocument();
      rebuildDrawerForms();
      showToast(`Loaded Preset: ${presetKey === 'exactPdf' ? 'Exact PDF Replica' : presetKey === 'stressTest' ? 'Multi-Page Stress Test' : 'Minimal Case'}`);
    }
  }

  /**
   * Switch Active Exercise
   */
  function switchExercise(exerciseKey) {
    if (state.currentExercise === exerciseKey) return;
    state.currentExercise = exerciseKey;

    // Update Tab UI
    elements.tabExercise1.classList.toggle('active', exerciseKey === 'expenseRequest');
    elements.tabExercise2.classList.toggle('active', exerciseKey === 'workerProgressReport');

    // Update Drawer Title
    if (elements.drawerTitle) {
      elements.drawerTitle.textContent = exerciseKey === 'expenseRequest'
        ? 'Expense Request Data Editor'
        : 'Worker Progress Report Data Editor';
    }

    // Reset preset to default replica
    state.currentPresetKey = 'exactPdf';
    elements.presetSelect.value = 'exactPdf';

    // Load Data and rebuild UI
    loadPreset('exactPdf');
  }

  /**
   * Rebuild Drawer Tabs and Form Controls dynamically for active exercise
   */
  function rebuildDrawerForms() {
    if (state.currentExercise === 'expenseRequest') {
      buildExpenseRequestDrawer();
    } else {
      buildProgressReportDrawer();
    }
  }

  // Expose rebuildDrawerForms globally
  window.rebuildDrawerForms = rebuildDrawerForms;

  // =========================================================================
  // EXERCISE 1: EXPENSE REQUEST DRAWER BUILDER
  // =========================================================================
  function buildExpenseRequestDrawer() {
    const navItems = [
      { id: 'general', label: 'General' },
      { id: 'rx', label: 'Rx Drugs' },
      { id: 'otc', label: 'OTC Drugs' },
      { id: 'supplies', label: 'Supplies' },
      { id: 'parking', label: 'Parking' },
      { id: 'mileage', label: 'Mileage' },
      { id: 'transit', label: 'Transit' },
      { id: 'raw', label: 'JSON' }
    ];

    // Build Nav Tabs
    elements.drawerNav.innerHTML = navItems.map(item => `
      <button class="tab-btn ${state.activeTabId === item.id ? 'active' : ''}" data-tab="${item.id}">
        ${item.label}
      </button>
    `).join('');

    const data = state.activeData;

    // Build Tab Panes
    elements.drawerContent.innerHTML = `
      <!-- Tab: General -->
      <div id="tab-general" class="tab-pane ${state.activeTabId === 'general' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Claimant Full Name</label>
          <input type="text" id="inp-claimantName" class="form-input" value="${ExpenseRequestRenderer.escapeHtml(data.claimantName || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Claim Number</label>
          <input type="text" id="inp-claimNo" class="form-input" value="${ExpenseRequestRenderer.escapeHtml(data.claimNo || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Worker App ID</label>
          <input type="text" id="inp-workerAppId" class="form-input" value="${ExpenseRequestRenderer.escapeHtml(data.workerAppId || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Submitted Timestamp</label>
          <input type="text" id="inp-submittedAt" class="form-input" value="${ExpenseRequestRenderer.escapeHtml(data.submittedAt || '')}">
        </div>
        <div class="form-group" style="margin-top: 14px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="checkbox" id="inp-privacy" ${data.privacyNoticeAcknowledged !== false ? 'checked' : ''} style="width: 16px; height: 16px;">
            <span>Privacy Notice Acknowledged</span>
          </label>
        </div>
      </div>

      <!-- Tab: Rx Drugs -->
      <div id="tab-rx" class="tab-pane ${state.activeTabId === 'rx' ? 'active' : ''}">
        <div id="rxItemsList"></div>
        <button id="btnAddRx" class="btn-add-item">&plus; Add Prescription Item</button>
      </div>

      <!-- Tab: OTC Drugs -->
      <div id="tab-otc" class="tab-pane ${state.activeTabId === 'otc' ? 'active' : ''}">
        <div id="otcItemsList"></div>
        <button id="btnAddOtc" class="btn-add-item">&plus; Add OTC Drug</button>
      </div>

      <!-- Tab: Supplies -->
      <div id="tab-supplies" class="tab-pane ${state.activeTabId === 'supplies' ? 'active' : ''}">
        <div id="suppliesItemsList"></div>
        <button id="btnAddSupply" class="btn-add-item">&plus; Add Medical Supply Item</button>
      </div>

      <!-- Tab: Parking -->
      <div id="tab-parking" class="tab-pane ${state.activeTabId === 'parking' ? 'active' : ''}">
        <div id="parkingItemsList"></div>
        <button id="btnAddParking" class="btn-add-item">&plus; Add Parking Expense</button>
      </div>

      <!-- Tab: Mileage -->
      <div id="tab-mileage" class="tab-pane ${state.activeTabId === 'mileage' ? 'active' : ''}">
        <div id="mileageItemsList"></div>
        <button id="btnAddMileage" class="btn-add-item">&plus; Add Mileage Record</button>
      </div>

      <!-- Tab: Transit -->
      <div id="tab-transit" class="tab-pane ${state.activeTabId === 'transit' ? 'active' : ''}">
        <div id="transitItemsList"></div>
        <button id="btnAddTransit" class="btn-add-item">&plus; Add Bus/Taxi Record</button>
      </div>

      <!-- Tab: Raw JSON -->
      <div id="tab-raw" class="tab-pane ${state.activeTabId === 'raw' ? 'active' : ''}">
        <p style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
          Live edit data directly in JSON. Changes sync instantly on apply.
        </p>
        <textarea id="jsonEditor" class="json-editor" spellcheck="false"></textarea>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button id="btnApplyJson" class="btn btn-primary" style="flex: 1;">Apply JSON</button>
          <button id="btnFormatJson" class="btn btn-secondary">Format</button>
        </div>
      </div>
    `;

    renderExpenseArrays();
    syncJsonEditor();
    attachExpenseDrawerListeners();
  }

  function renderExpenseArrays() {
    const data = state.activeData;

    // Rx Items
    const rxContainer = document.getElementById('rxItemsList');
    if (rxContainer) {
      rxContainer.innerHTML = (data.prescriptionDrugs || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="rx">
          <div class="card-header">
            <span class="card-title">Rx Drug #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-rx" data-index="${idx}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Drug Name</label>
              <input type="text" class="form-input" data-field="drugName" value="${ExpenseRequestRenderer.escapeHtml(item.drugName || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Amount</label>
              <input type="text" class="form-input" data-field="paidAmount" value="${ExpenseRequestRenderer.escapeHtml(item.paidAmount || '')}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prescription Date</label>
              <input type="text" class="form-input" data-field="prescriptionDate" value="${ExpenseRequestRenderer.escapeHtml(item.prescriptionDate || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Date Purchased</label>
              <input type="text" class="form-input" data-field="datePurchased" value="${ExpenseRequestRenderer.escapeHtml(item.datePurchased || '')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Healthcare Provider Name</label>
            <input type="text" class="form-input" data-field="providerName" value="${ExpenseRequestRenderer.escapeHtml(item.providerName || '')}">
          </div>
        </div>
      `).join('');
    }

    // OTC Items
    const otcContainer = document.getElementById('otcItemsList');
    if (otcContainer) {
      otcContainer.innerHTML = (data.overTheCounterDrugs || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="otc">
          <div class="card-header">
            <span class="card-title">OTC Drug #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-otc" data-index="${idx}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Drug Name</label>
              <input type="text" class="form-input" data-field="drugName" value="${ExpenseRequestRenderer.escapeHtml(item.drugName || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Paid Amount</label>
              <input type="text" class="form-input" data-field="paidAmount" value="${ExpenseRequestRenderer.escapeHtml(item.paidAmount || '')}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date Purchased</label>
              <input type="text" class="form-input" data-field="datePurchased" value="${ExpenseRequestRenderer.escapeHtml(item.datePurchased || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Seller's Name</label>
              <input type="text" class="form-input" data-field="sellerName" value="${ExpenseRequestRenderer.escapeHtml(item.sellerName || '')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Reason for Purchasing</label>
            <input type="text" class="form-input" data-field="reason" value="${ExpenseRequestRenderer.escapeHtml(item.reason || '')}">
          </div>
        </div>
      `).join('');
    }

    // Supplies Items
    const supContainer = document.getElementById('suppliesItemsList');
    if (supContainer) {
      supContainer.innerHTML = (data.medicalSupplies || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="supplies">
          <div class="card-header">
            <span class="card-title">Supply Item #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-supplies" data-index="${idx}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item Purchased</label>
              <input type="text" class="form-input" data-field="itemPurchased" value="${ExpenseRequestRenderer.escapeHtml(item.itemPurchased || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Amount</label>
              <input type="text" class="form-input" data-field="paidAmount" value="${ExpenseRequestRenderer.escapeHtml(item.paidAmount || '')}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date Purchased</label>
              <input type="text" class="form-input" data-field="datePurchased" value="${ExpenseRequestRenderer.escapeHtml(item.datePurchased || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Was Prescribed?</label>
              <select class="form-select" data-field="wasPrescribed">
                <option value="Yes" ${item.wasPrescribed === 'Yes' ? 'selected' : ''}>Yes</option>
                <option value="No" ${item.wasPrescribed === 'No' ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Healthcare Provider</label>
              <input type="text" class="form-input" data-field="providerName" value="${ExpenseRequestRenderer.escapeHtml(item.providerName || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Seller's Name</label>
              <input type="text" class="form-input" data-field="sellerName" value="${ExpenseRequestRenderer.escapeHtml(item.sellerName || '')}">
            </div>
          </div>
        </div>
      `).join('');
    }

    // Parking Items
    const parkContainer = document.getElementById('parkingItemsList');
    if (parkContainer) {
      parkContainer.innerHTML = (data.parking || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="parking">
          <div class="card-header">
            <span class="card-title">Parking Expense #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-parking" data-index="${idx}">&times;</button>
          </div>
          <div class="form-group">
            <label class="form-label">Facility Address</label>
            <input type="text" class="form-input" data-field="facilityAddress" value="${ExpenseRequestRenderer.escapeHtml(item.facilityAddress || '')}">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date</label>
              <input type="text" class="form-input" data-field="date" value="${ExpenseRequestRenderer.escapeHtml(item.date || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Paid Amount</label>
              <input type="text" class="form-input" data-field="paidAmount" value="${ExpenseRequestRenderer.escapeHtml(item.paidAmount || '')}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Meter Used?</label>
              <select class="form-select" data-field="meterUsed">
                <option value="yes" ${item.meterUsed === 'yes' ? 'selected' : ''}>Yes</option>
                <option value="no" ${item.meterUsed === 'no' ? 'selected' : ''}>No</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Meter Number / Details</label>
              <input type="text" class="form-input" data-field="meterNumber" value="${ExpenseRequestRenderer.escapeHtml(item.meterNumber || '')}">
            </div>
          </div>
        </div>
      `).join('');
    }

    // Mileage Items
    const mileContainer = document.getElementById('mileageItemsList');
    if (mileContainer) {
      mileContainer.innerHTML = (data.mileage || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="mileage">
          <div class="card-header">
            <span class="card-title">Mileage Record #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-mileage" data-index="${idx}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Appointment Date</label>
              <input type="text" class="form-input" data-field="appointmentDate" value="${ExpenseRequestRenderer.escapeHtml(item.appointmentDate || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Round Trip Distance</label>
              <input type="text" class="form-input" data-field="roundTripKm" value="${ExpenseRequestRenderer.escapeHtml(item.roundTripKm || '')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Facility Address</label>
            <input type="text" class="form-input" data-field="facilityAddress" value="${ExpenseRequestRenderer.escapeHtml(item.facilityAddress || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Workplace Address</label>
            <input type="text" class="form-input" data-field="workplaceAddress" value="${ExpenseRequestRenderer.escapeHtml(item.workplaceAddress || '')}">
          </div>
        </div>
      `).join('');
    }

    // Transit Items
    const transContainer = document.getElementById('transitItemsList');
    if (transContainer) {
      transContainer.innerHTML = (data.busOrTaxi || []).map((item, idx) => `
        <div class="dynamic-row-card" data-index="${idx}" data-category="transit">
          <div class="card-header">
            <span class="card-title">Transit Record #${idx + 1}</span>
            <button class="btn-remove-item" data-action="remove-transit" data-index="${idx}">&times;</button>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Appointment Date</label>
              <input type="text" class="form-input" data-field="appointmentDate" value="${ExpenseRequestRenderer.escapeHtml(item.appointmentDate || '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Mode</label>
              <select class="form-select" data-field="mode">
                <option value="Bus" ${item.mode === 'Bus' ? 'selected' : ''}>Bus</option>
                <option value="Taxi" ${item.mode === 'Taxi' ? 'selected' : ''}>Taxi</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Starting Point Address</label>
            <input type="text" class="form-input" data-field="startingAddress" value="${ExpenseRequestRenderer.escapeHtml(item.startingAddress || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Facility Address</label>
            <input type="text" class="form-input" data-field="facilityAddress" value="${ExpenseRequestRenderer.escapeHtml(item.facilityAddress || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Total Fare Paid</label>
            <input type="text" class="form-input" data-field="totalFare" value="${ExpenseRequestRenderer.escapeHtml(item.totalFare || '')}">
          </div>
        </div>
      `).join('');
    }
  }

  function attachExpenseDrawerListeners() {
    const bindInput = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          state.activeData[key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          renderDocument();
          syncJsonEditor();
        });
      }
    };

    bindInput('inp-claimantName', 'claimantName');
    bindInput('inp-claimNo', 'claimNo');
    bindInput('inp-workerAppId', 'workerAppId');
    bindInput('inp-submittedAt', 'submittedAt');
    bindInput('inp-privacy', 'privacyNoticeAcknowledged');

    // Live Array Edit Delegation
    const handleArrayInput = (containerId, arrayKey) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.addEventListener('input', (e) => {
        const card = e.target.closest('.dynamic-row-card');
        if (!card) return;
        const idx = parseInt(card.dataset.index, 10);
        const field = e.target.dataset.field;
        if (field && state.activeData[arrayKey] && state.activeData[arrayKey][idx]) {
          state.activeData[arrayKey][idx][field] = e.target.value;
          renderDocument();
          syncJsonEditor();
        }
      });

      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remove-item');
        if (!btn) return;
        const idx = parseInt(btn.dataset.index, 10);
        state.activeData[arrayKey].splice(idx, 1);
        renderExpenseArrays();
        renderDocument();
        syncJsonEditor();
        showToast(`Removed item from ${arrayKey}`);
      });
    };

    handleArrayInput('rxItemsList', 'prescriptionDrugs');
    handleArrayInput('otcItemsList', 'overTheCounterDrugs');
    handleArrayInput('suppliesItemsList', 'medicalSupplies');
    handleArrayInput('parkingItemsList', 'parking');
    handleArrayInput('mileageItemsList', 'mileage');
    handleArrayInput('transitItemsList', 'busOrTaxi');

    // Add Row Buttons
    document.getElementById('btnAddRx')?.addEventListener('click', () => {
      state.activeData.prescriptionDrugs = state.activeData.prescriptionDrugs || [];
      state.activeData.prescriptionDrugs.push({
        drugName: 'New Prescription',
        prescriptionDate: 'March 01, 2024',
        datePurchased: 'March 02, 2024',
        providerName: 'Dr. Best',
        paidAmount: '$20.00'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });

    document.getElementById('btnAddOtc')?.addEventListener('click', () => {
      state.activeData.overTheCounterDrugs = state.activeData.overTheCounterDrugs || [];
      state.activeData.overTheCounterDrugs.push({
        drugName: 'OTC Medication',
        datePurchased: 'March 05, 2024',
        paidAmount: '$12.00',
        sellerName: 'Pharmacy',
        reason: 'Pain'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });

    document.getElementById('btnAddSupply')?.addEventListener('click', () => {
      state.activeData.medicalSupplies = state.activeData.medicalSupplies || [];
      state.activeData.medicalSupplies.push({
        itemPurchased: 'Support Splint',
        datePurchased: 'March 10, 2024',
        wasPrescribed: 'Yes',
        providerName: 'Dr. Best',
        paidAmount: '$25.00',
        sellerName: 'Medical Supply Clinic'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });

    document.getElementById('btnAddParking')?.addEventListener('click', () => {
      state.activeData.parking = state.activeData.parking || [];
      state.activeData.parking.push({
        facilityAddress: '333 St Mary Ave, Winnipeg MB',
        date: 'March 15, 2024',
        paidAmount: '$10.00',
        meterUsed: 'yes',
        meterNumber: '10928'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });

    document.getElementById('btnAddMileage')?.addEventListener('click', () => {
      state.activeData.mileage = state.activeData.mileage || [];
      state.activeData.mileage.push({
        appointmentDate: 'March 20, 2024',
        facilityAddress: 'Health Sciences Centre, 820 Sherbrook St',
        workplaceAddress: 'WCB, 333 Broadway, Winnipeg MB',
        roundTripKm: '20 km'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });

    document.getElementById('btnAddTransit')?.addEventListener('click', () => {
      state.activeData.busOrTaxi = state.activeData.busOrTaxi || [];
      state.activeData.busOrTaxi.push({
        appointmentDate: 'March 22, 2024',
        startingAddress: 'Home',
        facilityAddress: 'Clinic, Winnipeg MB',
        mode: 'Bus',
        totalFare: '$3.15'
      });
      renderExpenseArrays();
      renderDocument();
      syncJsonEditor();
    });
  }

  // =========================================================================
  // EXERCISE 2: WORKER PROGRESS REPORT DRAWER BUILDER
  // =========================================================================
  function buildProgressReportDrawer() {
    const navItems = [
      { id: 'general', label: 'General' },
      { id: 'rtw', label: 'Return to Work' },
      { id: 'recovery', label: 'Recovery' },
      { id: 'medical', label: 'Medical & Rx' },
      { id: 'other', label: 'Other & Legal' },
      { id: 'raw', label: 'JSON' }
    ];

    elements.drawerNav.innerHTML = navItems.map(item => `
      <button class="tab-btn ${state.activeTabId === item.id ? 'active' : ''}" data-tab="${item.id}">
        ${item.label}
      </button>
    `).join('');

    const data = state.activeData;
    const rtw = data.returnToWork || {};
    const rec = data.recovery || {};
    const med = data.medicalAndTreatment || {};
    const dec = data.declarations || {};

    elements.drawerContent.innerHTML = `
      <!-- Tab: General -->
      <div id="tab-general" class="tab-pane ${state.activeTabId === 'general' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Claimant Full Name</label>
          <input type="text" id="wp-claimantName" class="form-input" value="${ProgressReportRenderer.escapeHtml(data.claimantName || '')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Claim Number</label>
            <input type="text" id="wp-claimNo" class="form-input" value="${ProgressReportRenderer.escapeHtml(data.claimNo || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Form Code</label>
            <input type="text" id="wp-formCode" class="form-input" value="${ProgressReportRenderer.escapeHtml(data.formCode || 'WP')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Worker App ID</label>
            <input type="text" id="wp-workerAppId" class="form-input" value="${ProgressReportRenderer.escapeHtml(data.workerAppId || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Submitted Timestamp</label>
            <input type="text" id="wp-submittedAt" class="form-input" value="${ProgressReportRenderer.escapeHtml(data.submittedAt || '')}">
          </div>
        </div>
      </div>

      <!-- Tab: Return to Work -->
      <div id="tab-rtw" class="tab-pane ${state.activeTabId === 'rtw' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Return to Work Status</label>
          <select id="wp-returnStatus" class="form-select">
            <option value="not_missed" ${rtw.returnStatus === 'not_missed' ? 'selected' : ''}>I have not missed time from work</option>
            <option value="not_returned" ${rtw.returnStatus === 'not_returned' ? 'selected' : ''}>I have not returned to work</option>
            <option value="returned_on_date" ${rtw.returnStatus === 'returned_on_date' ? 'selected' : ''}>I returned to work on (Date)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Returned on Date</label>
          <input type="text" id="wp-returnedOnDate" class="form-input" value="${ProgressReportRenderer.escapeHtml(rtw.returnedOnDate || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Working Duty Mode</label>
          <select id="wp-workingStatus" class="form-select">
            <option value="full_regular" ${rtw.workingStatus === 'full_regular' ? 'selected' : ''}>Full duties, regular hours</option>
            <option value="full_reduced" ${rtw.workingStatus === 'full_reduced' ? 'selected' : ''}>Full duties, reduced hours</option>
            <option value="modified_regular" ${rtw.workingStatus === 'modified_regular' ? 'selected' : ''}>Modified duties, regular hours</option>
            <option value="modified_reduced" ${rtw.workingStatus === 'modified_reduced' ? 'selected' : ''}>Modified duties, reduced hours</option>
            <option value="other" ${rtw.workingStatus === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">My return to work is going:</label>
          <textarea id="wp-returnToWorkGoing" class="form-textarea" rows="3">${ProgressReportRenderer.escapeHtml(rtw.returnToWorkGoing || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">I expect to return to work on (Date):</label>
          <input type="text" id="wp-expectedReturnDate" class="form-input" value="${ProgressReportRenderer.escapeHtml(rtw.expectedReturnDate || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Concerns about returning to work:</label>
          <textarea id="wp-concernsAboutReturning" class="form-textarea" rows="2">${ProgressReportRenderer.escapeHtml(rtw.concernsAboutReturning || '')}</textarea>
        </div>
      </div>

      <!-- Tab: Recovery -->
      <div id="tab-recovery" class="tab-pane ${state.activeTabId === 'recovery' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Recovery Status</label>
          <select id="wp-recoveryStatus" class="form-select">
            <option value="not_fully_recovered" ${rec.recoveryStatus === 'not_fully_recovered' ? 'selected' : ''}>I have not fully recovered from my workplace injury</option>
            <option value="fully_recovered" ${rec.recoveryStatus === 'fully_recovered' ? 'selected' : ''}>I have fully recovered from my workplace injury</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Comments about my recovery:</label>
          <textarea id="wp-recoveryComments" class="form-textarea" rows="3">${ProgressReportRenderer.escapeHtml(rec.recoveryComments || '')}</textarea>
        </div>
      </div>

      <!-- Tab: Medical & Treatment -->
      <div id="tab-medical" class="tab-pane ${state.activeTabId === 'medical' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Current Pain Scale Rating (1 - 10)</label>
          <select id="wp-painRating" class="form-select">
            <option value="">-- No Rating Selected --</option>
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${med.painRating === n ? 'selected' : ''}>${n} ${n===1?'(No Pain)':n===10?'(Severe Pain)':''}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Medical Treatment Status</label>
          <select id="wp-treatmentStatus" class="form-select">
            <option value="not_continuing" ${med.treatmentStatus === 'not_continuing' ? 'selected' : ''}>I am not continuing to receive medical treatment</option>
            <option value="continuing" ${med.treatmentStatus === 'continuing' ? 'selected' : ''}>I am continuing to receive medical treatment</option>
            <option value="none" ${med.treatmentStatus === 'none' ? 'selected' : ''}>None Selected</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Medical Provider Type</label>
          <input type="text" id="wp-medicalProviderType" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.medicalProviderType || '')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Last Treatment Date</label>
            <input type="text" id="wp-lastTreatmentDate" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.lastTreatmentDate || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Last Treatment Provider</label>
            <input type="text" id="wp-lastTreatmentProvider" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.lastTreatmentProvider || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Next Treatment Date</label>
            <input type="text" id="wp-nextTreatmentDate" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.nextTreatmentDate || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Next Treatment Provider</label>
            <input type="text" id="wp-nextTreatmentProvider" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.nextTreatmentProvider || '')}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Chiropractor / Physio Frequency</label>
          <input type="text" id="wp-chiroPhysioFrequency" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.chiroPhysioFrequency || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Medication Status</label>
          <select id="wp-medicationStatus" class="form-select">
            <option value="not_taking" ${med.medicationStatus === 'not_taking' ? 'selected' : ''}>I am not taking medication</option>
            <option value="taking" ${med.medicationStatus === 'taking' ? 'selected' : ''}>I am taking medication</option>
            <option value="none" ${med.medicationStatus === 'none' ? 'selected' : ''}>None Selected</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Prescribed Medication Name</label>
          <input type="text" id="wp-prescribedMedicationName" class="form-input" value="${ProgressReportRenderer.escapeHtml(med.prescribedMedicationName || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Home Exercises Status</label>
          <select id="wp-homeExercisesStatus" class="form-select">
            <option value="not_doing" ${med.homeExercisesStatus === 'not_doing' ? 'selected' : ''}>I am not doing home exercises</option>
            <option value="doing" ${med.homeExercisesStatus === 'doing' ? 'selected' : ''}>I am doing home exercises</option>
            <option value="none" ${med.homeExercisesStatus === 'none' ? 'selected' : ''}>None Selected</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">List Home Exercises</label>
          <textarea id="wp-homeExercisesList" class="form-textarea" rows="2">${ProgressReportRenderer.escapeHtml(med.homeExercisesList || '')}</textarea>
        </div>
      </div>

      <!-- Tab: Other & Legal -->
      <div id="tab-other" class="tab-pane ${state.activeTabId === 'other' ? 'active' : ''}">
        <div class="form-group">
          <label class="form-label">Additional Comments / Other Info</label>
          <textarea id="wp-additionalComments" class="form-textarea" rows="3">${ProgressReportRenderer.escapeHtml(data.otherInformation?.additionalComments || '')}</textarea>
        </div>
        <div class="form-group" style="margin-top: 14px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; margin-bottom: 8px;">
            <input type="checkbox" id="wp-truthCertified" ${dec.truthCertified !== false ? 'checked' : ''} style="width: 16px; height: 16px;">
            <span>Truth &amp; Complete Information Certified</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
            <input type="checkbox" id="wp-privacyConsent" ${dec.privacyNoticeAcknowledged !== false ? 'checked' : ''} style="width: 16px; height: 16px;">
            <span>Privacy Notice Acknowledged</span>
          </label>
        </div>
      </div>

      <!-- Tab: Raw JSON -->
      <div id="tab-raw" class="tab-pane ${state.activeTabId === 'raw' ? 'active' : ''}">
        <textarea id="jsonEditor" class="json-editor" spellcheck="false"></textarea>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button id="btnApplyJson" class="btn btn-primary" style="flex: 1;">Apply JSON</button>
          <button id="btnFormatJson" class="btn btn-secondary">Format</button>
        </div>
      </div>
    `;

    syncJsonEditor();
    attachProgressDrawerListeners();
  }

  function attachProgressDrawerListeners() {
    const bindInput = (id, path) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          setNestedValue(state.activeData, path, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
          renderDocument();
          syncJsonEditor();
        });
      }
    };

    bindInput('wp-claimantName', 'claimantName');
    bindInput('wp-claimNo', 'claimNo');
    bindInput('wp-formCode', 'formCode');
    bindInput('wp-workerAppId', 'workerAppId');
    bindInput('wp-submittedAt', 'submittedAt');

    // RTW
    bindInput('wp-returnStatus', 'returnToWork.returnStatus');
    bindInput('wp-returnedOnDate', 'returnToWork.returnedOnDate');
    bindInput('wp-workingStatus', 'returnToWork.workingStatus');
    bindInput('wp-returnToWorkGoing', 'returnToWork.returnToWorkGoing');
    bindInput('wp-expectedReturnDate', 'returnToWork.expectedReturnDate');
    bindInput('wp-concernsAboutReturning', 'returnToWork.concernsAboutReturning');

    // Recovery
    bindInput('wp-recoveryStatus', 'recovery.recoveryStatus');
    bindInput('wp-recoveryComments', 'recovery.recoveryComments');

    // Medical
    const painEl = document.getElementById('wp-painRating');
    if (painEl) {
      painEl.addEventListener('change', (e) => {
        state.activeData.medicalAndTreatment = state.activeData.medicalAndTreatment || {};
        state.activeData.medicalAndTreatment.painRating = e.target.value ? parseInt(e.target.value, 10) : null;
        renderDocument();
        syncJsonEditor();
      });
    }

    bindInput('wp-treatmentStatus', 'medicalAndTreatment.treatmentStatus');
    bindInput('wp-medicalProviderType', 'medicalAndTreatment.medicalProviderType');
    bindInput('wp-lastTreatmentDate', 'medicalAndTreatment.lastTreatmentDate');
    bindInput('wp-lastTreatmentProvider', 'medicalAndTreatment.lastTreatmentProvider');
    bindInput('wp-nextTreatmentDate', 'medicalAndTreatment.nextTreatmentDate');
    bindInput('wp-nextTreatmentProvider', 'medicalAndTreatment.nextTreatmentProvider');
    bindInput('wp-chiroPhysioFrequency', 'medicalAndTreatment.chiroPhysioFrequency');
    bindInput('wp-medicationStatus', 'medicalAndTreatment.medicationStatus');
    bindInput('wp-prescribedMedicationName', 'medicalAndTreatment.prescribedMedicationName');
    bindInput('wp-homeExercisesStatus', 'medicalAndTreatment.homeExercisesStatus');
    bindInput('wp-homeExercisesList', 'medicalAndTreatment.homeExercisesList');

    // Other & Declarations
    bindInput('wp-additionalComments', 'otherInformation.additionalComments');
    bindInput('wp-truthCertified', 'declarations.truthCertified');
    bindInput('wp-privacyConsent', 'declarations.privacyNoticeAcknowledged');
  }

  function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Sync JSON Editor text
   */
  function syncJsonEditor() {
    const editor = document.getElementById('jsonEditor');
    if (editor && document.activeElement !== editor) {
      editor.value = JSON.stringify(state.activeData, null, 2);
    }
  }

  /**
   * Apply JSON modifications
   */
  function applyJson() {
    const editor = document.getElementById('jsonEditor');
    if (!editor) return;
    try {
      const parsed = JSON.parse(editor.value);
      state.activeData = parsed;
      renderDocument();
      rebuildDrawerForms();
      showToast('JSON successfully applied & rendered!');
    } catch (err) {
      alert('Invalid JSON syntax: ' + err.message);
    }
  }

  /**
   * Format JSON
   */
  function formatJson() {
    const editor = document.getElementById('jsonEditor');
    if (!editor) return;
    try {
      const parsed = JSON.parse(editor.value);
      editor.value = JSON.stringify(parsed, null, 2);
    } catch (err) {
      alert('Cannot format invalid JSON: ' + err.message);
    }
  }

  // =========================================================================
  // AI ASSISTANT MODAL EVENT HANDLERS
  // =========================================================================
  function initAiModalListeners() {
    // Open/Close Modal
    elements.btnOpenAI?.addEventListener('click', () => {
      elements.aiAssistantModal?.classList.add('open');
      renderAiChatHistory();
    });

    const closeAiModal = () => elements.aiAssistantModal?.classList.remove('open');
    elements.btnCloseAIModal?.addEventListener('click', closeAiModal);
    elements.btnCloseAIModalFooter?.addEventListener('click', closeAiModal);

    // AI Tab Switching
    elements.aiAssistantModal?.querySelectorAll('.modal-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        elements.aiAssistantModal.querySelectorAll('.modal-nav-btn').forEach(b => b.classList.toggle('active', b === btn));
        elements.aiAssistantModal.querySelectorAll('.modal-tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === `aiTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        });
      });
    });

    // Sample Receipt Chips
    elements.aiAssistantModal?.querySelectorAll('.chip-btn[data-sample]').forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleKey = chip.dataset.sample;
        if (AIAssistant.sampleReceipts[sampleKey] && elements.aiOcrInput) {
          elements.aiOcrInput.value = AIAssistant.sampleReceipts[sampleKey];
        }
      });
    });

    // Clear OCR Input
    elements.btnAiClearOcr?.addEventListener('click', () => {
      if (elements.aiOcrInput) elements.aiOcrInput.value = '';
      if (elements.aiOcrPreviewCard) elements.aiOcrPreviewCard.classList.remove('show');
      state.parsedOcrResult = null;
    });

    // Parse Receipt Button
    elements.btnAiParseReceipt?.addEventListener('click', () => {
      const text = elements.aiOcrInput?.value || '';
      const res = AIAssistant.parseReceiptText(text);
      if (!res.success) {
        showToast(res.message);
        return;
      }

      state.parsedOcrResult = res.extracted;
      if (elements.aiOcrFieldsGrid) {
        const ext = res.extracted;
        elements.aiOcrFieldsGrid.innerHTML = `
          <div class="parsed-field">
            <div class="parsed-label">Detected Category</div>
            <div class="parsed-val">${ext.category.toUpperCase()}</div>
          </div>
          <div class="parsed-field">
            <div class="parsed-label">Item / Drug Name</div>
            <div class="parsed-val">${ext.drugName || ext.itemPurchased || ext.facilityAddress || 'Item'}</div>
          </div>
          <div class="parsed-field">
            <div class="parsed-label">Date</div>
            <div class="parsed-val">${ext.date}</div>
          </div>
          <div class="parsed-field">
            <div class="parsed-label">Amount Paid</div>
            <div class="parsed-val">${ext.amount}</div>
          </div>
          <div class="parsed-field">
            <div class="parsed-label">Healthcare Provider / Seller</div>
            <div class="parsed-val">${ext.providerName || ext.sellerName || ext.startingAddress || 'N/A'}</div>
          </div>
        `;
      }
      elements.aiOcrPreviewCard?.classList.add('show');
      showToast('Receipt parsed successfully!');
    });

    // Auto-Add Extracted Line Item
    elements.btnAiApplyToClaim?.addEventListener('click', () => {
      if (!state.parsedOcrResult) return;
      const res = AIAssistant.applyParsedDataToActiveClaim(state.parsedOcrResult);
      showToast(res.message);
      if (res.success) {
        closeAiModal();
      }
    });

    // Clinical Summary Generator
    elements.btnAiGenerateSummary?.addEventListener('click', () => {
      const summary = AIAssistant.generateProgressSummary();
      if (elements.aiSummaryOutput) {
        elements.aiSummaryOutput.textContent = summary;
      }
      showToast('Generated executive clinical summary!');
    });

    // Copy Summary
    elements.btnCopySummary?.addEventListener('click', () => {
      const txt = elements.aiSummaryOutput?.textContent || '';
      navigator.clipboard.writeText(txt).then(() => showToast('Copied summary to clipboard!'));
    });

    // Apply Summary to Progress Notes
    elements.btnApplySummaryToReport?.addEventListener('click', () => {
      if (state.currentExercise === 'workerProgressReport') {
        const txt = elements.aiSummaryOutput?.textContent || '';
        state.activeData.otherInformation = state.activeData.otherInformation || {};
        state.activeData.otherInformation.additionalComments = txt;
        renderDocument();
        rebuildDrawerForms();
        showToast('Inserted summary into Progress Notes!');
        closeAiModal();
      } else {
        showToast('Please switch to Worker Progress Report to apply.');
      }
    });

    // Policy Auditor
    elements.btnAiRunAudit?.addEventListener('click', () => {
      const results = AIAssistant.auditClaimCompliance();
      if (elements.aiAuditResultsList) {
        elements.aiAuditResultsList.innerHTML = results.map(item => `
          <div class="audit-card ${item.type}">
            <div class="audit-title">${item.type === 'error' ? '❌' : item.type === 'warning' ? '⚠️' : item.type === 'success' ? '✅' : 'ℹ️'} ${item.title}</div>
            <div class="audit-desc">${item.description}</div>
          </div>
        `).join('');
      }
      showToast('Policy audit complete!');
    });

    // Chatbot UI
    function renderAiChatHistory() {
      if (!elements.aiChatHistory) return;
      elements.aiChatHistory.innerHTML = AIAssistant.state.chatHistory.map(msg => `
        <div class="chat-bubble ${msg.sender}">
          <div>${msg.text.replace(/\n/g, '<br>')}</div>
          <div class="chat-time">${msg.time}</div>
        </div>
      `).join('');
      elements.aiChatHistory.scrollTop = elements.aiChatHistory.scrollHeight;
    }

    const sendChatMsg = () => {
      const val = elements.aiChatInput?.value?.trim();
      if (!val) return;
      AIAssistant.handleChatQuery(val);
      if (elements.aiChatInput) elements.aiChatInput.value = '';
      renderAiChatHistory();
    };

    elements.btnAiChatSend?.addEventListener('click', sendChatMsg);
    elements.aiChatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMsg();
    });

    elements.aiAssistantModal?.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        if (q) {
          AIAssistant.handleChatQuery(q);
          renderAiChatHistory();
        }
      });
    });
  }

  // =========================================================================
  // VIDEO HUB MODAL EVENT HANDLERS
  // =========================================================================
  function initVideoHubListeners() {
    elements.btnOpenVideo?.addEventListener('click', () => {
      elements.videoHubModal?.classList.add('open');
      renderVideoChapters();
      VideoHub.initCanvasPlayer(elements.videoDemoCanvas);
    });

    const closeVideoModal = () => {
      elements.videoHubModal?.classList.remove('open');
      VideoHub.stopWebcamStream();
    };
    elements.btnCloseVideoModal?.addEventListener('click', closeVideoModal);
    elements.btnCloseVideoModalFooter?.addEventListener('click', closeVideoModal);

    // Tab Switching
    elements.videoHubModal?.querySelectorAll('.modal-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vtab = btn.dataset.vtab;
        elements.videoHubModal.querySelectorAll('.modal-nav-btn').forEach(b => b.classList.toggle('active', b === btn));
        elements.videoHubModal.querySelectorAll('.modal-tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === `vTab${vtab.charAt(0).toUpperCase() + vtab.slice(1)}`);
        });
      });
    });

    // Render Chapters List
    function renderVideoChapters() {
      if (!elements.videoChaptersList) return;
      elements.videoChaptersList.innerHTML = VideoHub.videoChapters.map((ch, idx) => `
        <button class="chapter-item-btn ${VideoHub.state.activeChapter === idx ? 'active' : ''}" data-ch="${idx}">
          <strong>${ch.title}</strong> &mdash; <span style="color:#64748b;">${ch.description}</span>
        </button>
      `).join('');

      elements.videoChaptersList.querySelectorAll('.chapter-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chIdx = parseInt(btn.dataset.ch, 10);
          VideoHub.state.activeChapter = chIdx;
          renderVideoChapters();
          if (elements.videoCurrentTimeDisplay) {
            elements.videoCurrentTimeDisplay.textContent = `Chapter ${chIdx + 1} of ${VideoHub.videoChapters.length}`;
          }
          VideoHub.initCanvasPlayer(elements.videoDemoCanvas);
        });
      });
    }

    // Video Canvas Controls
    elements.btnVideoPlayPause?.addEventListener('click', () => {
      VideoHub.state.isPlaying = !VideoHub.state.isPlaying;
      elements.btnVideoPlayPause.textContent = VideoHub.state.isPlaying ? '⏸ Pause Demo' : '▶ Play Demo';
      if (VideoHub.state.isPlaying) {
        VideoHub.initCanvasPlayer(elements.videoDemoCanvas);
      }
    });

    elements.btnVideoNextCh?.addEventListener('click', () => {
      VideoHub.state.activeChapter = (VideoHub.state.activeChapter + 1) % VideoHub.videoChapters.length;
      renderVideoChapters();
      if (elements.videoCurrentTimeDisplay) {
        elements.videoCurrentTimeDisplay.textContent = `Chapter ${VideoHub.state.activeChapter + 1} of ${VideoHub.videoChapters.length}`;
      }
      VideoHub.initCanvasPlayer(elements.videoDemoCanvas);
    });

    // Webcam Recorder Controls
    elements.btnStartCamera?.addEventListener('click', async () => {
      const ok = await VideoHub.startWebcamPreview(elements.webcamPreviewEl);
      if (ok) {
        showToast('Webcam preview active.');
      }
    });

    elements.btnStartRec?.addEventListener('click', () => {
      const ok = VideoHub.startRecording((timeStr) => {
        if (elements.recTimerText) elements.recTimerText.textContent = `REC ${timeStr}`;
      });
      if (ok) {
        elements.recIndicator?.classList.add('active');
        elements.btnStartRec.disabled = true;
        elements.btnStopRec.disabled = false;
        showToast('Recording check-in video...');
      } else {
        alert('Please click "Enable Camera" first.');
      }
    });

    elements.btnStopRec?.addEventListener('click', () => {
      VideoHub.stopRecording();
      elements.recIndicator?.classList.remove('active');
      elements.btnStartRec.disabled = false;
      elements.btnStopRec.disabled = true;
      elements.btnDownloadRec.disabled = false;

      setTimeout(() => {
        if (VideoHub.state.recordedUrl && elements.recordedPlaybackEl) {
          elements.recordedPlaybackEl.src = VideoHub.state.recordedUrl;
          if (elements.recReviewContainer) elements.recReviewContainer.style.display = 'block';
        }
      }, 300);

      showToast('Video recording saved for preview.');
    });

    elements.btnDownloadRec?.addEventListener('click', () => {
      if (VideoHub.state.recordedUrl) {
        const a = document.createElement('a');
        a.href = VideoHub.state.recordedUrl;
        a.download = `WCB_Checkin_Claim_${state.activeData.claimNo || '712041'}.webm`;
        a.click();
        showToast('Video downloaded successfully.');
      }
    });
  }

  // =========================================================================
  // GLOBAL LISTENERS & INITIALIZATION
  // =========================================================================
  function initListeners() {
    // Exercise Tabs
    elements.tabExercise1?.addEventListener('click', () => switchExercise('expenseRequest'));
    elements.tabExercise2?.addEventListener('click', () => switchExercise('workerProgressReport'));

    // Presets Dropdown
    elements.presetSelect?.addEventListener('change', (e) => loadPreset(e.target.value));

    // Zoom Controls
    elements.btnZoomIn?.addEventListener('click', () => setZoom(state.zoomLevel + 0.1));
    elements.btnZoomOut?.addEventListener('click', () => setZoom(state.zoomLevel - 0.1));
    elements.btnZoomReset?.addEventListener('click', () => setZoom(1.0));

    // Drawer Toggle
    elements.btnToggleEditor?.addEventListener('click', () => {
      state.drawerOpen = !state.drawerOpen;
      elements.sidebarDrawer.classList.toggle('collapsed', !state.drawerOpen);
    });

    elements.btnCloseDrawer?.addEventListener('click', () => {
      state.drawerOpen = false;
      elements.sidebarDrawer.classList.add('collapsed');
    });

    // Drawer Tab Switcher Delegation
    elements.drawerNav?.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const tabId = btn.dataset.tab;
      state.activeTabId = tabId;

      elements.drawerNav.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
      elements.drawerContent.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));
    });

    // JSON Editor Buttons Delegation
    elements.drawerContent?.addEventListener('click', (e) => {
      if (e.target.id === 'btnApplyJson') applyJson();
      if (e.target.id === 'btnFormatJson') formatJson();
    });

    // Print
    elements.btnPrint?.addEventListener('click', () => window.print());

    // Init AI & Video Modules
    initAiModalListeners();
    initVideoHubListeners();

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.drawerOpen) {
          state.drawerOpen = false;
          elements.sidebarDrawer.classList.add('collapsed');
        }
        elements.aiAssistantModal?.classList.remove('open');
        elements.videoHubModal?.classList.remove('open');
      }
    });
  }

  // Initialize App
  function init() {
    initListeners();
    loadPreset('exactPdf');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
