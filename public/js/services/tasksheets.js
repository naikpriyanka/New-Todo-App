angular.module('tasksheetService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Tasksheets', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/tasksheet');
			},
			create : function(tasksheetData) {
				return $http.post('/api/tasksheet', tasksheetData);
			},
			delete : function(id) {
				return $http.delete('/api/tasksheet/' + id);
			},
			update : function(id) {
				return $http.put('/api/tasksheet/' + id);
			}
		}
		
	}]);