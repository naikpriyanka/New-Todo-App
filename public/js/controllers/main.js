var todoApp = angular.module('todoController', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

todoApp.filter('limitFromTo', function(){
    return function(input, from, to){
        return (input != undefined)? input.slice(from, to) : '';
    }
});

todoApp.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
    	return moment(date).format('YYYY/MM/DD');
	};
});

// inject the Todo service factory into our controller
todoApp.controller('mainController', ['$scope', '$routeParams', 'Todos', function($scope, $routeParams, Todos) {

		$scope.minDate = new Date();

		$scope.formData = {};
		$scope.loading = true;
		$scope.count = 0;

		$scope.todos = [];  
  		$scope.itemsPerPage = 5;
  		$scope.currentPage = 1;  
  		$scope.maxSize = 3;
		
		if($routeParams.TaskID) {
			var id = $routeParams.TaskID;
			Todos.getTodoForId(id)
				.success(function(data) {
					$scope.loading = false;
                	$scope.formData = {}; // clear the form so our user is ready to enter another
                	$scope.todos = data;  // assign our new list of todos
            	});	
		} else {
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				for(var i = 0; i < data.length; i++) {
      				$scope.todos.push(data[i]);
      			}
				$scope.loading = false;
			});
		}	
		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if($scope.formData.text != undefined) {
				$scope.loading = true;
				
				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
                		$scope.formData = {}; // clear the form so our user is ready to enter another
                		$scope.todos = data;  // assign our new list of todos
            		});	
			}
    	};
    	
    	// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};
		
		// UPDATE ==================================================================
		// update a todo after checking it
		$scope.updateTodo = function($event, id) {
			$scope.loading = true;
			var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			
			Todos.update(id, action)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};
		
		//If the end date has already past
		$scope.isGone = function (val, done) {
        	var isRed = false;
        	if (moment(val).isBefore(moment().format('YYYY-M-D')) && done != 1) {
            	isRed = true;
        	}
        	return isRed;
    	};
    	
    	$scope.updateAllTodos = function($event) {
    		$scope.loading = true;
    		var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			Todos.get()
				.success(function(data) {
					for(var i = 0; i < data.length; i++) {
						Todos.update(data[i].id, action)
							.success(function(data) {
								$scope.loading = false;
								$scope.todos = data; // assign our new list of todos
							});
					}
				});
    	};
		
}]);

todoApp.controller('alertController', ['$scope','Todos', function($scope, Todos) {
		$scope.formData = {};
		$scope.loading = true;
		
		$scope.todos = [];  
  		$scope.itemsPerPage = 5;
  		$scope.currentPage = 1;  
  		$scope.maxSize = 3;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.loading = false;
      			for(var i = 0; i < data.length; i++) {
      				if (moment(data[i].endDate).isBefore(moment().format('YYYY-M-D')) && data[i].done != 1) {
      					$scope.todos.push(data[i]);
      				}
      			}
      			$scope.count = $scope.todos.length;
			});
    	
    	// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = []; // assign our new list of todos
      				for(var i = 0; i < data.length; i++) {
      					if (moment(data[i].endDate).isBefore(moment().format('YYYY-M-D')) && data[i].done != 1) {
      						$scope.todos.push(data[i]);
      					}
      				}
      				$scope.count = $scope.todos.length;
				});
		};
		
		// UPDATE ==================================================================
		// update a todo after checking it
		$scope.updateTodo = function($event, id) {
			$scope.loading = true;
			var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			
			Todos.update(id, action)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = []; // assign our new list of todos
      				for(var i = 0; i < data.length; i++) {
      					if (moment(data[i].endDate).isBefore(moment().format('YYYY-M-D')) && data[i].done != 1) {
      						$scope.todos.push(data[i]);
      					}
      				}
      				$scope.count = $scope.todos.length;
				});
		};
		
		$scope.updateAllTodos = function($event) {
    		$scope.loading = true;
    		var checkbox = $event.target;
			var action = (checkbox.checked ? 'done' : 'undone');
			Todos.get()
				.success(function(data) {
					for(var i = 0; i < data.length; i++) {
						Todos.update(data[i].id, action)
							.success(function(data) {
								$scope.loading = false;
								$scope.todos = data; // assign our new list of todos
							});
					}
				});
    	};
}]);

todoApp.controller('tasksheetController', ['$scope', '$filter', 'Tasksheets', function($scope, $filter, Tasksheets) {
		$scope.formData = {};
		$scope.loading = true;

		$scope.tasksheets = []; 
  		$scope.itemsPerPage = 5;
  		$scope.currentPage = 1;  
  		$scope.maxSize = 3; 
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Tasksheets.get()
			.success(function(data) {
				for(var i = 0; i < data.length; i++) {
      				$scope.tasksheets.push(data[i]);
      			}
				$scope.loading = false;
				angular.forEach($scope.tasksheets, function(tasksheet){
         			tasksheet.formattedCreatedOn = $filter('date')(new Date(tasksheet.createdOn),'MMM dd, yyyy  -  hh:mm a');
      			});
			});
	
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTasksheet = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if($scope.formData.title != undefined) {
				$scope.loading = true;
				
				// call the create function from our service (returns a promise object)
				Tasksheets.create($scope.formData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
                		$scope.tasksheets = data;  // assign our new list of todos
                		angular.forEach($scope.tasksheets, function(tasksheet){
         					tasksheet.formattedCreatedOn = $filter('date')(new Date(tasksheet.createdOn),'MMM dd, yyyy  -  hh:mm a');
      					});
            		});	
			}
    	};
    	
    	// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTasksheet = function(id) {
			$scope.loading = true;

			Tasksheets.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.tasksheets = data;  // assign our new list of todos
                	angular.forEach($scope.tasksheets, function(tasksheet){
         				tasksheet.formattedCreatedOn = $filter('date')(new Date(tasksheet.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
		};
		
		// UPDATE ==================================================================
		// update a todo after checking it
		$scope.updateTasksheet = function($event, id) {
			$scope.loading = true;
			
			Tasksheets.update(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.tasksheets = data;  // assign our new list of todos
                	angular.forEach($scope.tasksheets, function(tasksheet){
         				tasksheet.formattedCreatedOn = $filter('date')(new Date(tasksheet.createdOn),'MMM dd, yyyy  -  hh:mm a');
      				});
				});
		};
}]);



// todoApp.directive("mydatepicker", function () {
//   	return {
//     	restrict: "A",
//     	require: "ngModel",
//     	link: function (scope, elem, attrs, ngModelCtrl) {
//       		var updateModel = function (dateText) {
//         		scope.$apply(function () {
//           			ngModelCtrl.$setViewValue(dateText);
//         		});
//       		};
//       		var options = {
//         		dateFormat: "yy-mm-dd",
//         		onSelect: function (dateText) {
//           			updateModel(dateText);
//         		},
//         		minDate: -0
//             		// maxDate: "+1M +10D"
//       		};
//       		elem.datepicker(options);
//     	}
//   	}
// });



// 		var element = angular.element(document.querySelector('.md-datepicker-input'));
// 		element.attr("ng-click","ctrl.openCalendarPane($event)");
// 		element.attr("ng-focus","");
// 		element.attr("ng-blur","");
// 		$compile(element)($scope);
// 		
// 		var element2 = angular.element(document.querySelector('.md-datepicker-input-container'));
// 		element2.attr("ng-class","");
// 		$compile(element2)($scope);

// 		var element = angular.element(document.querySelector('.md-datepicker-button md-icon-button md-button md-ink-ripple'));
// 		element.attr("class", "md-datepicker-button md-icon-button md-button md-ink-ripple pull-right");
// 		$compile(element)($scope);

