angular.module("zakApp").controller("transaksiKeseluruhanBankController",[
    "$scope",
    "$http",
    "SweetAlert",
    function($scope, $http, SweetAlert) {
        var getAliranBank = () => {
            $http
                .get(api_url + "/rekod/semua-aliran-bank")
                .then(function(response) {
                    $scope.listAliranBank = response.data.result
                })
        }

        $scope.tapis = {}

        $scope.tapisPilihan = () => {
            var tarikh_mula = $("[name=tarikhMula]").val()
            var tarikh_akhir = $("[name=tarikhAkhir]").val()
            $http({
                url: api_url + "/rekod/semua-aliran-bank",
                type: "get",
                params: {
                    tarikh_mula: dBdate(tarikh_mula),
                    tarikh_akhir: dBdate(tarikh_akhir)
                }
            }).then(function(response) {
                if (response.data.result.list.length > 0) {
                    $scope.listAliranBank = response.data.result
                }
            })
        }

        $scope.deleteTransaksi = (id) => {
            SweetAlert.swal(
                {
                    title: "Pengesahan",
                    text:
                        "Adakah anda pasti untuk membuang transaksi ini daripada rekod?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3e8f3e",
                    confirmButtonText: "Ya Buang!",
                    cancelButtonText: "Batal!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $http({
                            url: api_url + "/transaksi/aliran-bank?id=" + id,
                            method: "DELETE"
                        }).then(function() {
                            getAliranBank()
                            SweetAlert.swal(
                                "Berjaya!",
                                "Transaksi telah dibuang dari senarai.",
                                "success"
                            )
                        })
                    } else {
                        SweetAlert.swal(
                            "Pembatalan",
                            "Transaksi ini tidak dibuang dari senarai",
                            "error"
                        )
                    }
                }
            )
        }

        getAliranBank()
    }
])