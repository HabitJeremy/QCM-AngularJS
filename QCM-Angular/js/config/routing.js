module.exports=function($routeProvider,$locationProvider,$httpProvider) {
	$httpProvider.defaults.withCredentials = true;
	$routeProvider.
		when('/Questionnaires', {
			templateUrl: 'view/Questionnaire.html',
			controller: 'QuestionnairesController'
		}).
		when('/Connexion', {
			templateUrl: 'view/Connexion.html',
			controller:'NotConnectedController'
		}).
		when('/Inscription', {
			templateUrl: 'view/Inscription.html',
			controller:'NotConnectedController'
		}).
		when('/Questionnaire/:id', {
			templateUrl: 'view/Question.html',
			controller: 'QuestionsController'
		}).
		when('/Profil', {
			templateUrl: 'view/Profil.html',
			controller:'ProfilController'
		}).
		when('/PageInaccessible', {
			templateUrl: 'view/PasEncoreInscrit.html',
			controller:'NotConnectedController'
		}).otherwise({
			redirectTo: '/Connexion'
		});
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
};