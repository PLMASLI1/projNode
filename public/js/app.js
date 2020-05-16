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

// common service
app.service('common', [ '$uibModal', function($uibModal) {
    var common = this;
    
    // logged user
    common.login = null;
    common.role =  0;

}]);

// SP skeleton controller
app.controller("BodyCtrl", ['$scope', '$location', '$http', '$uibModal', 'routes', 'common', function($scope, $location, $http, $uibModal, routes, common) {
    var ctrl = this;

    // who am I
    $http.get('/login').then(
        function(rep) {
            common.login = rep.data.login;
            common.role = rep.data.role;
        },
        function(err) {}
    );

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

    // login/logout icon
    ctrl.loginIcon = function() {
        return common.login ? common.login + '&nbsp;<span class="fa fa-lg fa-sign-out"></span>' : '<span class="fa fa-lg fa-sign-in"></span>';
    };

    // login function
    ctrl.login = function() {
        if(common.login) {
            // log out
            $http.delete('/login').then(
                function(rep) {
                    common.login = null;
                    common.role = 0;
                    console.log('Logout');
                },
                function(err) {}
            );
        } else {
            // log in
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'loginDialog.html',
                controller: 'LoginCtrl',
                controllerAs: 'ctrl',
            });
    
            modalInstance.result.then(
                function(ret) { 
                    if(ret) {
                        console.log('Witaj na pokładzie, ' + ret);
                    } else {
                        console.log('Logowanie nieudane');
                    }
                },
                function() {}
            );
    
        }
    };
    
}]);