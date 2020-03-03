
const BVMC_ENABLE_CREDIT_SCORE_LTV_REDUCTION = false;
const BVMC_ENABLE_LITE_DOC_LTV_REDUCTION = false;
const BVMC_ENABLE_PRODUCT_DOCUMENTATION_DOLLAR_LIMIT = false;
const BVMC_ENABLE_VALIDATE_YSP_IF_LOAN_LESS_THAN_500000 = false;

module.exports = {
    loan_table: function (values, years, options) {
        var property_type = values['property_type'];//Multifamily
        var property_type_value = values['property_type_value'];//I
        var credit_score_range = values['credit_score_range_value'];
        var ltv_range = values['ltv_range'];
        var ltv = values['ltv_value'];
        var loan_amount = values['loan_amount'];
        var prepay_buydown = values['prepay_buydown'];
        var documentation = values['documentation'];
        var occupancy = values['occupancy'];
        var purpose = values['purpose'];
        var ysp = values['ysp_val'];
        var rate_buydown = values['rate_buydown_val'];
		var state = values['state'];
         var interest_only = 'No';

        var ltv_matrix = [];
        var ltv_matrix_new = {};
        //foreach (options['loanLookup']['ltv_matrix'] as $key => $value) {

        for(var tindex = 0; tindex < options['lists']['tier'].length; tindex++){
            if (options['lists']['tier'][tindex]['tier'] == property_type_value) {
                ltv_matrix = options['loanLookup']['ltv_matrix'][tindex];
            }
        }
        
        if(interest_only == 'Yes' && documentation == 'No Doc'){
            ltv_matrix_interest = options['loanLookup']['ltv_matrix'][2];
            ltv_matrix_streamline = options['loanLookup']['ltv_matrix'][2];
        }
        else if(interest_only == 'Yes'){
            ltv_matrix_interest = options['loanLookup']['ltv_matrix'][2];
            ltv_matrix_streamline = {};
        }
        else if(documentation == 'No Doc'){
            ltv_matrix_interest = {};
            ltv_matrix_streamline = options['loanLookup']['ltv_matrix'][2];
        }
        else{
            ltv_matrix_interest = {};
            ltv_matrix_streamline = {};
        }

        console.log('PREV ltv_matrix:', ltv_matrix);
        console.log('PREV ltv_matrix_interest:', ltv_matrix_interest);
        console.log('PREV ltv_matrix_streamline:', ltv_matrix_streamline);
        var keys = Object.keys(ltv_matrix['rates']);
        for(var kindex = 0; kindex < keys.length; kindex++){
            var keys1 = Object.keys(ltv_matrix['rates'][keys[kindex]]);
            for(var kindex1 = 0; kindex1 < keys1.length; kindex1++){
                var value_interest = 0;
                var value_streamline = 0;

                if(ltv_matrix_interest.hasOwnProperty('rates')){
                    value_interest = ltv_matrix_interest['rates'][keys[kindex]][keys1[kindex1]];
                }

                if(ltv_matrix_streamline.hasOwnProperty('rates')){
                    value_streamline = ltv_matrix_streamline['rates'][keys[kindex]][keys1[kindex1]];
                }

                if(!ltv_matrix_new.hasOwnProperty('rates')){
                    ltv_matrix_new['rates'] = {};
                }

                if(!ltv_matrix_new['rates'].hasOwnProperty(keys[kindex])){
                    ltv_matrix_new['rates'][keys[kindex]] = {};
                }

                if(!ltv_matrix_new['rates'][keys[kindex]].hasOwnProperty(keys1[kindex1])){
                    ltv_matrix_new['rates'][keys[kindex]][keys1[kindex1]] = {};
                }

                ltv_matrix_new['rates'][keys[kindex]][keys1[kindex1]] = parseFloat(ltv_matrix['rates'][keys[kindex]][keys1[kindex1]]) + parseFloat(value_interest) + parseFloat(value_streamline);
            }
        }

        console.log('AFTER ltv_matrix:', ltv_matrix_new);

        ltv_matrix = ltv_matrix_new;

        var loan_terms = options['lists']['loan_term'];
        // Bayview_Mortgage_Calculator::print_pre_with_header('$loan_terms', $loan_terms);

        var rate_adjustments = options['rateAdjustments']['rate_adjustments'];
        if (rate_adjustments == null || rate_adjustments == '') {
            rate_adjustments = {};
        }
        // Bayview_Mortgage_Calculator::print_pre_with_header('$rate_adjustments', $rate_adjustments);

        var results_table = [];
        var loan_terms_keys = Object.keys(loan_terms);
        // foreach ($loan_terms as $key => $loan_term) {
        for(var ltkindex = 0; ltkindex < loan_terms_keys.length; ltkindex++){
            var key = loan_terms_keys[ltkindex];
            var loan_term = loan_terms[key];
            var prepay_buydown_rate = 0;

            var atm = years;
            // var atm_desc = __("$years Years", 'bayview-mortgage-calculator');
            var atm_desc = years + " Years";

            if(ltv_matrix.hasOwnProperty('rates') && ltv_matrix['rates'].hasOwnProperty(ltv_range) && ltv_matrix['rates'][ltv_range].hasOwnProperty(credit_score_range['min'])){
            // if (isset(ltv_matrix['rates'][$ltv_range][$credit_score_range['min']])) {				
                var rate_pct = parseFloat(ltv_matrix['rates'][ltv_range][credit_score_range['min']]);

                if (rate_pct > 0) {
                    adj = this.func_rate_adjustments(
                        rate_pct, loan_term, atm, atm_desc, loan_amount,
                        occupancy, purpose, credit_score_range,
                        property_type_value, property_type, documentation, ltv, prepay_buydown,
                        rate_adjustments
                    );

                    console.log('adj', adj);
				
                    rate_pct = adj['rate'];
                    prepay_buydown_rate += adj['prepay_buydown_rate_adjustment'];
                    // Bayview_Mortgage_Calculator::print_pre( array ( 'rate' => $rate_pct, 'prepay' => $prepay_buydown_rate ) );


                    rate_pct += prepay_buydown_rate;
					if(loan_term['display']=='30 Yr Fixed') {
						rate_pct += 0.25;
					}	
    				if(loan_term['display']=='30 Year Interest Only') {
    				    rate_pct += 0.25;
    				}
				//	echo $rate_pct."-";
                    rate_pct += rate_buydown;
                    
                    min_loan_rate = parseFloat(options['rateAdjustments']['min_loan_rate']);
                    // $min_loan_rate = Bayview_Mortgage_Calculator_Option::get_option('min_loan_rate', 6);
                    
                    if (rate_pct < min_loan_rate) {
                        rate_pct = min_loan_rate;
                    }
                   // echo $rate_pct."<br>";
                    //echo "ysp-".$ysp."-".$rate_buydown."<br>";
                    rate_pct += ysp;

                    // 	global $wpdb;

					// $table_name = $wpdb->prefix . "customrate";

					var customrates = options['customRate'];
					// for(var crindex = 0; crindex < customrates.length; crindex++){

                    // }
					// 	$customrate_array= $customrow->value;
					// }
					// $custom_rate_array=json_decode($customrate_array, true);
					var custom_ltv = parseFloat(ltv_range) * 100;
                    custom_ltv = custom_ltv.toFixed(0);
					console.log('custom_ltv:', custom_ltv);
					if(loan_term['display']=='30 Year Interest Only') {
                        rate_pct += parseFloat(customrates[credit_score_range['min']][custom_ltv]);
                        // rate_pct += 0.6;
					}
                    //echo $rate_pct;
                    console.log('rate_pct:', rate_pct);
                    /* $min_loan_rate = Bayview_Mortgage_Calculator_Option::get_option('min_loan_rate', 6);
                    if ($rate_pct < $min_loan_rate) {
                        $rate_pct = $min_loan_rate;
                    } */
                    
                }
            } else {
                rate_pct = 0;
            }
            //echo $rate_pct;
            console.log('rate_pct', rate_pct);
            if (rate_pct > 0) {
                var rate = rate_pct / 100;

                rate_buydown_ysp_ = (rate_buydown != 0 || ysp != 0 || prepay_buydown_rate != 0) ? 'N/A' : 'None';

                row = {};
                row['loan_program'] = loan_term['display'];
				row['state'] = state;
                row['points'] = rate_buydown != 0 ? rate_buydown.toFixed(3) : rate_buydown_ysp_;
                row['prepay_buydown'] = prepay_buydown_rate != 0 ? prepay_buydown_rate.toFixed(3) : rate_buydown_ysp_;
                row['ysp'] = ysp != 0 ? ysp.toFixed(3) : rate_buydown_ysp_;
                row['rate'] = parseFloat(rate_pct).toFixed(3) + '%';
                if(loan_term['display']=='30 Year Interest Only') {
                    row['monthly_payment'] = rate > 0 ? this.monthly_payment_30_year_interest(rate, atm, loan_amount) : '0.00';
                    row['monthly_payment'] = row['monthly_payment'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
				} else {
                    row['monthly_payment'] = rate > 0 ? this.monthly_payment(rate, atm, loan_amount) : '0.00';
                    row['monthly_payment'] = row['monthly_payment'].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
				}

                program_data = {};
                program_data['rate_adjustments'] = row['points'] == 'None' ? 0 : row['points'];
                program_data['ysp'] = row['ysp'] == 'None' ? 0 : row['ysp'];
                // loan_programs[row['loan_program']] = program_data;

                results_table.push(row);
            }
        }

        // Bayview_Mortgage_Calculator::print_pre_with_header("results_table $years", $results_table);
        return results_table;
    },

    func_rate_adjustments: function(rate_param, loan_term, atm, atm_desc, loan_amount, occupancy, purpose, credit_score_range, property_type, property_type_name, documentation, ltv, prepay_buydown, rate_adjustments){
        console.log('func_rate_adjustments>> rate:', rate_param);
        console.log('func_rate_adjustments>> loan_term:', loan_term);
        console.log('func_rate_adjustments>> atm:', atm);
        console.log('func_rate_adjustments>> atm_desc:', atm_desc);
        console.log('func_rate_adjustments>> loan_amount:', loan_amount);
        console.log('func_rate_adjustments>> occupancy:', occupancy);
        console.log('func_rate_adjustments>> purpose:', purpose);
        console.log('func_rate_adjustments>> credit_score_range:', credit_score_range);
        console.log('func_rate_adjustments>> property_type:', property_type);
        console.log('func_rate_adjustments>> property_type_name:', property_type_name);
        console.log('func_rate_adjustments>> documentation:', documentation);
        console.log('func_rate_adjustments>> ltv:', ltv);
        console.log('func_rate_adjustments>> prepay_buydown:', prepay_buydown);
        // console.log('func_rate_adjustments>> rate_adjustments:', rate_adjustments);

        var prepay_buydown_rate_adjustment = 0;
        var rate_adjustments_matched = [];
        var purpose_adjustments=0;
        var rate = rate_param;
        //foreach (rate_adjustments as $key => $rate_adjustment) {
        var obj_keys = Object.keys(rate_adjustments);
        for(var raindex = 0; raindex < rate_adjustments.length; raindex++) {
            
            var rate_adjustment = rate_adjustments[raindex];
            // console.log('rate_adjustment', rate_adjustment);
            var conditions = rate_adjustment['conditions'];
            var include_rate_adjustment = true;
            var conditions_matched = 0;

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_ltv') && rate_adjustment['rate_adjustments_conditions_ltv'] != '') {
                var condition_ltv = parseFloat(rate_adjustment['rate_adjustments_conditions_ltv']);
                if (condition_ltv > 0) {
                    ++conditions_matched;
                    include_rate_adjustment = ltv >= condition_ltv;
                    console.log('test1');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_loan_amount_operation') && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_loan_amount') && rate_adjustment['rate_adjustments_conditions_loan_amount'] != '') {
                var condition_loan_amount = parseFloat(rate_adjustment['rate_adjustments_conditions_loan_amount']);
                if (condition_loan_amount > 0) {
                    if (rate_adjustment['rate_adjustments_conditions_loan_amount_operation'] == 'greater_than') {
                        ++conditions_matched;
                        include_rate_adjustment = loan_amount > condition_loan_amount;
                        console.log('test2');
                    } else if (rate_adjustment['rate_adjustments_conditions_loan_amount_operation'] == 'greater_than_or_equal') {
                        ++conditions_matched;
                        include_rate_adjustment = loan_amount >= condition_loan_amount;
                        console.log('test3');
                    } else if (rate_adjustment['rate_adjustments_conditions_loan_amount_operation'] == 'equal') {
                        ++conditions_matched;
                        include_rate_adjustment = loan_amount == condition_loan_amount;
                        console.log('test4');
                    } else if (rate_adjustment['rate_adjustments_conditions_loan_amount_operation'] == 'less_than') {
                        ++conditions_matched;
                        include_rate_adjustment = loan_amount < condition_loan_amount;
                        console.log('test5');
                    } else if (rate_adjustment['rate_adjustments_conditions_loan_amount_operation'] == 'less_than_or_equal') {
                        ++conditions_matched;
                        include_rate_adjustment = loan_amount <= condition_loan_amount;
                        console.log('test6');
                    }
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_loan_term') && rate_adjustment['rate_adjustments_conditions_loan_term'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_loan_term'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_loan_term'] == loan_term['display'];
                    console.log('test7');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_atm_term') && rate_adjustment['rate_adjustments_conditions_atm_term'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_atm_term'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_atm_term'] == atm_desc;
                    console.log('test8');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_teir') && rate_adjustment['rate_adjustments_conditions_teir'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_teir'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_teir'] == property_type;
                    console.log('test9');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_occupancy') && rate_adjustment['rate_adjustments_conditions_occupancy'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_occupancy'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_occupancy'] == occupancy;
                    console.log('test10');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_documentation') && rate_adjustment['rate_adjustments_conditions_documentation'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_documentation'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_documentation'] == documentation;
                    console.log('test11');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_purpose') && rate_adjustment['rate_adjustments_conditions_purpose'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_purpose'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = rate_adjustment['rate_adjustments_conditions_purpose'] == purpose;
                    console.log('test12');
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_credit_score_operation') && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_credit_score') && rate_adjustment['rate_adjustments_conditions_credit_score'] != '') {
                if (rate_adjustment['credit_score'] != '' || rate_adjustment['credit_score'] != '0.00') {
                    if (rate_adjustment['rate_adjustments_conditions_credit_score_operation'] == 'greater_than') {
                        ++conditions_matched;
                        include_rate_adjustment = credit_score_range['min'] > rate_adjustment['rate_adjustments_conditions_credit_score'];
                        console.log('test13');
                    } else if (rate_adjustment['rate_adjustments_conditions_credit_score_operation'] == 'greater_than_or_equal') {
                        ++conditions_matched;
                        include_rate_adjustment = credit_score_range['min'] >= rate_adjustment['rate_adjustments_conditions_credit_score'];
                        console.log('test14');
                    } else if (rate_adjustment['rate_adjustments_conditions_credit_score_operation'] == 'equal') {
                        ++conditions_matched;
                        include_rate_adjustment = credit_score_range['min'] == rate_adjustment['rate_adjustments_conditions_credit_score'];
                        console.log('test15');
                    } else if (rate_adjustment['rate_adjustments_conditions_credit_score_operation'] == 'less_than') {
                        ++conditions_matched;
                        include_rate_adjustment = credit_score_range['min'] < rate_adjustment['rate_adjustments_conditions_credit_score'];
                        console.log('test16');
                    } else if (rate_adjustment['rate_adjustments_conditions_credit_score_operation'] == 'less_than_or_equal') {
                        ++conditions_matched;
                        include_rate_adjustment = credit_score_range['min'] <= rate_adjustment['rate_adjustments_conditions_credit_score'];
                        console.log('test17');
                    }
                }
            }

            if (include_rate_adjustment && rate_adjustment.hasOwnProperty('rate_adjustments_conditions_prepay_buydown') && rate_adjustment['rate_adjustments_conditions_prepay_buydown'] != '') {
                if (rate_adjustment['rate_adjustments_conditions_prepay_buydown'] != '') {
                    ++conditions_matched;
                    include_rate_adjustment = false;

                    if (rate_adjustment['rate_adjustments_conditions_prepay_buydown'] == prepay_buydown) {
                        prepay_buydown_rate_adjustment = rate_adjustment['rate_adjustments_rate_adjustment'];

                        rate_adjustments_matched.push({
                          'rate': rate,
                          'atm': atm_desc,
                          'loan_term': loan_term,
                          'rate_adjustment': rate_adjustment['rate_adjustments_rate_adjustment'],
                          'property_type': property_type,
                        });
                        console.log('test18');
                    }
                }
            }

            if (conditions_matched == 0) {
                include_rate_adjustment = false;
            }

            console.log('include_rate_adjustment:', include_rate_adjustment);

            if (include_rate_adjustment) {
                rate_adjustments_matched.push({
                  'rate': rate,
                  'atm': atm_desc,
                  'loan_term': loan_term,
                  'rate_adjustment': rate_adjustment,
                  'property_type': property_type,
                });

                if(rate_adjustment['rate_adjustments_conditions_ltv'] == '' && rate_adjustment['rate_adjustments_conditions_purpose'] == 'Cash Out') {
                    purpose_adjustments = purpose_adjustments + 1;
                    console.log('test19');
                }

                if(parseFloat(rate_adjustment['rate_adjustments_conditions_ltv']) >= 0.7 && rate_adjustment['rate_adjustments_conditions_purpose'] == 'Cash Out') {
                    purpose_adjustments = purpose_adjustments + 1;
                    console.log('test20');
                }

                rate += parseFloat(rate_adjustment['rate_adjustments_rate_adjustment']);
                console.log(rate);
            }
		
        }
		
        if(purpose_adjustments == 2){
            rate = rate - 0.125;
            console.log('rate1', rate);
        }
        
        //if(property_type['name'] == 'Townhomes' || property_type['name'] == 'Single Family' || property_type['name'] == '2-4 Unit') {			
        if(property_type_name == 'Townhome' || property_type_name == 'Single Family' || property_type_name == '2-4 Unit') {			
            rate = rate - 0.625;
            console.log('rate2', rate);
			if(prepay_buydown== '5% for 5 Years' || prepay_buydown== 'Declining 5%, 4%, 3%, 2%, 1%') {
				rate = rate - 0.250;
				console.log('rate21', rate);
			}	
        }
        
		if(property_type_name == 'Restaurant/Bar' || property_type_name == 'Automotive') {
            rate = rate + 0.25;
            console.log('rate3', rate);
		}
		
		if(property_type_name == 'Restaurant/Bar' || property_type_name == 'Automotive' || property_type_name == 'Multifamily' || property_type_name == 'Mixed-Use Tier I (>= 50% residential)' || property_type_name == 'Mixed-Use Tier II (>= 50% commercial)' || property_type_name == 'Office' || property_type_name == 'Retail/Wholesale Store/Strip Center' || property_type_name == 'Warehouse/Self-Storage Facility' || property_type_name == 'Light Industrial' || property_type_name == 'Mobile Home Parks' || property_type_name == 'Day Care') {
			
			if(prepay_buydown== '5% for 5 Years' ) {
				rate = rate - 0.250;
				console.log('rate31', rate);
			}
				
			if(prepay_buydown== 'Declining 5%, 4%, 3%, 2%, 1%' ) {
				rate = rate - 0.125;
				console.log('rate32', rate);
			}	
			
		}	
		
		if(parseFloat(credit_score_range['min']) >= 700 && (documentation == 'Complete' || documentation == 'Bank Statement')) {			
            // rate = rate - 0.5;
		}
	
        return {
            'rate': rate,
            'prepay_buydown_rate_adjustment': parseFloat(prepay_buydown_rate_adjustment),
        }
    },

    monthly_payment_30_year_interest: function(rate, years, loan){
        
		var amount=(((rate * 365.349) / 360) / 12) * loan;
        return amount.toFixed(2);
    },

    monthly_payment: function(rate, years, loan){
        var months = years * 12;        
        var monthly_rate = this.monthly_rate_equation(rate);
        var amount = this.pmt_equation(monthly_rate, loan, months);

        return amount.toFixed(2);
    },

    monthly_rate_equation: function(rate) {
        return (((rate * 365.25) / 360) / 12);
    },

    pmt_equation: function(monthly_rate, loan, months){
        return monthly_rate * (-loan) * Math.pow((1 + monthly_rate), months) / (1 - Math.pow((1 + monthly_rate), months));
    },

    get_mortgage_calculator_submitted_values: function (_post, options){
        var values = {};        
    
        // FORM SECURITY
        values['bvmc_nonce']            = '';
        values['bvmc_term_sheet_nonce'] = '';

        // CALCULATOR VALUES
        values['loan_amount']              = 0;
        values['property_value']           = 0;
        values['ltv']                      = 0;
        values['ltv_value']                = 0;
        values['ltv_max_value']            = 0;
        values['ltv_range']                = '0.00';
        values['ltv_reduction']            = 0.0;
        values['ltv_state_reduction']      = 0.0;
        values['property_type']            = '';
        values['property_type_value']      = '';
        values['occupancy']                = '';
        values['documentation']            = '';
        values['state']                    = '';
        values['credit_score_range']       = '';
        values['credit_score_range_value'] = {};
        values['purpose']                  = '';
        values['ysp']                      = '';
        values['ysp_val']                  = .0;
        values['rate_buydown']             = '';
        values['rate_buydown_val']         = .0;
        values['rate_buydown_or_ysp']      = 'N/A';
        values['prepay_buydown']           = 'No';
        values['account_rep']              = '';
        values['sales_rep']                = {};
        values['disable_ysp']              = false;
        values['disable_rate_buydown']     = false;
        values['disable_occupancy']        = false;

        // LAST CALCULATOR SUBMIT ID
        values['last_submit_id'] = '';

        // LOAN TERM SHEET FORM
        values['borrower']        = '';
        values['guarantor']       = '';
        values['propertyaddress'] = '';
        values['brokerfee']       = '';
        values['term']            = '';
        values['est']             = '';
        values['programe']        = '';
        values['rate']            = '';

        // if ( count( $_post ) > 0 && wp_verify_nonce( sanitize_key( $_post['bvmc_nonce'] ), 'bvmc_nonce' ) ) {
        if ( Object.keys(_post).length > 0 ) {
            if ( _post.hasOwnProperty('bvmc_nonce')) {
                values['bvmc_nonce'] = _post['bvmc_nonce'];
            }

            if ( _post.hasOwnProperty('bvmc_term_sheet_nonce')) {
                values['bvmc_term_sheet_nonce'] = _post['bvmc_term_sheet_nonce'];
            }

            if ( _post.hasOwnProperty('loan_amount') ) {
                // values['loan_amount'] = parseFloat( preg_replace( '/[\$,]/', '', $_post['loan_amount'] ) );
                values['loan_amount'] = parseFloat(_post['loan_amount'].replace(/[\$,]/g, ''));
            }

            if ( _post.hasOwnProperty('property_value') ) {
                // values['property_value'] = parseFloat( preg_replace( '/[\$,]/', '', $_post['property_value'] ) );
                values['property_value'] = parseFloat(_post['property_value'].replace(/[\$,]/g, ''));
            }

            if ( _post.hasOwnProperty('property_type')) {
                values['property_type'] = _post['property_type'];

                var property_types = options['lists']['property_type'];
                // foreach ( Bayview_Mortgage_Calculator_Option::get_option( 'property_type' ) as $key => $value ) {
                for(var ptindex = 0; ptindex < property_types.length; ptindex++){
                    // if ( $value['name'] === $_post['property_type'] ) {
                    if ( property_types[ptindex]['property_type'] == _post['property_type'] ) {
                        values['property_type_value'] = property_types[ptindex]['tier'];
                    }
                }
            }

            if ( _post.hasOwnProperty('occupancy')) {
                values['occupancy'] = _post['occupancy'];
            }

            if ( _post.hasOwnProperty('documentation') ) {
                values['documentation'] = _post['documentation'];
            }

            if ( _post.hasOwnProperty('state') ) {
                values['state'] = _post['state'];

                var sales_reps = options['sales_reps'];
                        // foreach ( $sales_reps as $key => $value ) {
                for(var srindex = 0; srindex < sales_reps.length; srindex++){
                            //if ( $value['state'] !== $_post['state'] ) {
                    if ( sales_reps[srindex]['state'] !== _post['state'] ) {
                        continue;
                    }

                    values['sales_rep']   = sales_reps[srindex];
                    //values['account_rep'] = value['name'];
                    values['account_rep'] = sales_reps[srindex]['rep_email'];
                }
            }

            if ( _post.hasOwnProperty('credit_score_range') ) {
                values['credit_score_range'] = _post['credit_score_range'];

                var credit_score_ranges = options['lists']['credit'];
                //foreach ( $credit_score_ranges as $key => $value ) {
                for(var csrindex = 0; csrindex < credit_score_ranges.length; csrindex++){
                    if ( credit_score_ranges[csrindex]['display'] === _post['credit_score_range'] ) {
                        values['credit_score_range_value'] = credit_score_ranges[csrindex];
                    }
                }
            }

            if ( _post.hasOwnProperty('purpose') ) {
                values['purpose'] = _post['purpose'];
            }

            if ( _post.hasOwnProperty('ysp') ) {
                values['ysp'] = _post['ysp'];
                values['ysp_val'] = parseFloat( values['ysp'] );
                if(isNaN(values['ysp_val'])){
                    values['ysp_val'] = .0;
                }
                values['disable_rate_buydown'] = 0 !== values['ysp_val'];
            }

            if ( _post.hasOwnProperty('rate_buydown') ) {
                values['rate_buydown'] = _post['rate_buydown'];
                values['rate_buydown_val'] = parseFloat( _post['rate_buydown']);
                if(isNaN(values['rate_buydown_val'])){
                    values['rate_buydown_val'] = .0;
                }
                values['disable_ysp'] = 0 !== values['rate_buydown_val'];
            }

            if ( _post.hasOwnProperty('rate_buydown') && _post.hasOwnProperty('ysp')) {
                values['rate_buydown_or_ysp'] = ( 0 !== _post['rate_buydown'] || 0 !== _post['ysp'] ) ? 'N/A' : 'None';
            }

            if ( _post.hasOwnProperty('prepay_buydown') ) {
                values['prepay_buydown'] = _post['prepay_buydown'];
            }

            if ( !values.hasOwnProperty('prepay_buydown') ) {
                values['prepay_buydown'] = 'No';
            }

            if ( _post.hasOwnProperty('pdf_basename') ) {
                values['pdf_basename'] = _post['pdf_basename'];
            }

            if ( values.hasOwnProperty('bvmc_term_sheet_nonce') ) {
                if ( _post.hasOwnProperty( 'last_submit_id') ) {
                    values['last_submit_id'] = _post['last_submit_id'];
                }

                if ( _post.hasOwnProperty('borrower') ) {
                    values['borrower'] = _post['borrower'];
                }

                if ( _post.hasOwnProperty('guarantor') ) {
                    values['guarantor'] = _post['guarantor'];
                }

                if ( _post.hasOwnProperty('propertyaddress') ) {
                    values['propertyaddress'] = _post['propertyaddress'];
                }

                if ( _post.hasOwnProperty('brokerfee') ) {
                    values['brokerfee'] = _post['brokerfee'];
                }

                if ( _post.hasOwnProperty('term') ) {
                    values['term'] = _post['term'];
                }

                if ( _post.hasOwnProperty('est') ) {
                    values['est'] = _post['est'];
                }

                if ( _post.hasOwnProperty('programe') ) {
                    values['programe'] = _post['programe'];
                }

                if ( _post.hasOwnProperty('rate') ) {
                    values['rate'] = _post['rate'];
                }
            }

            // NOTE: Calculate LTV MAX.
            try {
                var ltv = parseFloat(values['loan_amount']) / parseFloat(values['property_value']);
                values['ltv'] = ( ltv * 100).toFixed(2) + '%';
                values['ltv_value'] = ltv;
            } catch ( error ) {
                values['ltv'] = '0%';
                values['ltv_value'] = 0;
            }

            // NOTE: LTV CALCULATIONS.
            var credit_score_range = values['credit_score_range_value'];
            var property_type = values['property_type_value'];
            var property_value = values['property_value'];
            var documentation = values['documentation'];
            var state = values['state'];

            var occupancy = values['occupancy'];
            var tier = property_type;

            var ltv_reduction = 0.0;
            var ltv_state_reduction = 0.0;

            // NOTE: Get the complete documentation because it is to highest level ltv.
            var max_ltv = parseFloat(options['ltvAdjustments']['max_complete_ltv'][tier]);

            console.log('max_ltv1', max_ltv);
            // NOTE: Deduct any credit reductions.
            if ( BVMC_ENABLE_CREDIT_SCORE_LTV_REDUCTION && false ) {
                if ( credit_score_range['max'] < 700 ) {
                    max_ltv -= .05;
                    console.log('max_ltv2', max_ltv);
                }
            }

            if ( max_ltv > 0.00 ) {
                // Get LTV reduction for states.
                var list_states = options['lists']['states'];
                // foreach ( Bayview_Mortgage_Calculator_Option::get_option( 'states' ) as $key => $value ) {
                for(var lsindex = 0; lsindex < list_states.length; lsindex++){
                    if ( list_states[lsindex]['state'] === state ) {
                        ltv_reduction += parseFloat(list_states[lsindex]['reduction']);
                        ltv_state_reduction = parseFloat(list_states[lsindex]['reduction']);
                    }
                }

                // Get LTV reduction for Lite Doc.
                if ( BVMC_ENABLE_LITE_DOC_LTV_REDUCTION ) {
                    if ( property_value > 0 && 'Lite Doc' === documentation ) {
                        ltv_reduction += .05;
                    }
                }

                if ( 'Complete' === values['documentation'] && 'Owner Occupied' === occupancy ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_complete_ltv'][tier] );
                    console.log('max_ltv3', max_ltv);
                } else if ( ('Stated Program' === values['documentation'] || 'Bank Statement' === values['documentation'] ) && 'Owner Occupied' === occupancy ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_bank_statement_program_ltv'][tier] );
                    console.log('max_ltv4', max_ltv);
                } else if ( 'Complete' === values['documentation'] && 'Investor' === occupancy ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_complete_ltv'][tier] );
                    console.log('max_ltv5', max_ltv);
                } else if ( 'Lite Doc' === values['documentation'] && 'Investor' === occupancy ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_streamline_ltv'][tier] );
                    console.log('max_ltv6', max_ltv);
                } else if ( 'Stated Program' === documentation || 'Bank Statement' === documentation ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_bank_statement_program_ltv'][tier] );
                    console.log('max_ltv7', max_ltv);
                } else if ( 'Lite Doc' === values['documentation'] ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_streamline_ltv'][tier] );
                    console.log('max_ltv8', max_ltv);
                }else if ( 'No Doc' === values['documentation'] ) {
                    max_ltv = parseFloat( options['ltvAdjustments']['max_no_doc_ltv'][tier] );
                    console.log('max_ltv9', max_ltv);
                }

                max_ltv -= ltv_reduction;
                console.log('max_ltv9', max_ltv);
            }

            values['ltv_max_value'] = parseFloat(max_ltv.toFixed(4));
            values['ltv_reduction'] = ltv_reduction;
            values['ltv_state_reduction'] = ltv_state_reduction;

            if ( ltv > max_ltv) {
                ltv_range = '0.00';
            } else if ( ltv > 0.75 ) {
                ltv_range = '0.80';
            } else if ( ltv > 0.70 ) {
                ltv_range = '0.75';
            } else if ( ltv > 0.65 ) {
                ltv_range = '0.70';
            } else if ( ltv > 0.60 ) {
                ltv_range = '0.65';
            } else if ( ltv > 0.55 ) {
                ltv_range = '0.60';
            } else if ( ltv > 0.50 ) {
                ltv_range = '0.55';
            } else {
                ltv_range = '0.50';
        }
        
            values['ltv_range'] = ltv_range;

            // Validate Property Type/Occupancy/Documentation.
            investor_only_property_types = [
                'Multifamily',
                'Mixed-Use Tier I (>= 50% residential)',
                'Mobile Home Parks',
        ];

            if (  investor_only_property_types.indexOf(values['property_type']) >= 0) {
                if ( 'Investor' !== values['occupancy'] ) {
                    values['occupancy'] = '';
                }
            }

            if ( 'Investor' === values['occupancy'] ) {
                if ( 'Stated Program' === values['documentation'] || 'Bank Statement' === values['documentation'] ) {
                    values['documentation'] = '';
                }

                if ( BVMC_ENABLE_PRODUCT_DOCUMENTATION_DOLLAR_LIMIT ) {
                    if ( values['loan_amount'] > 1000000 && 'Lite Doc' === values['documentation'] ) {
                        values['documentation'] = '';
                    }
                }
            } else if ( 'Owner Occupied' === values['occupancy'] ) {
                if ( 'Lite Doc' === values['documentation'] ) {
                    values['documentation'] = '';
                }

                if ( BVMC_ENABLE_PRODUCT_DOCUMENTATION_DOLLAR_LIMIT ) {
                    if ( values['loan_amount'] > 1000000 && ( 'Stated Program' === values['documentation'] || 'Bank Statement' === values['documentation'] ) ) {
                        values['documentation'] = '';
                    }
                }
            }

            if ( values['ltv_value'] > values['ltv_max_value'] ) {
                // message = __( 'LTV value out of range.', 'bayview-mortgage-calculator' );
                if ( values['ltv_max_value'] > 0 ) {
                    max = values['ltv_max_value'] * 100;
                    message = 'LTV value out of range. Max LTV is ' + max + '%';
                }

                // $this->add_error( 'ltv_value_out_of_range', $message );
            }

        max_loan_amount = 1000000;
        max_loan_amount = parseFloat(options['rateAdjustments']['max_loan_amount']);
        min_loan_amount = 250000;
            min_loan_amount = parseFloat(options['rateAdjustments']['min_loan_amount']);

            if ( !values.hasOwnProperty('loan_amount') ) {
                // $this->add_error( 'empty_loan_amount', __( 'Loan Amount required', 'bayview-mortgage-calculator' ) );
            } else if ( values['loan_amount'] > max_loan_amount ) {
                max_loan_amount_currency = max_loan_amount.toFixed(2);
                // $message                  = 'Loan Amount of less than ' . $max_loan_amount_currency . ' required';
                // $this->add_error( 'max_loan_amount', $message );
            } else if ( values['loan_amount'] < min_loan_amount ) {
                min_loan_amount_currency = min_loan_amount.toFixed(2);
                // $message                  = 'Loan Amount of greater than ' . $min_loan_amount_currency . ' required';
                // $this->add_error( 'min_loan_amount', $message );
            }

            if ( !values.hasOwnProperty('property_value') || values['property_value'] <= 0 ) {
                // $this->add_error( 'property_value', __( 'Property Value required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('property_type_value') ) {
                // $this->add_error( 'empty_property_type', __( 'Property Type required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('documentation') ) {
                // $this->add_error( 'empty_documentation', __( 'Documentation required', 'bayview-mortgage-calculator' ) );
            }
            if ( !values.hasOwnProperty('documentation') ) {
                // $this->add_error( 'empty_documentation', __( 'Documentation required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('state') ) {
                // $this->add_error( 'empty_state', __( 'State required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('account_rep') ) {
                // $this->add_error( 'account_rep', __( 'Account Rep required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('credit_score_range_value') ) {
                // $this->add_error( 'empty_credit_score_range', __( 'Credit Score required', 'bayview-mortgage-calculator' ) );
            }
            
            var lt_value_int = values['loan_amount'] / values['property_value'];
            
            var lt = lt_value_int * 100;
            var credit_score_range_array = values['credit_score_range'].split('-');
            
            if(credit_score_range_array[0] < "650" && lt > '60') {
                // $this->add_error( 'empty_credit_score_range', __( 'Your FICO score has to be at least 650.', 'bayview-mortgage-calculator' ) );
            }
            
            if(credit_score_range_array[0] < "650" && values['documentation'] == 'Stated Program') {
                // this->add_error( 'empty_credit_score_range', __( 'Your FICO score has to be at least 650.', 'bayview-mortgage-calculator' ) );
            }
            if ( !values.hasOwnProperty('purpose') ) {
                // $this->add_error( 'empty_purpose', __( 'Purpose required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('property_type') ) {
                // $this->add_error( 'empty_property_type', __( 'Property Type required', 'bayview-mortgage-calculator' ) );
            }

            if ( !values.hasOwnProperty('occupancy') ) {
                // $this->add_error( 'empty_occupancy', __( 'Occupancy required', 'bayview-mortgage-calculator' ) );
            }

            // RULE: Validate YSP: IF Loan Amount > 500000 Than YSP must be
            // .375 or less.
            if ( BVMC_ENABLE_VALIDATE_YSP_IF_LOAN_LESS_THAN_500000 ) {
                if ( values['ysp_val'] > 0.375 && values['loan_amount'] > 500000 ) {
                    // $this->add_error( 'max_ysp', 'YSP of than .375 required' );
                }
            }
        }

        return values;
    }
}