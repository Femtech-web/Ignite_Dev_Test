import Route from '@ioc:Adonis/Core/Route';


Route.group(() => {
  Route.get('private', 'GitHubController.privateRepos'); 
}).prefix('api/repo/');
