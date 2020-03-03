var session = require('supertest-session');

describe('Full Application Controller', function () {
  var testSession = null;
  var authenticatedSession;

  beforeEach(function (done) {
    testSession = session(sails.hooks.http.app);
    testSession.post('/login')
      .send({email: 'test_end@user.com', password: 'test123'})
      .expect(200)
      .expect({
        status: 'success',
        message: '',
        error: ''
      })
      .end(function (err) {
        if (err) return done(err);
        authenticatedSession = testSession;
        return done();
      });
  });

  describe('Personal Info', function () {
    it('should render personal info page', function (done) {
      authenticatedSession.get('/application/personal-info')
        .expect(200)
        .expect(/1. Individual or Borrowing Entity Information/, done);
    });

    it('should save personal info ', function (done) {
      this.timeout(2000000);
      authenticatedSession.post('/application/personal-info')
        .send({
          entityInformation: "Entity",
          entityIs: "LLC",
          entityIsOther: "",
          borrowEntityName: "Tkxel",
          dateFormed: "2017-09-11",
          taxId: "12-3123123",
          individualName: ["Jorge", "Washington"],
          individualEmail: ["test@test.com", "test2@test.com"],
          ownership: ["60", "40"],
          onTitle: ["Yes", "No"],
          isStructureChange: "No",
          structureChangeDescription: "",
          progress: "1",
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/loan-request', done);
    });
  });

  describe('Loan Request', function () {
    it('should render loan request page', function (done) {
      authenticatedSession.get('/application/loan-request')
        .expect(200)
        .expect(/2. Loan Request/, done);
    });

    it('should save loan request info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/loan-request')
        .send({
          mortgageType: "Investor",
          loanPurpose: "Refinance",
          amortization: "16",
          loanAmount: "10000",
          requestedInterest: "6",
          loanProgram: "4",
          prepaymentType: "5% for 5 Years",
          purchaseContract: "2000",
          purchasePrice: "3000",
          downPayment: "1500",
          originalPurchaseDate: "28 March 1898",
          originalPurchasePrice: "20000",
          improvementCost: "2000",
          currentLender: "None",
          interestRate: "10",
          monthlyPayment: "25000",
          payoffMortgage: "10000",
          payoffMortgage2: "20000",
          payoffOut: "30000",
          cashOut: "40000",
          cashOutDescription: "none of the description",
          additionalLiens: "yes",
          additionalLiensDescription: "extra liens",
          progress: 1,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/property-info', done);
    });
  });

  describe('Subject Property Information', function () {
    it('should render property info page', function (done) {
      authenticatedSession.get('/application/property-info')
        .expect(200)
        .expect(/3. Subject Property Information/, done);
    });

    it('should save property info', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/property-info')
        .send({
          "isSubmitted": "true",
          "propertyAddress": "Somewhere",
          "propertyCity": "Lahore",
          "propertyState": "AK",
          "propertyZipCode": "54500",
          "yearBuild": "1992",
          "propertyDescription": "This is the escription of a thing",
          "propertyFile": "",
          "propertyFileUrl": "",
          "commercialType": "Mixed-Use Tier I (>=50% res)",
          "doesHave": ["N/A", "Automotive repair uses", "Hazardous material handling/Licensing"],
          "estimatedValue": "32000000",
          "estimateSource": "Appraisal",
          "ownerOccupied": "Yes",
          "ownerPercentage": "23",
          "yrsExperience": "23",
          "numOfUnits": "1234",
          "numOfUnitsOccupied": "1233",
          "numOfBuildings": "22",
          "buildSquareFeet": "123456",
          "landSquareFeet": "12345667",
          "progress": "2"
        })
        .expect(302)
        .expect('location', '/application/business-info', done);
    });
  });

  describe('Business Information', function () {
    it('should render business info page', function (done) {
      authenticatedSession.get('/application/business-info')
        .expect(200)
        .expect(/4. Business Information/, done);
    });

    it('should save business info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/business-info')
        .send({
          businessName: "Zeeshan ",
          address: "260 A Block Gulshan e Ravi Lahore",
          city: "Lahore",
          state: "CT",
          zipCode: "545000",
          yearsAsOwner: "20",
          businessOccupy: "Yes",
          businessType: "LP/LLP",
          taxYear1: "1989",
          taxYear1Revenue: "2000",
          taxYear1Expenses: "1000",
          taxYear1NetIncome: "1000",
          taxYear2: "1990",
          taxYear2Revenue: "3000",
          taxYear2Expenses: "2000",
          taxYear2NetIncome: "1000",
          progress: 3,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/employment-info', done);
    });
  });

  describe('Employment Information', function () {
    it('should render employment info page', function (done) {
      authenticatedSession.get('/application/employment-info')
        .expect(200)
        .expect(/5. Employment Information/, done);
    });

    it('should save employment info', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/employment-info')
        .send({
          selfEmployed: "Yes",
          yearsOnJob: "200",
          coBorrowerSelfEmployed: "No",
          coBorrowerYearsOnJob: "100",
          progress: "4",
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/income-expense-info', done);
    });
  });

  describe('Annual Income And Combined Housing Expense Information', function () {
    it('should render income expense info page', function (done) {
      authenticatedSession.get('/application/income-expense-info')
        .expect(200)
        .expect(/6. Annual Income And Combined Housing Expense Information/, done);
    });

    it('should save loan income expense info', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/income-expense-info')
        .send({
          netAnnualIncome: "2000",
          totalIncome: "4000",
          totalMonthlyHousing: "1000",
          progress: 5,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/assets-liabilities', done);
    });
  });

  describe('Assets Liabilities', function () {
    it('should render assets liabilities page', function (done) {
      authenticatedSession.get('/application/assets-liabilities')
        .expect(200)
        .expect(/7. Assets And Liabilities/, done);
    });

    it('should save assets liabilities info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/assets-liabilities')
        .send({
          totalAssets: "3000",
          totalCashAvailable: "2000",
          totalLiabilities: "1000",
          netWorth: "500",
          progress: 6,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/personal-declarations', done);
    });
  });

  describe('Personal Declarations', function () {
    it('should render personal declaration page', function (done) {
      authenticatedSession.get('/application/personal-declarations')
        .expect(200)
        .expect(/8. Personal Declarations/, done);
    });

    it('should save personal declaration info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/personal-declarations')
        .send({
          anyOutstandingJudgment: "Yes",
          coBorrowerAnyOutstandingJudgment: "No",
          bankruptcyLast4years: "Yes",
          coBorrowerBankruptcyLast4years: "No",
          propertyForeclosed: "No",
          coBorrowerPropertyForeclosed: "Yes",
          partyToLawsuit: "Yes",
          coBorrowerPartyToLawsuit: "No",
          obligatedAnyLoan: "No",
          coBorrowerObligatedAnyLoan: "Yes",
          delinquentOnAnyLoan: "Yes",
          coBorrowerDelinquentOnAnyLoan: "No",
          obligatedToPay: "Yes",
          coBorrowerObligatedToPay: "No",
          occupyPropertyAsHouse: "Yes",
          coBorrowerOccupyPropertyAsHouse: "Yes",
          convictedLast10Years: "No",
          coBorrowerConvictedLast10Years: "No",
          isUSCitizen: "Yes",
          isCoBorrowerUSCitizen: "Yes",
          isPermanentResident: "No",
          isCoBorrowerPermanentResident: "No",
          visaStatus: "visa status is h1",
          progress: 7,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/business-declarations', done);
    });
  });

  describe('Business Declarations', function () {
    it('should render business declaration page', function (done) {
      authenticatedSession.get('/application/business-declarations')
        .expect(200)
        .expect(/9. Business Declarations/, done);
    });

    it('should save business declaration info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/business-declarations')
        .send({
          businessBankruptcyLast4Years: "True",
          businessPartyToLawsuit: "False",
          neverDefaultedOnDebt: "True",
          noPropertyForeclosedLast4Years: "False",
          neverDeniedLicense: "True",
          explanation: "We have documents available to prove",
          progress: "8",
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/general-authorization', done);
    });
  });


  describe('General Authorization', function () {
    it('should render general authorization page', function (done) {
      authenticatedSession.get('/application/general-authorization')
        .expect(200)
        .expect(/10. General Authorization/, done);
    });

    it('should save loan request info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/general-authorization')
        .send({
          progress: 9,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/info-for-monitoring', done);
    });
  });

  describe('Information For Government Monitoring Purposes', function () {
    it('should render info for monitoring page', function (done) {
      authenticatedSession.get('/application/info-for-monitoring')
        .expect(200)
        .expect(/11. Information For Government Monitoring Purposes/, done);
    });

    it('should save business declaration info ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/application/info-for-monitoring')
        .send({
          applicantEthnicity: "Hispanic or Latino",
          applicantRace: "Black or African American",
          applicantSex: "Male",
          coBorrowerEthnicity: "Hispanic or Latino",
          coBorrowerRace: "Black or African American",
          coBorrowerSex: "Female",
          applicantTOS: "Accepted",
          coApplicantTOS: "Accepted",
          progress: 10,
          isSubmitted: true
        })
        .expect(302)
        .expect('location', '/application/review', done);
    });
  });

  describe('Information For Government Monitoring Purposes', function () {
    it('should render info for monitoring page', function (done) {
      authenticatedSession.get('/application/info-for-monitoring')
        .expect(200)
        .expect(/11. Information For Government Monitoring Purposes/, done);
    });

    it('should display full application preview ', function (done) {
      this.timeout(600000);
      authenticatedSession.get('/application/review')
        .expect(200)
        .expect(/Commercial Loan Application/, done);
    });
  });


  describe('Application Completed', function () {
    it('should render application completed page', function (done) {
      authenticatedSession.get('/application/completed')
        .expect(200)
        .expect(/Thank you for submitting your loan application! A loan officer will contact you shortly./, done);
    });
  });

  describe('Application Printing', function () {
    it('should render application print', function (done) {
      authenticatedSession.get('/print/application/1')
        .expect(200)
        .expect(/Commercial Loan Application/, done);
    });
  });

  describe('Application Continue', function () {
    it('should render application print', function (done) {
      authenticatedSession.get('/application')
        .expect(302, done);
    });
  });
});
