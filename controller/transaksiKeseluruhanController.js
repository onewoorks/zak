angular.module("zakApp").controller("transaksiKeseluruhanController", [
    "$scope",
    "$http",
    function($scope, $http) {
        var getAliranTunai = () => {
            $http.get(api_url + "/rekod").then(function(response) {
                $scope.listAliranTunai = response.data.result
            })
        }

        $scope.tapis = {}

        $scope.tapisPilihan = () => {
            var tarikh_mula = $("[name=tarikh_mula]").val()
            var tarikh_akhir = $("[name=tarikh_akhir]").val()
            $http({
                url: api_url + "/rekod/aliran-tunai",
                type: "get",
                params: {
                    tarikh_mula: dBdate(tarikh_mula),
                    tarikh_akhir: dBdate(tarikh_akhir)
                }
            }).then(function(response) {
                if (response.data.total > 0) {
                    $scope.listAliranTunai = response.data.result
                }
            })
        }
        getAliranTunai()
    }
])
