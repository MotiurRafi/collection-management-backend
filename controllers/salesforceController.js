const axios = require('axios');
require('dotenv').config();
const SALESFORCE_LOGIN_URL = 'https://login.salesforce.com';
const SALESFORCE_CONSUMER_KEY = process.env.SALESFORCE_CONSUMER_KEY;
const SALESFORCE_REDIRECT_URI = process.env.SALESFORCE_REDIRECT_URI;
const SALESFORCE_API_VERSION = process.env.SALESFORCE_API_VERSION;

exports.getAuthorizationUrl = (req, res) => {
  const authorizationUrl = `${SALESFORCE_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${SALESFORCE_CONSUMER_KEY}&redirect_uri=${encodeURIComponent(SALESFORCE_REDIRECT_URI)}`;
  res.json({ url: authorizationUrl });
};

exports.createAccountAndContact = async (req, res) => {
  const { name, email, phone, accessToken, instanceUrl } = req.body
  try {
    const accountResponse = await axios.post(
      `${instanceUrl}/services/data/${SALESFORCE_API_VERSION}/sobjects/Account`,
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
      `${instanceUrl}/services/data/${SALESFORCE_API_VERSION}/sobjects/Contact`,
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