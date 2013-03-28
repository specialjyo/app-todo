var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        "use strict";
        $routeProvider.when('/', { controller: TodoCtrl, templateUrl: 'index.html' });
    });
TodoApp.factory('Todo', function ($resource) {
    "use strict";
    return $resource('/rest/db/todo/:id/?app_name=todo&fields=*', {}, { update: { method: 'PUT' }, query: {
        method: 'GET',
        isArray: false
    } });
});
var TodoCtrl = function ($scope, Todo) {
    "use strict";
    $scope.action="Add";
    $scope.Todos = Todo.get();
    $scope.addItem = function(){
        Todo.save($scope.todo, function(data){
            $scope.Todos.record.push(data);
        });
    }
    $scope.editItem = function(){
        $scope.action = "Update";
        $scope.todo = angular.copy(this.todo);
    }
    $scope.updateItem = function () {
        var id = $scope.todo.id;
        Todo.update({id:id}, $scope.todo, function () {
            updateByAttr($scope.Todos.record, 'id', id, $scope.todo);
            $scope.action="Add";
            $scope.todo = {};
        });
    };
    $scope.deleteItem = function(){
        var id = this.todo.id;
        Todo.delete({ id:id }, function () {
            $("#row_" + id).fadeOut();
        });
    }
    $scope.toggleStrike = function(){
        var id= this.todo.id;
        $('#item_' + id).toggleClass('strike');
    }
var updateByAttr = function(arr, attr1, value1, newRecord){
        if(!arr){
            return false;
        }
        var i = arr.length;
        while(i--){
            if(arr[i] && arr[i][attr1] && (arguments.length > 2 && arr[i][attr1] === value1 )){
                arr[i] = newRecord;
            }
        }
        return arr;
    };

};


