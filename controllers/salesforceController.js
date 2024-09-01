const axios = require('axios');
require('dotenv').config();

const SALESFORCE_API_VERSION = process.env.SALESFORCE_API_VERSION;

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