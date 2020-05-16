var app = angular.module("app2020");

app.controller("PersonsCtrl", ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal) {
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

    ctrl.personClick = function(_id) {
        $http.get('/person?_id=' + _id).then(
            function(rep) {
                var options = { data: rep.data };
                // open modal window with person data
                editPerson(options);
            },
            function() {}
        );
    };

    ctrl.newPerson = function() {
        var options = { data: { firstName: '', lastName: '', email: '', yearofbirth: 1990 }, noDelete: true };
        // open modal window with empty data
        editPerson(options);
    }

    var editPerson = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editPersonDialog.html',
            controller: 'EditPersonCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editPersonOptions: function () {
                    return options;
                }
            }
        });

        modalInstance.result.then(
            function (ret) {
                if(ret == 'delete') {
                    $http.delete('/person?_id='+options.data._id).then(
                        function(ret) {
                            ctrl.loadPersons();
                        },
                        function(err) {}
                    );
                } else if(ret == 'save') {
                    if(options.data._id) {
                        $http.put('/person', options.data).then(
                            function(ret) {
                                var n = ctrl.persons.findIndex(function(el) { 
                                    return el._id == ret.data._id 
                                }); // find the first element with specified _id
                                ctrl.persons[n] = ret.data;
                            },
                            function(err) {}
                        );
                    } else {
                        $http.post('/person', options.data).then(
                            function(ret) {
                                ctrl.loadPersons();
                            },
                            function(err) {}
                        );
                    }
                }
            },
            function (ret) {}
        );
    }

}]);