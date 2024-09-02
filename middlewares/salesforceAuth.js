const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

exports.getSalesforceToken = async (req, res) => {
    const { codeVerifier, code: authCode } = req.body;
    console.log('Received Auth Code:', authCode);
    console.log('Received Code Verifier:', codeVerifier);

    try {
        const data = qs.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.SALESFORCE_CONSUMER_KEY,
            client_secret: process.env.SALESFORCE_CONSUMER_SECRET,
            redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
            code: authCode,
            code_verifier: codeVerifier
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
    const { codeChallenge } = req.query;
    console.log("received code challenge : ", codeChallenge);
    const authorizationUrl = `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CONSUMER_KEY}&redirect_uri=${encodeURIComponent(process.env.SALESFORCE_REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    res.json({ url: authorizationUrl });
};
