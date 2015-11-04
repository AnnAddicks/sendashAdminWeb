var adminApp = angular
        .module('app', ['ng-admin'])
        .run(run);

//const sendash = 'https://sendash.com/';
const sendash = 'http://localhost:8191/sendash/api/admin/';

adminApp.config(['NgAdminConfigurationProvider', 'RestangularProvider', function (nga, RestangularProvider) {
    // create an admin application
    var admin = nga.application('Sendash Admin')
        .baseApiUrl(sendash);

    var user = nga.entity('user');
    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('email'),
        nga.field('firstName')
            .label('First Name'),
        nga.field('lastName')
            .label('Last Name'),
        nga.field('roles', 'embedded_list')
            .label('Roles')
            .targetFields([ 
                nga.field('name')
                    .label('')
            ]),
        nga.field('client', embedded_list)
            .targetFields([ 
                nga.field('name')
                    .label('')
             ])

    ]);
    user.listView().listActions(['edit', 'delete']);

    user.creationView().fields([
        nga.field('email', 'email'),
        nga.field('firstName')
            .label('First Name'),
        nga.field('lastName')
            .label('Last Name')
    ]);
    // use the same fields for the editionView as for the creationView
    user.editionView().fields(user.creationView().fields());

    admin.addEntity(user);

    var client = nga.entity('client');
    // set the fields of the user entity list view
    client.listView().fields([
        nga.field('id'),
        nga.field('name')
    ]);
    client.listView().listActions(['edit', 'delete']);

    client.creationView().fields([
        nga.field('name')

    ]);
    // use the same fields for the editionView as for the creationView
    client.editionView().fields(client.creationView().fields());
    admin.addEntity(client);



    var endpoint = nga.entity('endpoint');
    // set the fields of the user entity list view
    endpoint.listView().fields([
        nga.field('id'),
        nga.field('client.name')
            .label('Client Name'),
        nga.field('hostName')
            .label('Host Name'),
        nga.field('apiKey')
            .label('API Key'),
        nga.field('updateScriptRequest', 'datetime')
            .label('Last Request')
    ]);
    endpoint.listView()
        .listActions(['edit', 'delete']);

    endpoint.creationView().fields([
        nga.field('client.id', 'reference')
            .label('Client Name')
            .targetEntity(client)
            .targetField(nga.field('name'))
            .attributes({ placeholder: 'Select one' }),
        nga.field('hostName')
            .label('Host Name'),
        nga.field('apiKey')
            .label('API Key')
    ]);
    // use the same fields for the editionView as for the creationView
    endpoint.editionView().fields(endpoint.creationView().fields());
    admin.addEntity(endpoint);



    var pendingEndpoint = nga.entity('pending-endpoint');
    // set the fields of the user entity list view
    pendingEndpoint.listView().fields([
        nga.field('client.clientName')
            .label('Client Name'),
        nga.field('hostName')
            .label('Host Name'),
        nga.field('apiKey')
            .label('API Key')
    ]);
    pendingEndpoint.listView()
        .listActions(['edit', 'delete'])
        .batchActions(['<batch-approve type="accept" selection="selection"></batch-approve>',
            '<batch-approve type="reject" selection="selection"></batch-approve>',
            'delete']);

    pendingEndpoint.creationView().fields([
        nga.field('client.id', 'reference')
            .label('Client Name')
            .targetEntity(client)
            .targetField(nga.field('name'))
            .attributes({ placeholder: 'Select one' }),
        nga.field('hostName')
            .label('Host Name'),
        nga.field('apiKey')
            .label('API Key')
    ]);
    // use the same fields for the editionView as for the creationView
    pendingEndpoint.editionView().fields(pendingEndpoint.creationView().fields());
    admin.addEntity(pendingEndpoint);


    var githubPayload = nga.entity('github').label('Github Payload');
    githubPayload.listView().fields([
        nga.field('receivedTimestamp', 'datetime')
            .label('Received'),
        nga.field('commits')
    ]);
    githubPayload.listView().title('Github Payloads List');
    githubPayload.readOnly();
    admin.addEntity(githubPayload);


    admin.header(require('./header.html'));
    admin.menu(nga.menu()
            .addChild(nga.menu(user).icon('<span class="glyphicon glyphicon-user"></span>'))
            .addChild(nga.menu(client).icon('<span class="glyphicon glyphicon-briefcase"></span>'))
            .addChild(nga.menu(endpoint).icon('<span class="glyphicon glyphicon-hdd"></span>'))
            .addChild(nga.menu(pendingEndpoint).icon('<span class="glyphicon glyphicon-tasks"></span>'))
            .addChild(nga.menu(githubPayload).icon('<span class="glyphicon glyphicon-object-align-vertical"></span>'))
    );

    nga.configure(admin);
}]);


adminApp.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        parent: 'main',
        url: '/login',
        controller: 'LoginController',
        controllerAs: 'vm',
        templateUrl: 'login/login.view.html'
    });
}]);

adminApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._page = (params._page - 1);
            }
        }
        return { params: params };
    });


}]);

adminApp.controller('username', ['$scope', '$window', '$location', function($scope, $window, $location) { // used in header.html
    if($window.sessionStorage.getItem('userInfo')) {
        $scope.username = JSON.parse($window.sessionStorage.getItem('userInfo')).username;
    }
    else {
        $location.path("/login");
    }
}]);



run.$inject = ['$rootScope', '$location',  '$http', 'AuthenticationService', 'Restangular'];
function run($rootScope, $location,  $http, AuthenticationService, Restangular) {

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = AuthenticationService.IsAuthenticated();
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
            Restangular.setDefaultHeaders({});
        }
        else {
            //Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + AuthenticationService.GetToken()});
        }
    });
}
