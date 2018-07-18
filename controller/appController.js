var api_url = 'https://onewoorks-solutions.com/api/zak/api';
var app_url = 'https://zak-v2.herokuapp.com';
var zakApp = angular.module('zakApp', ["ngRoute", "AngularPrint", 'oitozero.ngSweetAlert']);

zakApp.config(function ($routeProvider) {
    var localStorage = window.localStorage;

    if (localStorage.getItem('user_session') === null) {
        window.location.href = './login.html';
    }

    $routeProvider
            .when("/", {
                templateUrl: "pages/dashboard.html"
            })
            .when("/transaksi-jualan", {
                templateUrl: "pages/transaksi/jualan.html"
            })
            .when('/transaksi-aliran-tunai', {
                templateUrl: "pages/transaksi/aliran-tunai.html"
            })
            .when('/transaksi-aliran-bank', {
                templateUrl: "pages/transaksi/aliran-duit-bank.html"
            })
            .when('/transaksi-buang-aliran',{
                templateUrl: "pages/transaksi/buang-rekod-aliran.html"
            })
            .when('/rekod-transaksi-keseluruhan', {
                templateUrl: "pages/rekod/transaksi-keseluruhan.html"
            })
            .when('/rekod-transaksi-keseluruhan-bank', {
                templateUrl: "pages/rekod/transaksi-keseluruhan-bank.html"
            })
            .when('/rekod-semakan-ikut-pilihan', {
                templateUrl: "pages/rekod/semakan-ikut-pilihan.html"
            })
            .when('/rekod-semakan-rekod-baki-terakhir', {
                templateUrl: "pages/rekod/semakan-rekod-baki-terakhir.html"
            })
            .when('/rekod-laporan-bulanan', {
                templateUrl: "pages/rekod/laporan-bulanan.html"
            })
            .when('/rekod-laporan-harian', {
                templateUrl: "pages/rekod/laporan-harian.html"
            })
            .when('/rekod-laporan-keuntungan-jualan-emas', {
                templateUrl: "pages/rekod/laporan-keuntungan-jualan-emas.html"
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

const currentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    ;
    var year = now.getFullYear();
    return day + '/' + month + '/' + year;
}

var isNumberKey = (evt, val) => {
    var key = evt.key;
    var obj = {};
    var str = $(val).val();
    for (x = 0, length = str.length; x < length; x++) {
        var l = str.charAt(x);
        if (l === '.') {
            obj['dot'] = 1;
        }
    }
    const allowNumber = (obj.dot) ? '0123456789' : '.0123456789';
    if (key != 'Enter') {
        return (allowNumber.indexOf(key) > -1) ? true : false;
    }
};

const kedai = {
    namakedai: 'ZAK EMAS SERVICES',
    no_gst: '(TR0068938-T) No GST : 001225527296',
    alamatkedai: 'No 20, (A), Jalan Mahkota, 25000 Kuantan Pahang',
    telefon: 'Tel: 09-514 6555 Fax: 09-512 4750'
};


zakApp.controller('user_navigation', ['$scope', function ($scope) {
        $scope.logout = () => {
            window.localStorage.removeItem('user_session');
            window.location.href = './login.html';
        };

        var user_session = JSON.parse(window.localStorage.getItem('user_session'));

        $scope.profile = {
            username: user_session.username,
            full_name: user_session.full_name
        };
    }]);

zakApp.service("generalController",function($http,$q){
    var generalFunction = {};
    
    generalFunction.listOfCawangan = () => {
        return $http.get(api_url + '/cawangan')
            .then(function(response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function(response) {
                return $q.reject(response.data.result);
            });
    };
    
    return generalFunction;
});

zakApp.controller('alirantunaiController', ['$scope', '$http','generalController', function ($scope, $http, generalController) {
        angular.extend($scope,generalController);
        $scope.listOfCawangan().then(function(response){
            $scope.listCawangan = response;
        });
        
        $scope.perkara = '';
        $scope.cawangan = '';
        $scope.tarikh = currentDate();
        $scope.jenis = '';
        $scope.jumlah = '';
        $scope.beratEmas = '';
        $scope.nilai = '';
        $scope.transaksi = "masuk";
        $scope.selectCawangan = false;
        
        $scope.pilihCawangan = () => {
            $scope.selectCawangan = ($scope.cawangan) ? true : false;
        };

        var awlist = [];
        $scope.awlist = awlist;

        $scope.addToList = () => {
            addToList();
        };
        
        $scope.daftarAw = () => {
            daftarAw();
        };

        var clearForm = () => {
            $scope.perkara = '';
            $scope.cawangan = '';
            $scope.tarikh = currentDate();
            $scope.transaksi = 'masuk';
            $scope.nilai = '';
            $scope.berat = '';
            $scope.jumlah = '';
        };

        var kiraJumlah = () => {
            var masuk = 0;
            var keluar = 0;
            var berat_emas = 0;
            var nilai = 0;

            angular.forEach(awlist, function (value, key) {
                masuk = (parseFloat(masuk) + parseFloat(value.jenis_masuk));
                keluar = (parseFloat(keluar) + parseFloat(value.jenis_keluar));
                berat_emas = (parseFloat(berat_emas) + parseFloat(value.emas_berat));
                nilai = (parseFloat(nilai) + parseFloat(value.nilai));
            });

            var jumlah = {
                masuk: masuk,
                keluar: keluar,
                berat_emas: berat_emas,
                nilai: nilai
            };

            return jumlah;
        };

        addToList = () => {
            
            var data = {
                pid: (awlist.length),
                tarikh: $scope.tarikh,
                perkara: $scope.perkara,
                cawangan: $scope.cawangan.id,
                cawangan_nama: $scope.cawangan.nama_cawangan,
                jenis_masuk: ($scope.transaksi === 'masuk') ? $scope.jumlah : 0,
                jenis_keluar: ($scope.transaksi === 'keluar') ? $scope.jumlah : 0,
                emas_berat: $scope.berat,
                nilai: $scope.nilai,
                jumlah: $scope.jumlah
            };
            awlist.push(data);
            $scope.jumlah = kiraJumlah();
            $scope.awlist = awlist;
            clearForm();
        };
        
        $scope.removeAw = (item) => {
          angular.forEach(awlist, function(value,key){
              if(awlist[key].pid===item){
                  awlist.splice(key,1);
              }
          });
          $scope.awlist = awlist;
        };

        daftarAw = () => {
            console.log('daftar aliran tunai');
            console.log(awlist);
        };
        

    }]);

zakApp.controller('transactionController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        var itemList = [];
        $scope.latestResit = 0;
        $scope.beforeSave = 'hidden';
        $scope.printOnly = 'hidden';
        $scope.kedai = kedai;
        $scope.tarikh = currentDate();
        $scope.harga_besar = 0;

        $scope.kiraHarga = function () {
            var harga = ((($scope.market - $scope.tolak) * 0.02646) * $scope.berat).toFixed(2);
            $scope.harga_besar = isNaN(harga) ? 'RM 0.00' : 'RM ' + harga;
        };

        $scope.addToList = function () {
            var harga = ((($scope.market - $scope.tolak) * 0.02646) * $scope.berat).toFixed(2);
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

        $scope.senaraiCawangan = senaraiCawangan();
        $scope.gst = 6;
        $scope.itemList = itemList;

    }]);

zakApp.controller('transaksiKeseluruhanController',['$scope','$http', function($scope, $http){
        var getAliranTunai = () => {
            $http.get(api_url + '/rekod')
                    .then(function(response){
                        $scope.listAliranTunai = response.data.result;
                        console.log(response.data.result);
            });
        };
        
        getAliranTunai();
}]);

zakApp.controller('transaksiKeseluruhanBankController',['$scope','$http', function($scope, $http){
        var getAliranBank = () => {
            $http.get(api_url + '/rekod/semua-aliran-bank')
                    .then(function(response){
                        $scope.listAliranBank = response.data.result;
                        console.log(response.data.result);
            });
        };
        
        getAliranBank();
}]);

zakApp.controller('rekodJualanController', ['$scope', '$http', '$location', 'SweetAlert', function ($scope, $http, $location, SweetAlert) {
        var getListJualan = () => {
            $http.get(api_url + '/transaksi/jualan')
                    .then(function (response) {
                        $scope.listJualan = response.data.result;
                    });
        };

        $scope.cetakInvois = (resit_no) => {
            window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + resit_no);
        };


        $scope.deleteInvois = (resit_no) => {
            SweetAlert.swal({
                title: "Buang invois ini?",
                text: "Adakah anda pasti untuk membuang invois ini daripada rekod?!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3e8f3e", confirmButtonText: "Ya Buang!",
                cancelButtonText: "Batal!",
                closeOnConfirm: false,
                closeOnCancel: false},
                    function (isConfirm) {
                        if (isConfirm) {
                            deleteInvois(resit_no);
                        } else {
                            SweetAlert.swal("Pembatalan", "Rekod invois ini tidak dibuang dari sistem", "error");
                        }
                    });
        };


        var deleteInvois = (resit_no) => {
            var info = {
                resit_no: resit_no
            };
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: api_url + '/transaksi/invoice',
                method: "DELETE",
                data: JSON.stringify(info)})
                    .then(function () {
                        getListJualan();
                        SweetAlert.swal("Berjaya!", "Rekod invois telah dibuang.", "success");
                    });
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

        $scope.openModalCawangan = (x) => {
            $('#editCawangan').modal('show');
            $http.get(api_url + '/cawangan/cawangan_detail?id=' + x)
                    .then(function (response) {
                        var cawangan = response.data.result;
                        $scope.modalcawangan = {
                            nama: cawangan.nama_cawangan,
                            alamat: cawangan.alamat,
                            notelefon: cawangan.no_gst,
                            nogst: cawangan.no_telefon,
                            id: cawangan.id
                        };
                    });
        };

        $scope.kemaskiniCawangan = () => {
            var cawangan = $scope.modalcawangan;
            $http({
                headers: {
                    'Content-Type': 'application/json'},
                url: api_url + '/cawangan/kemaskini_cawangan',
                method: "PUT",
                data: JSON.stringify(cawangan)})
                    .then(function () {
                        getListCawangan();
                        $scope.modalcawangan = {};
                    });
        }
        getListCawangan();
    }]);

zakApp.controller('aliranbankController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.tarikh = currentDate();
        var listAliran = [];
        $scope.transaksi = 'masuk';

        $scope.addToList = () => {
            addToList();
        };

        $scope.rekodAb = () => {
            rekodAb();
        };

        $scope.listAliranBank = listAliran;

        var clearForm = () => {
            $scope.perkara = '';
            $scope.nilai = '';
            $scope.tarikh = currentDate();
        };

        var kiraJumlah = () => {
            var masuk = 0;
            var keluar = 0;

            angular.forEach(listAliran, function (value, key) {
                masuk = (parseFloat(masuk) + parseFloat(value.jenis_masuk));
                keluar = (parseFloat(keluar) + parseFloat(value.jenis_keluar));
            });

            var jumlah = {
                masuk: masuk,
                keluar: keluar
            };

            return jumlah;
        };

        var addToList = () => {
            var data = {
                tarikh: $scope.tarikh,
                perkara: $scope.perkara,
                bank: $scope.bank,
                jenis_masuk: ($scope.transaksi === 'masuk') ? $scope.nilai : 0,
                jenis_keluar: ($scope.transaksi === 'keluar') ? $scope.nilai : 0
            };
            listAliran.push(data);
            $scope.jumlah = kiraJumlah();
            clearForm();
        };

        var rekodAb = () => {

        };


    }]);