const axios = require('axios');
require('dotenv').config();

exports.getSalesforceToken = async (req, res) => {
  const { codeVerifier, code: authCode } = req.body;
  console.log('Received codeVerifier:', codeVerifier);
  console.log('Received authCode:', authCode);
    try {
    const tokenResponse = await axios.post(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CONSUMER_KEY,
      client_secret: process.env.SALESFORCE_CONSUMER_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
      code: authCode,
      code_verifier: codeVerifier
    });
    console.log("tokenResponse : ", tokenResponse.data)
    const { access_token, instance_url } = tokenResponse.data;
    res.status(200).json({ accessToken: access_token, instanceUrl: instance_url });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to exchange code for token');
  }
};

exports.getAuthorizationUrl = (req, res) => {
  const { codeChallenge } = req.query;
  const authorizationUrl = `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CONSUMER_KEY}&redirect_uri=${encodeURIComponent(process.env.SALESFORCE_REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  res.json({ url: authorizationUrl });
};
