import axios from 'axios';

export class GitHubAuthService {
    async exchangeCode(code: string): Promise<any> {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Get user info
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        return userResponse.data;
    }
}