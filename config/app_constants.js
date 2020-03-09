/**
 * Created by zeeshan on 3/15/2017.
 */

module.exports.app_constants = {


  payment_details: {
    amount: '100',
    currency: 'USD'
  },

  es_types: {
    faq: 'faq',
    blog: 'blog',
    successStory: 'showcase',
    knowledge: 'knowledge',
    vide0: 'video'
  },

  doc_status: {
    deleted: 'Deleted',
    published: 'Published',
    draft: 'Draft'
  },

  user_types: {
    admin: 'admin',
    end_user: 'end_user'
  },

  user_roles: {
    editor: 'editor',
    loan_officer: 'loan_officer'
  },

  user_status: {
    active: 'Active',
    deleted: 'Deleted'
  },

  application_entity_types: {
    Personal: 'Personal',
    Entity: 'Entity'
  },

  configs: {
    loanLookup : 'loanLookup',
    rateAdjustments: 'rateAdjustments',
    ltvAdjustments: 'ltvAdjustments',
    lists: 'lists',
    salesReps: 'salesReps',
    customRate: 'customRate',
    homeBanner: 'homeBanner',
    homePortal: 'homePortal',
    homeFeatured: 'homeFeatured',
    homeMortgage: 'homeMortgage'
  },

  user_progress: {
    miniApp: "miniApp",
    completedCalculator: "completedCalculator",
    completedQuickApplication: "completedQuickApplication",
    requestedCall: "requestedCall",
    startedFullApplication: "startedFullApplication",
    fullApplicationStep: 'fullApplicationStep',
    fullApplicationReview: 'fullApplicationReview',
    fullApplicationCompleted: "fullApplicationCompleted"
  },

  states: [
    {key: 'AK', name: 'Alaska'},
    {key: 'AL', name: 'Alabama'},
    {key: 'AR', name: 'Arkansas'},
    {key: 'AZ', name: 'Arizona'},
    {key: 'CA', name: 'California'},
    {key: 'CO', name: 'Colorado'},
    {key: 'CT', name: 'Connecticut'},
    {key: 'DE', name: 'Delaware'},
    {key: 'FL', name: 'Florida'},
    {key: 'GA', name: 'Georgia'},
    {key: 'HI', name: 'Hawaii'},
    {key: 'ID', name: 'Idaho '},
    {key: 'IA', name: 'Iowa'},
    {key: 'IL', name: 'Illinois'},
    {key: 'IN', name: 'Indiana'},
    {key: 'KS', name: 'Kansas'},
    {key: 'KY', name: 'Kentucky'},
    {key: 'LA', name: 'Louisiana'},
    {key: 'MA', name: 'Massachusetts'},
    {key: 'MD', name: 'Maryland'},
    {key: 'ME', name: 'Maine'},
    {key: 'MN', name: 'Minnesota'},
    {key: 'MO', name: 'Missouri'},
    {key: 'MS', name: 'Mississippi'},
    {key: 'MT', name: 'Montana '},
    {key: 'NC', name: 'North Carolina'},
    {key: 'NE', name: 'Nebraska'},
    {key: 'NV', name: 'Nevada'},
    {key: 'NH', name: 'New Hampshire'},
    {key: 'NJ', name: 'New Jersey'},
    {key: 'NM', name: 'New Mexico'},
    {key: 'NY', name: 'New York'},
    {key: 'NC', name: 'North Carolina'},
    {key: 'ND', name: 'North Dakota'},
    {key: 'OH', name: 'Ohio'},
    {key: 'OK', name: 'Oklahoma'},
    {key: 'OR', name: 'Oregon'},
    {key: 'PA', name: 'Pennsylvania'},
    {key: 'RI', name: 'Rhode Island'},
    {key: 'SC', name: 'South Carolina'},
    {key: 'SD', name: 'South Dakota'},
    {key: 'TN', name: 'Tennessee '},
    {key: 'TX', name: 'Texas'},
    {key: 'UT', name: 'Utah'},
    {key: 'VT', name: 'Vermont'},
    {key: 'VA', name: 'Virginia'},
    {key: 'WA', name: 'Washington'},
    {key: 'WV', name: 'West Virginia'},
    {key: 'WI', name: 'Wisconsin'},
    {key: 'WY', name: 'Wyoming '}
  ],

  lendingStates: [
    {key: 'AK', name: 'Alaska'},
    {key: 'AL', name: 'Alabama'},
    {key: 'AR', name: 'Arkansas'},
    {key: 'AZ', name: 'Arizona'},
    {key: 'CA', name: 'California'},
    {key: 'CO', name: 'Colorado'},
    {key: 'CT', name: 'Connecticut'},
    {key: 'FL', name: 'Florida'},
    {key: 'GA', name: 'Georgia'},
    {key: 'IA', name: 'Iowa'},
    {key: 'IL', name: 'Illinois'},
    {key: 'IN', name: 'Indiana'},
    {key: 'KS', name: 'Kansas'},
    {key: 'KY', name: 'Kentucky'},
    {key: 'LA', name: 'Louisiana'},
    {key: 'MA', name: 'Massachusetts'},
    {key: 'MD', name: 'Maryland'},
    {key: 'ME', name: 'Maine'},
    {key: 'MN', name: 'Minnesota'},
    {key: 'MO', name: 'Missouri'},
    {key: 'MS', name: 'Mississippi'},
    {key: 'NC', name: 'North Carolina'},
    {key: 'NE', name: 'Nebraska'},
    {key: 'NV', name: 'Nevada'},
    {key: 'NH', name: 'New Hampshire'},
    {key: 'NJ', name: 'New Jersey'},
    {key: 'NM', name: 'New Mexico'},
    {key: 'NY', name: 'New York'},
    {key: 'NC', name: 'North Carolina'},
    {key: 'OH', name: 'Ohio'},
    {key: 'OK', name: 'Oklahoma'},
    {key: 'OR', name: 'Oregon'},
    {key: 'PA', name: 'Pennsylvania'},
    {key: 'RI', name: 'Rhode Island'},
    {key: 'SC', name: 'South Carolina'},
    {key: 'TX', name: 'Texas'},
    {key: 'UT', name: 'Utah'},
    {key: 'VA', name: 'Virginia'},
    {key: 'WA', name: 'Washington'},
    {key: 'WI', name: 'Wisconsin'}
  ],

  propertyTypes: [
    {name: 'Multi-Family', value:"Multi-Family", tier: 'Tier I'},
    {name: 'Single Family', value:"Single Family", tier: 'Tier II'},
    {name: 'Two to Four Units', value:"2 To 4 Family", tier: 'Tier II'},
    {name: 'Mixed-Use (>=50% res)', value:"Mixed-Use Tier 1 (>=50% res)", tier: 'Tier I'},
    {name: 'Mixed-Use (>=50% comm)', value:"Mixed-Use Tier 2 (>=50% comm)", tier: 'Tier II'},
    {name: 'Office', value:"Office", tier: 'Tier II'},
    {name: 'Retail/Wholesale Store/Strip Center', value:"Retail/Wholesale Store/Strip Center", tier: 'Tier II'},
    {name: 'Warehouse', value:"Warehouse", tier: 'Tier II'},
    {name: 'Light Industrial', value: "Light Industrial", tier: 'Tier II'},
    {name: 'Self-Storage Facility', value: "Self-Storage Facility", tier: 'Tier II'},
    {name: 'Mobile Home Park', value: "Mobile Home Park", tier: 'Tier II'},
    {name: 'Automotive', value: "Automotive", tier: 'Tier II'},
    {name: 'Bulk Multiple-Residential Condo', value: "Bulk Multiple-Residential Condo", tier: 'Tier II'},
    {name: 'Bulk Multiple-Residential 1-4', value: "Bulk Multiple-Residential 1-4", tier: 'Tier II'},
    {name: 'Daycare', value: "Day Care", tier: 'Tier II'},
    {name: 'Restaurant/Bar', value: "Restaurant/Bar", tier: 'Tier II'},
    {name: 'Commercial Condo', value: "Commercial Condo", tier: 'Tier II'},
    {name: 'Residential Condo', value:"Residential Condo", tier: 'Tier II'},
    // {name: 'Investor Fix & Flip', value:"Investor Fix & Flip", tier: 'Tier II'}
  ],

  propertyTypesOneToFour: [
    {name: 'Single Family', value:"Single Family", tier: 'Tier II'},
    {name: 'Two to Four Units', value:"2 To 4 Family", tier: 'Tier II'},
    {name: 'Residential Condo', value:"Residential Condo", tier: 'Tier II'}
  ],

  propertyTypesCommercialBridgeLoan: [
    {name: 'Multi-Family', value:"Multi-Family", tier: 'Tier I'},
    {name: 'Mixed-Use (>=50% res)', value:"Mixed-Use Tier 1 (>=50% res)", tier: 'Tier I'},
    {name: 'Mixed-Use (>=50% comm)', value:"Mixed-Use Tier 2 (>=50% comm)", tier: 'Tier II'},
    {name: 'Office', value:"Office", tier: 'Tier II'},
    {name: 'Retail/Wholesale Store/Strip Center', value:"Retail/Wholesale Store/Strip Center", tier: 'Tier II'},
    {name: 'Warehouse', value:"Warehouse", tier: 'Tier II'},
    {name: 'Light Industrial', value: "Light Industrial", tier: 'Tier II'},
    {name: 'Self-Storage Facility', value: "Self-Storage Facility", tier: 'Tier II'},
    {name: 'Mobile Home Park', value: "Mobile Home Park", tier: 'Tier II'},
    {name: 'Automotive', value: "Automotive", tier: 'Tier II'},
    {name: 'Daycare', value: "Day Care", tier: 'Tier II'},
    {name: 'Restaurant/Bar', value: "Restaurant/Bar", tier: 'Tier II'},
    {name: 'Commercial Condo', value: "Commercial Condo", tier: 'Tier II'},
  ],

  propertyTypesSpecial : [
    'Single Family',
    '2 To 4 Family',
    'Residential Condo'
  ],

  loanTypes: [
    {name: 'Purchase'},
    {name: 'Refinance'},
    {name: 'Cash Out Refinance'}
  ],

  commercialMortgageTypes: [
    {key: 'rented', value: "Investor"},
    {key: 'owner_occupied', value: "Owner-Occupied"}
  ],

  propertyFacilities: [
    "N/A",
    "Underground or above ground storage tanks",
    "Automotive repair uses",
    "Ongoing environmental remediation",
    "Hazardous material handling/Licensing",
    "On-site dry cleaner",
    "A prior Phase 1 report available"
  ],

  chooseWithin: [
    '15 days',
    '30 days',
    '60 days',
    '90 days'
  ],

  amortizations: [
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30
  ],

  loanPrograms: [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ],

  prePaymentFee: [
    2,
    3,
    4,
    5
  ],

  creditScore: [
    {key: '800+', value: 800},
    {key: '775 - 799', value: 775},
    {key: '750 - 774', value: 750},
    {key: '725 - 749', value: 725},
    {key: '700 - 724', value: 700},
    {key: '675 - 699', value: 675},
    {key: '650 - 674', value: 650}
  ],

  creditScoreCustom: [
    {key: '800+', value: 800},
    {key: '775 - 799', value: 775},
    {key: '750 - 774', value: 750},
    {key: '725 - 749', value: 725},
    {key: '700 - 724', value: 700},
    {key: '675 - 699', value: 675},
    {key: '660 - 674', value: 660}
  ],

  businessTypes: [
    'Corporation (C Corp)',
    'LLC',
    'LP/LLP',
    'S Corp',
    'Other'
  ],

  staticContentType: {
    about: 'aboutUs',
    aboutSectionOne: 'aboutUsSectionOne',
    aboutSectionTwo: 'aboutUsSectionTwo',
    aboutSectionThree: 'aboutUsSectionThree',
    aboutSectionFour: 'aboutUsSectionFour',

    aboutSectionOneImg: 'aboutUsSectionOneImage',
    aboutSectionTwoImg: 'aboutUsSectionTwoImage',
    aboutSectionThreeImg: 'aboutUsSectionThreeImage',
    aboutSectionFourImg: 'aboutUsSectionFourImage',

    aboutWideOne: 'aboutUsWideOne',
    aboutWideTwo: 'aboutUsWideTwo',
    aboutWideThree: 'aboutUsWideThree',
    aboutWideFour: 'aboutUsWideFour',

    privacy: 'privacyPolicy',
    terms: 'termsAndConditions',
    contact_us: 'contactUs',
    showcase: 'showcase',
    loan_customizer: 'loanCustomizer',
    about_bayview: 'aboutBayview',
    sample_testimonial: 'sampleTestimonial',
    property_types: 'propertyTypes',
    programs: 'programs',
    new_section: 'newSection',
    new_section_link: 'newSectionLink',
    articles: 'articles',
    videos: 'videos',
    knowledge_base: 'knowledgeBase',
    frequently_asked_questions: 'frequentlyAskedQuestions',

    programs_article_one: 'programsArticleOne',
    programs_article_two: 'programsArticleTwo',
    programs_article_three: 'programsArticleThree',
  }

};
