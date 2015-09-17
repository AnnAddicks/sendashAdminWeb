var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Sendash Admin')
        .baseApiUrl('https://sendash.com/'); // main API endpoint
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

    var githubPayload = nga.entity('github').label('Github Payload');
    githubPayload.listView().fields([
        nga.field('receivedTimestamp')
            .label('Received'),
        nga.field('commits')
    ]);
    githubPayload.readOnly();
    admin.addEntity(githubPayload);

    admin.menu(nga.menu()
            .addChild(nga.menu(user).icon('<span class="glyphicon glyphicon-user"></span>'))
            .addChild(nga.menu(githubPayload).icon('<span class="glyphicon glyphicons-git-branch"></span>'))
    );

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