import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Octokit } from '@octokit/rest';
import {getUserCode,} from '../../../start/helpers/generateToken';

export default class GithubController {
  public async privateRepos({ response }: HttpContextContract) {
    try {
      const  USER_ACCESS_TOKEN: string | undefined = await getUserCode();
      
      const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

      if(USER_ACCESS_TOKEN && USER_ACCESS_TOKEN !== undefined){
        const octokit = new Octokit({
          auth: `${USER_ACCESS_TOKEN}`
        })
        
        const res = await octokit.request('GET /user/repos', {
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        response.json(res.data);
      }
    } catch (error) {
      console.error('Error:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
