var app = angular.module("app2020", ['ngSanitize', 'ngAnimate', 'ngRoute', 'ui.bootstrap']);

// router menu
app.constant('routes', [
    { route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
    { route: '/example', templateUrl: 'exampleView.html', controller: 'ExampleCtrl', controllerAs: 'ctrl', menu: 'Przykład' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Osoby' }
]);

// router installation
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('');
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i]);
	}
	$routeProvider.otherwise({ redirectTo: '/' });
}]);

// SP skeleton controller
app.controller("BodyCtrl", ['$scope', '$location', 'routes', function($scope, $location, routes) {
    var ctrl = this;

    // navigation building
    ctrl.menu = [];
    for (var i in routes) {
        ctrl.menu.push({route: routes[i].route, title: routes[i].menu});
    }
    
    // controlling collapsed/not collapsed status
    ctrl.isCollapsed = true;
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true;
    });

    // determining which menu position is active
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : '';
    };

}]);
