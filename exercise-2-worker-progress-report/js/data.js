/**
 * Data definitions and presets for WCB Manitoba PDF Generators
 * Supports both Exercise 1 (Expense Request) and Exercise 2 (Worker Progress Report)
 */

const APP_DATA = {
  // ==========================================
  // EXERCISE 1: Medical & Travel Expense Request
  // ==========================================
  expenseRequest: {
    // Preset 1: Exact byte-for-byte replica of provided Expense Request PDF
    exactPdf: {
      claimantName: "Madeleine Willson",
      claimNo: "20042047",
      workerAppId: "712041",
      submittedAt: "March 28, 2024 20:43",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      prescriptionDrugs: [
        {
          drugName: "Naproxen",
          prescriptionDate: "February 28, 2024",
          datePurchased: "February 29, 2024",
          providerName: "Dr. Best",
          paidAmount: "$20.00"
        }
      ],
      overTheCounterDrugs: [
        {
          drugName: "Advil",
          datePurchased: "March 28, 2024",
          paidAmount: "$8.00",
          sellerName: "Shoppers Drug Mart",
          reason: "Pain"
        }
      ],
      medicalSupplies: [
        {
          itemPurchased: "Tensor",
          datePurchased: "February 28, 2024",
          wasPrescribed: "Yes",
          providerName: "Dr. Best",
          paidAmount: "$10.00",
          sellerName: "Shoppers DrugMart"
        }
      ],
      parking: [
        {
          facilityAddress: "333 St Mary Ave, Winnipeg MB R3C4A5, Canada",
          date: "March 28, 2024",
          paidAmount: "$10.00",
          meterUsed: "yes",
          meterNumber: "12245"
        }
      ],
      mileage: [
        {
          appointmentDate: "March 28, 2024",
          facilityAddress: "HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada",
          workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3,Canada",
          roundTripKm: "20 km"
        }
      ],
      busOrTaxi: [
        {
          appointmentDate: "March 28, 2024",
          startingAddress: "",
          facilityAddress: "HSC Winnipeg Women’s Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada",
          mode: "Bus",
          totalFare: "$3.00"
        },
        {
          appointmentDate: "March 27, 2024",
          startingAddress: "25 Furby St, Winnipeg MB R3C2A2, Canada",
          facilityAddress: "440 Edmonton St, Winnipeg MB R3B 2M4, Canada",
          mode: "Taxi",
          totalFare: "$15.00"
        }
      ],
      privacyNoticeAcknowledged: true
    },

    // Preset 2: Multi-Item Stress Test (10+ items expanding to 3+ pages)
    stressTest: {
      claimantName: "Robert J. Montgomery",
      claimNo: "30089124",
      workerAppId: "894512",
      submittedAt: "April 15, 2024 16:15",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      prescriptionDrugs: [
        { drugName: "Naproxen 500mg", prescriptionDate: "April 01, 2024", datePurchased: "April 02, 2024", providerName: "Dr. Best", paidAmount: "$24.50" },
        { drugName: "Cyclobenzaprine 10mg", prescriptionDate: "April 01, 2024", datePurchased: "April 02, 2024", providerName: "Dr. Best", paidAmount: "$18.75" },
        { drugName: "Tramadol 50mg", prescriptionDate: "April 05, 2024", datePurchased: "April 06, 2024", providerName: "Dr. S. Miller", paidAmount: "$32.00" },
        { drugName: "Gabapentin 300mg", prescriptionDate: "April 10, 2024", datePurchased: "April 11, 2024", providerName: "Dr. K. Patel", paidAmount: "$45.20" },
        { drugName: "Pregabalin 75mg", prescriptionDate: "April 12, 2024", datePurchased: "April 13, 2024", providerName: "Dr. Best", paidAmount: "$38.40" }
      ],
      overTheCounterDrugs: [
        { drugName: "Advil Extra Strength 400mg", datePurchased: "April 03, 2024", paidAmount: "$14.99", sellerName: "Shoppers Drug Mart", reason: "Acute Joint Pain" },
        { drugName: "Tylenol Arthritis 650mg", datePurchased: "April 07, 2024", paidAmount: "$16.49", sellerName: "Rexall Pharmacy", reason: "Morning Stiffness" },
        { drugName: "Voltaren Emulgel Extra Strength", datePurchased: "April 09, 2024", paidAmount: "$21.99", sellerName: "Walmart Pharmacy", reason: "Topical Lower Back Relief" },
        { drugName: "Robaxacet Platinum", datePurchased: "April 12, 2024", paidAmount: "$19.89", sellerName: "Shoppers Drug Mart", reason: "Muscle Spasms" },
        { drugName: "Salonpas Pain Relief Patch (5pk)", datePurchased: "April 14, 2024", paidAmount: "$11.50", sellerName: "Costco Pharmacy", reason: "Shoulder Ache" }
      ],
      medicalSupplies: [
        { itemPurchased: "Lumbar Support Brace", datePurchased: "April 02, 2024", wasPrescribed: "Yes", providerName: "Dr. Best", paidAmount: "$85.00", sellerName: "Winnipeg Orthotics Clinic" },
        { itemPurchased: "Compression Knee Sleeve", datePurchased: "April 04, 2024", wasPrescribed: "Yes", providerName: "Dr. S. Miller", paidAmount: "$35.50", sellerName: "Shoppers Home Health Care" },
        { itemPurchased: "Tensor Bandage (4-inch)", datePurchased: "April 05, 2024", wasPrescribed: "No", providerName: "N/A", paidAmount: "$11.25", sellerName: "Rexall Pharmacy" },
        { itemPurchased: "Reusable Hot/Cold Gel Pack (2x)", datePurchased: "April 08, 2024", wasPrescribed: "Yes", providerName: "Dr. Best", paidAmount: "$22.00", sellerName: "Shoppers Drug Mart" },
        { itemPurchased: "Wrist Immobilizer Splint", datePurchased: "April 11, 2024", wasPrescribed: "Yes", providerName: "Dr. K. Patel", paidAmount: "$42.00", sellerName: "Winnipeg Orthotics Clinic" }
      ],
      parking: [
        { facilityAddress: "333 St Mary Ave, Winnipeg MB R3C4A5, Canada", date: "April 03, 2024", paidAmount: "$12.00", meterUsed: "yes", meterNumber: "12245" },
        { facilityAddress: "HSC Winnipeg, 820 Sherbrook St, Winnipeg MB", date: "April 05, 2024", paidAmount: "$15.00", meterUsed: "no", meterNumber: "Lot B - Ticket #892" },
        { facilityAddress: "Pan Am Clinic, 75 Poseidon Way, Winnipeg MB", date: "April 10, 2024", paidAmount: "$8.50", meterUsed: "yes", meterNumber: "55412" },
        { facilityAddress: "St. Boniface Hospital, 409 Tache Ave, Winnipeg", date: "April 14, 2024", paidAmount: "$14.00", meterUsed: "no", meterNumber: "Parkade #3" }
      ],
      mileage: [
        { appointmentDate: "April 03, 2024", facilityAddress: "HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3,Canada", roundTripKm: "22 km" },
        { appointmentDate: "April 05, 2024", facilityAddress: "Pan Am Clinic, 75 Poseidon Bay, Winnipeg MB R3M 3E4", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3,Canada", roundTripKm: "18.5 km" },
        { appointmentDate: "April 10, 2024", facilityAddress: "St. Boniface Hospital, 409 Tache Ave, Winnipeg MB R2H 2A6", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3,Canada", roundTripKm: "14.2 km" },
        { appointmentDate: "April 14, 2024", facilityAddress: "Concordia Physiotherapy, 1095 Concordia Ave, Winnipeg", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3,Canada", roundTripKm: "28 km" }
      ],
      busOrTaxi: [
        { appointmentDate: "April 03, 2024", startingAddress: "120 Osborne St, Winnipeg MB", facilityAddress: "HSC Women’s Hospital, 665 William Ave, Winnipeg", mode: "Bus", totalFare: "$3.15" },
        { appointmentDate: "April 05, 2024", startingAddress: "120 Osborne St, Winnipeg MB", facilityAddress: "Pan Am Clinic, 75 Poseidon Bay, Winnipeg MB", mode: "Taxi", totalFare: "$22.50" },
        { appointmentDate: "April 10, 2024", startingAddress: "120 Osborne St, Winnipeg MB", facilityAddress: "St. Boniface Hospital, 409 Tache Ave, Winnipeg", mode: "Taxi", totalFare: "$18.00" },
        { appointmentDate: "April 14, 2024", startingAddress: "120 Osborne St, Winnipeg MB", facilityAddress: "Concordia Hospital, 1095 Concordia Ave, Winnipeg", mode: "Taxi", totalFare: "$26.40" }
      ],
      privacyNoticeAcknowledged: true
    },

    // Preset 3: Minimal Single-Item Case
    minimal: {
      claimantName: "Sarah Jenkins",
      claimNo: "10984562",
      workerAppId: "654321",
      submittedAt: "May 02, 2024 10:15",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      prescriptionDrugs: [
        { drugName: "Amoxicillin 500mg", prescriptionDate: "May 01, 2024", datePurchased: "May 01, 2024", providerName: "Dr. Adams", paidAmount: "$15.50" }
      ],
      overTheCounterDrugs: [
        { drugName: "Ibuprofen 200mg", datePurchased: "May 01, 2024", paidAmount: "$7.25", sellerName: "Costco Pharmacy", reason: "Headache" }
      ],
      medicalSupplies: [
        { itemPurchased: "Adhesive Bandages (Box of 50)", datePurchased: "May 01, 2024", wasPrescribed: "No", providerName: "N/A", paidAmount: "$6.50", sellerName: "Walmart" }
      ],
      parking: [
        { facilityAddress: "Winnipeg Clinic, 425 St Mary Ave, Winnipeg MB", date: "May 01, 2024", paidAmount: "$6.00", meterUsed: "yes", meterNumber: "8821" }
      ],
      mileage: [
        { appointmentDate: "May 01, 2024", facilityAddress: "Winnipeg Clinic, 425 St Mary Ave", workplaceAddress: "WCB, 333 Broadway, Winnipeg MB R3C 4W3", roundTripKm: "12 km" }
      ],
      busOrTaxi: [
        { appointmentDate: "May 01, 2024", startingAddress: "Home", facilityAddress: "Winnipeg Clinic, 425 St Mary Ave", mode: "Bus", totalFare: "$3.15" }
      ],
      privacyNoticeAcknowledged: true
    }
  },

  // ==========================================
  // EXERCISE 2: Worker Progress Report (WP)
  // ==========================================
  workerProgressReport: {
    // Preset 1: Exact byte-for-byte replica of provided 3-page Progress Report PDF
    exactPdf: {
      claimantName: "Madeleine Willson",
      claimNo: "20042047",
      formCode: "WP",
      workerAppId: "712041",
      submittedAt: "March 19, 2024 19:21",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      returnToWork: {
        returnStatus: "returned_on_date", // 'not_missed' | 'not_returned' | 'returned_on_date'
        returnedOnDate: "March 15, 2024",
        workingStatus: "modified_reduced", // 'full_regular' | 'full_reduced' | 'modified_regular' | 'modified_reduced' | 'other'
        workingStatusOther: "",
        returnToWorkGoing: "Terrible. Testing Testing",
        expectedReturnDate: "",
        concernsAboutReturning: "",
        lastEmployerContact: "",
        lastEmployerContactDate: ""
      },
      recovery: {
        recoveryStatus: "fully_recovered", // 'not_fully_recovered' | 'fully_recovered'
        recoveryComments: ""
      },
      medicalAndTreatment: {
        painRating: null, // 1 to 10 scale (or null if unrated)
        treatmentStatus: "none", // 'not_continuing' | 'continuing' | 'none'
        medicalProviderType: "",
        lastTreatmentDate: "",
        lastTreatmentProvider: "",
        nextTreatmentDate: "",
        nextTreatmentProvider: "",
        chiroPhysioFrequency: "",
        medicationStatus: "none", // 'not_taking' | 'taking' | 'none'
        prescribedMedicationName: "",
        homeExercisesStatus: "none", // 'not_doing' | 'doing' | 'none'
        homeExercisesList: ""
      },
      otherInformation: {
        additionalComments: "No info Testing Testing"
      },
      declarations: {
        truthCertified: true,
        privacyNoticeAcknowledged: true
      }
    },

    // Preset 2: Fully Completed Active Recovery Progress Report
    stressTest: {
      claimantName: "Arthur Pendelton",
      claimNo: "40092188",
      formCode: "WP",
      workerAppId: "951234",
      submittedAt: "May 10, 2024 14:30",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      returnToWork: {
        returnStatus: "not_returned",
        returnedOnDate: "",
        workingStatus: "other",
        workingStatusOther: "Currently on medical leave pending follow-up MRI results.",
        returnToWorkGoing: "Experiencing intermittent nerve pain upon prolonged sitting.",
        expectedReturnDate: "June 01, 2024",
        concernsAboutReturning: "Concerned about heavy lifting required in warehouse environment. Requested ergonomic assessment.",
        lastEmployerContact: "Janice Miller (HR Supervisor)",
        lastEmployerContactDate: "May 08, 2024"
      },
      recovery: {
        recoveryStatus: "not_fully_recovered",
        recoveryComments: "Range of motion in lumbar spine has improved from 40% to 65% following physical therapy sessions."
      },
      medicalAndTreatment: {
        painRating: 4,
        treatmentStatus: "continuing",
        medicalProviderType: "Physiotherapist & Orthopedic Specialist",
        lastTreatmentDate: "May 06, 2024",
        lastTreatmentProvider: "Pan Am Clinic - Dr. K. Wilson",
        nextTreatmentDate: "May 20, 2024",
        nextTreatmentProvider: "Pan Am Clinic - Dr. K. Wilson",
        chiroPhysioFrequency: "Twice per week",
        medicationStatus: "taking",
        prescribedMedicationName: "Naproxen 500mg twice daily & Baclofen 10mg as needed",
        homeExercisesStatus: "doing",
        homeExercisesList: "Pelvic tilts (3x10), Cat-Cow stretches (2x10), Bird-Dog core stabilization (3x8 each side), Hamstring wall stretches."
      },
      otherInformation: {
        additionalComments: "Physiotherapist provided updated functional capacity evaluation form submitted directly to case manager."
      },
      declarations: {
        truthCertified: true,
        privacyNoticeAcknowledged: true
      }
    },

    // Preset 3: Minimal Unrecovered Scenario
    minimal: {
      claimantName: "Elena Rostova",
      claimNo: "10023489",
      formCode: "WP",
      workerAppId: "442190",
      submittedAt: "June 01, 2024 09:15",
      organization: {
        addressLine1: "333 Broadway",
        addressLine2: "Winnipeg, MB R3C 4W3",
        phone: "Phone: (204) 954-4321",
        tollFree: "Toll Free: 1-855-954-4321",
        website: "wcb.mb.ca"
      },
      returnToWork: {
        returnStatus: "not_missed",
        returnedOnDate: "",
        workingStatus: "full_regular",
        workingStatusOther: "",
        returnToWorkGoing: "Working regular schedule without restrictions.",
        expectedReturnDate: "",
        concernsAboutReturning: "",
        lastEmployerContact: "David Clark",
        lastEmployerContactDate: "May 30, 2024"
      },
      recovery: {
        recoveryStatus: "fully_recovered",
        recoveryComments: "No ongoing symptoms or limitations."
      },
      medicalAndTreatment: {
        painRating: 1,
        treatmentStatus: "not_continuing",
        medicalProviderType: "",
        lastTreatmentDate: "May 25, 2024",
        lastTreatmentProvider: "Dr. Best",
        nextTreatmentDate: "",
        nextTreatmentProvider: "",
        chiroPhysioFrequency: "",
        medicationStatus: "not_taking",
        prescribedMedicationName: "",
        homeExercisesStatus: "not_doing",
        homeExercisesList: ""
      },
      otherInformation: {
        additionalComments: "Claim closed as worker has made complete recovery."
      },
      declarations: {
        truthCertified: true,
        privacyNoticeAcknowledged: true
      }
    }
  }
};

// Export for browser or node
if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_DATA;
}
