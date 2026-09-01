/**
 * Exercise 2: Worker Progress Report (WP) - Document Renderer & Pagination Engine
 */

const ProgressReportRenderer = {
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

  // Generate Page 1 Header with Split Claim Box (Claim No. + WP)
  renderHeader(data) {
    const org = data.organization || {};
    return `
      <div class="doc-header wp-header">
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
          <div class="doc-title wp-title">
            Worker Progress Report
          </div>
          <div class="claim-box-split">
            <span class="claim-num-part">Claim No. ${this.escapeHtml(data.claimNo || '')}</span>
            <span class="claim-badge-part">${this.escapeHtml(data.formCode || 'WP')}</span>
          </div>
        </div>
      </div>
      <div class="claimant-intro">
        ${this.escapeHtml(data.claimantName || 'Madeleine Willson')} provided the following updates in relation to their claim:
      </div>
    `;
  },

  // Section 1: Return to Work
  renderReturnToWork(data) {
    const rtw = data.returnToWork || {};
    const status = rtw.returnStatus || '';
    const working = rtw.workingStatus || '';

    return `
      <div class="wp-section" data-section="rtw">
        <div class="wp-section-title">Return to Work</div>
        
        <!-- Box 1: Select One Return Status -->
        <div class="wp-boxed-group">
          <div class="wp-group-label">Select one:</div>
          <div class="wp-options-row three-col">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${status === 'not_missed' ? 'checked' : ''}"></span>
              <span>I have not missed time from work</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${status === 'not_returned' ? 'checked' : ''}"></span>
              <span>I have not returned to work</span>
            </label>
            <div class="wp-inline-date-group">
              <label class="wp-checkbox-label" style="margin-right: 4px;">
                <span class="doc-checkbox ${status === 'returned_on_date' ? 'checked' : ''}"></span>
                <span>I returned to work on:</span>
              </label>
              <div class="underlined-field-container date-field">
                <span class="underlined-value">${this.escapeHtml(rtw.returnedOnDate || '')}</span>
                <span class="field-sublabel">Date</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Box 2: I am working -->
        <div class="wp-boxed-group">
          <div class="wp-group-label">I am working:</div>
          <div class="wp-options-row four-col">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${working === 'full_regular' ? 'checked' : ''}"></span>
              <span>Full duties, regular hours</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${working === 'full_reduced' ? 'checked' : ''}"></span>
              <span>Full duties, reduced hours</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${working === 'modified_regular' ? 'checked' : ''}"></span>
              <span>Modified duties, regular hours</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${working === 'modified_reduced' ? 'checked' : ''}"></span>
              <span>Modified duties, reduced hours</span>
            </label>
          </div>
          <div class="wp-options-row full-width" style="margin-top: 10px;">
            <label class="wp-checkbox-label" style="min-width: 65px;">
              <span class="doc-checkbox ${working === 'other' ? 'checked' : ''}"></span>
              <span>Other:</span>
            </label>
            <div class="underlined-field-container flex-grow">
              <span class="underlined-value">${this.escapeHtml(rtw.workingStatusOther || '')}</span>
            </div>
          </div>
        </div>

        <!-- Box 3: My return to work is going -->
        <div class="wp-boxed-group single-line-box">
          <div class="wp-group-label">My return to work is going:</div>
          <div class="wp-box-content-text">${this.escapeHtml(rtw.returnToWorkGoing || '')}</div>
        </div>

        <!-- Inline: I expect to return to work on -->
        <div class="wp-inline-row" style="margin: 12px 0;">
          <span>I expect to return to work on:</span>
          <div class="underlined-field-container date-field-lg">
            <span class="underlined-value">${this.escapeHtml(rtw.expectedReturnDate || '')}</span>
            <span class="field-sublabel">Date</span>
          </div>
        </div>

        <!-- Box 4: Concerns about returning to work -->
        <div class="wp-boxed-group multiline-box" style="min-height: 70px;">
          <div class="wp-group-label">I have the following concerns about returning to work:</div>
          <div class="wp-box-content-text">${this.escapeHtml(rtw.concernsAboutReturning || '')}</div>
        </div>

        <!-- Inline: Contact with employer -->
        <div class="wp-inline-row contact-row" style="margin-top: 14px;">
          <span>I was most recently in contact with:</span>
          <div class="underlined-field-container contact-field">
            <span class="underlined-value">${this.escapeHtml(rtw.lastEmployerContact || '')}</span>
            <span class="field-sublabel">(Name of employer contact)</span>
          </div>
          <span style="margin: 0 8px;">on</span>
          <div class="underlined-field-container date-field-md">
            <span class="underlined-value">${this.escapeHtml(rtw.lastEmployerContactDate || '')}</span>
            <span class="field-sublabel">Date</span>
          </div>
        </div>

      </div>
    `;
  },

  // Section 2: Recovery (ends Page 1 in standard document)
  renderRecovery(data) {
    const rec = data.recovery || {};
    const status = rec.recoveryStatus || '';

    return `
      <div class="wp-section" data-section="recovery">
        <div class="wp-section-title">Recovery</div>

        <!-- Box: Select one recovery status -->
        <div class="wp-boxed-group">
          <div class="wp-group-label">Select one:</div>
          <div class="wp-options-row two-col">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${status === 'not_fully_recovered' ? 'checked' : ''}"></span>
              <span>I have not fully recovered from my workplace injury.</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${status === 'fully_recovered' ? 'checked' : ''}"></span>
              <span>I have fully recovered from my workplace injury.</span>
            </label>
          </div>
        </div>

        <!-- Box: Comments about recovery -->
        <div class="wp-boxed-group multiline-box" style="min-height: 65px; margin-top: 12px;">
          <div class="wp-group-label">I have provided the following comments about my recovery:</div>
          <div class="wp-box-content-text">${this.escapeHtml(rec.recoveryComments || '')}</div>
        </div>
      </div>
    `;
  },

  // Section 3: Pain Scale & Medical Treatment (starts Page 2 in standard document)
  renderMedicalAndTreatment(data) {
    const med = data.medicalAndTreatment || {};
    const pain = med.painRating;
    const tStatus = med.treatmentStatus || '';
    const mStatus = med.medicationStatus || '';
    const eStatus = med.homeExercisesStatus || '';

    // Render pain 1-10 scale
    const painCol1 = [1, 2, 3, 4, 5].map(n => `
      <label class="wp-pain-option">
        <span class="doc-checkbox ${pain === n ? 'checked' : ''}"></span>
        <span>${n}</span>
      </label>
    `).join('');

    const painCol2 = [6, 7, 8, 9, 10].map(n => `
      <label class="wp-pain-option">
        <span class="doc-checkbox ${pain === n ? 'checked' : ''}"></span>
        <span>${n}</span>
      </label>
    `).join('');

    return `
      <div class="wp-section" data-section="medical">
        
        <!-- Pain Rating -->
        <div class="wp-pain-rating-block">
          <div class="wp-pain-label">
            I rate my current pain/discomfort on a scale of 1-10, where 1 is no pain and 10 is severe pain out of 10.
          </div>
          <div class="wp-pain-grid">
            <div class="wp-pain-row">${painCol1}</div>
            <div class="wp-pain-row">${painCol2}</div>
          </div>
        </div>

        <!-- Continuing Medical Treatment -->
        <div class="wp-boxed-group" style="margin-top: 14px;">
          <div class="wp-group-label">Select one:</div>
          <div class="wp-options-row two-col align-top">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${tStatus === 'not_continuing' ? 'checked' : ''}"></span>
              <span>I am not continuing to receive medical treatment for my workplace injury.</span>
            </label>
            <div class="wp-inline-treatment-group">
              <label class="wp-checkbox-label" style="align-items: flex-start;">
                <span class="doc-checkbox ${tStatus === 'continuing' ? 'checked' : ''}"></span>
                <span>I am continuing to receive medical treatment for my workplace injury from:</span>
              </label>
              <div class="underlined-field-container flex-grow" style="margin-top: 4px;">
                <span class="underlined-value">${this.escapeHtml(med.medicalProviderType || '')}</span>
                <span class="field-sublabel">(Medical Provider Type)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Last Medical Treatment -->
        <div class="wp-inline-row treatment-history-row" style="margin-top: 14px;">
          <span style="min-width: 175px;">My last medical treatment was</span>
          <div class="underlined-field-container date-field-md">
            <span class="underlined-value">${this.escapeHtml(med.lastTreatmentDate || '')}</span>
            <span class="field-sublabel">Date</span>
          </div>
          <span style="margin: 0 8px;">from</span>
          <div class="underlined-field-container flex-grow">
            <span class="underlined-value">${this.escapeHtml(med.lastTreatmentProvider || '')}</span>
            <span class="field-sublabel">(Medical Provider Name)</span>
          </div>
        </div>

        <!-- Next Medical Treatment -->
        <div class="wp-inline-row treatment-history-row" style="margin-top: 14px;">
          <span style="min-width: 175px;">My next medical treatment is</span>
          <div class="underlined-field-container date-field-md">
            <span class="underlined-value">${this.escapeHtml(med.nextTreatmentDate || '')}</span>
            <span class="field-sublabel">Date</span>
          </div>
          <span style="margin: 0 8px;">from</span>
          <div class="underlined-field-container flex-grow">
            <span class="underlined-value">${this.escapeHtml(med.nextTreatmentProvider || '')}</span>
            <span class="field-sublabel">(Medical Provider Name)</span>
          </div>
        </div>

        <!-- Chiro / Physio Attendance -->
        <div class="wp-inline-row" style="margin-top: 16px;">
          <span>I am attending a Chiropractor or Physiotherapist</span>
          <div class="underlined-field-container flex-grow" style="margin-left: 10px;">
            <span class="underlined-value">${this.escapeHtml(med.chiroPhysioFrequency || '')}</span>
            <span class="field-sublabel">(Frequency)</span>
          </div>
        </div>

        <!-- Medication -->
        <div class="wp-boxed-group" style="margin-top: 16px;">
          <div class="wp-group-label">Select one:</div>
          <div class="wp-options-row two-col align-top">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${mStatus === 'not_taking' ? 'checked' : ''}"></span>
              <span>I am not taking medication for my workplace injury.</span>
            </label>
            <div class="wp-inline-treatment-group">
              <label class="wp-checkbox-label">
                <span class="doc-checkbox ${mStatus === 'taking' ? 'checked' : ''}"></span>
                <span>I am taking medication for my workplace injury:</span>
              </label>
              <div class="underlined-field-container flex-grow" style="margin-top: 4px;">
                <span class="underlined-value">${this.escapeHtml(med.prescribedMedicationName || '')}</span>
                <span class="field-sublabel">(Name of prescribed medication)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Home Exercises -->
        <div class="wp-boxed-group" style="margin-top: 16px;">
          <div class="wp-group-label">Select one:</div>
          <div class="wp-options-row two-col">
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${eStatus === 'not_doing' ? 'checked' : ''}"></span>
              <span>I am not doing home exercises for my workplace injury.</span>
            </label>
            <label class="wp-checkbox-label">
              <span class="doc-checkbox ${eStatus === 'doing' ? 'checked' : ''}"></span>
              <span>I am doing home exercises for my workplace injury.</span>
            </label>
          </div>
        </div>

        <!-- List Exercises -->
        <div class="wp-boxed-group multiline-box" style="min-height: 65px; margin-top: 12px;">
          <div class="wp-group-label">List the exercises you are doing:</div>
          <div class="wp-box-content-text">${this.escapeHtml(med.homeExercisesList || '')}</div>
        </div>

      </div>
    `;
  },

  // Section 4: Other Information
  renderOtherInformation(data) {
    const other = data.otherInformation || {};
    return `
      <div class="wp-section" data-section="other">
        <div class="wp-section-title">Other Information</div>
        <div class="wp-boxed-group single-line-box">
          <div class="wp-group-label">I would like to provide the following additional information about my claim/injury:</div>
          <div class="wp-box-content-text">${this.escapeHtml(other.additionalComments || '')}</div>
        </div>
      </div>
    `;
  },

  // Section 5: Declarations & Certifications (starts Page 3 in standard document)
  renderDeclarations(data) {
    const decl = data.declarations || {};
    const isCertChecked = decl.truthCertified !== false;
    const isPrivacyChecked = decl.privacyNoticeAcknowledged !== false;

    return `
      <div class="wp-section wp-declarations-section" data-section="declarations">
        <div class="wp-declaration-item">
          <div class="doc-checkbox ${isCertChecked ? 'checked' : ''}"></div>
          <div class="wp-declaration-text">
            I certify that the information given on this form is true, correct and complete to the best of my knowledge. I agree to notify the Workers Compensation Board of Manitoba (WCB) immediately once I return to any form of work and/or employment. I understand that it is an offence to knowingly make a false statement to the WCB. I also understand that it is an offence to withhold information from WCB which affects my entitlement to compensation (e.g., full or partial recovery from injury, ability to return to work, sources of additional income, etc.). I understand that refusing to co-operate with, or follow my treatment, may result in the WCB reducing or suspending my benefits.
          </div>
        </div>

        <div class="wp-declaration-item" style="margin-top: 24px;">
          <div class="doc-checkbox ${isPrivacyChecked ? 'checked' : ''}"></div>
          <div class="wp-declaration-text">
            I understand that the <span class="privacy-link">Privacy Notice</span> applies to the personal information collected in this document.
          </div>
        </div>
      </div>
    `;
  },

  // Standard Page Footer
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
   * Smart Dynamic Pagination Engine for Worker Progress Report:
   * Maps sections into standard 3-page layout by default, while dynamically handling
   * content overflows and dynamic additions cleanly.
   */
  paginateAndRender(data, targetContainer) {
    targetContainer.innerHTML = '';

    const blocks = [];

    // Page 1 Header & Intro
    blocks.push({
      type: 'header',
      html: this.renderHeader(data),
      weight: 180,
      mustBeFirst: true
    });

    // Return to Work
    blocks.push({
      type: 'rtw',
      html: this.renderReturnToWork(data),
      weight: 340
    });

    // Recovery
    blocks.push({
      type: 'recovery',
      html: this.renderRecovery(data),
      weight: 180
    });

    // Medical & Treatment (starts Page 2 in standard PDF)
    blocks.push({
      type: 'medical',
      html: this.renderMedicalAndTreatment(data),
      weight: 560,
      forceNewPage: true
    });

    // Other Information (Page 2)
    blocks.push({
      type: 'other',
      html: this.renderOtherInformation(data),
      weight: 120
    });

    // Declarations (Page 3 in standard PDF)
    blocks.push({
      type: 'declarations',
      html: this.renderDeclarations(data),
      weight: 320,
      forceNewPage: true
    });

    const PAGE_BUDGET = 780;
    const pages = [];
    let currentPageBlocks = [];
    let currentWeight = 0;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const exceedsBudget = (currentWeight + block.weight) > PAGE_BUDGET;

      if ((block.forceNewPage || exceedsBudget) && currentPageBlocks.length > 0) {
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
      pageEl.className = `pdf-page progress-report-page page-${pageNum}`;
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
  window.ProgressReportRenderer = ProgressReportRenderer;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressReportRenderer;
}
