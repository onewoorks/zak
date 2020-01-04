var zakApp = angular.module("zakApp", [])

zakApp.controller("loginController", [
    "$scope",
    "$http",
    function($scope, $http) {
        var keycloak = Keycloak({
            realm: "pengurusan_emas",
            "auth-server-url": "https://sso.onewoorks-solutions.com/auth/",
            "ssl-required": "external",
            resource: "zak-v2-demo",
            "public-client": true,
            "confidential-port": 0,
            clientId: "zak-v2-demo"
        })

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
        let todo = location.search.split("d=")[1]
        if (typeof todo !== "undefined") {
            keycloak.logout(
                "https://sso.onewoorks-solutions.com/auth/realms/pengurusan_emas/protocol/openid-connect/logout?redirect_uri=encodedRedirectUri"
            )
            window.location.href = './login.html'
        }
    }
])
