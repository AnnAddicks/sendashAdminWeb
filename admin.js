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
        nga.field('firstName'),
        nga.field('lastName'),
        nga.field('email')
    ]);
    // add the user entity to the admin application
    admin.addEntity(user)
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