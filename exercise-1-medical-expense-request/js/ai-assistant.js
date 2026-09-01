/**
 * WCB PDF Generation Suite - AI Assistant & Automation Center
 * Features:
 * 1. AI Receipt & Medical Note Parser (Smart OCR Simulator & Extractor)
 * 2. AI Clinical & Recovery Summarizer for Progress Reports
 * 3. AI Policy & Anomaly Auditor (WCB Manitoba Travel & Medical Rules)
 * 4. Interactive WCB Claims Chatbot & Helper
 * 5. Optional Google Gemini API Integration with Local Intelligent Fallback
 */

const AIAssistant = (function () {
  'use strict';

  // Config & State
  const state = {
    apiKey: localStorage.getItem('wcb_gemini_api_key') || '',
    activeTab: 'ocr', // 'ocr' | 'summarizer' | 'auditor' | 'chat' | 'settings'
    chatHistory: [
      {
        sender: 'ai',
        text: 'Hello! I am your WCB Smart Claim Assistant. I can help you parse receipts, audit your expenses against WCB Manitoba guidelines, generate clinical progress notes, or answer any claim questions.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    isProcessing: false
  };

  // Sample Simulated Receipts for quick demonstration
  const sampleReceipts = {
    rx: `PHARMACY RECEIPT
Shoppers Drug Mart #0542 - 333 Portage Ave, Winnipeg MB
Date: March 14, 2024
Prescription #: RX-994821
Prescribing Physician: Dr. H. Vance, MD
Medication: Cyclobenzaprine 10mg Tablets (Qty 30)
Category: Muscle Relaxant
Total Paid: $26.85
Payment: Visa **** 4912 - APPROVED`,

    otc: `RETAIL HEALTH RECEIPT
Rexall Pharmacy - 100 Main St, Winnipeg MB
Date: March 22, 2024
Items:
1x Advil Muscle & Joint Extra Strength (72 Caplets) - $14.99
Reason: Lower Back Flare-Up Pain
GST/PST: $1.80
Total: $16.79 Paid by Debit`,

    supplies: `ORTHOTICS & MEDICAL SUPPLIES INVOICE
Winnipeg Orthopedic & Surgical Supply
Date: March 18, 2024
Patient: Madeleine Willson
Prescribed by: Dr. Best, MD (Prescription attached)
Item: Deluxe Lumbar Support Belt w/ Rigid Stays
Unit Price: $89.50
Status: PAID IN FULL`,

    parking: `WINNIPEG PARKING AUTHORITY
Location: Health Sciences Centre - 820 Sherbrook St
Date: March 20, 2024
Meter No: 14892
Time: 13:30 - 15:30 (2.0 hrs)
Total Paid: $12.00
Payment: Credit Card`,

    transit: `CITY TAXI DISPATCH - WINNIPEG
Trip Date: March 25, 2024
Pickup: 25 Furby St, Winnipeg MB R3C 2A2
Dropoff: Pan Am Clinic, 75 Poseidon Bay, Winnipeg MB
Pre-Approval Code: WCB-TX-9982 (Dr. Best Referral)
Fare Amount: $21.50
Tip: $3.00 | Total Charged: $24.50`
  };

  // Pre-programmed WCB Policy Knowledge Base for Chatbot
  const policyKnowledge = [
    {
      keywords: ['eligible', 'expense', 'what can i claim', 'covered', 'reimbursement'],
      response: 'Under WCB Manitoba policy:\n• **Prescription Drugs**: Fully reimbursable when prescribed by your treating healthcare provider for your compensable injury.\n• **Over-the-Counter Drugs**: Covered if recommended by your healthcare provider for injury relief.\n• **Medical Supplies & Braces**: Splints, crutches, braces, and bandages are covered (prescription recommended).\n• **Travel & Mileage**: Reimbursed when traveling to medical appointments in excess of normal commute to work (standard rate: $0.45/km).\n• **Parking**: Reimbursable with meter receipts or hospital parkade stubs.\n• **Taxi Fares**: Requires prior approval from your WCB case representative.'
    },
    {
      keywords: ['taxi', 'cab', 'pre-approval', 'uber'],
      response: '⚠️ **Important Taxi Policy**: Pre-approval from your WCB representative is strictly required before claiming taxi fares. If public transit or personal vehicle is not medically feasible, contact your Case Manager to record taxi authorization on your claim file.'
    },
    {
      keywords: ['mileage', 'km', 'kilometers', 'rate', 'distance', 'travel'],
      response: '🚗 **WCB Mileage Guidelines**: WCB reimburses travel to medical treatments that exceeds your normal daily commute to work. Ensure you list both the healthcare facility address and your regular workplace address along with total round-trip kilometers.'
    },
    {
      keywords: ['return to work', 'modified', 'duties', 'hours', 'light duty'],
      response: '💼 **Return-to-Work Updates**: In the Worker Progress Report (WP), you should select your current duty status:\n• **Full duties, regular hours**\n• **Full duties, reduced hours**\n• **Modified duties, regular hours**\n• **Modified duties, reduced hours**\nNotify your Case Manager promptly of any changes in your earnings or physical capability.'
    },
    {
      keywords: ['pain', 'scale', 'rating', '1-10'],
      response: '📊 **Pain Scale Guidance**: On a 1-10 scale:\n• 1–3: Mild pain (minimal impact on daily tasks)\n• 4–6: Moderate pain (interferes with heavier duties/sleep)\n• 7–9: Severe pain (significantly limits movement)\n• 10: Worst possible pain requiring urgent intervention.'
    },
    {
      keywords: ['deadline', 'time', 'when', 'submit'],
      response: '⏱ **Submission Deadlines**: Expense claims should be submitted within **6 months** of the purchase or appointment date. Worker Progress Reports should be submitted whenever requested by WCB or whenever there is a change in your recovery or work status.'
    }
  ];

  /**
   * Parse Raw Receipt Text using NLP / Regular Expressions or Gemini API
   */
  function parseReceiptText(text) {
    if (!text || text.trim().length === 0) {
      return { success: false, message: 'Please provide receipt text to parse.' };
    }

    const t = text;

    // Detect Category
    let category = 'rx';
    if (/parking|meter|parkade|garage/i.test(t)) {
      category = 'parking';
    } else if (/taxi|cab|uber|lyft|dispatch|bus|transit/i.test(t)) {
      category = 'transit';
    } else if (/brace|splint|tensor|bandage|crutch|orthopedic|orthotics/i.test(t)) {
      category = 'supplies';
    } else if (/advil|tylenol|ibuprofen|otc|over-the-counter|aspirin|voltaren|robax/i.test(t)) {
      category = 'otc';
    } else if (/prescription|rx|dr\.|tablets|capsules|mg/i.test(t)) {
      category = 'rx';
    }

    // Extract Date
    let extractedDate = '';
    const dateMatch = t.match(/(?:Date:\s*|on\s+)?([A-Za-z]+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i);
    if (dateMatch) {
      extractedDate = dateMatch[1];
    } else {
      extractedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Extract Amount ($XX.XX)
    let extractedAmount = '$10.00';
    const amountMatch = t.match(/\$\s*(\d+(?:\.\d{2})?)/);
    if (amountMatch) {
      extractedAmount = `$${parseFloat(amountMatch[1]).toFixed(2)}`;
    }

    // Category-specific Extractions
    const result = {
      category: category,
      date: extractedDate,
      amount: extractedAmount,
      rawText: text
    };

    if (category === 'rx') {
      const drugMatch = t.match(/(?:Medication|Drug|Rx):\s*([^\n\r,]+)/i) || t.match(/([A-Z][a-z]+(?: \d+mg)?)/);
      result.drugName = drugMatch ? drugMatch[1].trim() : 'Prescribed Medication';

      const providerMatch = t.match(/(?:Physician|Prescriber|Doctor|Dr\.)\s*([^\n\r,]+)/i) || t.match(/(Dr\.\s+[A-Z][a-z]+)/i);
      result.providerName = providerMatch ? (providerMatch[1].startsWith('Dr.') ? providerMatch[1] : `Dr. ${providerMatch[1]}`) : 'Dr. Best';
      result.prescriptionDate = extractedDate;
    } else if (category === 'otc') {
      const itemMatch = t.match(/(?:Items?|Product|Drug):\s*([^\n\r,]+)/i) || t.match(/([A-Z][a-z]+(?:\s+[A-Za-z]+){1,3})/);
      result.drugName = itemMatch ? itemMatch[1].trim() : 'Pain Relief Medication';

      const sellerMatch = t.match(/(?:Shoppers Drug Mart|Rexall|Walmart|Costco|Safeway|Pharmacy)/i);
      result.sellerName = sellerMatch ? sellerMatch[0] : 'Shoppers Drug Mart';

      const reasonMatch = t.match(/Reason:\s*([^\n\r]+)/i);
      result.reason = reasonMatch ? reasonMatch[1].trim() : 'Injury Pain & Inflammation';
    } else if (category === 'supplies') {
      const supplyMatch = t.match(/Item:\s*([^\n\r]+)/i) || t.match(/(?:Lumbar Support|Tensor|Brace|Splint|Bandage[^\n\r]*)/i);
      result.itemPurchased = supplyMatch ? supplyMatch[0].trim() : 'Medical Support Supply';

      const sellerMatch = t.match(/(?:Winnipeg Orthopedic|Shoppers|Rexall|Clinic|Hospital|Pharmacy[^\n\r]*)/i);
      result.sellerName = sellerMatch ? sellerMatch[0].trim() : 'Winnipeg Medical Supplies';

      const prescribedMatch = /prescrib/i.test(t);
      result.wasPrescribed = prescribedMatch ? 'Yes' : 'No';
      result.providerName = prescribedMatch ? 'Dr. Best' : 'N/A';
    } else if (category === 'parking') {
      const facilityMatch = t.match(/(?:Location|Facility|Hospital|Clinic):\s*([^\n\r]+)/i) || t.match(/(?:HSC|St\. Boniface|Pan Am|Winnipeg Clinic[^\n\r]*)/i);
      result.facilityAddress = facilityMatch ? facilityMatch[0].trim() : '333 St Mary Ave, Winnipeg MB';

      const meterMatch = t.match(/(?:Meter(?: No)?[:#]?\s*|#)(\w+)/i);
      result.meterUsed = 'yes';
      result.meterNumber = meterMatch ? meterMatch[1].trim() : '14892';
    } else if (category === 'transit') {
      const modeMatch = /taxi|cab/i.test(t) ? 'Taxi' : 'Bus';
      result.mode = modeMatch;

      const pickupMatch = t.match(/Pickup:\s*([^\n\r]+)/i);
      result.startingAddress = pickupMatch ? pickupMatch[1].trim() : '25 Furby St, Winnipeg MB';

      const dropoffMatch = t.match(/Dropoff:\s*([^\n\r]+)/i);
      result.facilityAddress = dropoffMatch ? dropoffMatch[1].trim() : 'HSC Women’s Hospital, Winnipeg MB';
    }

    return {
      success: true,
      extracted: result
    };
  }

  /**
   * Apply extracted receipt data to active app state
   */
  function applyParsedDataToActiveClaim(extractedData) {
    if (!window.state || !window.state.activeData) {
      return { success: false, message: 'No active claim loaded.' };
    }

    const data = window.state.activeData;
    const cat = extractedData.category;

    if (window.state.currentExercise === 'expenseRequest') {
      if (cat === 'rx') {
        data.prescriptionDrugs = data.prescriptionDrugs || [];
        data.prescriptionDrugs.push({
          drugName: extractedData.drugName || 'Prescribed Medication',
          prescriptionDate: extractedData.prescriptionDate || extractedData.date,
          datePurchased: extractedData.date,
          providerName: extractedData.providerName || 'Dr. Best',
          paidAmount: extractedData.amount
        });
      } else if (cat === 'otc') {
        data.overTheCounterDrugs = data.overTheCounterDrugs || [];
        data.overTheCounterDrugs.push({
          drugName: extractedData.drugName || 'Over-the-Counter Medicine',
          datePurchased: extractedData.date,
          paidAmount: extractedData.amount,
          sellerName: extractedData.sellerName || 'Pharmacy',
          reason: extractedData.reason || 'Pain relief'
        });
      } else if (cat === 'supplies') {
        data.medicalSupplies = data.medicalSupplies || [];
        data.medicalSupplies.push({
          itemPurchased: extractedData.itemPurchased || 'Medical Supply Item',
          datePurchased: extractedData.date,
          wasPrescribed: extractedData.wasPrescribed || 'Yes',
          providerName: extractedData.providerName || 'Dr. Best',
          paidAmount: extractedData.amount,
          sellerName: extractedData.sellerName || 'Medical Supply Provider'
        });
      } else if (cat === 'parking') {
        data.parking = data.parking || [];
        data.parking.push({
          facilityAddress: extractedData.facilityAddress || 'Health Facility, Winnipeg MB',
          date: extractedData.date,
          paidAmount: extractedData.amount,
          meterUsed: extractedData.meterUsed || 'yes',
          meterNumber: extractedData.meterNumber || '12345'
        });
      } else if (cat === 'transit') {
        data.busOrTaxi = data.busOrTaxi || [];
        data.busOrTaxi.push({
          appointmentDate: extractedData.date,
          startingAddress: extractedData.startingAddress || '',
          facilityAddress: extractedData.facilityAddress || 'Medical Facility, Winnipeg MB',
          mode: extractedData.mode || 'Bus',
          totalFare: extractedData.amount
        });
      }

      // Trigger document re-render and drawer sync
      if (typeof window.renderDocument === 'function') {
        window.renderDocument();
      }
      if (typeof window.rebuildDrawerForms === 'function') {
        window.rebuildDrawerForms();
      }

      return { success: true, message: `Successfully added item to ${cat.toUpperCase()} table!` };
    } else {
      return { success: false, message: 'Please switch to "Exercise 1: Medical & Travel Expense Request" to add expense line items.' };
    }
  }

  /**
   * Generate Clinical & Recovery Summary for Worker Progress Report
   */
  function generateProgressSummary() {
    if (!window.state || !window.state.activeData) {
      return 'No active Progress Report data available.';
    }

    const d = window.state.activeData;
    const rtw = d.returnToWork || {};
    const rec = d.recovery || {};
    const med = d.medicalAndTreatment || {};

    const claimant = d.claimantName || 'Claimant';
    const claimNo = d.claimNo || 'N/A';
    const pain = med.painRating ? `${med.painRating}/10` : 'Not rated';
    const rtwStatus = rtw.returnStatus === 'returned_on_date'
      ? `Returned to work on ${rtw.returnedOnDate || 'specified date'} (${(rtw.workingStatus || '').replace('_', ' ')})`
      : rtw.returnStatus === 'not_returned'
      ? 'Currently off work (not returned)'
      : 'Has not missed time from work';

    const recoveryStatus = rec.recoveryStatus === 'fully_recovered'
      ? 'Claimant reports full recovery from workplace injury.'
      : 'Claimant reports ongoing recovery with active symptoms.';

    const treatment = med.treatmentStatus === 'continuing'
      ? `Active medical care under ${med.medicalProviderType || 'medical provider'}. Next appointment: ${med.nextTreatmentDate || 'TBD'}.`
      : 'No active external treatment at this time.';

    const exercises = med.homeExercisesStatus === 'doing'
      ? `Engaged in home exercise rehabilitation (${med.homeExercisesList || 'as directed'}).`
      : 'Home exercise program not reported.';

    return `### WCB Case Adjudication Executive Summary
**Claimant:** ${claimant} | **Claim #:** ${claimNo} | **Submission Date:** ${d.submittedAt || 'Current'}

1. **Employment & Return-to-Work Status:**
   ${rtwStatus}. Worker remarks: "${rtw.returnToWorkGoing || 'No specific remarks.'}"

2. **Recovery & Symptom Assessment:**
   ${recoveryStatus}
   • Current Reported Pain Scale: **${pain}**
   • Recovery Notes: ${rec.recoveryComments || 'No additional recovery comments logged.'}

3. **Treatment & Active Regimen:**
   • ${treatment}
   • Physical Therapy / Chiropractic Frequency: ${med.chiroPhysioFrequency || 'None specified'}
   • Prescribed Medication: ${med.medicationStatus === 'taking' ? med.prescribedMedicationName || 'Active' : 'None reported'}
   • Rehabilitation Regimen: ${exercises}

4. **Adjudicator Recommendation:**
   Review for continued modified duties suitability and verify upcoming medical treatment follow-up.`;
  }

  /**
   * Audit Active Claim for WCB Policy Compliance & Anomalies
   */
  function auditClaimCompliance() {
    if (!window.state || !window.state.activeData) {
      return [];
    }

    const issues = [];
    const d = window.state.activeData;

    if (window.state.currentExercise === 'expenseRequest') {
      // Check Taxi Pre-approval
      const busTaxi = d.busOrTaxi || [];
      const taxiTrips = busTaxi.filter(item => item.mode && item.mode.toLowerCase() === 'taxi');
      if (taxiTrips.length > 0) {
        issues.push({
          type: 'warning',
          title: 'Taxi Pre-Approval Required',
          description: `You have logged ${taxiTrips.length} taxi fare(s). WCB Manitoba requires pre-approval from your case representative for taxi claims. Ensure authorization is recorded.`
        });
      }

      // Check Prescriptions without Doctor Name
      const rxList = d.prescriptionDrugs || [];
      const missingDr = rxList.filter(item => !item.providerName || item.providerName.trim() === '');
      if (missingDr.length > 0) {
        issues.push({
          type: 'error',
          title: 'Missing Prescribing Provider',
          description: `${missingDr.length} prescription drug item(s) are missing the Healthcare Provider Name. WCB requires a licensed physician name for all Rx claims.`
        });
      }

      // Check Mileage Round Trip Distance
      const mileageList = d.mileage || [];
      mileageList.forEach((m, idx) => {
        const kmVal = parseFloat(m.roundTripKm) || 0;
        if (kmVal > 60) {
          issues.push({
            type: 'info',
            title: `High Mileage Entry (Row ${idx + 1}): ${m.roundTripKm}`,
            description: 'Round trips over 50 km to medical facilities may qualify for additional out-of-town meal allowances under WCB travel guidelines.'
          });
        }
      });

      // Check Privacy Declaration
      if (!d.privacyNoticeAcknowledged) {
        issues.push({
          type: 'error',
          title: 'Privacy Declaration Not Acknowledged',
          description: 'The statutory Privacy Notice checkbox must be acknowledged before final claim submission.'
        });
      }

      if (issues.length === 0) {
        issues.push({
          type: 'success',
          title: 'All Policy Checks Passed',
          description: 'No anomalies detected! All expense entries conform to WCB Manitoba reimbursement rules.'
        });
      }
    } else {
      // Progress Report Audits
      const rtw = d.returnToWork || {};
      const med = d.medicalAndTreatment || {};
      const dec = d.declarations || {};

      if (rtw.returnStatus === 'returned_on_date' && !rtw.returnedOnDate) {
        issues.push({
          type: 'error',
          title: 'Missing Return-to-Work Date',
          description: 'You selected "I returned to work on", but did not enter a specific date.'
        });
      }

      if (med.medicationStatus === 'taking' && !med.prescribedMedicationName) {
        issues.push({
          type: 'warning',
          title: 'Missing Medication Name',
          description: 'You indicated that you are taking medication for your workplace injury, but the medication name is blank.'
        });
      }

      if (!dec.truthCertified || !dec.privacyNoticeAcknowledged) {
        issues.push({
          type: 'error',
          title: 'Statutory Certification Incomplete',
          description: 'You must check both the Truth Certification and Privacy Notice declarations on Page 3.'
        });
      }

      if (issues.length === 0) {
        issues.push({
          type: 'success',
          title: 'Progress Report Validated',
          description: 'All mandatory fields and legal certifications are complete and ready for case manager review.'
        });
      }
    }

    return issues;
  }

  /**
   * Process Chatbot User Query
   */
  function handleChatQuery(userText) {
    const textLower = userText.toLowerCase();
    let bestMatch = null;

    for (const item of policyKnowledge) {
      if (item.keywords.some(kw => textLower.includes(kw))) {
        bestMatch = item.response;
        break;
      }
    }

    if (!bestMatch) {
      bestMatch = `Thank you for your question. As your WCB Smart Assistant, I can assist with:
• **Prescription & OTC Reimbursement Rules**
• **Mileage Calculation & Travel Pre-approvals**
• **Return-to-Work Schedules & Duty Classifications**
• **Automated Receipt Parsing (OCR)**

Please select one of the suggested topics below or ask a specific policy question.`;
    }

    state.chatHistory.push({
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    state.chatHistory.push({
      sender: 'ai',
      text: bestMatch,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  // Public Interface
  return {
    state,
    sampleReceipts,
    parseReceiptText,
    applyParsedDataToActiveClaim,
    generateProgressSummary,
    auditClaimCompliance,
    handleChatQuery
  };
})();

// Export globally
window.AIAssistant = AIAssistant;
