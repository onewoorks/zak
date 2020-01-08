angular.module("zakApp").controller("aliranbankController", [
    "$scope",
    "$http",
    "generalController",
    "SweetAlert",
    function($scope, $http, generalController, SweetAlert) {
        angular.extend($scope, generalController)
        $scope.listBank().then(function(response) {
            $scope.listOfBanks = response
            $scope.bank_akaun = $scope.listOfBanks[0]
        })

        $scope.tarikh = currentDate()

        var listAliran = []
        $scope.transaksi = "masuk"

        $scope.addToList = () => {
            addToList()
        }

        $scope.listAliranBank = listAliran

        var clearForm = () => {
            $scope.perkara = ""
            $scope.nilai = ""
            $scope.tarikh = currentDate()
        }

        var kiraJumlah = () => {
            var masuk = 0
            var keluar = 0

            angular.forEach(listAliran, function(value, key) {
                masuk = parseFloat(masuk) + parseFloat(value.jenis_masuk)
                keluar = parseFloat(keluar) + parseFloat(value.jenis_keluar)
            })

            var jumlah = {
                masuk: masuk,
                keluar: keluar
            }

            return jumlah
        }

        var addToList = () => {
            var data = {
                tarikh: $scope.tarikh,
                perkara: $scope.perkara,
                bank: $scope.bank_akaun,
                kategori: $scope.transaksi === "masuk" ? 1 : 2,
                jumlah: Number($scope.nilai || 0),
                nama_bank: $scope.bank_akaun.bank_name,
                user_id: user_session.uid,
                jenis_masuk:
                    $scope.transaksi === "masuk"
                        ? Number($scope.nilai || 0)
                        : 0,
                jenis_keluar:
                    $scope.transaksi === "keluar"
                        ? Number($scope.nilai || 0)
                        : 0
            }
            listAliran.push(data)
            $scope.jumlah = kiraJumlah()
            clearForm()
        }

        $scope.rekodAb = () => {
            let post_data = $scope.listAliranBank
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: api_url + "/transaksi/aliran-bank",
                method: "POST",
                data: JSON.stringify(post_data)
            }).then(response => {
                SweetAlert.swal({
                    title: "Berjaya!",
                    text: "Pendaftaran aliran bank telah berjaya.",
                    type: "success"
                }, function(){
                    location.reload()
                })
            })
        }
    }
])
