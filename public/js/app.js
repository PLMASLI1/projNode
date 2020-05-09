var app = angular.module("app2020", []);

app.controller("Ctrl1", ["$scope", "$http", function($scope, $http) {
    var ctrl = this;

    ctrl.persons = [];
    ctrl.skip = 0;
    ctrl.limit = 10;
    ctrl.search = '';
    ctrl.filtered = 0;
    ctrl.count = 0;

    ctrl.loadPersons = function() {
        $http.get("/persons?skip=" + ctrl.skip + "&limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.persons = rep.data.data;
                ctrl.filtered = rep.data.filtered;
                ctrl.count = rep.data.count;
                        },
            function(err) {
                ctrl.persons = [];
                ctrl.filtered = 0;
                ctrl.count = 0;                        }
        );
    };

    ctrl.loadPersonsWithZeroSkip = function() {
        ctrl.skip = 0;
        ctrl.loadPersons();
    };

    ctrl.loadPersons();

    ctrl.prev = function() {
        ctrl.skip -= ctrl.limit;
        ctrl.loadPersons();
    };

    ctrl.next = function() {
        ctrl.skip += ctrl.limit;
        ctrl.loadPersons();
    };

}]);