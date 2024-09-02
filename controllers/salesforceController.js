const axios = require('axios');
require('dotenv').config();

const SALESFORCE_API_VERSION = process.env.SALESFORCE_API_VERSION || 'v61.0';

exports.createAccountAndContact = async (req, res) => {
    const { name, email, phone, accessToken, instanceUrl } = req.body
    try {
        const accountResponse = await axios.post(
            `${instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/sobjects/Account`,
            {
                Name: name,
                Phone: phone
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const accountId = accountResponse.data.id;

        await axios.post(
            `${instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/sobjects/Contact`,
            {
                LastName: name,
                Email: email,
                AccountId: accountId
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).send('Account and Contact created in Salesforce');
    } catch (error) {
        console.error('Salesforce error:', error);
        res.status(500).send('Failed to create Salesforce account');
    }
};

exports.checkSalesforceUser = async (req, res) => {
    const { email } = req.body;
    console.log("email : ", email)
    const query = `SELECT Id FROM Contact WHERE Email = '${email}'`;
    const url = `${process.env.SALESFORCE_INSTANCE_URL}/services/data/${process.env.API_VERSION}/query?q=${encodeURIComponent(query)}`;
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${req.access_token}` }
      });
  
      const contactExists = response.data.records && response.data.records.length > 0;
      res.json({ exists: contactExists });
    } catch (error) {
      console.error("Error checking Salesforce user:", error);
      res.status(500).json({ error: 'An error occurred while checking Salesforce user' });
    }
  };
  