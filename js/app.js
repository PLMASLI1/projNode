var app = angular.module("its2020", []);

app.controller("Ctrl1", [ "$interval", "$http", function($interval, $http) {
    console.log("The first controller");

    var ctrl = this;

    /* $interval(function() {
        ctrl.x++;
    }, 5000); */

    ctrl.getDane = function() {
        $http.get("/dane").then(
            function(rep) {
                console.log(rep);
                ctrl.x = rep.data.balance;
            },
            function(err) {
                console.log(err);
            }
        );            
    }
    ctrl.postDane = function() {
        $http.post("/dane", {"x": ctrl.x}).then(
            function(rep) {
                console.log(rep);
                ctrl.x = rep.data.balance;
            },
            function(err) {
                console.log(err);
            }
        );            
    }
}]);