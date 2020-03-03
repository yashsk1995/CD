/**
 * Created by zeeshan on 7/27/2017.
 */
var _ = require('underscore');
var moment = require('moment');

module.exports = {

  customFieldKeys: {
    customId: 'Custom_ID__c',
    leadProgress: 'Lead_Progress__c',
    fullApplicationUrl: 'Full_Application_URL__c',
    isPaymentAllowed: 'Is_Payment_Allowed__c',
    paymentType: 'Payment_Type__c',
    paymentTransactionId: 'Payment_Transaction_ID__c',
    commercialLoanApplicationId: 'Initial_Commercial_Loan_Application__c',
    propertyType: 'Silver_Hill_Property_Type__c',
    loanPurpose: 'CD_Loan_Purpose__c',
    creditScore: 'CD_Credit_Score_Range__c',
    propertyValue: 'Estimated_Value__c',
    loanAmount: 'Desired_Loan_Amount__c',
    amortization: 'Estimated_Amortized_Term_Years__c',
    interestOnlyMonths: 'CD_IO_Months__c',
    fixedRatePeriod: 'CD_Fixed_Rate_Period__c',
    prepaymentPenalty: 'Proposed_Prepayment_Penalty__c',
    rateBuyDown: 'CD_Rate_Buydown__c',
    paymentDay: 'CD_Payment_Day__c',
    documentation: 'CD_Documentation__c',
    occupancy: 'CD_Occupancy__c',
    piPayment: 'Estimated_P_I_Payment__c',
    estimatedRate: 'Estimated_Rate__c',
    miniAppDate: 'CD_Mini_App_Date__c',
    leadSource: 'CD_Lead_Source__c',
    sourceLead: 'LeadSource',
    leadSourceCampaignCode: 'Lead_Source_Campaign_Code__c',
    keyword: 'Keyword__c',
    adpos: 'Ad_Position__c',
    adContent: 'Ad_Content__c',
    statusNotes: 'Status_Notes__c'
  },

  mapLeadObject: function (user, endUser, loanApplication) {
    var sfConstant = sails.config.sales_force_constants;
    var customFieldKeys = this.customFieldKeys;

    var leadObject = {
      Status: sails.config.sales_force.status,
      Company: sails.config.sales_force.company,
      RecordTypeId: sails.config.sales_force.record_type_id
    };

    if (user) {
      var name = user.name.trim() || '';
      var firstName = name;
      var lastName = "Not Provided";
      var lastNameIndex = firstName.lastIndexOf(" ");
      if (lastNameIndex > 0) {
        firstName = name.substring(0, lastNameIndex);
        lastName = name.substring(lastNameIndex + 1, name.length);
      }

      var userObject = {
        FirstName: firstName,
        LastName: lastName,
        Email: user.email || ''
      };
      _.extend(leadObject, userObject);
    }

    if (endUser) {
      if (endUser.salesForceId) {
        leadObject['Id'] = endUser.salesForceId;
      }
      var endUserObject = {
        Phone: endUser.phoneNumber || '',
        Street: endUser.streetAddressOne || '',
        City: endUser.city || '',
        State: endUser.state || ''
      };
      endUserObject[customFieldKeys.leadProgress] = endUser.progress || '';
      _.extend(leadObject, endUserObject);
    }

    if (loanApplication) {
      leadObject[customFieldKeys.propertyType] = loanApplication.propertyType || '';
      leadObject[customFieldKeys.loanPurpose] = loanApplication.loanType ? sfConstant.loan_types[loanApplication.loanType] : '';
      leadObject[customFieldKeys.creditScore] = loanApplication.creditScore ? sfConstant.credit_score[loanApplication.creditScore] : '';
      leadObject[customFieldKeys.propertyValue] = this._parseCurrency(loanApplication.propertyPrice) || 0;
      leadObject[customFieldKeys.loanAmount] = this._parseCurrency(loanApplication.loanAmount) || 0;
      leadObject[customFieldKeys.amortization] = loanApplication.amortizationTerm || 30;
      leadObject[customFieldKeys.interestOnlyMonths] = loanApplication.interestOnlyPeriodMonths || 0;
      leadObject[customFieldKeys.fixedRatePeriod] = loanApplication.program || 0;
      leadObject[customFieldKeys.prepaymentPenalty] = loanApplication.prepayPenalty ? sfConstant.lead_prepayment_options[loanApplication.prepayPenalty] : '';
      leadObject[customFieldKeys.paymentDay] = loanApplication.paymentDay;
      leadObject[customFieldKeys.occupancy] = loanApplication.propertyOccupancy ? sfConstant.occupancy[loanApplication.propertyOccupancy] : '';

      if (loanApplication.rateBuyDown) {
        leadObject[customFieldKeys.rateBuyDown] = loanApplication.rateBuyDown ? parseFloat(loanApplication.rateBuyDown).toFixed(2) + '%' : 0;
      }
      if (loanApplication.documentation) {
        leadObject[customFieldKeys.documentation] = loanApplication.documentation.trim();
      }

      leadObject[customFieldKeys.miniAppDate] = moment().format('YYYY-MM-DD'); //  NEED TO SAVE CURRENT TIMESTAMP HERE
      leadObject[customFieldKeys.piPayment] = loanApplication.resultingMonthlyPayment;
      leadObject[customFieldKeys.estimatedRate] = loanApplication.resultingRate;
      leadObject[customFieldKeys.leadSource] = loanApplication.utm_campaign ? 'AdWords Campaign' : 'Organic Web';

      if (loanApplication.utm_campaign) {
        leadObject[customFieldKeys.leadSourceCampaignCode] = loanApplication.utm_campaign;
      }
      if (loanApplication.keyword) {
        leadObject[customFieldKeys.keyword] = loanApplication.keyword;
      }
      if (loanApplication.adpos) {
        leadObject[customFieldKeys.adpos] = loanApplication.adpos;
      }
      if (loanApplication.utm_content) {
        leadObject[customFieldKeys.adContent] = loanApplication.utm_content;
      }
      if (loanApplication.source) {
        leadObject[customFieldKeys.sourceLead] = loanApplication.source;
      }
      if(loanApplication.notes) {
        leadObject[customFieldKeys.statusNotes] = loanApplication.notes;
      }
    }

    return leadObject;
  },

  mapLoanApplicationObject: function (loanApplication, docusignStatus) {
    var sfApplication = {};

    var sfConstantMapper = sails.config.sales_force_constants;
    var coBorrowersCount = loanApplication.noOfCoBorrowers || 0;

    if (loanApplication.sfApplicationId) {
      sfApplication = {Id: loanApplication.sfApplicationId};
    }

    if (loanApplication.personalBorrowerInfo) {
      var personalInfo = loanApplication.personalBorrowerInfo;
      var obj = {};
      if (personalInfo.entityInformation == sails.config.app_constants.application_entity_types.Entity) {
        obj = {
          borrower_entity_type__c: sfConstantMapper.entity_types[personalInfo.entityInformation] || '',
          borrower_business_type__c: personalInfo.entityIs || '',
          borrowing_entity_name__c: personalInfo.borrowEntityName || '',
          borrowing_entity_date_formed__c: personalInfo.dateFormed || '',
          borrowing_entity_tax_id__c: personalInfo.taxId || '',
          entity_structure_changing__c: personalInfo.isStructureChange || '',
          entity_structure_description__c: personalInfo.structureChangeDescription || ''
        };

        for (var i = 0; i < personalInfo.individuals && i < 4; i++) {
          if (i == 0) {
            obj['borrower_name__c'] = personalInfo.individuals[i].individualName;
            obj['borrower_ownership_percentage__c'] = personalInfo.individuals[i].ownership;
            obj['borrower_on_title__c'] = personalInfo.individuals[i].onTitle;
          } else {
            obj['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'name__c'] = personalInfo.individuals[i].individualName;
            obj['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'email__c'] = personalInfo.individuals[i].individualEmail;
            obj['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'ownership_percentage__c'] = personalInfo.individuals[i].ownership;
            obj['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'on_title__c'] = personalInfo.individuals[i].onTitle;
          }
        }

      } else if (personalInfo.entityInformation == sails.config.app_constants.application_entity_types.Personal) {
        obj = {
          borrower_entity_type__c: sfConstantMapper.entity_types[personalInfo.entityInformation] || '',
          borrower_name__c: personalInfo.borrowerName || '',
          borrower_social_security__c: personalInfo.socialSecurity || '',
          borrower_date_of_birth__c: personalInfo.dateOfBirth || '',
          borrower_marital_status__c: personalInfo.maritalStatus || '',
          borrower_street__c: personalInfo.address1 || '',
          borrower_street_2__c: personalInfo.address2 || '',
          borrower_city__c: personalInfo.city || '',
          borrower_state__c: personalInfo.state || '',
          borrower_zip_code__c: personalInfo.zipCode || '',
          borrower_phone__c: personalInfo.phoneNumber || '',
          borrower_email__c: personalInfo.emailAddress || ''
        };

        for (var i = 0; i < (personalInfo.coBorrowers ? personalInfo.coBorrowers.length : 0); i++) {
          obj['co_borrower_' + (i != 0 ? (i + 2) + '_' : '') + 'name__c'] = personalInfo.coBorrowers[i].coBorrowerName;
          obj['co_borrower_' + (i != 0 ? (i + 2) + '_' : '') + 'email__c'] = personalInfo.coBorrowers[i].coBorrowerEmail;
          obj['co_borrower_' + (i != 0 ? (i + 2) + '_' : '') + 'street__c'] = personalInfo.coBorrowers[i].coBorrowerAddress;
          obj['co_borrower_' + (i != 0 ? (i + 2) + '_' : '') + 'city__c'] = personalInfo.coBorrowers[i].coBorrowerCity;
          obj['co_borrower_' + (i != 0 ? (i + 2) + '_' : '') + 'state__c'] = personalInfo.coBorrowers[i].coBorrowerState;
        }

      }
      _.extend(sfApplication, obj);
    }

    if (loanApplication.loanRequest) {
      var loanRequest = loanApplication.loanRequest;
      var obj1 = {
        product_line__c: sfConstantMapper.loan_types[loanRequest.loanPurpose] || '',
        occupancy__c: loanRequest.mortgageType || '',
        amortization__c: loanRequest.amortization + ' Years' || '',
        loan_amount__c: loanRequest.loanAmount || '',
        loan_program__c: loanRequest.loanProgram || '',
        prepayment_options__c: sfConstantMapper.prepayment_options[loanRequest.prepaymentType] || '',
        purchase_price__c: loanRequest.purchasePrice || '',
        amount_of_down_payment__c: loanRequest.downPayment || '',

        original_purchase_price__c: loanRequest.originalPurchasePrice || '',
        cost_of_improvements_made__c: loanRequest.improvementCost || '',

        current_lender__c: loanRequest.currentLender || '',
        current_interest_rate_refi__c: loanRequest.interestRate || '',
        monthly_payment_refi__c: loanRequest.monthlyPayment || '',
        pay_off_mortgage_1__c: loanRequest.payoffMortgage || '',
        pay_off_mortgage_2__c: loanRequest.payoffMortgage2 || '',
        pay_off_outstanding_taxes_others__c: loanRequest.payoffOut || '',
        cash_out_refi__c: loanRequest.cashOut || '',
        cash_out_description_refi__c: loanRequest.cashOutDescription || '',
        liens_encumbrances_restrictions__c: loanRequest.additionalLiens || '',
        liens_encumbrances_restrictions_desc__c: loanRequest.additionalLiensDescription || ''
      };
      if (loanRequest.purchaseContract) {
        obj1['purchase_contract_expiration__c'] = loanRequest.purchaseContract;
      }

      if (loanRequest.originalPurchaseDate) {
        obj1['original_purchase_date__c'] = loanRequest.originalPurchaseDate;
      }
      _.extend(sfApplication, obj1);
    }


    if (loanApplication.propertyInfo) {
      var propertyInfo = loanApplication.propertyInfo;
      var obj2 = {
        property_street__c: propertyInfo.propertyAddress || '',
        property_city__c: propertyInfo.propertyCity || '',
        property_state__c: propertyInfo.propertyState || '',
        property_zipcode__c: propertyInfo.propertyZipCode || '',
        year_built__c: propertyInfo.yearBuild || '',
        description_of_subject_property__c: (propertyInfo.propertyDescription || '') + ' \n' + (propertyInfo.propertyFileUrl || ''),
        silver_hill_property_type__c: propertyInfo.commercialType || '',
        does_the_property_have__c: sfConstantMapper.convertArrayToString(propertyInfo.doesHave) || '',
        estimated_value_of_real_estate__c: propertyInfo.estimatedValue || '',
        source_of_value_estimate__c: propertyInfo.estimateSource || '',
        is_owner_occupied__c: propertyInfo.ownerOccupied || '',
        owner_occupancy__c: propertyInfo.ownerPercentage || '',
        years_of_investor_experience__c: propertyInfo.yrsExperience || '',
        number_of_units__c: propertyInfo.numOfUnits || '',
        number_of_units_occupied__c: propertyInfo.numOfUnitsOccupied || '',
        number_of_buildings__c: propertyInfo.numOfBuildings || '',
        building_sq_footage__c: propertyInfo.buildSquareFeet || '',
        land_sq_footage__c: propertyInfo.landSquareFeet || ''
      };
      _.extend(sfApplication, obj2);
    }

    if (loanApplication.businessInfo) {
      var businessInfo = loanApplication.businessInfo;
      var obj3 = {
        business_name__c: businessInfo.businessName || '',
        business_street__c: businessInfo.address || '',
        business_city__c: businessInfo.city || '',
        business_state__c: businessInfo.state || '',
        business_zip__c: businessInfo.zipCode || '',
        years_as_business_owner__c: businessInfo.yearsAsOwner || '',
        business_occupy_subject_property__c: businessInfo.businessOccupy || '',
        business_type__c: businessInfo.businessType || '',
        tax_year_1__c: businessInfo.taxYear1 || '',
        tax_year_1_annual_revenues__c: this._parseCurrency(businessInfo.taxYear1Revenue) || '',
        tax_year_1_annual_expenses__c: this._parseCurrency(businessInfo.taxYear1Expenses) || '',
        tax_year_2__c: businessInfo.taxYear2 || '',
        tax_year_2_annual_revenues__c: this._parseCurrency(businessInfo.taxYear2Revenue) || '',
        tax_year_2_annual_expenses__c: this._parseCurrency(businessInfo.taxYear2Expenses) || '',

      };
      _.extend(sfApplication, obj3);
    }

    if (loanApplication.employmentInfo) {
      var employmentInfo = loanApplication.employmentInfo;
      var obj4 = {
        borrower_self_employed__c: employmentInfo.selfEmployed || '',
        borrower_years_on_the_job__c: employmentInfo.yearsOnJob || '',

      };
      for (var i = 1; i <= coBorrowersCount; i++) {
        obj4['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'self_employed__c'] = employmentInfo['coBorrower' + i + 'SelfEmployed'] || '';
        obj4['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'years_on_the_job__c'] = employmentInfo['coBorrower' + i + 'YearsOnJob'] || '';
      }

      _.extend(sfApplication, obj4);
    }

    if (loanApplication.incomeExpenseInfo) {
      var incomeExpenseInfo = loanApplication.incomeExpenseInfo;
      var obj5 = {
        borrower_total_income__c: incomeExpenseInfo.borrowerTotalIncome || '',
        borrower_total_monthly_housing_expense__c: incomeExpenseInfo.borrowerTotalMonthlyHousing || ''
      };

      for (var i = 1; i <= coBorrowersCount; i++) {
        obj5['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'total_income__c'] = employmentInfo['coBorrower' + i + 'TotalIncome'] || '';
        obj5['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'total_monthly_housing__c'] = employmentInfo['coBorrower' + i + 'TotalMonthlyHousing'] || '';
      }
      _.extend(sfApplication, obj5);
    }

    if (loanApplication.assetsLiabilities) {
      var assetsLiabilities = loanApplication.assetsLiabilities;
      var obj6 = {
        total_assets_borrower_1__c: assetsLiabilities.borrowerTotalAssets || '',
        total_cash_available_borrower_1__c: assetsLiabilities.borrowerTotalCashAvailable || '',
        total_liabilities_borrower_1__c: assetsLiabilities.borrowerTotalLiabilities || '',
        net_worth_borrower_1__c: assetsLiabilities.borrowerNetWorth || ''
      };

      for (var i = 1; i <= coBorrowersCount; i++) {
        obj6['total_assets_co_borrower_' + (i + 1) + '__c'] = employmentInfo['coBorrower' + i + 'TotalAssets'] || '';
        obj6['total_cash_available_co_borrower_' + (i + 1) + '__c'] = employmentInfo['coBorrower' + i + 'TotalCashAvailable'] || '';
        obj6['total_liabilities_co_borrower_' + (i + 1) + '__c'] = employmentInfo['coBorrower' + i + 'TotalLiabilities'] || '';
        obj6['net_worth_co_borrower_' + (i + 1) + '__c'] = employmentInfo['coBorrower' + i + 'NetWorth'] || '';
      }
      _.extend(sfApplication, obj6);
    }

    if (loanApplication.personalDeclarations) {
      var personalDeclarations = loanApplication.personalDeclarations;
      var obj7 = {
        qab1_outstanding_judgements__c: personalDeclarations.anyOutstandingJudgment || '',
        qbb1_bankruptcy__c: personalDeclarations.bankruptcyLast4years || '',
        qcb1_foreclosure__c: personalDeclarations.propertyForeclosed || '',
        qdb1_lawsuit__c: personalDeclarations.partyToLawsuit || '',
        qeb1_obligated_loan_foreclosure__c: personalDeclarations.obligatedAnyLoan || '',
        qfb1_delinquent_default__c: personalDeclarations.delinquentOnAnyLoan || '',
        qgb1_child_support_alimony__c: personalDeclarations.obligatedToPay || '',
        qhb1_primary_housing_residence__c: personalDeclarations.occupyPropertyAsHouse || '',
        qib1_felony_last_10__c: personalDeclarations.convictedLast10Years || '',
        qjb1_citizen__c: personalDeclarations.isUSCitizen || '',
        qkb1_permanent_resident_alien__c: personalDeclarations.isPermanentResident || '',
        visa_status_borrower_1__c: personalDeclarations.borrowerVisaStatus || ''

      };

      for (var i = 1; i <= coBorrowersCount; i++) {
        obj7['qab' + (i + 1) + '_outstanding_judgements__c'] = personalDeclarations['coBorrower' + i + 'AnyOutstandingJudgment'] || '';
        obj7['qbb' + (i + 1) + '_bankruptcy__c'] = personalDeclarations['coBorrower' + i + 'BankruptcyLast4years'] || '';
        obj7['qcb' + (i + 1) + '_foreclosure__c'] = personalDeclarations['coBorrower' + i + 'PropertyForeclosed'] || '';
        obj7['qdb' + (i + 1) + '_lawsuit__c'] = personalDeclarations['coBorrower' + i + 'PartyToLawsuit'] || '';
        obj7['qeb' + (i + 1) + '_obligated_loan_foreclosure__c'] = personalDeclarations['coBorrower' + i + 'ObligatedAnyLoan'] || '';
        obj7['qfb' + (i + 1) + '_delinquent_default__c'] = personalDeclarations['coBorrower' + i + 'DelinquentOnAnyLoan'] || '';
        obj7['qgb' + (i + 1) + '_child_support_alimony__c'] = personalDeclarations['coBorrower' + i + 'ObligatedToPay'] || '';
        obj7['qhb' + (i + 1) + '_primary_housing_residence__c'] = personalDeclarations['coBorrower' + i + 'OccupyPropertyAsHouse'] || '';
        obj7['qib' + (i + 1) + '_felony_last_10__c'] = personalDeclarations['coBorrower' + i + 'ConvictedLast10Years'] || '';
        obj7['qjb' + (i + 1) + '_citizen__c'] = personalDeclarations['coBorrower' + i + 'USCitizen'] || '';
        obj7['qkb' + (i + 1) + '_permanent_resident_alien__c'] = personalDeclarations['coBorrower' + i + 'PermanentResident'] || '';
        obj7['visa_status_co_borrower_' + (i + 1) + '__c'] = personalDeclarations['coBorrower' + i + 'VisaStatus'] || '';
      }
      _.extend(sfApplication, obj7);
    }


    if (loanApplication.businessDeclarations) {
      var businessDeclarations = loanApplication.businessDeclarations;
      var obj8 = {
        ql_business_bankruptcy__c: businessDeclarations.businessBankruptcyLast4Years || '',
        qm_business_lawsuit__c: businessDeclarations.businessPartyToLawsuit || '',
        qn_business_no_federal_debt_default__c: businessDeclarations.neverDefaultedOnDebt || '',
        qo_business_no_property_foreclosure__c: businessDeclarations.noPropertyForeclosedLast4Years || '',
        qp_business_no_license_denial__c: businessDeclarations.neverDeniedLicense || '',
        business_declarations_explanation__c: businessDeclarations.explanation || ''
      };
      _.extend(sfApplication, obj8);
    }


    if (loanApplication.infoForMonitoring) {
      var infoForMonitoring = loanApplication.infoForMonitoring;
      var obj9 = {};
      if (infoForMonitoring.applicantNotProvidingInfo) {
        obj9 = {borrower_personal_information__c: "I do not wish to furnish this information."};
      } else {
        obj9 = {
          borrower_personal_information__c: "I wish to furnish this information.",
          borrower_ethnicity__c: infoForMonitoring.applicantEthnicity || '',
          borrower_race__c: infoForMonitoring.applicantRace || '',
          borrower_sex__c: infoForMonitoring.applicantSex || ''
        };
      }

      for (var i = 1; i <= coBorrowersCount; i++) {
        if (infoForMonitoring['coBorrower' + i + 'NotProvidingInfo']) {
          obj9['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'personal_information__c'] = "I do not wish to furnish this information.";
        } else {
          obj9['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'personal_information__c'] = "I wish to furnish this information.";
          obj9['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'ethnicity__c'] = infoForMonitoring['coBorrower' + i + 'Ethnicity'] || '';
          obj9['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'race__c'] = infoForMonitoring['coBorrower' + i + 'Race'] || '';
          obj9['co_borrower_' + (i != 1 ? (i + 1) + '_' : '') + 'sex__c'] = infoForMonitoring['coBorrower' + i + 'Sex'] || '';
        }
      }
      _.extend(sfApplication, obj9);
    }

    //Docusign Status
    if (docusignStatus) {
      _.extend(sfApplication, this.mapDocusignObject(docusignStatus));
    }

    return sfApplication;
  },

  mapDocusignObject: function (docusignStatus) {
    return {
      docusign_envelope_id__c: docusignStatus.envelopeId,
      borrower_authorization_inquiries__c: docusignStatus.hasBorrowerSigned || false,
      co_borrower_authorization_inquiries__c: docusignStatus.hasCoBorrowerSigned || false,
      co_borrower_3_authorization_inquiries__c: docusignStatus.hasCoBorrower2Signed || false,
      co_borrower_4_authorization_inquiries__c: docusignStatus.hasCoBorrower3Signed || false
    };
  },

  _parseCurrency: function (value) {
    if (value && typeof(value) == 'string') {
      var a = value.replace(/,/g, "");
      var s = parseInt(a);
      return s;
    } else {
      return value;
    }
  }
};
