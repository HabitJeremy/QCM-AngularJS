								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  MODULE APP ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var app = angular.module("qcmApp", ["ngResource", "ngRoute", "ngCookies"]).
config(['$routeProvider', '$locationProvider', '$httpProvider', require("./../config/routing")]).
factory("config", require("./../config/configFactory")).
service("rest",["$http","$resource","$location","config","$sce", require("./../services/rest")]).
service("tokenService",["rest", require("./../services/tokenService")]);


								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  MAINCONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("MainController", ["$cookieStore","$scope","$window","$location","rest","tokenService",function($cookieStore,$scope,$window,$location,rest,tokenService){

	// :::::::::::::::::::::::::::::: permet de checker la connection ::::::::::::::::::::::::::::
	$scope.checkConnexion=false;
	StockResult=tokenService.getToken();
	if(StockResult.connected){
		$scope.checkConnexion=true;
		console.log("connecté");
		console.log(StockResult.connected+" "+StockResult.tokenResult);		
	}else{
		console.log("Non connecté");
		console.log(StockResult.connected+" "+StockResult.tokenResult);		
	}
	
	/*rest.get($scope.value, "Users/check", function(result){
		if(result.connected){
			$scope.checkConnexion=true;
			/*if($location.path()=="/Connexion" || $location.path()=="/Inscription" || $location.path()=="/PageInaccessible"){
				// on redirige vers Questionnaires
				$location.path("/Questionnaires");
			}
		}else{
			if($location.path()!="/Connexion" && $location.path()!="/Inscription" && $location.path()!="/PageInaccessible"){
				// on redirige vers Questionnaires
				$location.path("/PageInaccessible");
			}
		}
	});*/
	
	// ::::::::::::::::::::::::::::::  fonction pour se déconnecter (bouton menu) ::::::::::::::::::::::::::
	$scope.disconnectUser = function(){
		rest.get($scope.value, "Users/disconnect", function(result){
			// permet de reload index.html = header + mainCtrl
			$window.location.reload();
			// on redirige vers Connexion
			$location.path("/");
		});
	}
}]);


								//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  QUESTIONS CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("QuestionsController", ["$scope","rest","$routeParams", function($scope,rest,$routeParams){
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


app.controller("QuestionnairesController", ["$scope","rest",function($scope,rest){
	$scope.data={};
	$scope.data.questionnaires;
	rest.getAll($scope.data, "questionnaires",undefined,"questionnaires");
}]);

			
								//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// ::::::::::::::::::::::::::::::::::::::::::::  INSCRIPTION CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("InscriptionController", ["$scope","rest",function($scope,rest){
	$scope.UserInscription = {};
	var data = {posted: $scope.UserInscription};
	$scope.addUser = function(){
		rest.postUser(data, "Users/add",function(result){
			console.log(result);
		});
	}
}]);


								//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::: CONNEXION CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
								// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


app.controller("ConnexionController", ["$cookieStore","$window","$location","$scope","rest",function($cookieStore,$window,$location,$scope,rest){
	$scope.UserConnexion = {};
	var data = {posted: $scope.UserConnexion};
	// fonction pour se connecter
	$scope.connectUser = function(){
		rest.postUser(data, "Users/connect", function(user){
			if(user.connected){	
				// création du cookie utilisateur
				$cookieStore.put("user",user.token);
				// on reload le header = mainCtrl + menu
				$window.location.reload();
				// on redirige vers Questionnaires
				$location.path("/Questionnaires");
			}else{
				console.log("Non connecté");
			}
		});
	}
}]);


									//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
									// ::::::::::::::::::::::::::::::::::::::::::::  PROFIL CONTROLLER ::::::::::::::::::::::::::::::::::::::::::::::::::::::
									// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.controller("ProfilController", ["rest","$scope", function(rest,$scope){
	$scope.UserProfil="";
	/*rest.get($scope.UserProfil, "Users/", function(result){
		if(result.connected){
			$scope.checkConnexion=true;
			if($location.path()=="/Connexion" || $location.path()=="/Inscription" || $location.path()=="/PageInaccessible"){
				// on redirige vers Questionnaires
				$location.path("/Questionnaires");
			}
		}else{
			if($location.path()!="/Connexion" && $location.path()!="/Inscription" && $location.path()!="/PageInaccessible"){
				// on redirige vers Questionnaires
				$location.path("/PageInaccessible");
			}
		}
	});*/
}]);








