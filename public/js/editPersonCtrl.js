var app = angular.module('app2020');

app.controller('EditPersonCtrl', ['$uibModalInstance', 'editPersonOptions', function($uibModalInstance, editPersonOptions) {
    var ctrl = this;

    ctrl.opt = editPersonOptions;

    ctrl.save = function() { $uibModalInstance.close('save'); };
    ctrl.delete = function() { $uibModalInstance.close('delete'); };
    ctrl.cancel = function() { $uibModalInstance.dismiss('cancel'); };

}]);