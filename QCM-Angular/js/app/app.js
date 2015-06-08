								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  MODULE APP ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var app = angular.module("qcmApp", ["ngResource", "ngRoute", "ngCookies"]).
config(['$routeProvider', '$locationProvider', '$httpProvider', require("./../config/routing")]).
factory("config", require("./../config/configFactory")).
service("rest",["$http","$resource","$location","config","$sce", require("./../services/rest")]).
service("servCheckUser",["$http","config","$resource", require("./../services/servCheckUser")]).
service("servRedirect",["$http","config","$resource","$location", require("./../services/servRedirect")]);


								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  MAINCONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("MainController", ["$http","config","$cookieStore","$scope","$location","rest","servCheckUser",function($http,restConfig,$cookieStore,$scope,$location,rest,servCheckUser){

	// :::::::::::::::::::::::::::::: permet de checker la connection ::::::::::::::::::::::::::::	
	$scope.checkConnexion=false;
	servCheckUser.getToken(function(data){
		if(data.connected){
			$scope.checkConnexion=true;
		}
	});
	
	
	// :::::::::::::::::::::::::::::: permet la connection ::::::::::::::::::::::::::::	
	$scope.UserConnexion = {};
	$scope.authValid=true;
	// fonction pour se connecter
	$scope.connectUser = function(){
		rest.postUser($scope.UserConnexion, "Users/connect", function(user){
			if(user.connected){	
				// création du cookie utilisateur
				$cookieStore.put("user",user.token);
				$scope.checkConnexion=true;
				// on redirige vers Questionnaires
				$location.path("/Questionnaires");
			}else{
				$scope.authValid=false;
			}
		});
	}
	
	// :::::::::::::::::::::::::::::: permet l'inscription ::::::::::::::::::::::::::::	
	$scope.UserInscription = {};
	// fonction pour s'inscrire
	$scope.addUser = function(){
		rest.postUser($scope.UserInscription, "Users/add", function(result){
			console.log(result);
		});
	}
	
	
	// ::::::::::::::::::::::::::::::  fonction pour se déconnecter (button menu) ::::::::::::::::::::::::::
	$scope.disconnectUser = function(){
		rest.get($scope.value, "Users/disconnect", function(result){
			$scope.checkConnexion=false;
			$scope.authValid=true;
			// on redirige vers Connexion
			$location.path("/");
		});
	}

}]);


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::  NOTCONNECTED CONTROLLER  (connexion, inscription, pageInaccessible)::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



app.controller("NotConnectedController", ["$scope","rest","$routeParams","servRedirect","$location", function($scope,rest,$routeParams,servRedirect,$location){
	servRedirect.getRedirected("/Questionnaires",false); // on vérifie que l'utilisateur est pas connecté , si oui il est redirigé vers /Questionnaires false=authRequired
}]);


								//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  QUESTIONS CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("QuestionsController", ["$scope","rest","$routeParams","servRedirect","$location", function($scope,rest,$routeParams,servRedirect,$location){
	servRedirect.getRedirected("/PageInaccessible",true); // on vérifie que l'utilisateur est connecté , sinon il est redirigé vers /PageInaccessible  true=authRequired
	$scope.idQuestionnaire=$routeParams.id;
	$scope.data={};
	$scope.data.questionnaire;
	rest.getAll($scope.data, "questionnaires/"+$scope.idQuestionnaire,undefined,"questionnaire");
	$scope.data.questions={};
	rest.getAll($scope.data, "questions/questionnaire/"+$scope.idQuestionnaire,function(questions){
		for(index in questions){
			rest.getAll(questions[index], "reponses/question/"+questions[index].id,undefined,"reponses");			
		}		
	},"questions");	
}]);


								//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  QUESTIONNAIRE CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("QuestionnairesController", ["$scope","rest","$location","servRedirect",function($scope,rest,$location,servRedirect){
	servRedirect.getRedirected("/PageInaccessible",true); // on vérifie que l'utilisateur est connecté , sinon il est redirigé vers /PageInaccessible true=authRequired
	$scope.data={};
	$scope.data.questionnaires;
	rest.getAll($scope.data, "questionnaires",undefined,"questionnaires");
}]);


									//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
									// ::::::::::::::::::::::::::::::::::::::::::::  PROFIL CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
									// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("ProfilController", ["rest","$scope","servRedirect",function(rest,$scope,servRedirect){
	servRedirect.getRedirected("/PageInaccessible",true); // on vérifie que l'utilisateur est connecté , sinon il est redirigé vers /PageInaccessible true=authRequired
	$scope.UserProfil="";
	
}]);

