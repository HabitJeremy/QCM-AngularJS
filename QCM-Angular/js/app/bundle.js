(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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









},{"./../config/configFactory":2,"./../config/routing":3,"./../services/rest":4,"./../services/tokenService":5}],2:[function(require,module,exports){
module.exports=function() {
	var factory={questions:{},server:{},reponses:{},questionnaire:{}};
	factory.activeBrewery=undefined;
	factory.questions.loaded=false;
	factory.questions.refresh="all";//all|ask
	factory.questions.update="immediate";//deffered|immediate
	factory.server.privateToken="";
	factory.server.restServerUrl="http://192.168.1.15/rest-qcm/";
	factory.server.force=false;
	return factory;
};
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports=function($http,$resource,$location,restConfig,$sce) {
	var self=this;
	if(angular.isUndefined(this.messages))
		this.messages=new Array();
	
	this.getParams=function(){
		return '?token='+restConfig.server.privateToken+'&force='+restConfig.server.force;
	}
	this.headers={ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
	    	'Accept': 'application/json'
	    	};
	this.getAll=function(response,what,callback,name){
		if(angular.isUndefined(name))
			name=what;
		var request = $http({
		    method: "GET",
		    url: restConfig.server.restServerUrl+what+this.getParams(),
		    headers: {'Accept': 'application/json'},
		    callback: 'JSON_CALLBACK'
		});
		request.success(function(data, status, headers, config) {
			response[name]=data;
			//restConfig[name].all=data;
			restConfig[name]=data;
			response.load=false;
			if(angular.isDefined(callback))
				callback(data);
		}).
		error(function(data, status, headers, config) {
			self.addMessage({type: "danger", content: "Erreur de connexion au serveur, statut de la réponse : "+status});
			console.log("Erreur de connexion au serveur, statut de la réponse : "+status);
		});
	};
	this.addMessage=function(message){
		content=$sce.trustAsHtml(message.content);
		self.messages.push({"type":message.type,"content":content});
	};
	
	this.post=function(response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["Accept"] = "application/json";

		var request = $http({
		    method: "POST",
		    url: restConfig.server.restServerUrl+what+this.getParams(),
		    data: response.posted,
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.addMessage(data.message);
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(data, status, headers, config){
			self.addMessage({type: "warning", content:"Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data.message});
		});
	};
	
	/* --------------------- POST UTILISATEUR --------------------- */
	this.postUser=function(response,what,callback){
		var request = $http({
		    method: "POST",
		    url: restConfig.server.restServerUrl+what+this.getParams(),
		    data: $.param(response.posted),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback(data);
			}
		}).error(function(data, status, headers, config){
			self.addMessage({type: "warning", content:"Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data});
		});
	};
	/* ----------------------------------------------------------- */
	this.get=function(response,what,callback){
		var request = $http({
		    method: "GET",
		    url: restConfig.server.restServerUrl+what+this.getParams()
		});
		request.success(function(data, status, headers, config) {
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback(data);
			}
		}).error(function(data, status, headers, config){
			self.addMessage({type: "warning", content:"Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data});
		});
	};
	
	this.put=function(id,response,what,name,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		$http.defaults.headers.post["Accept"] = "text/plain";
		var request = $http({
		    method: "PUT",
		    url: restConfig.server.restServerUrl+what+'/'+id+this.getParams(),
		    data: response.posted,
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.addMessage(data.message);
			if(angular.isUndefined(callback)){
				$location.path("/"+what);
			}else{
				callback();
			}
		}).error(function(data, status, headers, config){
			self.addMessage({type: "warning", content: "Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data.message});
		});
	};
	
	this.remove=function(object,what,callback){
		if(angular.isUndefined(callback))
			this.clearMessages();
		var request = $http({
		    method: "DELETE",
		    url: restConfig.server.restServerUrl+what+'/'+object.id+this.getParams(),
		    headers: self.headers
		});
		request.success(function(data, status, headers, config) {
			self.addMessage(data.message);
			if(angular.isDefined(callback)){
				callback();
			}
		}).error(function(data, status, headers, config){
			self.addMessage({type: "warning", content: "Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data.message});
		});
	};
	
	this.clearMessages=function(){
		self.messages.length=0;
	};
};
},{}],5:[function(require,module,exports){
module.exports=function(rest) {
	
	this.getToken=function(){
		stockResult=[];
		valConnected=false;
		valResult={};
		rest.get(stockResult, "Users/check", function(result){
			if(result.connected){
				valConnected=true;
				valResult=result;
			}
		});
		return '?connected='+valConnected+'&tokenResult='+valResult;
	};
};
},{}]},{},[1]);
