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