const axios = require('axios');

const JIRA_INSTANCE = process.env.JIRA_INSTANCE;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;

const createJiraUser = async (email, name) => {
    try {
        const response = await axios.post(
            `${JIRA_INSTANCE}/rest/api/3/user`,
            {
                emailAddress: email,
                displayName: name,
                notification: false
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.accountId;
    } catch (error) {
        console.error('Error creating user in Jira:', error.message);
        return null;
    }
};

const checkUserExistsInJira = async (email) => {
    try {
        const response = await axios.get(
            `${JIRA_INSTANCE}/rest/api/3/user/search?query=${email}`,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.length > 0;
    } catch (error) {
        console.error('Error checking user in Jira:', error.message);
        return false;
    }
};

exports.createJiraTicket = async (req, res) => {
    const { email, name, summary, priority, collection, link } = req.body;

    try {
        console.log('Request Data:', req.body);

        let userExists = await checkUserExistsInJira(email);
        let accountId;

        if (!userExists) {
            console.log('Creating new user in Jira');
            accountId = await createJiraUser(email, name);
            if (!accountId) throw new Error('Failed to create user in Jira');
        } else {
            console.log('User already exists in Jira');
            const userResponse = await axios.get(
                `${JIRA_INSTANCE}/rest/api/3/user/search?query=${email}`,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            accountId = userResponse.data[0].accountId;
        }

        console.log('Creating ticket with accountId:', accountId);

        const ticketResponse = await axios.post(
            `${JIRA_INSTANCE}/rest/api/3/issue`,
            {
                fields: {
                    project: { key: "SUP" },
                    summary: summary,
                    description: `Collection: ${collection}\nLink: ${link}`,
                    issuetype: { name: "Task" },
                    priority: { name: priority },
                    reporter: { id: accountId },
                    customfield_10053: link,
                    customfield_10047: collection
                }
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Ticket created successfully:', ticketResponse.data);
        res.json({ key: ticketResponse.data.key, success: true });
    } catch (error) {
        console.error('Error creating Jira ticket:', error.message);
        res.status(500).json({ success: false, message: 'Failed to create Jira ticket or user', error: error.message });
    }
};
