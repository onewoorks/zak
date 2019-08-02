angular.module('zakApp').controller('laporanUntungJualanController',['$scope','$http', 
function($scope,$http){
    $scope.testlu = "ok proceed"

    var getRekodJualanEmas = () => {
        $http.get(api_url + '/laporan/semua-jualan')
                    .then(function (response) {
                        $scope.listCawanganStok = response.data.result.itemize;
                        $scope.summary = response.data.result.summary;
                        for (i = 0; i < $scope.listCawanganStok.length; i++) {
                            $scope.berat_nak_jual[i] = $scope.listCawanganStok[i].berat_stok
                            $scope.jual_item[i] = true
                        }
                    })
    }
}])