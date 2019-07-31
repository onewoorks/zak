angular.module('zakApp').controller(
    'emasTarikJualController',
    ['$scope', '$http', 'generalController', '$location',
        function ($scope, $http, generalController, $location) {
            angular.extend($scope, generalController);
            $scope.berat_nak_jual = []
            $scope.jual_item = []
            $scope.jual_semua = true

            var getEmasProsesTarik = () => {
                $http.get(api_url + '/ambilemas/stok-emas-untuk-jual')
                    .then(function (response) {
                        $scope.listCawanganStok = response.data.result.itemize;
                        for (i = 0; i < $scope.listCawanganStok.length; i++) {
                            $scope.berat_nak_jual[i] = $scope.listCawanganStok[i].berat_stok
                            $scope.jual_item[i] = true
                        }
                    })
            }

            $scope.simpanStokTarik = () => {
                formData = []
                for (i = 0; i < $scope.listCawanganStok.length; i++) {
                    if ($scope.berat_nak_jual[i] > 0 && $scope.berat_nak_jual[i] != "") {
                        input = $scope.listCawanganStok[i]
                        input['berat_nak_jual'] = $scope.berat_nak_jual[i]
                        input['jual_item'] = $scope.jual_item[i]
                        $scope.listCawanganStok.splice(i, 1)
                        formData.push(input)
                        $scope.berat_nak_jual[i] = ""
                        $scope.jual_item[i] = ""
                    }
                }
                $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: api_url + '/ambilemas/buat-jualan-emas',
                    method: "POST",
                    data: JSON.stringify(formData)
                })
                    .then(function (response) {
                        $location.path("/transaksi-jualan");
                    });

            }

            getEmasProsesTarik();
        }]);
