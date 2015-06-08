module.exports=function($http,restConfig,$resource,$location) {
	
	this.getRedirected=function(page, authRequired){
	    var request = $http({
	        method: "GET",
	        url: restConfig.server.restServerUrl+"Users/check"
	        });
	        request.success(function(data, status, headers, config) {
	        	if((authRequired && !data.connected) || (!authRequired && data.connected)){
	        		$location.path(page);
	    		}	    		
	        }).error(function(data, status, headers, config){
	            self.addMessage({type: "warning", content:"Erreur de connexion au serveur, statut de la réponse : "+status+"<br>"+data.message});
	        });
	}
};