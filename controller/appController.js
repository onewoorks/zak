var api_url = 'http://localhost/zak_api/api';
var zakApp = angular.module('zakApp', ["ngRoute","AngularPrint"]);

zakApp.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "pages/dashboard.html"
            })
            .when("/transaksi-jualan", {
                templateUrl: "pages/transaksi/jualan.html"
            })
            .when("/rekod-jualan", {
                templateUrl: "pages/rekod/jualan.html",
                controller: 'rekodJualanController'
            })
            .when("/tetapan-cawangan", {
                templateUrl: "pages/tetapan/cawangan.html",
                controller: ''
            });
});

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateGST = (total, gstRate) => {
    return ((parseFloat(total) * parseFloat(gstRate) / 100)).toFixed(2);
};

const priceSplit = (price, arr) => {
    var cleanPrice = (parseFloat(price)).toFixed(2);
    var strPrice = cleanPrice.toString().split('.');
    return strPrice[arr];
};

zakApp.controller('transactionController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var itemList = [];

        $scope.kedai = {
            namakedai: 'ZAK EMAS SERVICES',
            no_gst: 'No GST : 001225527296',
            alamatkedai: '97-A, Jalan Mewah 8, Medan Warisan, 26700 Muadzam Shah, Pahang Darul Makmur.',
            telefon: 'Tel: 09-452 5920 Fax: 09-452 5955 H/P: 019-934 9555'
        }

        $scope.addToList = function () {
            var harga = (($scope.market - $scope.tolak) * $scope.berat).toFixed(2);
            var hargaSplit = harga.toString().split('.');
            var formData = {
                cawangan: $scope.cawangan,
                tarikh: $('input[name=tarikh]').val(),
                perkara: $scope.perkara,
                market: $scope.market,
                tolak: $scope.tolak,
                berat: $scope.berat,
                gst: $scope.gst,
                hargaGst: calculateGST(harga, $scope.gst),
                harga: numberWithCommas(hargaSplit[0]),
                hargaSen: hargaSplit[1],
                hargaClean: harga
            }

            itemList.push(formData);
            jumlahJualan();
            clearForm();
        };

        var clearForm = function () {
            $scope.market = '';
            $scope.gst = 6
            $scope.tolak = '';
            $scope.perkara = '';
            $scope.berat = '';
        };

        var jumlahJualan = function () {
            var totalHarga = 0;
            var totalGST = 0;
            var hargaPenuh = 0;
            for (var x in itemList) {
                totalHarga = parseFloat((parseFloat(totalHarga) + parseFloat(itemList[x]['hargaClean'])).toFixed(2));
                totalGST = parseFloat((totalGST + parseFloat(itemList[x]['hargaGst'])).toFixed(2));
                hargaPenuh = parseFloat((parseFloat(totalHarga) + parseFloat(totalGST)).toFixed(2));
            }

            $scope.jumlah = numberWithCommas(priceSplit(totalHarga, 0));
            $scope.jumlahSen = priceSplit(totalHarga, 1);
            $scope.jumlahGst = numberWithCommas(priceSplit(totalGST, 0));
            $scope.jumlahGstSen = priceSplit(totalGST, 1);
            $scope.jumlahBesar = numberWithCommas(priceSplit(hargaPenuh, 0));
            $scope.jumlahBesarSen = priceSplit(hargaPenuh, 1);
        };

        var senaraiCawangan = function () {
            $http.get(api_url + '/cawangan')
                    .then(function (response) {
                        $scope.listCawangan = response.data.result;
                    });
        };

        $scope.pickCawangan = function () {
            var selectedCawangan = $scope.cawangan;
            $http.get(api_url + '/cawangan/CawanganDetail?id=' + selectedCawangan)
                    .then(function (response) {
                        var jualkepada = response.data.result;
                        $scope.jualkepada = {
                            namacawangan: jualkepada.nama_cawangan,
                            alamatkedai: jualkepada.alamat + ', ' + jualkepada.no_telefon + ', (GST:' + jualkepada.no_gst + ')'
                        }
                    });
        }

        $scope.postJualan = function () {
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: api_url + '/transaksi/jualan',
                method: "POST",
                data: JSON.stringify(itemList)})
                    .then(function (response) {
                        console.log(response);
                    });
        };

        $scope.tambahCawangan = function () {
            var cawangan = $scope.modalcawangan;
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: api_url + '/cawangan/TambahCawangan',
                method: "POST",
                data: JSON.stringify(cawangan)})
                    .then(function () {
                        senaraiCawangan();
                    });
        };

        $scope.senaraiCawangan = senaraiCawangan()
        $scope.gst = 6;
        $scope.itemList = itemList;

    }]);

zakApp.controller('rekodJualanController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var getListJualan = () => {
            $http.get(api_url + '/transaksi/jualan')
                    .then(function (response) {
                        $scope.listJualan = response.data.result;
                    });
        };

        $scope.cetakInvois = (resit_no) => {
            window.open('http://localhost:8383/Zak_v2/pages/cetak/resit-jualan.html?id='+resit_no);
        };

        getListJualan();
    }]);

zakApp.controller('cawanganController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var getListCawangan = () => {
            $http.get(api_url + '/cawangan')
                    .then(function (response) {
                        console.log(response)
                        $scope.listCawangan = response.data.result
                    });
        };
        getListCawangan();
    }]);