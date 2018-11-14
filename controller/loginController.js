var api_url = 'https://onewoorks-solutions.com/api/zak/api';
var app_url = 'https://zak-v2.herokuapp.com';
var zakApp = angular.module('zakApp', []);

zakApp.controller('loginController', ['$scope', '$http', function ($scope, $http) {
        
        $scope.login = () => {
            var user = {
                username: $scope.username,
                password: $scope.password
            };
            $http({
                headers: {
                    'Content-Type': 'text/plain'},
                url: api_url + '/users/login',
                method: "POST",
                data: JSON.stringify(user)})
                    .then(function (response) {
                        var result = response.data.response;
                        if (!result.token) {
                            $scope.login.error = 'Nama pengguna dan password tidak sepadan.';
                        } else {
                            var lcUser = {
                                uid: result.id,
                                username:result.username,
                                full_name: result.full_name,
                                token: result.token
                            };
                            window.localStorage.setItem('user_session', JSON.stringify(lcUser));
                            verifySession();
                        }
                    });
        };

        verifySession();

    }]);