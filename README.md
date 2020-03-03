# cd.com

Docusign Integration
-

**How it works:**

- When user gets to the General Authorization form of Full Application. Front end page will send an ajax request to server. Server will first check if that document is already signed or not if yes then it will send the status back and if not then it will check whether the evelope is already created or not it yes then it will generate a new signing url to be opened in iframe and if no then it will send a request to docusign to create a new envelope and then get the signing url to be opened in iframe.
- When the envelope is generated the co borrowers (if any) will receive the email along with their singing url. Once they sign that docusign will send a request to /docusign-success API of commercial direct app. that API will save the status in the database and check if full application is submitted or not if not then it won't do anything and if yes then it will update the docusign sign status on salesforce.

SalesForce Integration
-

Need to find the Record Type ID from Leads object and add that ID into env file.

Need to modify following objects on Sales Force

1. Leads:
    -	Add a new field labeled ‘Lead Progress’ typed ‘Text’; with field name ‘Lead_Progress’ and the API key should be ‘Lead_Progress\__c’
    -	Add a new field labeled ‘Full Application URL’ typed ‘URL’; with field name ‘Full_Application_URL’ and the API key should be ‘Full_Application_URL\__c’
    - Add a new field labeled 'Custom ID' typed 'Farmula' of 'Text' type and the farmula should be 'Id' (to duplicate lead Id); and API key should be 'Custom_ID__c'.

2. Fee:
    -	Add a new field labeled ‘Is Payment Allowed’ typed ‘Checkbox’; with field name ‘Is_Payment_Allowed’ and the API key should be ‘Is_Payment_Allowed\__c’
    -	Add a new field labeled ‘Payment Type’ typed ‘Text’; with field name ‘Payment_Type’ and the API key should be ‘Payment_Type\__c’
    -	Add a new field labeled ‘Payment Transaction ID’ typed ‘Text’; with field name ‘Payment_Transaction_ID’ and the API key should be ‘Payment_Transaction_ID\__c’

3. Loan:
    - Add a new field labeled 'Custom ID' typed 'Text' whose values needs to be copied from Leads -> Custom ID object to map that loan object to lead object.

**How it works:**
- When a user is save the information after filling the Loan Calculator, App also creates a lead on Salesforce with all the details.
- When user completes the Quick Application, app also update the information of lead at salesforce.
- If user start the Full application then app will update the lead progress to 'startFullApplication' on salesforce.
- On each step of full application, app will generate a pdf and upload that PDF to s3 bucket and update the url along with the progress to the lead object.
- Once user completed the full application and click on submit button after reviewing it, app will map the complete application into salesforce "Commercial Loan Application" Object and post it on sales force.
- When co borrowers sign the general authorization document, app will get a callack from docusign and will first check whether the full appication has already been submitted or not. If it has been submitted then it will updated the "Commercial Loan Application" object on salesforce. If not then it will just save it in the database.
- Payments verfication is also checked and updated on Salesforce.

PayPal Integration
-
**How it works:**
- Once the lead has been converted to loan object on Salesforce then Salesforce admin will create a new Fee object with 'Is Payment Allowed' flagged being true.
- Once Fee object is created admin will send an email to user with a url to CD website to pay fees. That url should contain the email address of user e.g. https://commercialdirect.com/payFees?email=abc@def.xyz.
- Once user open the url from the email. App will first verify whether the email address exists in our database or not.
- If yes, then it will check whether user has already paid fees or not
   - If yes, then it will show a message to user that 'This user has already paid'
   - If no, then it will query the Salesforce to get Fee object that has 'Is Payment Allowed' being true and will get the remaining fee amount.
     - After that it will ask user to choose their preferred payment method. Currently app only support 'PayPal' payment gateway.
     - User can click on 'PayPal' button and provide payment info.
     - Once payment is done app will verify the payment by payment token and then update User's object locally and Fee object on Salesforce and redirect user to success page.
