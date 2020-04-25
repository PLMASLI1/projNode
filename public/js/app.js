var app = angular.module("app2020", []);

app.controller("Ctrl1", ["$scope", "$http", function($scope, $http) {
    var ctrl = this;

    ctrl.persons = [];
    ctrl.person_id = null;
    ctrl.person = {};

    ctrl.loadPersons = function() {
        $http.get("/persons").then(
            function(rep) {
                ctrl.persons = rep.data;
                if(!ctrl.person_id && ctrl.persons.length > 0) {
                    ctrl.person_id = ctrl.persons[0]._id;
                    ctrl.loadPerson();
                }
            },
            function(err) {
                ctrl.persons = [];
            }
        );
    };

    ctrl.loadPerson = function() {
        $http.get("/person?_id=" + ctrl.person_id).then(
            function(rep) {
                ctrl.person = rep.data;
                $scope.form1.$setPristine();
            },
            function(err) {
                ctrl.person = {};
            }
        );
    };

    ctrl.loadPersons();

    ctrl.changePerson = function() {
        $http.put("/person", ctrl.person).then(
            function(rep) {
                ctrl.loadPersons();
                ctrl.person = rep.data;
                $scope.form1.$setPristine();
            },
            function(err) {}    
        );
    }
}]);