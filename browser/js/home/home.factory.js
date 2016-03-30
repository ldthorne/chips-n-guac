app.factory("HomeFactory", function($http){
	return {
		sendToChipotle: function(data){
			return $http.post('/api/chipotle', data)
		}
	};
});



