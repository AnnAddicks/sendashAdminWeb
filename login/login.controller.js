(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$rootScope', 'AuthenticationService', 'FlashService'];
    function LoginController( $location, $rootScope, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
            $rootScope.username = null;
        })();

        function login() {
            vm.dataLoading = true;
            var promise = AuthenticationService.Login(vm.username, vm.password)
                .then(function(userInfo){
                    AuthenticationService.SetCredentials(userInfo);
                    $rootScope.username = userInfo.username;
                    $location.path('/dashboard');

                }, function(failedReason) {
                    FlashService.Error(failedReason);
                    vm.dataLoading = false;
                });
        };
    }

})();
