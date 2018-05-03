var api_url = 'https://onewoorks-solutions.com/api/zak/api';
var app_url = 'https://zak-v2.herokuapp.com';
var zakApp = angular.module('zakApp', ["ngRoute", "AngularPrint"]);

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

const kedai = {
    namakedai: 'ZAK EMAS SERVICES',
    no_gst: '(TR0068938-T) No GST : 001225527296',
    alamatkedai: 'Lot G 23A, Ground Floor, Kuantan Parade, Jalan Haji, Abdul Rahman, 25000 Kuantan, Pahang',
    telefon: 'Tel: 09-514 6555 Fax: 09-512 4750'
};

zakApp.controller('transactionController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var itemList = [];
        $scope.latestResit = 0;
        $scope.beforeSave = 'hidden';
        $scope.printOnly = 'hidden';
        $scope.kedai = kedai;

        $scope.addToList = function () {
            var harga = (($scope.market - $scope.tolak) * $scope.berat).toFixed(2);
            var hargaSplit = harga.toString().split('.');
            $scope.beforeSave = '';
            $scope.tarikhini = $('input[name=tarikh]').val();
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
            };

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
        $scope.printOnlyBtn = () => {
            window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + $scope.latestResit);
        };

        $scope.postJualan = function () {
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: api_url + '/transaksi/jualan',
                method: "POST",
                data: JSON.stringify(itemList)})
                    .then(function (response) {
                        var no_resit = response.data.response.no_resit;
                        $scope.latestResit = no_resit;
                        $scope.printOnly = '';
                        $scope.beforeSave = 'hidden';
                        window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + no_resit)
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
                        $scope.modalcawangan = {}
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
            window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + resit_no);
        };

        getListJualan();
    }]);

zakApp.controller('cawanganController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var getListCawangan = () => {
            $http.get(api_url + '/cawangan')
                    .then(function (response) {
                        $scope.listCawangan = response.data.result;
                    });
        };
        getListCawangan();
    }]);
