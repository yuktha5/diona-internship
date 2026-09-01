/**
 * Exercise 1: Medical & Travel Expense Request - Document Renderer & Pagination Engine
 */

const ExpenseRequestRenderer = {
  // SVG Vector definition for Workers Compensation Board of Manitoba Logo
  getWcbLogoSvg() {
    return `
      <svg class="wcb-logo-svg" viewBox="0 0 270 70" width="220" height="57" xmlns="http://www.w3.org/2000/svg">
        <g fill="#0b5871">
          <!-- Stylized WCB Text -->
          <text x="0" y="44" font-family="'Trebuchet MS', 'Arial Black', sans-serif" font-weight="900" font-size="38" letter-spacing="-1">WCB</text>
          
          <!-- Stylized Human Figures Icon (above/around C & B) -->
          <circle cx="120" cy="16" r="4.5" fill="#0b5871"/>
          <path d="M112,30 C112,22 128,22 128,30 Z" fill="#0b5871"/>
          
          <circle cx="134" cy="12" r="5" fill="#0b5871"/>
          <path d="M125,28 C125,19 143,19 143,28 Z" fill="#0b5871"/>

          <circle cx="148" cy="16" r="4.5" fill="#0b5871"/>
          <path d="M140,30 C140,22 156,22 156,30 Z" fill="#0b5871"/>

          <!-- Subtitle: Workers Compensation Board of Manitoba -->
          <text x="2" y="56" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" letter-spacing="-0.2">Workers Compensation</text>
          <text x="2" y="67" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" letter-spacing="-0.2">Board of Manitoba</text>
        </g>
      </svg>
    `;
  },

  // Helper to escape HTML strings safely
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Generate Page 1 Header
  renderHeader(data) {
    const org = data.organization || {};
    return `
      <div class="doc-header">
        <div class="doc-header-left">
          <div class="wcb-logo-container">
            ${this.getWcbLogoSvg()}
          </div>
        </div>
        <div class="doc-header-center">
          <p>${this.escapeHtml(org.addressLine1 || '333 Broadway')}</p>
          <p>${this.escapeHtml(org.addressLine2 || 'Winnipeg, MB R3C 4W3')}</p>
          <p>${this.escapeHtml(org.phone || 'Phone: (204) 954-4321')}</p>
          <p>${this.escapeHtml(org.tollFree || 'Toll Free: 1-855-954-4321')}</p>
          <p>${this.escapeHtml(org.website || 'wcb.mb.ca')}</p>
        </div>
        <div class="doc-header-right">
          <div class="doc-title">
            Medical &amp; Travel Expense<br>Request
          </div>
          <div class="claim-box">
            Claim No. ${this.escapeHtml(data.claimNo || '')}
          </div>
        </div>
      </div>
      <div class="claimant-intro">
        ${this.escapeHtml(data.claimantName || 'Madeleine Willson')} requested reimbursement for the following medical and/or travel expenses:
      </div>
    `;
  },

  // Render Prescription Drugs Section
  renderPrescriptionDrugs(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.drugName)}</td>
        <td>${this.escapeHtml(item.prescriptionDate)}</td>
        <td>${this.escapeHtml(item.datePurchased)}</td>
        <td>${this.escapeHtml(item.providerName)}</td>
        <td>${this.escapeHtml(item.paidAmount)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-rx" data-section-type="rx">
        <div class="section-heading">Prescription Drugs</div>
        <table class="expense-table table-rx">
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Prescription Date</th>
              <th>Date Purchased</th>
              <th>Healthcare Provider Name</th>
              <th>Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Over-the-Counter Drugs Section
  renderOverTheCounterDrugs(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.drugName)}</td>
        <td>${this.escapeHtml(item.datePurchased)}</td>
        <td>${this.escapeHtml(item.paidAmount)}</td>
        <td>${this.escapeHtml(item.sellerName)}</td>
        <td>${this.escapeHtml(item.reason)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-otc" data-section-type="otc">
        <div class="section-heading">Over-the-Counter Drugs</div>
        <table class="expense-table table-otc">
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Date Purchased</th>
              <th>Paid Amount</th>
              <th>Seller's Name</th>
              <th>Reason for Purchasing</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Bandages, Braces or Other Medical Supplies Section
  renderMedicalSupplies(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.itemPurchased)}</td>
        <td>${this.escapeHtml(item.datePurchased)}</td>
        <td>${this.escapeHtml(item.wasPrescribed)}</td>
        <td>${this.escapeHtml(item.providerName)}</td>
        <td>${this.escapeHtml(item.paidAmount)}</td>
        <td>${this.escapeHtml(item.sellerName)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-supplies" data-section-type="supplies">
        <div class="section-heading">Bandages, Braces or Other Medical Supplies</div>
        <table class="expense-table table-supplies">
          <thead>
            <tr>
              <th>Item Purchased</th>
              <th>Date<br>Purchased</th>
              <th>Was this<br>Prescribed?</th>
              <th>Healthcare Provider Name</th>
              <th>Paid Amount</th>
              <th>Seller's Name</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Parking for Medical Appointments Section
  renderParking(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.facilityAddress)}</td>
        <td>${this.escapeHtml(item.date)}</td>
        <td>${this.escapeHtml(item.paidAmount)}</td>
        <td>${this.escapeHtml(item.meterUsed)}</td>
        <td>${this.escapeHtml(item.meterNumber)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-parking" data-section-type="parking">
        <div class="section-heading">Parking for Medical Appointments</div>
        <table class="expense-table table-parking">
          <thead>
            <tr>
              <th>Address of Healthcare Provider/Medical Facility</th>
              <th>Date</th>
              <th>Paid Amount</th>
              <th>Meter Used?</th>
              <th>Meter Number</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Mileage to Medical Appointments Section
  renderMileage(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.appointmentDate)}</td>
        <td>${this.escapeHtml(item.facilityAddress)}</td>
        <td>${this.escapeHtml(item.workplaceAddress)}</td>
        <td>${this.escapeHtml(item.roundTripKm)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-mileage" data-section-type="mileage">
        <div class="section-heading">Mileage to Medical Appointments</div>
        <div class="section-note">
          The WCB will generally reimburse only those transportation costs which are in excess of costs that would be incurred by the worker while travelling to and from work.
        </div>
        <table class="expense-table table-mileage">
          <thead>
            <tr>
              <th>Appointment Date</th>
              <th>Address of Healthcare Provider/Medical Facility</th>
              <th>Address of Workplace</th>
              <th>Number of km (Round<br>Trip)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Bus or Taxi Fare Section
  renderBusOrTaxi(items) {
    if (!items || items.length === 0) return '';
    const rows = items.map(item => `
      <tr>
        <td>${this.escapeHtml(item.appointmentDate)}</td>
        <td>${this.escapeHtml(item.startingAddress)}</td>
        <td>${this.escapeHtml(item.facilityAddress)}</td>
        <td>${this.escapeHtml(item.mode)}</td>
        <td>${this.escapeHtml(item.totalFare)}</td>
      </tr>
    `).join('');

    return `
      <div class="expense-section section-transit" data-section-type="transit">
        <div class="section-heading">Bus or Taxi Fare for Medical Appointments*</div>
        <div class="section-note">
          *Note: Pre-approval is required from your WCB representative to claim taxi fare(s).
        </div>
        <table class="expense-table table-transit">
          <thead>
            <tr>
              <th>Appointment Date</th>
              <th>Address of Starting Point</th>
              <th>Address of Healthcare Provider/Medical Facility</th>
              <th>Bus or Taxi<br>(indicate<br>one)</th>
              <th>Total Fare<br>Paid</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // Render Privacy Consent Statement
  renderPrivacyConsent(isChecked) {
    return `
      <div class="privacy-consent-block">
        <div class="doc-checkbox ${isChecked ? 'checked' : ''}"></div>
        <div class="privacy-consent-text">
          I understand that the <span class="privacy-link">Privacy Notice</span> applies to the personal information collected in this document.
        </div>
      </div>
    `;
  },

  // Render Standard Page Footer
  renderFooter(data, pageNum, totalPages) {
    return `
      <div class="doc-footer">
        <div class="doc-footer-left">
          Worker App ID: ${this.escapeHtml(data.workerAppId || '')}
        </div>
        <div class="doc-footer-right">
          <div>Submitted: ${this.escapeHtml(data.submittedAt || '')}</div>
          <div class="doc-footer-page-num">Page ${pageNum} of ${totalPages}</div>
        </div>
      </div>
    `;
  },

  /**
   * Smart Pagination Engine:
   * Distributes sections & rows cleanly across page containers,
   * guaranteeing exact layout for standard data while gracefully scaling for 10+ items.
   */
  paginateAndRender(data, targetContainer) {
    targetContainer.innerHTML = '';

    const blocks = [];

    // Header & Claimant Intro
    blocks.push({
      type: 'header',
      html: this.renderHeader(data),
      weight: 180,
      mustBeFirst: true
    });

    if (data.prescriptionDrugs && data.prescriptionDrugs.length > 0) {
      blocks.push({
        type: 'rx',
        html: this.renderPrescriptionDrugs(data.prescriptionDrugs),
        weight: 60 + (data.prescriptionDrugs.length * 28)
      });
    }

    if (data.overTheCounterDrugs && data.overTheCounterDrugs.length > 0) {
      blocks.push({
        type: 'otc',
        html: this.renderOverTheCounterDrugs(data.overTheCounterDrugs),
        weight: 60 + (data.overTheCounterDrugs.length * 28)
      });
    }

    if (data.medicalSupplies && data.medicalSupplies.length > 0) {
      blocks.push({
        type: 'supplies',
        html: this.renderMedicalSupplies(data.medicalSupplies),
        weight: 60 + (data.medicalSupplies.length * 28)
      });
    }

    if (data.parking && data.parking.length > 0) {
      blocks.push({
        type: 'parking',
        html: this.renderParking(data.parking),
        weight: 60 + (data.parking.length * 28)
      });
    }

    if (data.mileage && data.mileage.length > 0) {
      blocks.push({
        type: 'mileage',
        html: this.renderMileage(data.mileage),
        weight: 80 + (data.mileage.length * 30)
      });
    }

    if (data.busOrTaxi && data.busOrTaxi.length > 0) {
      blocks.push({
        type: 'transit',
        html: this.renderBusOrTaxi(data.busOrTaxi),
        weight: 80 + (data.busOrTaxi.length * 30),
        forceNewPageIfExact: true // Standard 2-page document puts Transit on Page 2
      });
    }

    // Consent statement block
    blocks.push({
      type: 'consent',
      html: this.renderPrivacyConsent(data.privacyNoticeAcknowledged !== false),
      weight: 45
    });

    const PAGE_BUDGET_PAGE_1 = 700;
    const PAGE_BUDGET_SUBSEQUENT = 780;

    const pages = [];
    let currentPageBlocks = [];
    let currentWeight = 0;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const isFirstPage = pages.length === 0;
      const budget = isFirstPage ? PAGE_BUDGET_PAGE_1 : PAGE_BUDGET_SUBSEQUENT;

      const shouldBreakForExact = block.forceNewPageIfExact && isFirstPage && blocks.length >= 6;
      const exceedsBudget = (currentWeight + block.weight) > budget;

      if ((shouldBreakForExact || exceedsBudget) && currentPageBlocks.length > 0) {
        pages.push(currentPageBlocks);
        currentPageBlocks = [block];
        currentWeight = block.weight;
      } else {
        currentPageBlocks.push(block);
        currentWeight += block.weight;
      }
    }

    if (currentPageBlocks.length > 0) {
      pages.push(currentPageBlocks);
    }

    const totalPages = pages.length;

    pages.forEach((pageBlocks, index) => {
      const pageNum = index + 1;
      const pageEl = document.createElement('div');
      pageEl.className = `pdf-page expense-report-page page-${pageNum}`;
      pageEl.dataset.pageNumber = pageNum;

      const bodyHtml = pageBlocks.map(b => b.html).join('');
      const footerHtml = this.renderFooter(data, pageNum, totalPages);

      pageEl.innerHTML = `
        <div class="doc-body">
          ${bodyHtml}
        </div>
        ${footerHtml}
      `;

      targetContainer.appendChild(pageEl);
    });

    return totalPages;
  }
};

// Export
if (typeof window !== 'undefined') {
  window.ExpenseRequestRenderer = ExpenseRequestRenderer;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExpenseRequestRenderer;
}
