function clientSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            $scope.userClients = {};
            Restangular
                .all('client')
                .getList()
                .then(clients => {
                    $scope.userClients = clients.data.map(client=>{return {label: client.name, value: client.id}});
                });
        },
        template: '<select multiple class="form-control ui-select-search ng-pristine ng-valid ng-touched" style="outline:0;" field="::field" ng-options="client.label for client in userClients track by client.value"></select>'
    };
}

clientSummary.$inject = ['Restangular'];

export default clientSummary;