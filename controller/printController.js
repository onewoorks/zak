var api_url = 'https://onewoorks-solutions.com/api/zak/api';
var zakPrintApp = angular.module('zakPrintApp', []);

const priceSplit = (price, arr) => {
    var cleanPrice = (parseFloat(price)).toFixed(2);
    var strPrice = cleanPrice.toString().split('.');
    return strPrice[arr];
};

var gf_getQueryParams = function () {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
};

const kedai = {
    namakedai: 'ZAK EMAS SERVICES',
    no_gst: '(TR0068938-T) No GST : 001225527296',
    alamatkedai: 'No 20, (A), Jalan Mahkota, 25000 Kuantan Pahang',
    telefon: 'Tel: 09-514 6555 Fax: 09-512 4750'
};

zakPrintApp.controller('printController', ['$scope', '$http', '$location', function ($scope, $http) {
        $scope.kedai = kedai;

        var params = gf_getQueryParams();
        var resit_no = params.id;
        $scope.nobil = resit_no;

        $scope.tutupWindow = () => {
            close();
        };
        
        $scope.printResit = () => {
            print();
        };
        
        $http.get(api_url + '/transaksi/jualan-resit?id=' + resit_no)
                .then(function (response) {
                    var info = response.data.result;
                    $scope.jualkepada = {
                        namacawangan: info[0].nama_cawangan,
                        alamatkedai: info[0].alamat,
                        notelefon: 'No Tel: '+info[0].no_telefon + ', No GST : ' + info[0].no_gst 
                    };
                    $scope.tarikhini = info[0].tarikh_jual;
                    $scope.jumlahGst = priceSplit(info[0].total_gst, 0);
                    $scope.jumlahGstSen = priceSplit(info[0].total_gst, 1);
                    $scope.jumlah = priceSplit(info[0].total_harga, 0);
                    $scope.jumlahSen = priceSplit(info[0].total_harga, 1);
                    $scope.jumlahBesar = priceSplit((parseFloat(info[0].total_harga) + parseFloat(info[0].total_gst)), 0);
                    $scope.jumlahBesarSen = priceSplit((parseFloat(info[0].total_harga) + parseFloat(info[0].total_gst)), 1);
                    $scope.itemList = info;
                });
    }]);