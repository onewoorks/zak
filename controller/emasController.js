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
                    if ($scope.jual_item[i] == true && $scope.berat_nak_jual[i] != "") {
                        input = $scope.listCawanganStok[i]
                        berat_asal = parseFloat($scope.listCawanganStok[i].berat_stok)
                        berat_jual = parseFloat($scope.berat_nak_jual[i])
                        input['berat_nak_jual'] = berat_jual
                        input['baki_emas'] = (parseFloat(berat_asal) - parseFloat(berat_jual)).toFixed(2)
                        formData.push(input)
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

angular.module('zakApp').controller(
    'stokEmasAmbilController', ['$scope', '$http', '$location', 'SweetAlert', function ($scope, $http, $location, SweetAlert) {
            $scope.cawangan_detail = false;
            $scope.cawangan_itemize = true;
            $scope.tarik_emas = true;
            $scope.berat_ambilan = {}
            $scope.summary = {}
            $scope.baki_emas = {}
        
            var getListCawanganStok = () => {
                $http.get(api_url + '/stok/stok-emas-ambil')
                    .then(function (response) {
                        $scope.listCawanganStok = response.data.result.itemize;
                        $scope.summary = response.data.result.summary;
                        for (i = 0; i < $scope.listCawanganStok.length; i++) {
                            $scope.berat_ambilan[i] = $scope.listCawanganStok[i].berat_ambil
                        }
                    })
            }
        
            $scope.hantarTarik = () => {
                formData = []
                for (i = 0; i < $scope.listCawanganStok.length; i++) {
                    if(parseFloat($scope.berat_ambilan[i]) > 0){
                        input = $scope.listCawanganStok[i]
                        input['ambilan'] = $scope.berat_ambilan[i]
                        input['baki_berat'] = (parseFloat($scope.listCawanganStok[i].berat_ambil) - parseFloat($scope.berat_ambilan[i])).toFixed(2)
                        formData.push(input)
                    } 

                }
                $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: api_url + '/ambilemas/hantar-emas-untuk-tarik',
                    method: "POST",
                    data: JSON.stringify(formData)
                })
                    .then(function (response) {
                        $scope.listCawanganStok = [];
                        getListCawanganStok();
                        SweetAlert.swal("Berjaya!", "Emas ambil telah sedia untuk proses tarik.", "success");
                    });
            }
        
            $scope.changeEmasAmbil = (berat, index) => {
                console.log(index)
                console.log(berat)
            }
        
            getListCawanganStok();
        }])

angular.module('zakApp').controller('aliranAmbilEmasController', ['$scope', '$http', 'generalController', 'SweetAlert', function ($scope, $http, generalController, SweetAlert) {
            angular.extend($scope, generalController);
            $scope.listKakitangan()
                .then(function (response) {
                    $scope.listOfKakitangan = response;
                });
        
            $scope.perkara = '';
            $scope.cawangan = '';
            $scope.tarikh = currentDate();
            $scope.jenis = '';
            $scope.jumlah = '';
            $scope.beratEmas = '';
            $scope.resit_ambil = '';
        
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
                    resit_ambil: $scope.resit_ambil,
                    perkara: $scope.perkara,
                    cawangan_id: $scope.kakitangan.caw_id,
                    stf_id: $scope.kakitangan.stf_id,
                    nama_cawangan: $scope.kakitangan.nama_cawangan,
                    nama_kakitangan: $scope.kakitangan.stf_nama,
                    emas_berat: Number($scope.berat || 0)
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
                    url: api_url + '/ambilemas/ambil-emas',
                    method: "POST",
                    data: JSON.stringify(awlist)
                })
                    .then(function (response) {
                        $scope.awlist = [];
                        SweetAlert.swal("Berjaya!", "Pendaftaran ambilan emas telah berjaya.", "success");
                    });
            };
        
        
        }]);

angular.module('zakApp').controller('stokProsesTarikController', ['$scope', '$http', 'SweetAlert', function ($scope, $http, SweetAlert) {
            $scope.berat_lepas_tarik = []
            $scope.nilai_lepas_tarik = []
            $scope.summary = {}
        
            var getEmasProsesTarik = () => {
                $http.get(api_url + '/ambilemas/emas-proses-tarik')
                    .then(function (response) {
                        $scope.listCawanganStok = response.data.result.itemize;
                        $scope.summary = response.data.result.summary
                    })
            }
        
            $scope.simpanStokTarik = () => {
                formData = []
                for (i = 0; i < $scope.listCawanganStok.length; i++) {
                    if ($scope.berat_lepas_tarik[i] > 0 && $scope.berat_lepas_tarik[i] != "") {
                        input = $scope.listCawanganStok[i]
                        input['berat_lepas_tarik'] = $scope.berat_lepas_tarik[i]
                        input['nilai_lepas_tarik'] = $scope.nilai_lepas_tarik[i]
                        formData.push(input)
                        // $scope.listCawanganStok.splice(i, 1)
                    }
                }
                $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: api_url + '/ambilemas/emas-lepas-tarik',
                    method: "PUT",
                    data: JSON.stringify(formData)
                })
                    .then(function (response) {
                        SweetAlert.swal("Berjaya!", "Maklumat emas tarik telah berjaya dikemaskini.", "success");
                    });
        
            }
        
            getEmasProsesTarik();
        }])
        