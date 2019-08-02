angular.module('zakApp').controller('laporanUntungJualanController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.testlu = "ok proceed"
        $scope.listEmasJual = []

        var getRekodJualanEmas = () => {
            $http.get(api_url + '/laporan/semua-jualan')
                .then(function (response) {
                    console.log(response.data.result)
                    $scope.listEmasJual = response.data.result.itemize;
                    $scope.summary = response.data.result.summary;
                })
        }

        getRekodJualanEmas()
    }])