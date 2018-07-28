zakApp.controller('tetapanKakitanganKakitanganController',['$scope','$http',function($scope,$http){
        console.log('ok');
        $scope.listRekod = {
            list: 0
        };
        $scope.paparPengguna = true;
        $scope.formPengguna = false;
        
        var getListUsers = () => {
            $http({
                url:api_url+'/tetapan/kakitangan',
                method:'GET',
            })
                    .then((response) => {
                        $scope.listRekod = response.data.result;
                    });
        };
        
        $scope.tambahPengguna = () => {
            $scope.paparPengguna = false;
            $scope.formPengguna = true;
        };
        
        $scope.daftarKakitangan = () => {
            console.log("tt");
            $scope.paparPengguna = true;
            $scope.formPengguna = false;
        };
        
        getListUsers();
}]);