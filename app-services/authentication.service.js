(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$window', '$rootScope', '$timeout', '$q'];
    function AuthenticationService($http, $window, $rootScope, $timeout, $q) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.IsAuthenticated = IsAuthenticated;

        return service;

        function Login(username, password, callback) {
            var deferred = $q.defer();
            //curl -X POST -vu sendashWebApp:GoGoVCHeckProApp http://localhost:8191/sendash/oauth/token -H "Accept: application/json" -d "password=password&username=ann.addicks@test.com&grant_type=password&scope=read%20write&client_secret=GoGoVCHeckProApp&client_id=sendashWebApp"

            var user = {'username': username,
                        'password': password,
                        'grant_type': 'password',
                        'scope': 'read write',
                        'client_id': 'sendashWebApp',
                        'client_secret': 'GoGoVCHeckProApp'};

            var userInfo = {};
            var authdata = Base64.encode(user.client_id + ':' + user.client_secret);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $http({
                method: 'POST',
                url: "http://localhost:8191/sendash/oauth/token",
                data: $.param(user),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(result) {

                userInfo = {
                    accessToken: result.data.access_token,
                    refreshToken: result.data.refresh_token,
                    username: user.username
                };

                deferred.resolve(userInfo);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function SetCredentials(userInfo) {
            $window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + userInfo.accessToken;
        }

        function IsAuthenticated() {

            return $window.sessionStorage.getItem('userInfo') != null &&
                JSON.parse($window.sessionStorage.getItem('userInfo')).accessToken != null;
        }

        function ClearCredentials() {
            $window.sessionStorage.removeItem("userInfo");
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    }

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();