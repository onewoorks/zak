// var api_url = 'http://localhost/zak_api/api';
// var app_url = 'http://localhost/Zak_v2/public_html/home.html'

var api_url = 'https://onewoorks-solutions.com/api/zak/api';
var app_url = 'https://zak-v2.herokuapp.com';

var zakApp = angular.module('zakApp', ["ngRoute", "AngularPrint", 'oitozero.ngSweetAlert']);

var localStorage = window.localStorage;
var user_session = JSON.parse(localStorage.getItem('user_session'));

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
        .when("/transaksi-jualan-lama", {
            templateUrl: "pages/transaksi/jualan-lama.html"
        })
        .when('/transaksi-aliran-tunai', {
            templateUrl: "pages/transaksi/aliran-tunai.html"
        })
        .when('/transaksi-aliran-bank', {
            templateUrl: "pages/transaksi/aliran-duit-bank.html"
        })
        .when('/transaksi-buang-aliran', {
            templateUrl: "pages/transaksi/buang-rekod-aliran.html"
        })
        .when('/rekod-stok-emas', {
            templateUrl: "pages/rekod/stok-emas.html"
        })
        .when('/rekod-tarik-untuk-jual', {
            templateUrl: "pages/rekod/emas-tarik-untuk-jual.html"
        })
        .when('/rekod-proses-tarik', {
            templateUrl: "pages/rekod/emas-dalam-proses.html"
        })
        .when('/rekod-ambil-emas', {
            templateUrl: "pages/rekod/stok-emas-ambil.html"
        })
        .when('/ambil-emas', {
            templateUrl: "pages/transaksi/ambil-emas.html"
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
            templateUrl: "pages/tetapan/cawangan/cawangan.html",
            controller: ''
        })
        .when("/tetapan-cawangan-jual-emas", {
            templateUrl: "pages/tetapan/cawangan/cawangan-jual-emas.html"
        })
        .when("/tetapan-kakitangan", {
            templateUrl: "pages/tetapan/kakitangan/kakitangan.html"
        })
        .when("/ubah-rekod-jualan", {
            templateUrl: "pages/transaksi/jualan-lama.html"
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
    var year = now.getFullYear();
    return day + '/' + month + '/' + year;
}

const dBdate = (date) => {
    var arr = date.split('/');
    return arr['2'] + '-' + arr[1] + '-' + arr[0];
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

zakApp.service("generalController", function ($http, $q) {
    var generalFunction = {};

    generalFunction.testJe = () => {
        console.log('test je')
    }

    generalFunction.numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    generalFunction.listOfCawangan = () => {
        return $http.get(api_url + '/cawangan')
            .then(function (response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function (response) {
                return $q.reject(response.data.result);
            });
    };

    generalFunction.listOfCawanganLama = () => {
        return $http.get(api_url + '/cawangan/cawangan-zak1')
            .then(function (response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function (response) {
                return $q.reject(response.data.result);
            });
    };

    generalFunction.listOfCawanganHead = () => {
        return $http.get(api_url + '/cawangan/cawangan-head')
            .then(function (response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function (response) {
                return $q.reject(response.data.result);
            });
    };

    generalFunction.listKakitangan = () => {
        return $http.get(api_url + '/cawangan/kakitangan')
            .then(function (response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function (response) {
                return $q.reject(response.data.result);
            });
    };

    generalFunction.listBank = () => {
        return $http.get(api_url + '/bank/bank-list')
            .then(function (response) {
                if (typeof response.data.result === 'object') {
                    return response.data.result;
                } else {
                    return $q.reject(response.data.result);
                }
            }, function (response) {
                return $q.reject(response.data.result);
            });
    };

    return generalFunction;
});

zakApp.controller('stokTarikController', ['$scope', '$http', function ($scope, $http) {

}])

zakApp.controller('dashboardController', ['$scope', '$http', function ($scope, $http) {

    var grafAliranWang = (data) => {
        var label = [];
        var masuk = [];
        var keluar = [];

        data.forEach(function (value, key) {
            label.push(value.bulan);
            masuk.push(value.masuk);
            keluar.push(value.keluar);
        });

        var densityCanvas = document.getElementById("grafAliranWang");

        var dataMasuk = {
            label: 'Aliran Wang Masuk (RM)',
            data: masuk,
            backgroundColor: 'rgba(99, 255, 32, 0.6)',
            borderWidth: 0,
            yAxisID: "nilai"
        };
        var dataKeluar = {
            label: 'Aliran Wang Keluar (RM)',
            data: keluar,
            backgroundColor: 'rgba(266, 62, 51, 0.6)',
            borderWidth: 0,
            yAxisID: "nilai"
        };
        var dataAliranTunai = {
            labels: label,
            datasets: [dataMasuk, dataKeluar]
        };
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    barPercentage: 1,
                    categoryPercentage: 0.7
                }],
                yAxes: [
                    {
                        id: "nilai",
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + 'k';
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '1k = 1000'
                        }
                    },
                    {
                        id: "nilai",
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + ' K';
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '1k = 1000'
                        }
                    }]
            }
        };
        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: dataAliranTunai,
            options: chartOptions
        });
    }

    var getSummary = () => {
        $http({
            url: api_url + '/dashboard/summary',
            type: 'get'
        })
            .then(function (response) {
                $scope.ringkasan = response.data.result;
                grafAliranWang(response.data.result.graf_aliran_wang);
            });
    }

    getSummary();

}]);

zakApp.controller('semakanIkutPilihanController', ['$scope', '$http', 'generalController', function ($scope, $http, generalController) {
    angular.extend($scope, generalController);
    $scope.listOfCawanganHead().then(function (response) {
        $scope.listCawangan = response;
    });

    $scope.listRekod = false;
    $scope.tapis = {
        cawangan: "0",
        tarikh: {}
    };

    $scope.tapisPilihan = () => {
        var cawangan = $scope.tapis.cawangan;
        var tarikhMula = $('[name=tarikh_mula]').val();
        var tarikhAkhir = $('[name=tarikh_akhir]').val();
        $scope.tapis.tarikh = {
            mula: dBdate(tarikhMula),
            akhir: dBdate(tarikhAkhir)
        };

        $http({
            url: api_url + '/rekod/pilihan',
            method: 'get',
            params: {
                cawangan: cawangan,
                tarikh_mula: dBdate(tarikhMula),
                tarikh_akhir: dBdate(tarikhAkhir)
            }
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listRekod = response.data.result;
                }
            });
    };
}]);

zakApp.controller('alirantunaiController', ['$scope', '$http', 'generalController', 'SweetAlert', function ($scope, $http, generalController, SweetAlert) {
    angular.extend($scope, generalController);
    $scope.listKakitangan()
        .then(function (response) {
            $scope.listOfKakitangan = response;
        });

    $scope.listAkaunZak = [{
        name: "Zak Services",
        id: 1
    }, {
        name: "Malik",
        id: 2
    }, {
        name: "Joe",
        id: 3
    }];

    $scope.perkara = '';
    $scope.cawangan = '';
    $scope.tarikh = currentDate();
    $scope.jenis = '';
    $scope.jumlah = '';
    $scope.beratEmas = '';
    $scope.nilai = '';
    $scope.transaksi = {
        jenis: "masuk",
        account_zak: 1
    };
    $scope.selectKakitangan = false;
    $scope.jumlahAw = {};

    $scope.transaksi_type = {};

    $scope.pilihKakitangan = () => {
        $scope.selectKakitangan = ($scope.kakitangan) ? true : false;
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
        $scope.transaksi = { jenis: "masuk", account_zak: 1 };
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
            cawangan_id: $scope.kakitangan.caw_id,
            stf_id: $scope.kakitangan.stf_id,
            nama_cawangan: $scope.kakitangan.nama_cawangan,
            nama_kakitangan: $scope.kakitangan.stf_nama,
            kategori: ($scope.transaksi.jenis === 'masuk') ? 1 : 2,
            jenis_masuk: ($scope.transaksi.jenis === 'masuk') ? Number($scope.jumlah || 0) : 0,
            jenis_keluar: ($scope.transaksi.jenis === 'keluar') ? Number($scope.jumlah || 0) : 0,
            emas_berat: Number($scope.berat || 0),
            akaun_zak: $scope.transaksi.account_zak,
            nilai: Number($scope.nilai || 0),
            jumlah: Number($scope.jumlah || 0)
        };
        awlist.push(data);
        $scope.jumlahAw = kiraJumlah();
        $scope.awlist = awlist;
        clearForm();
    };

    $scope.removeAw = (item) => {
        angular.forEach(awlist, function (value, key) {
            if (awlist[key].pid === item) {
                awlist.splice(key, 1);
            }
        });
        $scope.awlist = awlist;
    };

    daftarAw = () => {
        $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: api_url + '/transaksi/aliran-tunai',
            method: "POST",
            data: JSON.stringify(awlist)
        })
            .then(function (response) {
                $scope.awlist = [];
                SweetAlert.swal("Berjaya!", "Pendaftaran aliran wang telah berjaya.", "success");
            });
    };


}]);

zakApp.controller('transaksiKeseluruhanController', ['$scope', '$http', function ($scope, $http) {
    var getAliranTunai = () => {
        $http.get(api_url + '/rekod')
            .then(function (response) {
                $scope.listAliranTunai = response.data.result;
            });
    };

    $scope.tapis = {};

    $scope.tapisPilihan = () => {
        var tarikh_mula = $('[name=tarikhMula]').val();
        var tarikh_akhir = $('[name=tarikhAkhir]').val();
        $http({
            url: api_url + '/rekod/aliran-tunai',
            type: 'get',
            params: {
                tarikh_mula: dBdate(tarikh_mula),
                tarikh_akhir: dBdate(tarikh_akhir)
            }
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listAliranBank = response.data.result;
                }
            });
    };

    getAliranTunai();
}]);

zakApp.controller('transaksiKeseluruhanBankController', ['$scope', '$http', function ($scope, $http) {
    var getAliranBank = () => {
        $http.get(api_url + '/rekod/semua-aliran-bank')
            .then(function (response) {
                $scope.listAliranBank = response.data.result;
            });
    };

    $scope.tapis = {};

    $scope.tapisPilihan = () => {
        var tarikh_mula = $('[name=tarikhMula]').val();
        var tarikh_akhir = $('[name=tarikhAkhir]').val();
        $http({
            url: api_url + '/rekod/semua-aliran-bank',
            type: 'get',
            params: {
                tarikh_mula: dBdate(tarikh_mula),
                tarikh_akhir: dBdate(tarikh_akhir)
            }
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listAliranBank = response.data.result;
                }
            });
    };

    getAliranBank();
}]);

zakApp.controller('stokController', ['$scope', '$http', '$location', 'SweetAlert', function ($scope, $http, $location, SweetAlert) {
    $scope.cawangan_detail = false;
    $scope.cawangan_itemize = true;
    $scope.tarik_emas = true;
    var getListCawanganStok = () => {
        $http.get(api_url + '/stok/stok-info')
            .then(function (response) {
                $scope.listCawanganStok = response.data.result.itemize;
                $scope.listStokSummary = response.data.result.summary[0];
            })
    }

    $scope.viewRecords = (caw_id) => {
        $http.get(api_url + `/stok/stok-info?caw_id=${caw_id}`)
            .then(function (response) {
                $scope.cawangan_itemize = false;
                $scope.cawangan_detail = true;
                $scope.tarik_emas = false;
                $scope.cawangan_detail = response.data.result.itemize;
            })
    }

    $scope.viewEmasTarik = (caw_id) => {
        $scope.tarik_emas = false;
        $scope.cawangan_detail = true;
        $scope.cawangan_itemize = true;
    }

    getListCawanganStok();
}])

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

    $scope.editInvois = (resit_no) => {
        window.open(app_url + '/home.html#!/ubah-rekod-jualan?id=' + resit_no, '_self');
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
            closeOnCancel: false
        },
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
                'Content-Type': 'application/json'
            },
            url: api_url + '/transaksi/invoice',
            method: "DELETE",
            data: JSON.stringify(info)
        })
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

    var getListCawanganLama = () => {
        $http.get(api_url + '/cawangan/cawangan-zak1')
            .then(function (response) {
                $scope.listCawanganLama = response.data.result;
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
                'Content-Type': 'application/json'
            },
            url: api_url + '/cawangan/kemaskini_cawangan',
            method: "PUT",
            data: JSON.stringify(cawangan)
        })
            .then(function () {
                getListCawangan();
                $scope.modalcawangan = {};
            });
    };
    getListCawangan();
    getListCawanganLama();
}]);

zakApp.controller('laporanBulananController', ['$scope', '$http', function ($scope, $http) {
    var getLaporanBulan = () => {
        $http.get(api_url + '/rekod/transaksi-bulan-ini')
            .then(function (response) {
                $scope.listAliran = response.data.result;
            });
    };

    $scope.tarikh = {};

    $scope.cariLaporan = () => {
        var tarikhMula = $('[name=tarikhMula]').val();
        var tarikhAkhir = $('[name=tarikhMula]').val();

        $scope.tarikh = {
            masuk: tarikhMula,
            akhir: tarikhAkhir
        };

        $http.get(api_url + 'rekod/transaksi-bulan-ini');
        dBdate(tarikhMula);
    };

    getLaporanBulan();
}]);

zakApp.controller('laporanHarianController', ['$scope', '$http', function ($scope, $http) {
    var getLaporanHarian = () => {
        $http.get(api_url + '/rekod/transaksi-hari-ini')
            .then(function (response) {
                $scope.listAliran = response.data.result;
            });
    };
    getLaporanHarian();
}]);

zakApp.controller('aliranbankController', ['$scope', '$http', 'generalController', 'SweetAlert', function ($scope, $http, generalController, SweetAlert) {
    angular.extend($scope, generalController);
    $scope.listBank()
        .then(function (response) {
            $scope.listOfBanks = response;
            $scope.bank_akaun = $scope.listOfBanks[0];
        });


    $scope.tarikh = currentDate();

    var listAliran = [];
    $scope.transaksi = 'masuk';

    $scope.addToList = () => {
        addToList();
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
            bank: $scope.bank_akaun,
            kategori: ($scope.transaksi === 'masuk') ? 1 : 2,
            jumlah: Number($scope.nilai || 0),
            nama_bank: $scope.bank_akaun.bank_name,
            jenis_masuk: ($scope.transaksi === 'masuk') ? Number($scope.nilai || 0) : 0,
            jenis_keluar: ($scope.transaksi === 'keluar') ? Number($scope.nilai || 0) : 0
        };
        listAliran.push(data);
        $scope.jumlah = kiraJumlah();
        clearForm();
    };

    $scope.rekodAb = () => {
        $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: api_url + '/transaksi/aliran-bank',
            method: "POST",
            data: JSON.stringify($scope.listAliranBank)
        })
            .then(function (response) {
                $scope.listAliranBank = [];
                SweetAlert.swal("Berjaya!", "Pendaftaran aliran bank telah berjaya.", "success");
            });
    };

}]);

zakApp.controller('semakanRekodBakiTerakhir', ['$scope', '$http', 'generalController', function ($scope, $http, generalController) {
    angular.extend($scope, generalController);
    $scope.listOfCawanganLama()
        .then(function (response) {
            $scope.listCawanganLama = response;
        });

    $scope.listRekod = {
        list: 0
    };

    $scope.tapis = {
        cawangan: "0"
    };

    $scope.tapisPilihan = () => {
        var tarikh_mula = $('[name=tarikh_mula]').val();
        var tarikh_akhir = $('[name=tarikh_akhir]').val();
        $http({
            url: api_url + '/rekod/pilihan',
            type: 'get',
            params: {
                cawangan: $scope.tapis.cawangan,
                tarikh_mula: dBdate(tarikh_mula),
                tarikh_akhir: dBdate(tarikh_akhir)
            }
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listRekod = response.data.result;
                }
            });
    };
}]);

zakApp.controller('buangRekodTransaksiController', ['$scope', '$http', 'SweetAlert', function ($scope, $http, SweetAlert) {
    $scope.tapis = {};
    $scope.listRekod = {
        list: 0
    };

    var getListTerkini = () => {
        $http({
            url: api_url + '/transaksi/aliran-tunai-terkini',
            method: 'get'
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listRekod = response.data.result;
                }
            });
    };
    getListTerkini();

    $scope.tapisPilihan = () => {
        var tarikh_mula = $('[name=tarikh_mula]').val();
        var tarikh_akhir = $('[name=tarikh_akhir]').val();
        $http({
            url: api_url + '/transaksi/aliran-tunai-terkini',
            type: 'get',
            params: {
                tarikh_mula: dBdate(tarikh_mula),
                tarikh_akhir: dBdate(tarikh_akhir)
            }
        })
            .then(function (response) {
                if (response.data.result.list.length > 0) {
                    $scope.listRekod = response.data.result;
                }
            });
    };

    var deleteTransaksi = (pickedItems) => {
        $http({
            url: api_url + '/transaksi/aliranwang',
            method: 'DELETE',
            data: JSON.stringify(pickedItems)
        })
            .then(function (response) {
                getListTerkini();
                $scope.listBuang = [];
                SweetAlert.swal("Berjaya!", "Pendaftaran aliran wang telah berjaya.", "success");
            });

    };

    var listPickedDelete = [];

    $scope.selectedChange = (item) => {
        if (item.selected) {
            listPickedDelete.push(item);
        } else {
            var filtered = listPickedDelete.filter(function (data) {
                return data.at_id !== item.at_id;
            });
            listPickedDelete = filtered;
        }

        $scope.listBuang = listPickedDelete;
    };

    $scope.listBuang = [];

    $scope.picked = () => {
        var pickedItem = [];
        angular.forEach($scope.listRekod.list, function (item) {
            if (item.selected) {
                pickedItem.push(item);
            }
            ;
        });

        SweetAlert.swal({
            title: "Buang transaksi pilihan ini?",
            text: "Adakah anda pasti untuk membuang transaksi-transaksi ini daripada rekod?!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3e8f3e", confirmButtonText: "Ya Buang!",
            cancelButtonText: "Batal!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    deleteTransaksi(pickedItem);
                } else {
                    SweetAlert.swal("Pembatalan", "Rekod transaksi ini tidak dibuang dari sistem", "error");
                }
            });

    };
}]);

zakApp.controller('tetapanKakitanganKakitanganController', ['$scope', '$http', function ($scope, $http) {
    $scope.listRekod = {
        list: 0
    };
    $scope.paparPengguna = true;
    $scope.formPengguna = false;

    var getListUsers = () => {
        $http({
            url: api_url + '/tetapan/kakitangan',
            method: 'GET',
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
