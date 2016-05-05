var app = angular.module('todo', ['ngRoute', 'todoController', 'todoService', 'tasksheetService']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			templateUrl: "app.html",
			controller: "mainController"
		})
		.when('/NewTask',
		{
			templateUrl: "newtasksheet.html",
			controller: "mainController"
		})
		.when('/Alerts',
		{
			templateUrl: "alerts.html",
			controller: "alertController"
		})
		.when('/Recent',
		{
			templateUrl: "recent.html",
			controller: "tasksheetController"
		})
		.when('/:TaskID', 
		{
			templateUrl: "app.html",
			controller: "mainController"
		})
		.otherwise({ redirectTo: "/"});
}]);
