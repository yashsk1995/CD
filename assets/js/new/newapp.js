(function ($) {

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function initPage(){
        $(document).on('click', '#logout_btn', function(){
            $.ajax({
                url: '/api_logout',
                type: 'post',
                success: function(response){
                    location.href="/login";
                }
            })
        })

        //menu nav icon event
        $(document).on('click', '.header-menu-nav-btn', function(){
            if($('body').hasClass('state--mobile-menu-show')){
                $('body').removeClass('state--mobile-menu-show');
            }
            else{
                $('body').addClass('state--mobile-menu-show');
            }
        })

        //menu item click event
        $(document).on('click', '.header-menu-title', function(){
            if($(this).parent().hasClass('state--mobile-submenu-show')){
                $(this).parent().removeClass('state--mobile-submenu-show');
            }
            else{
                $(this).parent().addClass('state--mobile-submenu-show');
            }
        })
    }
    // initPage

    function initHomePage(){
        $('.home-banner-slider').slick();
    }
    // initHomePage

    function initRegisterPage(){
        $(document).on('click', '#register_btn', function(){
            var bHasError = false;

            if($('[name="first_name"]').val() == ''){
                $('[name="first_name"]').focus();
                $('[name="first_name"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="first_name"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="last_name"]').val() == ''){
                $('[name="last_name"]').focus();
                $('[name="last_name"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="last_name"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="phone"]').val() == ''){
                $('[name="phone"]').focus();
                $('[name="phone"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="phone"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="email"]').val() == ''){
                $('[name="email"]').focus();
                $('[name="email"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="email"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');

                if(!validateEmail($('[name="email"]').val())){    
                    $('[name="email"]').parents('.form-input-container').addClass('state--has-error state--error-invalid');
                    bHasError = true;
                }
                else{
                    $('[name="email"]').parents('.form-input-container').removeClass('state--has-error state--error-invalid');
                }
            }
            
            if($('[name="company_name"]').val() == ''){
                $('[name="company_name"]').focus();
                $('[name="company_name"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="company_name"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="state"]').val() == ''){
                $('[name="state"]').focus();
                $('[name="state"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="state"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="job"]').val() == ''){
                $('[name="job"]').focus();
                $('[name="job"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="job"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            // if($('[name="user_name"]').val() == ''){
            //     $('[name="user_name"]').focus();
            //     $('[name="user_name"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
            //     bHasError = true;
            // }
            // else{
            //     $('[name="user_name"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            // }

            if($('[name="password"]').val() == ''){
                $('[name="password"]').focus();
                $('[name="password"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="password"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="password_confirm"]').val() == ''){
                $('[name="password_confirm"]').focus();
                $('[name="password_confirm"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="password_confirm"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if($('[name="password"]').val() != '' && $('[name="password"]').val() != $('[name="password_confirm"]').val()){
                // alert("Confirm Password is incorrect!");
                $('[name="password_confirm"]').focus();
                $('[name="password_confirm"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                if($('[name="password"]').val() != ''){
                    $('[name="password_confirm"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
                }
            }

            if(bHasError){
                $('#signup_form_container').addClass('form-state--has-error form-state--error-validate');
                return;
            }

            $('#signup_form_container').removeClass('form-state--has-error form-state--error-validate form-state--error-response');

            function registerUser(){
                $.ajax({
                    url: '/api_register',
                    type: 'post',
                    data: {
                        'first_name': $('[name="first_name"]').val(),
                        'last_name': $('[name="last_name"]').val(),
                        'phone': $('[name="phone"]').val(),
                        'email': $('[name="email"]').val(),
                        'company_name': $('[name="company_name"]').val(),
                        'state': $('[name="state"]').val(),
                        'job': $('[name="job"]').val(),
                        // 'user_name': $('[name="user_name"]').val(),
                        'password': $('[name="password"]').val()
                    },
                    success: function(response){
                        if(response.success){
                            // alert('User Create Successfully!');
                            location.href="/";
                        }
                        else{
                            $('#signup_form_container').addClass('form-state--has-error form-state--error-response');
                        }
                        
                    }
                })
            }

            $.ajax({
                url: '/api_check',
                type: 'post',
                data: {
                    'email': $('[name="email"]').val(),
                },
                success: function(response){
                    if(response.exist){
                        $('[name="email"]').parents('.form-input-container').removeClass('state--error-empty state--error-invalid');
                        $('[name="email"]').parents('.form-input-container').addClass('state--has-error state--error-exist');
                    }
                    else{
                        $('[name="email"]').parents('.form-input-container').removeClass('state--error-empty state--error-invalid state--error-exist');
                        registerUser();
                    }
                }
            })

            
        })

        $('[name="phone"]').mask('(999) 999-9999').bind('keypress', function(e){
            if(e.which == 13){
                jQuery(this).blur();
            }
        })
    }
    //initRegisterPage

    function initLoginPage(){
        $(document).on('click', '#login_btn', function(){
            var bHasError = false;
            if($('[name="email"]').val() == ''){
                $('[name="email"]').focus();
                $('[name="email"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="email"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');

                if(!validateEmail($('[name="email"]').val())){    
                    $('[name="email"]').parents('.form-input-container').addClass('state--has-error state--error-invalid');
                    bHasError = true;
                }
                else{
                    $('[name="email"]').parents('.form-input-container').removeClass('state--has-error state--error-invalid');
                }

            }

            if($('[name="password"]').val() == ''){
                $('[name="password"]').focus();
                $('[name="password"]').parents('.form-input-container').addClass('state--has-error state--error-empty');
                bHasError = true;
            }
            else{
                $('[name="password"]').parents('.form-input-container').removeClass('state--has-error state--error-empty');
            }

            if(bHasError){
                $('#login_form_container').addClass('form-state--has-error form-state--error-validate');
                return;
            }

            $('#login_form_container').removeClass('form-state--has-error form-state--error-validate form-state--error-response');

            $.ajax({
                url: 'api_login',
                type: 'post',
                data: {
                    'email': $('[name="email"]').val(),
                    'password': $('[name="password"]').val()
                },
                success: function(response){
                    if(response.success){
                        // alert('Login Success!');
                        location.href="/";
                    }
                    else{
                        // alert('Login Failed!');
                        $('#login_form_container').addClass('form-state--has-error form-state--error-response')
                    }
                }
            })
        })
    }
    // initLoginPage

    function initSilverQualifierPage(){

        // if($('.calc-result-sub-panel').length > 0){
        //     $([document.documentElement, document.body]).animate({
        //         scrollTop: $(".calc-divided-panel.calc-result-panel").offset().top
        //     }, 2000);
        // }

        const $loanAmount = $('#silver_qualifier_page form input[name="loan_amount"]');
		const $propertyValue = $('#silver_qualifier_page form input[name="property_value"]');
		const $ltv = $('#silver_qualifier_page form span.ltvText');
		const $ysp = $('#silver_qualifier_page form select[name="ysp"]');
		const $rateBuydown = $('#silver_qualifier_page form select[name="rate_buydown"]');
		const $documentation = $('#silver_qualifier_page form select[name="documentation"]');
		const $occupancy = $('#silver_qualifier_page form select[name="occupancy"]');
		const $propertyType = $('#silver_qualifier_page form select[name="property_type"]');
		const $credit_score_range = $('#silver_qualifier_page form select[name="credit_score_range"]');
		const $rateBuydownSelected = $('#silver_qualifier_page form .rate_buydown_selected');
		const $prepayBuydown = $('#silver_qualifier_page form select[name="prepay_buydown1"]');
		const $yspSelected = $('#silver_qualifier_page form .ysp_selected');
        const $form = $('#silver_qualifier_page form');
        
        function checkOccupancy($occupancy, $documentation) {
            $documentation.prop('disabled', false);
    
            switch ($occupancy.val()) {
                case 'Investor':
                    updateSelectedDocumentation($documentation);
    
                    $documentation.find('option[value="Stated Program"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Lite Doc"]').prop('disabled', false).show();
                    $documentation.find('option[value="No Doc"]').prop('disabled', false).show();
                    break;
                case 'Owner Occupied':
                    $documentation.find('option[value="Lite Doc"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Stated Program"]').prop('disabled', false).show();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', false).show();
                    $documentation.find('option[value="No Doc"]').prop('disabled', false).show();
                    break;
                default:
                    $documentation.val('');
                    $documentation.prop('disabled', 'disabled');
                    break;
            }
        }
    
        function checkDocumentation($documentation, $occupancy, resetOccupancy) {
            resetOccupancy = typeof (resetOccupancy) === 'undefined' ? true : resetOccupancy;
    
            $occupancy.prop('disabled', false);
    
            switch ($documentation.val()) {
                case 'Lite Doc':
                    $occupancy.val('Investor');
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', 'disabled').hide();
                    $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
                    break;
                case 'Stated Program':
                case 'Bank Statement':
                    $occupancy.val('Owner Occupied');
                    $occupancy.find('option[value="Investor"]').prop('disabled', 'disabled').hide();
                    break;
                case '':
                    $occupancy.val('');
                    $occupancy.prop('disabled', 'disabled');
                    break;
                default:
                    if (resetOccupancy) {
                        $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
                        $occupancy.find('option[value="Owner Occupied"]').prop('disabled', false).show();
                    }
                    break;
            }

            $occupancy.find('option[value="No Doc"]').prop('disabled', false).show();
        }
    
        function checkYsp($ysp, $rateBuydown, $yspSelected) {
            const parsedValue = parseFloat($ysp.val());
            if (parsedValue !== 0 && !isNaN(parsedValue)) {
                $rateBuydown.prop('disabled', 'disabled');
                $yspSelected.removeClass('hidden').show();
            } else {
                $rateBuydown.prop('disabled', false);
                $yspSelected.addClass('hidden').hide();
            }
        }
    
        function checkRateBuydown($ysp, $rateBuydown, $rateBuydownSelected) {
            const parsedValue = parseFloat($rateBuydown.val());
            if (parsedValue !== 0 && !isNaN(parsedValue)) {
                $ysp.prop('disabled', 'disabled');
                $rateBuydownSelected.removeClass('hidden').show();
            } else {
                $ysp.prop('disabled', false);
                $rateBuydownSelected.addClass('hidden').hide();
            }
        }
    
        function checkPropertyType($propertyType, $documentation, $occupancy, $loanAmount, $prepayBuydown, clearOccupancy, clearDocumentation) {
            clearOccupancy = typeof (clearOccupancy) === 'undefined' ? true : clearOccupancy;
            clearDocumentation = typeof (clearDocumentation) === 'undefined' ? true : clearDocumentation;
    
            if (typeof ($loanAmount) === 'undefined') {
                $loanAmount = $('#silver_qualifier_page form input[name="loan_amount"]');
            }
    
            // Reset occupancy and documentation dropdowns
            $occupancy.prop('disabled', false);
            $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
            $occupancy.find('option[value="Owner Occupied"]').prop('disabled', false).show();
    
            if (clearOccupancy) {
                $occupancy.val('');
            }
    
            if (clearDocumentation) {
                $documentation.val('');
            }
    
            $documentation.prop('disabled', 'disabled');
            if($propertyType.val()!='2-4 Unit' || $propertyType.val()!='Single Family' || $propertyType.val()!='Townhome') {
				if ( $prepayBuydown.find('option[value="5% for 3 Years"]').parent().is( "span" ) ){
					$prepayBuydown.find('option[value="5% for 3 Years"]').unwrap();
					}
                //$prepayBuydown.find('option[value="5% for 3 Years"]').unwrap();
				if ( $prepayBuydown.find('option[value="3%, 2%, 1%"]').parent().is( "span" ) ){
					
					}else {
					$prepayBuydown.find('option[value="3%, 2%, 1%"]').wrap('<span/>');
					}
				
               // $prepayBuydown.find(':nth-child(1)').prop('selected', true);
                $occupancy.find('option[value="Owner Occupied"]').prop('disabled', false).show();
                $documentation.find('option[value="Stated Program"]').prop('disabled', false).show();
                $documentation.find('option[value="Bank Statement"]').prop('disabled', false).show();
                $documentation.find('option[value="Complete"]').prop('disabled', false).show();
            }
            switch ($propertyType.val()) {
                case 'Multifamily':
                case 'Mobile Home Parks':
                case 'Mixed-Use Tier I (>= 50% residential)':
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', 'disabled').hide();
                    $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
                    $documentation.find('option[value="Lite Doc"]').show().prop('disabled', false);
                    $documentation.find('option[value="Stated Program"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', 'disabled').hide();
                    break;
                case '':
                    $occupancy.prop('disabled', 'disabled');
                    break;
                case '2-4 Unit':
                    $prepayBuydown.find('option[value="5% for 3 Years"]').wrap('<span/>');
					if ( $prepayBuydown.find('option[value="3%, 2%, 1%"]').parent().is( "span" ) ){
					$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
					}
					//$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
                   // $prepayBuydown.find(':nth-child(2)').prop('selected', true);
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', 'disabled').hide();
                    $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
                    $documentation.find('option[value="Lite Doc"]').show().prop('disabled', false);
                    $documentation.find('option[value="Stated Program"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Complete"]').prop('disabled', 'disabled').hide();
                    break;
               case 'Single Family':
                    $prepayBuydown.find('option[value="5% for 3 Years"]').wrap('<span/>');
					if ( $prepayBuydown.find('option[value="3%, 2%, 1%"]').parent().is( "span" ) ){
						$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
					}
					//$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
                    //$prepayBuydown.find(':nth-child(2)').prop('selected', true);
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', 'disabled').hide();
                    $occupancy.find('option[value="Investor"]').prop('disabled', false).show();				
                    $documentation.find('option[value="Lite Doc"]').show().prop('disabled', false);
                    $documentation.find('option[value="Stated Program"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Complete"]').prop('disabled', 'disabled').hide();
                    break;
               case 'Townhome':
                      $prepayBuydown.find('option[value="5% for 3 Years"]').wrap('<span/>');
					  if ( $prepayBuydown.find('option[value="3%, 2%, 1%"]').parent().is( "span" ) ){
					$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
					}
					//$prepayBuydown.find('option[value="3%, 2%, 1%"]').unwrap();
                    //$prepayBuydown.find(':nth-child(2)').prop('selected', true);
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', 'disabled').hide();
                    $occupancy.find('option[value="Investor"]').prop('disabled', false).show();
                    $documentation.find('option[value="Lite Doc"]').show().prop('disabled', false);
                    $documentation.find('option[value="Stated Program"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', 'disabled').hide();
                    $documentation.find('option[value="Complete"]').prop('disabled', 'disabled').hide();
                    break;
                default:
                    $occupancy.find('option[value="Owner Occupied"]').prop('disabled', false).show();
                    $documentation.find('option[value="Stated Program"]').prop('disabled', false).show();
                    $documentation.find('option[value="Bank Statement"]').prop('disabled', false).show();
					if ( $prepayBuydown.find('option[value="5% for 3 Years"]').parent().is( "span" ) ){
					$prepayBuydown.find('option[value="5% for 3 Years"]').unwrap();
					}
                   // $prepayBuydown.find('option[value="5% for 3 Years"]').unwrap();
				   if ( $prepayBuydown.find('option[value="3%, 2%, 1%"]').parent().is( "span" ) ){
					
					}else {
					$prepayBuydown.find('option[value="3%, 2%, 1%"]').wrap('<span/>');
					}
					
                    //$prepayBuydown.find(':nth-child(1)').prop('selected', true);
                    break;
            }

            $documentation.find('option[value="No Doc"]').prop('disabled', false).show();
        }
    
        function calculateLmt($loanAmount, $propertyValue, $ltv) {
            if (accounting.formatMoney($loanAmount.val(), '$', 0) !== $loanAmount.val()) {
                $loanAmount.val(accounting.formatMoney($loanAmount.val(), '$', 0));
            }
    
            if (accounting.formatMoney($propertyValue.val(), '$', 0) !== $propertyValue.val()) {
                $propertyValue.val(accounting.formatMoney($propertyValue.val(), '$', 0));
            }
    
            const loanAmount = accounting.unformat($loanAmount.val());
            const propertyValue = accounting.unformat($propertyValue.val());
            let ltv = 0;
    
            if (loanAmount > 0 && propertyValue > 0) {
                ltv = loanAmount / propertyValue;
            }
    
            ltv *= 100;
            $ltv.text(ltv.toFixed() + '%');
        }
    
        function checkYspLoanAmount($loanAmount, $ysp) {
            // Store occupancy options
            const options = [];
            $('#silver_qualifier_page form select[name="ysp"] option').each(function () {
                options.push($(this));
            });
    
            if (accounting.unformat($loanAmount.val()) > 1000000) {
          //show upto 1
          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if ((option.val() == "None") ||
              (option.val() == "+0.125% to rate = 1/3 point") ||
              (option.val() == "+0.250% to rate = 2/3 point") ||
              (option.val() == "+0.375% to rate = 1 point")) {
              option.prop('disabled', false).removeClass('hidden').show();
            } else {
              option.prop('disabled', 'disabled').addClass('hidden').hide();
            }
          }
        } else {
            // Show all
          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            option.prop('disabled', false).removeClass('hidden').show();
          }
        }
            
            if (accounting.unformat($loanAmount.val()) <= 500000) {
                // Show all
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    option.prop('disabled', false).removeClass('hidden').show();
                }
            }
        }
    
        function updateSelectedDocumentation($documentation) {
            return;
            if ($documentation.val() !== 'Lite Doc' &&
                    $documentation.val() !== 'Complete' &&
                    $documentation.prop('selectedIndex') > 1) {
                $documentation.find(':nth-child(2)').prop('selected', true);
            }
        }

        $loanAmount.keyup(function(){
			calculateLmt($loanAmount, $propertyValue, $ltv);
			checkOccupancy($occupancy, $documentation);
			checkYspLoanAmount($loanAmount, $ysp);
		});

		$propertyValue.keyup(function(){
			calculateLmt($loanAmount, $propertyValue, $ltv);
		});
		
		$credit_score_range.change(function(e) {
		//console.log("$credit_score_range",$credit_score_range.val());
		//console.log("$documentation",$documentation.val());
		if( $credit_score_range.val() > "700-724" && ($documentation.val()=='Complete' || $documentation.val()=='Bank Statement')) {
		  //$rateBuydown.prop('disabled', 'disabled');
		}else {
		  
		   //$rateBuydown.prop('disabled', false);
		}
	 
		});
	
		$propertyType.change(function(){
			checkPropertyType($propertyType, $documentation, $occupancy, $loanAmount,$prepayBuydown);
		});

		$documentation.change(function(){
			checkDocumentation($documentation, $occupancy, true);
		});

		$ysp.change(function(){
			checkYsp($ysp, $rateBuydown, $yspSelected);
		});

		$rateBuydown.change(function(){
			checkRateBuydown($ysp, $rateBuydown, $rateBuydownSelected);
		});

		$occupancy.change(function(){
			checkOccupancy($occupancy, $documentation);
		});

		/* eslint-disable  camelcase */
		$form.validate({
			rules: {
				loan_amount: {
					required: true,
					normalizer: function(value) {
						return accounting.unformat(value).toString();
					}
				},
				property_value: {
					required: true,
					normalizer: function(value) {
						return accounting.unformat(value).toString();
					}
				}
			}
		});
		/* eslint-enable  camelcase */

		calculateLmt($loanAmount, $propertyValue, $ltv);
		checkYsp($ysp, $rateBuydown, $yspSelected);
		checkRateBuydown($ysp, $rateBuydown, $rateBuydownSelected);
		checkYspLoanAmount($loanAmount, $ysp);

		if ($propertyType.val() !== '') {
			checkPropertyType($propertyType, $documentation, $occupancy, $loanAmount,$prepayBuydown, $occupancy.val() === '', $documentation.val() === '');
		}

		if ($occupancy.val() === '') {
			$occupancy.prop('disabled', 'disabled');
		} else {
			checkOccupancy($occupancy, $documentation);
		}

		if ($documentation.val() === '') {
			$documentation.prop('disabled', 'disabled');
		} else {
			checkDocumentation($documentation, $occupancy, $occupancy.val() === '');
        }
        
        $(document).on('click', '.calc-result-sub-panel-header', function(){
            if($(this).parent().hasClass('state--collpase')){
                $(this).parent().removeClass('state--collpase');
                $(this).parent().find('.calc-result-table').slideDown();
            }
            else{
                $(this).parent().addClass('state--collpase');
                $(this).parent().find('.calc-result-table').slideUp();
            }
            
        })

        $('.calc-result-sub-panel-header').parent().addClass('state--collpase');
        $('.calc-result-sub-panel-header').parent().find('.calc-result-table').slideUp();

        $('.calc-result-sub-panel-header[data-term="30"]').trigger('click');

        function initPropModal() {
            $('#closePropModalBtn').click(function(e){
                e.preventDefault();
                $('#specialPTypeModal').css('display', 'none');
            });
    
            $('#closePropModalLink').click(function(e){
                e.preventDefault();
                $('#specialPTypeModal').css('display', 'none');
            });

        }

        initPropModal();


        var programe = '';
        var term = '';
        var rate = '';
        var est = '';
        
        $(document).on('click', '.centeredRadio', function(){
            $('#myModal').modal('toggle');
            programe = $(this).parents('.calc-result-table-row').attr('data-loan_program');
            term = $(this).parents('.calc-result-table-row').attr('data-term');
            rate = $(this).parents('.calc-result-table-row').attr('data-rate');
            est = $(this).parents('.calc-result-table-row').attr('data-monthly_payment');
        })

        function processDownloadTermSheet(){
            document.getElementById('fake_download_btn').click();
            $('#mortgage-calculator-form').submit();
        }

        $(document).on('click', '[name="termSheetSubmit"]', function(){
            if($('[name="propertyaddress"]').val() == ''){
                alert('Please Enter Property Address.');
                $('[name="propertyaddress"]').focus();
                return;
            }

            if($('[name="borrower"]').val() == ''){
                alert('Please Enter Borrower.');
                $('[name="borrower"]').focus();
                return;
            }

            var borrower = $('[name="borrower"]').val();
            var guarantor = $('[name="guarantor"]').val();
            var propertyaddress = $('[name="propertyaddress"]').val();
            var loan_amount = $('[name="loan_amount"]').val();
            var ltv = $('.ltvText').text();
            var purpose =  $('[name="purpose"]').val();
            var property_type = $('[name="property_type"]').val();
            
            var brokerfee = $('[name="brokerfee"]').val();
            var rate_buydown = $('[name="rate_buydown"]').val();
            var prepay_buydown = $('[name="prepay_buydown1"]').val();

            var calcsubmit_id = $('[name="calcsubmit_id"]').val();

            $.ajax({
                url: '/generatetermsheet',
                type: 'post',
                data: {
                    borrower: borrower,
                    guarantor: guarantor,
                    propertyaddress: propertyaddress,
                    loan_amount: loan_amount,
                    ltv: ltv,
                    purpose: purpose,
                    property_type: property_type,
                    programe: programe,
                    term: term,
                    rate: rate,
                    est: est,
                    brokerfee: brokerfee,
                    rate_buydown: rate_buydown,
                    prepay_buydown: prepay_buydown,

                    calcsubmit_id: calcsubmit_id
                },
                success: function(response){
                    // console.log(response.success);
                    if(response.success){
                        // location.href="/downloadtermsheet?filename=" + response.filename + '&filepath=' + response.filepath;

                        // var opened = window.open("/downloadtermsheet?filename=" + response.filename + '&filepath=' + response.filepath, '_blank');
                        $('#mortgage-calculator-form').append('<a target="_blank" id="fake_download_btn" href="/downloadtermsheet?filename=' + response.filename + '&filepath=' + response.filepath + '">');
                        setTimeout(function(){
                            processDownloadTermSheet();
                        }, 2000);
                        
                        $('#mortgage-calculator-form').append('<input type="hidden" name="downloadtermsheet">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="borrower" value="' + borrower + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="guarantor" value="' + guarantor + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="propertyaddress" value="' + propertyaddress + '">');
                        // $('#mortgage-calculator-form').append('<input type="hidden" name="loan_amount" value="' + loan_amount + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="ltv" value="' + ltv + '">');
                        // $('#mortgage-calculator-form').append('<input type="hidden" name="purpose" value="' + purpose + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="programe" value="' + programe + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="term" value="' + term + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="rate" value="' + rate + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="est" value="' + est + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="brokerfee" value="' + brokerfee + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="pdfilename" value="' + response.filename + '">');
                        $('#mortgage-calculator-form').append('<input type="hidden" name="pdfilepath" value="' + response.filepath + '">');
                        // $('#mortgage-calculator-form').append('<input type="hidden" name="rate_buydown" value="' + rate_buydown + '">');
                        // $('#mortgage-calculator-form').append('<input type="hidden" name="prepay_buydown" value="' + prepay_buydown + '">');
                        // $('#mortgage-calculator-form').submit();
                    }
                    
                }
            })
        })

        $(document).on('click', '#loan_term_download_btn', function(){
            if($(this).attr('data-filename') == ''){
                alert("there isn't download file");
                return;
            }
            console.log('download');
        })

        $(document).on('click', '#loan_term_reload_btn', function(){
            location.reload();
        })
    }
    // initSilverQualifierPage

    function initPasswordResetPage(){
        $(document).on('click', '#password_reset_btn', function(){
            if($('[name="email"]').val() == ''){
                $('[name="email"]').focus();
                $('[name="email"]').parents('.form-input-container').addClass('state--has-error');
                return;
            }

            $('#password_reset_form').submit();
        })
    }
    // initPasswordResetPage

    function initPasswordSetPage(){
        $(document).on('click', '#password_set_btn', function(){
            if($('[name="password"]').val() == ''){
                $('[name="password"]').focus();
                $('[name="password"]').parents('.form-input-container').addClass('state--has-error');
                return;
            }
            else{
                $('[name="password"]').parents('.form-input-container').removeClass('state--has-error');
            }

            if($('[name="password_confirm"]').val() == ''){
                $('[name="password_confirm"]').focus();
                $('[name="password_confirm"]').parents('.form-input-container').addClass('state--has-error');
                return;
            }
            else{
                $('[name="password_confirm"]').parents('.form-input-container').removeClass('state--has-error');
            }

            if($('[name="password"]').val() != $('[name="password_confirm"]').val()){
                alert('Please input the same password');
                return;
            }

            $('#password_set_form').submit();
        })
    }
    // initPasswordSetPage

    $(document).ready(function(){

        initPage();

        if($('#home_page').length != 0){
            initHomePage();
        }

        if($('#register_page').length != 0){
            initRegisterPage();
        }

        if($('#login_page').length != 0){
            initLoginPage();
        }

        if($('#silver_qualifier_page').length != 0){
            initSilverQualifierPage();
        }

        if($('#password_reset_page').length != 0){
            initPasswordResetPage();
        }

        if($('#password_set_page').length != 0){
            initPasswordSetPage();
        }
    })
})(jQuery);