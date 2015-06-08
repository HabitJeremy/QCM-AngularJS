module.exports=function($http,restConfig,$resource) {
	
	this.getToken=function(callback){
	    var request = $http({
	        method: "GET",
	        url: restConfig.server.restServerUrl+"Users/check"
	        });
	        request.success(function(data, status, headers, config) {
	            callback(data);
	        }).error(function(data, status, headers, config){
	            self.addMessage({type: "warning", content:"Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data.message});
	        });
	}
};