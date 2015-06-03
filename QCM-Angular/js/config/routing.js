module.exports=function($routeProvider,$locationProvider,$httpProvider) {
	$httpProvider.defaults.withCredentials = true;
	$routeProvider.
		when('/Questionnaires', {
			templateUrl: 'view/Questionnaire.html',
			controller: 'QuestionnairesController'
		}).
		when('/Connexion', {
			templateUrl: 'view/Connexion.html',
			controller: 'ConnexionController'
		}).
		when('/Inscription', {
			templateUrl: 'view/Inscription.html',
			controller: 'InscriptionController'
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
			templateUrl: 'view/PasEncoreInscrit.html'
		}).otherwise({
			redirectTo: '/Connexion'
		});
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
};