var myApp = angular.module('myApp', ['ng-admin']);

var sendash = 'https://sendash.com/';

//myApp.controller('clientsCtrl', ClientsCtrl)
//    .factory('clientApi', clientApi)
//    .constant('clientApiUrl', sendash + 'clients');

myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Sendash Admin')
        .baseApiUrl(sendash); // main API endpoint
    // create a user entity
    // the API endpoint for this entity will be 'http://jsonplaceholder.typicode.com/users/:id
    var user = nga.entity('user');
    // set the fields of the user entity list view
    user.listView().fields([
        nga.field('email'),
        nga.field('firstName')
            .label('First Name'),
        nga.field('lastName')
            .label('Last Name')
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
        .listActions(['edit', 'delete'])
        .batchActions(['<batch-approve type="accept" selection="selection"></batch-approve>',
            '<batch-approve type="reject" selection="selection"></batch-approve>',
            'delete']);


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
    pendingEndpoint.listView().listActions(['edit', 'delete']);

    pendingEndpoint.creationView().fields([
        nga.field('client.clientName')
            .label('Client Name'),
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

    admin.menu(nga.menu()
            .addChild(nga.menu(user).icon('<span class="glyphicon glyphicon-user"></span>'))
            .addChild(nga.menu(client).icon('<span class="glyphicon glyphicon-briefcase"></span>'))
            .addChild(nga.menu(endpoint).icon('<span class="glyphicon glyphicon-hdd"></span>'))
            .addChild(nga.menu(pendingEndpoint).icon('<span class="glyphicon glyphicon-tasks"></span>'))
            .addChild(nga.menu(githubPayload).icon('<span class="glyphicon glyphicon-object-align-vertical"></span>'))
    );


    var clientData = nga.entity('clients')
        .baseApiUrl(admin._baseApiUrl) // The base API endpoint can be customized by entity
        .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)


    nga.application().debug(true);
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
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