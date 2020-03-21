var app = angular.module("its2020d", []);

app.controller("Ctrl1", ["$http", function($http) {
    var ctrl = this;

    ctrl.person = {};

    $http.get("/person").then(
        function(rep) {
            ctrl.person = rep.data;
        },
        function(err) {}
     );

     ctrl.send = function() {
         $http.post("/person", ctrl.person).then(
            function(rep) {
                ctrl.person = rep.data;
            },
            function(err) {}    
         );
     }
}]);