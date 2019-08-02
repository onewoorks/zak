zakApp.controller('transactionController', ['$scope', '$http', '$location', 'SweetAlert', 'generalController', function ($scope, $http, $location, SweetAlert, generalController) {
    angular.extend($scope, generalController)

    var itemList = [];
    $scope.latestResit = 0;
    $scope.beforeSave = 'hidden';
    $scope.printOnly = 'hidden';
    $scope.updateOnly = 'hidden';
    $scope.kedai = kedai;
    $scope.tarikh = currentDate();
    $scope.harga_besar = 0;
    $scope.list_emas = [];
    $scope.market_required = true;
    $scope.tolak_requred = true;
    $scope.berat_pilih = []
    $scope.berat_pilih_disabled = []

    var beratEmasUntukJual = () => {
        $http.get(api_url + '/ambilemas/berat-untuk-jual')
            .then(function (response) {
                $scope.berat = response.data.result.summary.berat_jual.toFixed(2)
                $scope.list_emas = response.data.result.itemize;
                for (var i = 0; i < $scope.list_emas.length; i++) {
                    $scope.berat_pilih[$scope.list_emas[i].id] = true
                    $scope.berat_pilih_disabled[$scope.list_emas[i].id] = false
                }
            })
    }

    beratEmasUntukJual();

    $scope.pilih_berat_ini = (index) => {
        let berat = parseFloat($scope.berat)
        let current_pick = $scope.berat_pilih[index]
        let berat_picked = $scope.list_emas.find(o => o.id === index)
        if (!current_pick) {
            berat = parseFloat(berat) - parseFloat(berat_picked.berat_jual)
        } else {
            berat = parseFloat(berat) + parseFloat(berat_picked.berat_jual)
        }
        $scope.berat = berat.toFixed(2)
        kiraHarga()
    }

    var removeBeratYangDahPilih = () => {
        for (var i = 0; i < $scope.list_emas.length; i++) {
            if ($scope.berat_pilih[$scope.list_emas[i].id]) {
                $scope.berat_pilih[$scope.list_emas[i].id] = false
                $scope.berat_pilih_disabled[$scope.list_emas[i].id] = true
            } else {
                $scope.berat_pilih[$scope.list_emas[i].id] = true
            }
        }
        kiraHarga()
        kiraBeratPilih()
    }

    var kiraBeratPilih = () => {
        var berat = 0
        for (var i = 0; i < $scope.list_emas.length; i++) {
            if ($scope.berat_pilih[i]) {
                berat = parseFloat(berat) + parseFloat($scope.list_emas[i].berat_jual)
            }
        }
        $scope.berat = parseFloat(berat).toFixed(2)
    }

    if ($location.$$search.id !== undefined) {
        $scope.updateOnly = '';
        $http.get(api_url + '/transaksi/jualan-resit?id=' + $location.$$search.id)
            .then(function (response) {
                var result = response.data.result;
                var itemList_1 = [];

                angular.forEach(result, function (value, key) {
                    if (value.isempty !== true) {
                        var item = {
                            tarikh: value.tarikh_jual,
                            perkara: value.perkara,
                            market: value.market,
                            berat: generalController.numberWithCommas(value.berat_jual),
                            harga: value.harga_jual,
                            hargaSen: priceSplit(value.harga_jual, 1),
                            hargaClean: value.harga_jual,
                            gstClean: value.nilai_gst,
                            cawangan: value.cawangan_id,
                            tolak: value.tolak,
                            gst: value.nilai_gst,
                            hargaGst: value.nilai_gst,
                            nobil: $location.$$search.id
                        };
                        itemList_1.push(item);
                    }
                });
                $scope.jualkepada = {
                    namacawangan: result[0].nama_cawangan,
                    alamatkedai: result[0].alamat + ', (GST:' + result[0].no_gst + ')',
                };

                $scope.tarikh = result[0].tarikh_jual;
                $scope.jumlah = generalController.numberWithCommas(priceSplit(result[0].total_harga, 0));
                $scope.jumlahSen = priceSplit(result[0].total_harga, 1);
                $scope.jumlahGst = generalController.numberWithCommas(priceSplit(result[0].total_gst, 0));
                $scope.jumlahGstSen = priceSplit(result[0].total_gst, 1);
                $scope.jumlahBesar = generalController.numberWithCommas(priceSplit((parseFloat(result[0].total_gst) + parseFloat(result[0].total_harga)), 0));
                $scope.jumlahBesarSen = priceSplit((parseFloat(result[0].total_gst) + parseFloat(result[0].total_harga)), 1);
                $scope.nobil = result[0].resit;
                $scope.cawangan = result[0].cawangan_id;

                itemList = itemList_1;
                $scope.itemList = itemList;
            });
    }

    var resetBackPilihEmas = (id) => {
        let berat = $scope.berat
        id.map((key)=>{
            $scope.berat_pilih[key.id] = true
            $scope.berat_pilih_disabled[key.id] = false
            berat = parseFloat(berat) + parseFloat(key.berat)
        })
        $scope.berat = berat.toFixed(2)
    }

    $scope.deleteInList = (id) => {
        SweetAlert.swal({
            title: "Buang item ini?",
            text: "Adakah anda pasti untuk membuang item ini daripada senarai?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3e8f3e", confirmButtonText: "Ya Buang!",
            cancelButtonText: "Batal!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    resetBackPilihEmas(itemList[id].emas_pilih)
                    itemList.splice(id, 1);
                    $scope.itemList = itemList;
                    jumlahJualan();
                    SweetAlert.swal("Berjaya!", "Item telah dibuang dari senarai.", "success");
                } else {
                    SweetAlert.swal("Pembatalan", "Item ini tidak dibuang dari senarai", "error");
                }
            });
    };

    var kiraHarga = () => {
        var harga = ((($scope.market - $scope.tolak) * 0.02646) * $scope.berat).toFixed(2);
        $scope.harga_besar = isNaN(harga) ? '0.00' : harga;
    }

    $scope.kiraHarga = function () {
        kiraHarga()
    };

    $scope.addToList = function () {
        var harga = ((($scope.market - $scope.tolak) * 0.02646) * $scope.berat).toFixed(2);
        var hargaSplit = harga.toString().split('.');

        $scope.beforeSave = ($location.$$search.id !== undefined) ? 'hidden' : '';
        $scope.tarikhini = $('input[name=tarikh]').val();

        let list_emas_pilih = []

        for (var i = 0; i < $scope.list_emas.length; i++) {
            if ($scope.berat_pilih[$scope.list_emas[i].id]) {
                let emasnya = {}
                emasnya['id'] = $scope.list_emas[i].id
                emasnya['berat'] = $scope.list_emas[i].berat_jual
                list_emas_pilih.push(emasnya)
            }
        }

        var formData = {
            cawangan: $scope.cawangan,
            tarikh: $('input[name=tarikh]').val(),
            perkara: $scope.perkara,
            market: $scope.market,
            tolak: $scope.tolak,
            berat: $scope.berat,
            gst: $scope.gst,
            hargaGst: calculateGST(harga, $scope.gst),
            harga: hargaSplit[0],
            hargaSen: hargaSplit[1],
            hargaClean: harga,
            emas_pilih: list_emas_pilih
        };

        if ($location.$$search.id !== undefined) {
            formData['nobil'] = $location.$$search.id
        }

        itemList.push(formData);
        removeBeratYangDahPilih()
        jumlahJualan();
        clearForm();
    };

    var clearForm = function () {
        $scope.market = '';
        $scope.gst = 0;
        $scope.tolak = '';
        $scope.perkara = '';
    };

    var jumlahJualan = function () {

        var totalHarga = 0;
        var totalGST = 0;
        var hargaPenuh = 0;

        if ($location.$$search.id !== undefined) {
            angular.forEach(itemList, function (value, key) {
                totalHarga = parseFloat((parseFloat(totalHarga) + parseFloat(value.hargaClean))).toFixed(2);
                totalGST = parseFloat((parseFloat(totalGST) + parseFloat(value.hargaGst))).toFixed(2);
                hargaPenuh = parseFloat((parseFloat(totalHarga) + parseFloat(totalGST))).toFixed(2);
            });
        } else {
            for (var x in itemList) {
                totalHarga = parseFloat((parseFloat(totalHarga) + parseFloat(itemList[x]['hargaClean'])).toFixed(2));
                totalGST = parseFloat((parseFloat(totalGST) + parseFloat(itemList[x]['hargaGst'])).toFixed(2));
                hargaPenuh = parseFloat((parseFloat(totalHarga) + parseFloat(totalGST)).toFixed(2));
            }
        }

        $scope.jumlah = generalController.numberWithCommas(priceSplit(totalHarga, 0));
        $scope.jumlahSen = priceSplit(totalHarga, 1);
        $scope.jumlahGst = generalController.numberWithCommas(priceSplit(totalGST, 0));
        $scope.jumlahGstSen = priceSplit(totalGST, 1);
        $scope.jumlahBesar = generalController.numberWithCommas(priceSplit(hargaPenuh, 0));
        $scope.jumlahBesarSen = priceSplit(hargaPenuh, 1);
    };

    var senaraiCawangan = function () {
        $http.get(api_url + '/cawangan')
            .then(function (response) {
                $scope.listCawangan = response.data.result;
                $scope.cawangan = $scope.listCawangan[0].id
                $scope.pickCawangan()
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
                };
            });
    }

    $scope.printOnlyBtn = () => {
        window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + $scope.latestResit);
    };

    $scope.postJualan = function () {
        $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: api_url + '/transaksi/jualan',
            method: "POST",
            data: JSON.stringify(itemList)
        })
            .then(function (response) {
                var no_resit = response.data.response.no_resit;
                $scope.latestResit = no_resit;
                $scope.printOnly = '';
                $scope.beforeSave = 'hidden';
                window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + no_resit)
            });
    };

    $scope.updateJualan = (no_resit) => {
        var data = {
            no_resit: no_resit,
            itemList: itemList,
        };
        $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: api_url + '/transaksi/edit-resit-jualan',
            method: "POST",
            data: JSON.stringify(data)
        })
            .then(function (response) {
                window.open(app_url + '/pages/cetak/resit-jualan.html?id=' + no_resit)
            });
    };

    $scope.tambahCawangan = function () {
        var cawangan = $scope.modalcawangan;
        $http({
            headers: {
                'Content-Type': 'application/json'
            },
            url: api_url + '/cawangan/TambahCawangan',
            method: "POST",
            data: JSON.stringify(cawangan)
        })
            .then(function () {
                senaraiCawangan();
                $scope.modalcawangan = {}
            });
    };

    $scope.senaraiCawangan = senaraiCawangan();
    $scope.gst = 0;

    $scope.itemList = itemList;

}]);