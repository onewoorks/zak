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

zakPrintApp.controller('printController', ['$scope', '$http', '$location', function ($scope, $http) {
        $scope.kedai = {
            namakedai: 'ZAK EMAS SERVICES',
            no_gst: 'No GST : 001225527296',
            alamatkedai: '97-A, Jalan Mewah 8, Medan Warisan, 26700 Muadzam Shah, Pahang Darul Makmur.',
            telefon: 'Tel: 09-452 5920 Fax: 09-452 5955 H/P: 019-934 9555'
        };


        var params = gf_getQueryParams();
        var resit_no = params.id;
        $scope.nobil = resit_no;

        $scope.tutupWindow = () => {
            close();
        };
        
        $scope.printResit = () => {
            print();
        }
        
        $http.get(api_url + '/transaksi/jualan-resit?id=' + resit_no)
                .then(function (response) {
                    var info = response.data.result;
                    $scope.jualkepada = {
                        namacawangan: info[0].nama_cawangan,
                        alamatkedai: info[0].alamat + ', ' + info[0].no_telefon + ', (No GST : ' + info[0].no_gst + ')'
                    };
                    $scope.tarikhini = info[0].tarikh_jual;
                    $scope.jumlahGst = priceSplit(info[0].total_gst, 0);
                    $scope.jumlahGstSen = priceSplit(info[0].total_gst, 1);
                    $scope.jumlah = priceSplit(info[0].total_harga, 0);
                    $scope.jumlahSen = priceSplit(info[0].total_harga, 1);
                    $scope.jumlahBesar = priceSplit((parseFloat(info[0].total_harga) + parseFloat(info[0].total_gst)), 0);
                    $scope.jumlahBesarSen = priceSplit((parseFloat(info[0].total_harga) + parseFloat(info[0].total_gst)), 1);
                    $scope.itemList = info;
//                    window.print();
                });


    }]);