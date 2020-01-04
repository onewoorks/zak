var zakApp = angular.module("zakApp", [])

zakApp.controller("loginController", [
    "$scope",
    "$http",
    function($scope, $http) {
        var keycloak = Keycloak('./keycloak.json')

        let verify_session = () => {
            var user_session = window.localStorage.getItem("user_session")
            if (user_session !== null) {
                window.location.href = "./home.html"
            }
        }

        keycloak
            .init({
                onLoad: "login-required",
                promiseType: "native"
            })
            .then(function(authenticated) {
                var lcUser = {
                    uid: keycloak.idTokenParsed.sub,
                    username: keycloak.idTokenParsed.preferred_username,
                    full_name: keycloak.idTokenParsed.name,
                    token: keycloak.token
                }
                window.localStorage.setItem(
                    "user_session",
                    JSON.stringify(lcUser)
                )
                verify_session()
            })
            .catch(function() {
                // alert('failed to initialize');
            })

        verify_session()
    }
])
