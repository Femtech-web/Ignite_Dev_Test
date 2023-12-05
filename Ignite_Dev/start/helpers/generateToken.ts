import axios, { AxiosResponse } from 'axios';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

interface DeviceCode {
  verification_uri: string;
  user_code: string;
  device_code: string;
  interval: number;
};

interface TokenResponse {
  access_token: string;
};

async function requestToken(deviceCode: string, clientID: string): Promise<TokenResponse> {
  const uri = 'https://github.com/login/oauth/access_token';
  const headers = { Accept: 'application/json' };
  const grant_type = 'urn:ietf:params:oauth:grant-type:device_code';
  const data = {
    client_id: clientID,
    device_code: deviceCode,
    grant_type,
  };

  try {
    const response = await axios.post(uri, data, { headers });
    return { access_token: response.data.access_token };
  } catch (error) {
    throw error;
  }
}

async function pollForToken(deviceCode: string, clientID: string): Promise<TokenResponse> {
  try {
    const token = await requestToken(deviceCode, clientID);
    return token;
  } catch (error) {
    throw error;
  }
}

async function requestDeviceCode(): Promise<DeviceCode> {
  const uri = 'https://github.com/login/device/code';
  const headers = { 'Accept': 'application/json' };
  const data = { client_id: CLIENT_ID };

  try {
    const response: AxiosResponse = await axios.post(uri, data, { headers });
    
    console.log(response.data);
    return response.data as DeviceCode;
  } catch (error) {
    throw new Error('Failed to obtain device code');
  }
}

async function login(): Promise<TokenResponse> {
  try {
    const { device_code, user_code, verification_uri, interval } = await requestDeviceCode();

    console.log(`Please visit: ${verification_uri}`);
    console.log(`and enter code: ${user_code}`);

    return new Promise((resolve) => {
      const pollInterval = setInterval(async () => {
        const token = await pollForToken(device_code, CLIENT_ID);

        if (token.access_token) {
          clearInterval(pollInterval);
          console.log('Successfully authenticated!');
          console.log("access_token" + ' ' + token.access_token);
          resolve(token);
        }
      }, interval * 1000);
    });
  } catch (error) {
    throw error;
  }
};

export async function getUserCode(): Promise<string | undefined> {
  try {
    const { access_token } = await login();
    return access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

