angular.module('zakApp').controller('laporanUntungJualanController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.tarikhMula = ""
        $scope.tarikhAkhir = ""
        $scope.listEmasJual = []

        var getRekodJualanEmas = () => {
            $http.get(api_url + '/laporan/semua-jualan')
                .then(function (response) {
                    $scope.listEmasJual = response.data.result.itemize;
                    $scope.summary = response.data.result.summary;
                })
        }
        getRekodJualanEmas()

        var getRekodJualanEmasTarikh = (tarikh_mula, tarikh_akhir) => {
            $http({
                url: api_url + '/laporan/semua-jualan',
                method: 'get',
                params: {
                    tarikh_mula: dBdate(tarikh_mula),
                    tarikh_akhir: dBdate(tarikh_akhir)
                }
            })
                .then(function (response) {
                    $scope.listEmasJual = response.data.result.itemize;
                    $scope.summary = response.data.result.summary;
                });
        }

        $scope.buatCarian = () => {
            let tarikh_mula = $('[name=tarikh_mula]').val();
            let tarikh_akhir = $('[name=tarikh_akhir]').val();
            getRekodJualanEmasTarikh(tarikh_mula, tarikh_akhir)
        }
    }])