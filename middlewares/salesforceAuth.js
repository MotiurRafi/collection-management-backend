const qs = require('qs');
const axios = require('axios')

exports.getSalesforceToken = async (req, res) => {
  const { code: authCode } = req.body;
  console.log('Received Auth Code:', authCode);

  try {
      const data = qs.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.SALESFORCE_CONSUMER_KEY,
          client_secret: process.env.SALESFORCE_CONSUMER_SECRET,
          redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
          code: authCode
      });

      const tokenResponse = await axios.post(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, data, {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });

      const { access_token, instance_url } = tokenResponse.data;
      res.status(200).json({ accessToken: access_token, instanceUrl: instance_url });
  } catch (error) {
      console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to exchange code for token', error: error.response ? error.response.data : error.message });
  }
};

exports.getAuthorizationUrl = (req, res) => {
  const authorizationUrl = `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CONSUMER_KEY}&redirect_uri=${encodeURIComponent(process.env.SALESFORCE_REDIRECT_URI)}`;
  res.json({ url: authorizationUrl });
};

exports.getSalesforceAuthorToken = async (req, res, next) => {
  const url = 'https://login.salesforce.com/services/oauth2/token';
  const payload = {
    grant_type: 'password',
    client_id: process.env.SALESFORCE_CONSUMER_KEY,
    client_secret: process.env.SALESFORCE_CONSUMER_SECRET,
    username: process.env.SALESFORCE_USERNAME,
    password: `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
  };

  try {
    const response = await axios.post(url, payload);
    req.access_token = response.data.access_token;
    next();
  } catch (error) {
    console.error("Error obtaining Salesforce access token:", error);
    res.status(500).json({ error: 'Failed to obtain Salesforce access token' });
  }
};
