/**
 * CustomLoanController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');

const loanAppTypes = {
  miniApp : 'miniApp',
  miniAppSimple: 'miniAppSimple',
  loanApp: 'loanApp'
};

module.exports = {
  renderCalculator: next(function*(req, res) {
    var source = req.originalUrl;
    if(req.user && req.user.type == sails.config.app_constants.user_types.end_user) {
      var endUser = yield EndUserService.findById(req.user.endUser);
      if (endUser) {
        if(endUser.progress === sails.config.app_constants.user_progress.miniApp) {
          var loanApp = yield LoanApplicationService.getByEndUser(req.user.endUser);

          if (loanApp && sails.config.app_constants.propertyTypesSpecial.includes(loanApp.propertyType)) {
            delete loanApp.propertyType;
          }

          if (loanApp && loanApp.creditScore == "Don't know") {
            delete loanApp.creditScore;
          }

          yield this._renderCalculator(res, 'advance', loanApp, {}, {}, {}, source)
        } else {
          res.redirect('/continue');
        }
      } else {
        yield this._renderCalculator(res, 'advance', {}, {}, {}, {}, source)
      }
    } else {
      return yield this._renderCalculator(res, 'advance', {}, {}, {}, {}, source);
    }
  }),

  calculateQuick: next(function* (req, res) {
    var reqLoan = req.allParams();
    reqLoan.source = reqLoan.source || 'Loan Customizer';
    var loanApp = yield LoanApplicationService.createOrUpdate(reqLoan);
    reqLoan.id = loanApp.id;
    try {
      yield LoanCalculatorService.calculateBasic(reqLoan);
      return yield this._renderCalculator(res, 'quick', reqLoan, {}, {}, {}, '');
    } catch (err) {
      return yield this._renderCalculator(res, 'quick', reqLoan, {}, err, {}, '');
    }
  }),

  calculateAdvance: next(function* (req, res) {
	   
    var reqLoanApp = req.allParams();
    reqLoanApp.source = reqLoanApp.source || 'Loan Customizer';
    var loanApp = yield LoanApplicationService.createOrUpdate(reqLoanApp);
    reqLoanApp.id = loanApp.id;
    try {
      var result = yield LoanCalculatorService.calculateBasic(reqLoanApp);
      _.extend(reqLoanApp, result);
      yield LoanApplicationService.createOrUpdate(reqLoanApp);
      return yield this._renderCalculator(res, 'quick', reqLoanApp, result, {}, {}, '');
    } catch (err) {
      return yield this._renderCalculator(res, 'quick', reqLoanApp, {}, err, {}, '');
    }
  }),

  saveExistingLoanApp: next(function* (req, res) {
    var loanId = req.param('id');
    var loanApp = yield LoanApplicationService.getById(loanId);
    if (loanApp) {
      if(req.user) {
        var endUserId = req.user.endUser;
        var endUser = yield EndUserService.findById(endUserId);
        if (endUser) {
          endUser.progress = sails.config.app_constants.user_progress.completedCalculator;
          var salesForceId = yield SalesForceService.createOrUpdateLead(req.user, endUser, loanApp);
          endUser.salesForceId = salesForceId;
          yield EndUserService.update(endUser.id, endUser);
          loanApp.endUser = endUser.id;
          yield LoanApplicationService.update(loanApp.id, loanApp);

          var redirectAt = loanApp.propertyType == 'Investor Fix & Flip' ? '/application-investorflip': '/quick-application';
          return res.redirect(redirectAt);
        } else {
          return yield this._renderCalculator(res, 'advance', loanApp, {}, {message: 'User not found.'}, {}, '');
        }
      } else {
        return yield this._renderCalculator(res, 'advance', loanApp, {}, {message: 'Please login to continue.'}, {}, '');
      }
    } else {
      return yield this._renderCalculator(res, 'advance', {}, {}, {message: 'unable to find loan application.'}, {}, '');
    }
  }),

  saveLoanApplication: next(function* (req, res) {
    var params = req.allParams();
    var {id, email, name, phoneNumber} = params;
    var loanApp = yield LoanApplicationService.getById(id);
    if (loanApp) {
      var marketingFields = _.omit(params, ['id', 'email', 'name', 'phoneNumber']);
      _.extend(loanApp, marketingFields);
      var user = yield UserService.findByEmail(email);
      if (!user) {
        var progress = sails.config.app_constants.user_progress.completedCalculator;
        var result = yield this._createLeadAndEndUser(name, email, phoneNumber, progress, loanApp, loanAppTypes.loanApp);
        loanApp.endUser = result.endUser.id;
        yield LoanApplicationService.createOrUpdate(loanApp);
        if (!req.user || req.user.type != sails.config.app_constants.user_types.end_user){
          yield this._loginUser(req, result.user);
        }

        var redirectAt = loanApp.propertyType == 'Investor Fix & Flip' ? '/application-investorflip': '/quick-application';
        return res.redirect(redirectAt);
      } else {
        var result = {
          resultingRate: loanApp.resultingRate,
          resultingMonthlyPayment: loanApp.resultingMonthlyPayment,
          resultingMonthlyIOPayment: loanApp.resultingMonthlyIOPayment
        };
        var modal = {
          isShow: true,
          message: 'You already have an account with us. Please enter your information to continue with your previous application.',
          error: {}
        };
        return yield this._renderCalculator(res, 'advance', loanApp, result, {}, modal);
      }
    } else{
      return yield this._renderCalculator(res, 'advance', {}, {}, {message: 'unable to find loan application.'}, {}, '');
    }
  }),

  saveMiniApp: next(function*(req, res) {
    var params = req.allParams();
    var {email, firstName, lastName, phoneNumber} = params;
    var user = yield UserService.findByEmail(email);
    if (user) {
      return void res.json({
        status: 'error',
        message: "The user already exists. Please Login to continue your app"
      });
    } else {
      var loanApp = _.omit(params, ['firstName', 'lastName', 'email', 'phoneNumber']);
      loanApp['source'] = 'Mini-App';
      var name = firstName + ' ' + lastName;
      var response = yield this._createLeadAndEndUser(name, email, phoneNumber, sails.config.app_constants.user_progress.miniApp, loanApp, loanAppTypes.miniApp);
      loanApp['endUser'] = response.endUser.id;
      yield LoanApplicationService.createOrUpdate(loanApp);
      yield this._loginUser(req, response.user);
      return void res.json({
        status:'success',
        message: ''
      });
    }
  }),

  saveMiniAppSimple: next(function*(req, res) {
    var params = req.allParams();
    var {email, firstName, lastName, phoneNumber, page} = params;
    var user = yield UserService.findByEmail(email);
    if (user) {
      var endUser = yield EndUserService.findById(user.endUser);
      var loanApp = yield LoanApplicationService.getByEndUser(user.endUser);
      if (!loanApp) {
        loanApp = {};
      }
      loanApp.notes = 'User has downloaded file for Landing Page';
      try {
        var sfId = yield SalesForceService.createOrUpdateLead(user, endUser, loanApp);
        endUser.salesForceId = sfId;
        yield EndUserService.update(endUser.id, endUser);
      } catch(exception) {
        console.log('Error:', exception);
      }

     // yield EmailService.sendLeadConfirmSimple(user.name, user.email, phoneNumber, page);

      return void res.json({message: 'A loan officer will contact you shortly. Where should we go next?'});
    } else {
      try {
        var loanApp = _.omit(params, ['firstName', 'lastName', 'email', 'phoneNumber']);
        loanApp['source'] = 'Mini-App';
        var name = firstName + ' ' + lastName;
        yield this._createLeadAndEndUser(name, email, phoneNumber, sails.config.app_constants.user_progress.miniApp, loanApp, loanAppTypes.miniAppSimple, page);
      }catch(exception) {
        console.log('Error:', exception);
      }

      return void res.json({message: 'You can download your file here. Then be sure visit our blog page for additional commercial mortgage tips and resources.'});
    }
  }),

  _renderCalculator: function* (res, type, loan, result, error, modal, source) {
    var content = yield StaticContentService.getByType(sails.config.app_constants.staticContentType.loan_customizer);
    var loanLookup = yield ConfigService.getByKey(sails.config.app_constants.configs.loanLookup);

    return res.view('loan_calculator', {
      states: sails.config.app_constants.lendingStates,
      loanTypes: sails.config.app_constants.loanTypes,
      propertyTypes: sails.config.app_constants.propertyTypes,
      chooseWithin: sails.config.app_constants.chooseWithin,
      creditScores: sails.config.app_constants.creditScore,
      loanLookup: loanLookup,
      content: content,
      type: type,
      loan: loan || {},
      result: result || {},
      loginModal: modal,
      error: error,
      sourceUrl: source,
      locals: {
        pageTitle: "Commercial Direct - Loan Customizer"
      }
    });
  },

  _createLeadAndEndUser: function* (name, email, phoneNumber, progress, loanApp, loanType, page) {
    var password = Math.random().toString(36).slice(2);
    if (sails.config.environment == 'development'
      || sails.config.environment == 'test') {
      password = 'zee123';
    }
    var reqUser = {
      name: name,
      email: email,
      password: password,
      type: sails.config.app_constants.user_types.end_user
    };
    var reqEndUser = {
      phoneNumber: phoneNumber,
      progress: progress
    }
    var saleForceId = yield SalesForceService.createOrUpdateLead(reqUser, reqEndUser, loanApp);
    reqEndUser['salesForceId'] = saleForceId;
    var newEndUser = yield EndUserService.create(reqEndUser);
    reqUser['endUser'] = newEndUser;
    var newUser = yield UserService.create(reqUser);
    if(loanType === loanAppTypes.miniAppSimple) {
      //yield EmailService.sendWelcomeEmailMiniAppSimple(newUser, password);
     // yield EmailService.sendLeadConfirmSimple(name, email, phoneNumber, page);
    } else {
     // yield EmailService.sendWelcomeEmail(newUser, password);
     // yield EmailService.sendLeadConfirm(newUser, phoneNumber, loanApp);
    }
    return {
      user: newUser,
      endUser: newEndUser
    };
  },

  _loginUser: function (req, user) {
    return new Promise(function (resolve, reject) {
      req.logIn(user, function (err, response) {
        if (err) {
          return reject({message: 'Unable to Login'});
        }
        return resolve(response);
      });
    });
  },

  silverQualifier: next(function* (req, res) {
    var sales_reps = yield ConfigService.getByKey(sails.config.app_constants.configs.salesReps);
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    var ltvAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.ltvAdjustments);
    var rateAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.rateAdjustments);

    var allParams = req.allParams();
    if(allParams.hasOwnProperty('prepay_buydown1')){
      allParams['prepay_buydown'] = allParams['prepay_buydown1'];
    }
    
    // allParams['downloadtermsheet'] = 1;
    
    if(req.session.authenticated){
      res.locals.layout = 'new/homelayout';
      res.view('new/pages/silverqualifierpage', {
        sales_reps: sales_reps,
        lists: lists,
        ltvAdjustments: ltvAdjustments,
        rateAdjustments: rateAdjustments,
        params: allParams,
        noResult: '',
        values: [],
        results_30: [],
        results_25: [],
        results_20: [],
        results_15: [],
        isAuthenticated: req.session.authenticated ? true : false,
        calcsubmit_id: -1,
        post_valid: false,
        errors: []
      });
    }
    else{
      res.redirect('/login');
    }
    
  }),

  silverQualifierCalculate: next(function* (req, res){

    if(!req.session.authenticated){
      res.redirect('/login');
      return;
    }

    var sales_reps = yield ConfigService.getByKey(sails.config.app_constants.configs.salesReps);
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    var ltvAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.ltvAdjustments);
    var rateAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.rateAdjustments);
    var loanLookup = yield ConfigService.getByKey(sails.config.app_constants.configs.loanLookup);
    var customRate = yield ConfigService.getByKey(sails.config.app_constants.configs.customRate);

    var options = {
      sales_reps: sales_reps,
      lists: lists,
      ltvAdjustments: ltvAdjustments,
      rateAdjustments: rateAdjustments,
      loanLookup: loanLookup,
      customRate: customRate
    }


    var allParams = req.allParams();
    if(allParams.hasOwnProperty('prepay_buydown1')){
      allParams['prepay_buydown'] = allParams['prepay_buydown1'];
    }

    var pdf = null;
		var max_30year_ltv_error_show = false;

		var results_30 = [];
		var results_25 = [];
		var results_20 = [];
    var results_15 = [];
    var values;
    var post_valid;
    var errors = [];

		if ( allParams.length != 0){
			values = Bayview_Mortgage_Calculator_Calculations.get_mortgage_calculator_submitted_values( allParams, options );
			post_valid = true;
		} else {
			values = Bayview_Mortgage_Calculator_Calculations.get_mortgage_calculator_submitted_values( [], options );
			post_valid = false;
    }
    
		var prepay_buydown = values['prepay_buydown'];
		var purpose = values['purpose'];
    var loan_amount = values['loan_amount'];
    var noResult = false;

		// $errors = Bayview_Mortgage_Calculator_Errors::errors()->get_error_messages();

    console.log('values:', values);
    var calcsubmit_id = -1;
    
		if ( post_valid ) {
			// self::verify_table_exist( $values );

			var ltv_state_reduction = values['ltv_state_reduction'];
			var ltv = values['ltv_value'];
			var property_type = values['property_type_value'];

			/* Check 30 year conditions */
      var max_30year_ltv = parseFloat(ltvAdjustments['max_30year_ltv'][property_type] - ltv_state_reduction);
      
			var show_30year = ( ltv <= max_30year_ltv );
			var max_30year_ltv_error = 'LTV value out of range. Max LTV for 30 Year Amortization is ' + ( max_30year_ltv * 100 ) + '%';
      var max_30year_ltv_error_show = ! show_30year;
      
      if(max_30year_ltv_error_show){
        errors.push({
          code: 'max_30year_ltv_error_show',
          message: max_30year_ltv_error
        });
      }
		
		if(values['loan_amount']>300000 && values['documentation']=='No Doc') {
			var max_loan_amount_no_doc_error='For No-Doc loan type, loan amount must be $300k or less';
			errors.push({
          code: 'max_loan_amount_no_doc_error',
          message: max_loan_amount_no_doc_error
			});
			
		}
		
			if ( show_30year ) {
				results_30 = Bayview_Mortgage_Calculator_Calculations.loan_table( values, 30, options );
			}
			results_25 = Bayview_Mortgage_Calculator_Calculations.loan_table( values, 25, options );
			results_20 = Bayview_Mortgage_Calculator_Calculations.loan_table( values, 20, options );
			results_15 = [];

			if ( !post_valid && results_30.length == 0 && results_25.length == 0 && results_20.lenght == 0 && results_15.length == 0) {
        // $this->add_error( 'no_results_returned', 'No results returned' );
        noResult = true;
			}

		// 	if ( empty( $values['last_submit_id'] ) ) {
		// 		$values['last_submit_id'] = self::store_calculator_submit_values( $values );
		// 	} elseif ( ! empty( $values['bvmc_term_sheet_nonce'] ) ) {
			
			
		// 		$pdf = new Bayview_Mortgage_Calculator_Pdf( $values, self::get_submit_term_sheet_name( $values['last_submit_id'] ) );
			
		// 		$pdf->save();
	
		// 		self::update_calculator_submit_values(
		// 			array(
		// 				'id'              => $values['last_submit_id'],
		// 				'propertyaddress' => $values['propertyaddress'],
		// 				'borrower'        => $values['borrower'],
		// 				'guarntor'        => $values['guarantor'],
		// 				'brokerfee'       => $values['brokerfee'],
		// 				'ltv'             => $values['ltv'],
		// 				'programe'        => $values['programe'],
		// 				'rate'            => $values['rate'],
		// 				'mopayment'       => $values['est'],
		// 				'term_sheet_name' => $pdf->get_basename(),
		// 			)
		// 		);
    // 	}

      if(!allParams.hasOwnProperty('downloadtermsheet')){
        var calcsubmit = yield CalculatorSubmitService.create({
          ltv: values['ltv'],
          loan_amount: values['loan_amount'],
          property_value: values['property_value'],
          occupancy: values['occupancy'],
          documentation: values['documentation'],
          property_state: values['state'],
          average_middle_credit_score: values['credit_score_range'],
          purpose: values['purpose'],
          ysp: values['ysp_val'],
          rate_buydown: values['rate_buydown_val'],
          prepay_buydown: values['prepay_buydown'],
  
          user_login: req.session.user['username'],
          user_email: req.session.user['email'],
          user_first_name: req.session.user['first_name'],
          user_last_name: req.session.user['last_name'],
        });
  
        calcsubmit_id = calcsubmit.id;
      }

    }
    

		// Bayview_Mortgage_Calculator::print_pre_with_header( 'POST', $_POST );
		// Bayview_Mortgage_Calculator::print_pre_with_header( 'VALUES', $values );
		// Bayview_Mortgage_Calculator::print_pre_with_header( 'ERRORS', Bayview_Mortgage_Calculator_Errors::errors() );
		// Bayview_Mortgage_Calculator::print_pre_with_header( 'LAST SUBMIT', Bayview_Mortgage_Calculator_Calculator_Submits::last_submit() );

    
    console.log('results_30:', results_30);
    console.log('results_25:', results_25);
    console.log('results_20:', results_20);
    console.log('results_15:', results_15);
    console.log('calcsubmit_id:', calcsubmit_id);

    if(allParams.hasOwnProperty('downloadtermsheet')){
      // res.attachment('/assets/pdfs/' + allParams['pdfilename']);
    }

    res.locals.layout = 'new/homelayout';
    res.view('new/pages/silverqualifierpage', {
      sales_reps: sales_reps,
      lists: lists,
      ltvAdjustments: ltvAdjustments,
      rateAdjustments: rateAdjustments,
      params: allParams,
      noResult: noResult,
      values: values,
      results_30: results_30,
      results_25: results_25,
      results_20: results_20,
      results_15: results_15,
      isAuthenticated: req.session.authenticated ? true : false,
      calcsubmit_id: calcsubmit_id,
      post_valid: post_valid,
      errors: errors
    });
    
  }),

  generateTermSheet: function(req, res){
    var protocol = req.connection.encrypted?'https':'http';
    var baseUrl = protocol + '://' + req.headers.host;
    
    var filename = new Date().valueOf() + '.pdf';
    var filepath = 'assets/pdfs/' + filename;

    var data = {
      logo: baseUrl + '/images/frontend/sh_logo.png',
      today: 'June 20, 2019',
      borrower: 'wer',
      guarantor: 'asd',
      propertyaddress: 'asd',
      loan_amount: '30000000',
      ltv: '60.00%',
      purpose: 'Rate/Term Refinance',
      property_type: 'Multifamily',
      programe: '5/1 ARM',
      term: '30',
      rate: '7.500%',
      est: '2,120.16',
      brokerfee: 'wer',
      rate_buydown: '',
      prepay_buydown: '5% for 5 years'
    }
    
    var dateFormat = require('dateformat');
    data['today'] = dateFormat('mmm dd, yyyy');
    data['borrower'] = req.param('borrower');
    data['guarantor'] = req.param('guarantor');
    data['propertyaddress'] = req.param('propertyaddress');
    data['loan_amount'] = req.param('loan_amount');
    data['ltv'] = req.param('ltv');
    data['purpose'] = req.param('purpose');
    data['property_type'] = req.param('property_type');
    data['programe'] = req.param('programe');
    data['term'] = req.param('term');
    data['rate'] = req.param('rate');
    data['est'] = req.param('est');
    data['brokerfee'] = req.param('brokerfee');
    data['rate_buydown'] = req.param('rate_buydown');
    data['prepay_buydown'] = req.param('prepay_buydown');

    if(parseFloat(req.param('calcsubmit_id')) > 0){
      CalculatorSubmitService.update(req.param('calcsubmit_id'), {
        property_address: data['propertyaddress'],
        term_sheet_name: filename,
        borrower: data['borrower'],
        guarantor: data['guarantor'],
        broker_fee: data['brokerfee'],
        programe: data['programe'],
        rate: data['rate'],
        mopayment: data['est'],
        property_type: data['property_type'],
      });
    }

    // sails.hooks.pdf.make(
    PDFGenService.generate(sails,
      "termsheet",
      data,
      {
        output: filepath
      },
      function(err, result) {
        console.log('pdfmake result >>', err, result);
        if(err == null){
          res.send({
            success: true,
            filename: filename,
            filepath: filepath
          });
        }
        else{
          res.send({
            success: false,
          });
        }
      }
    );

    // res.send({
    //   success: true,
    //   filename: filename,
    //   filepath: filepath
    // });
  },

  testgenerateTermSheet: function(req, res){
    var protocol = req.connection.encrypted?'https':'http';
    var baseUrl = protocol + '://' + req.headers.host + '/';
    
    var filename = new Date().valueOf() + '.pdf';
    filename="test.pdf";
    var filepath = 'assets/pdfs/' + filename;

    var data = {
      logo: baseUrl + '/images/frontend/sh_logo.png',
      today: 'June 20, 2019',
      borrower: 'wer',
      guarantor: 'asd',
      propertyaddress: 'asd',
      loan_amount: '30000000',
      ltv: '60.00%',
      purpose: 'Rate/Term Refinance',
      programe: '5/1 ARM',
      term: '30',
      rate: '7.500%',
      est: '2,120.16',
      brokerfee: 'wer',
      rate_buydown: '',
      prepay_buydown: '5% for 5 years'
    }
    
    PDFGenService.generate(sails, 
      "termsheet",
      data,
      {
        output: filepath
      },
      function(err, result) {
        console.log('pdfmake result >>', err, result);
        if(err == null){
          res.send({
            success: true,
            filename: filename,
            filepath: filepath
          });
        }
        else{
          res.send({
            success: false,
          });
        }
        
      }
    );
  },

  downloadTermSheet: function(req, res){

    let filename = req.param("filename");
    let filepath = req.param("filepath");
    
    filepath = 'assets/pdfs/' + filename;
    // var filepath = 'assets/pdfs/termsheet.pdf';
    // var filename = 'termsheet.pdf';
    let file = require('path').resolve(sails.config.appPath+'//'+filepath)
    var fs = require('fs');
    if(fs.existsSync(file))
    {
          res.setHeader('Content-disposition', 'attachment; filename=' + filename);

          let filestream = fs.createReadStream(file);
          filestream.pipe(res);

    }else{
        res.json({error : "File not Found"});
    }
  }

};

