import axios, { AxiosResponse } from 'axios';

async function getInstallationID(token: string): Promise<any> {
  try {
    const APP_PRIVATE_KEY: string | undefined = process.env.GITHUB_APP_PK;

    if (!APP_PRIVATE_KEY) {
      throw new Error('GitHub App private key not provided.');
    }

    const response: AxiosResponse = await axios.get('https://api.github.com/app/installations', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error; 
  }
}

export default getInstallationID;
