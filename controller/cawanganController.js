angular.module("zakApp").controller("cawanganController", [
    "$scope",
    "$http",
    "$location",
    "SweetAlert",
    function($scope, $http, $location, SweetAlert) {
        $scope.tapis_cawangan_id = '0'
        $scope.semua_cawangan_ahli = {}
        $scope.daftar_cawangan_ahli = {
            cawangan_id:'0'
        }

        var user_session = JSON.parse(
            window.localStorage.getItem("user_session")
        )

        var getListCawangan = () => {
            $http.get(api_url + "/cawangan").then(function(response) {
                $scope.listCawangan = response.data.result
            })
        }

        $scope.getListCawanganAhli = () => {
            $http.get(api_url + '/cawangan/cawangan-ahli')
            .then((response) => {
                $scope.listCawanganAhli = response.data.result
                $scope.semua_cawangan_ahli = response.data.result
                $scope.tapisAhliCawangan()
            })
        }

        var getListCawanganLama = () => {
            $http
                .get(api_url + "/cawangan/cawangan-zak1")
                .then(function(response) {
                    $scope.listCawanganLama = response.data.result
                })
        }

        $scope.openModalCawangan = x => {
            $("#editCawangan").modal("show")
            $http
                .get(api_url + "/cawangan/cawangan_detail?id=" + x)
                .then(function(response) {
                    var cawangan = response.data.result
                    $scope.modalcawangan = {
                        nama: cawangan.nama_cawangan,
                        alamat: cawangan.alamat,
                        notelefon: cawangan.no_telefon,
                        nogst: cawangan.no_gst,
                        id: cawangan.id
                    }
                })
        }

        $scope.openModalCawanganLama = x => {
            $("#editCawangan").modal("show")
            $http
                .get(api_url + "/cawangan/cawangan_detail_lama?id=" + x)
                .then(function(response) {
                    var cawangan = response.data.result
                    $scope.modalcawangan = {
                        nama: cawangan.nama_cawangan,
                        alamat: cawangan.alamat,
                        notelefon: cawangan.no_telefon,
                        nogst: cawangan.no_gst,
                        id: cawangan.id
                    }
                })
        }

        $scope.kemaskiniCawangan = () => {
            var cawangan = $scope.modalcawangan
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: api_url + "/cawangan/kemaskini_cawangan",
                method: "PUT",
                data: JSON.stringify(cawangan)
            }).then(function() {
                getListCawangan()
                $scope.modalcawangan = {}
            })
        }

        $scope.kemaskiniCawanganLama = () => {
            var cawangan = $scope.modalcawangan
            cawangan["profile"] = user_session.uid
            // cawangan["profile"] = 1
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: api_url + "/cawangan/kemaskini_cawangan_lama",
                method: "PUT",
                data: JSON.stringify(cawangan)
            }).then(function() {
                getListCawanganLama()
                $scope.modalcawangan = {}
                SweetAlert.swal(
                    "Berjaya!",
                    "Kemaskini cawangan telah berjaya.",
                    "success"
                )
            })
        }

        $scope.deleteCawanganLama = id => {
            SweetAlert.swal(
                {
                    title: "Pengesahan",
                    text:
                        "Adakah anda pasti untuk membuang cawangan ini daripada senarai?",
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
                            url: api_url + "/cawangan/cawangan_lama?id=" + id,
                            method: "DELETE"
                        }).then(function() {
                            $scope.listCawanganLama = $scope.listCawanganLama.filter(
                                function(item) {
                                    return item.id !== id
                                }
                            )
                            SweetAlert.swal(
                                "Berjaya!",
                                "Cawangan telah dibuang dari senarai.",
                                "success"
                            )
                        })
                    } else {
                        SweetAlert.swal(
                            "Pembatalan",
                            "Cawangan ini tidak dibuang dari senarai",
                            "error"
                        )
                    }
                }
            )
        }

        $scope.daftarCawanganLama = () => {
            var cawangan = $scope.modalcawangan
            cawangan["profile"] = user_session.uid
            
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: `${api_url}/cawangan/tambah_cawangan_lama`,
                method: "POST",
                data: JSON.stringify(cawangan)
            }).then(function() {
                $scope.modalcawangan = {}
                SweetAlert.swal(
                    "Berjaya!",
                    "Pendaftaran cawangan telah berjaya.",
                    "success"
                )
            })
        }

        $scope.tapisAhliCawangan = () => {
            var cawangan_id = $scope.tapis_cawangan_id
            if (cawangan_id != '0'){
                $scope.listCawanganAhli = $scope.semua_cawangan_ahli.filter(
                function(item) {
                    return item.caw_id === cawangan_id
                }
            )
            } else {
                $scope.listCawanganAhli = $scope.semua_cawangan_ahli
            }
        }

        $scope.daftarAhliCawangan = () => {
            var ahli = $scope.daftar_cawangan_ahli
            ahli["profile_uid"] = user_session.uid
            if (ahli.cawangan_id === '0'){
                SweetAlert.swal({
                    title:"",
                    text:"Maklumat cawangan diperlukan",
                    type:"warning"
                })
            } else {
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: `${api_url}/cawangan/tambah_cawangan_ahli`,
                method: "POST",
                data: JSON.stringify(ahli)
            }).then(function() {
                $scope.daftar_cawangan_ahli = {
                    cawangan_id: '0'
                }
                SweetAlert.swal(
                    "Berjaya!",
                    "Pendaftaran ahli cawangan telah berjaya.",
                    "success"
                )
            })
            }
        }    

        $scope.open_modal_ahli_cawangan = (staff_id) => {
            $("#edit_ahli_cawangan").modal("show")
            var info_ahli = $scope.semua_cawangan_ahli.filter(
                function(item) {
                    return item.stf_id === staff_id
                })

            $scope.modal_ahli_cawangan = {
                nama_cawangan: info_ahli[0].nama_cawangan,
                nama: info_ahli[0].stf_nama,
                no_telefon: info_ahli[0].stf_tel,
                akaun_bank: info_ahli[0].stf_akaun,
                stf_id: info_ahli[0].stf_id
            }
        }

        $scope.kemaskini_ahli_cawangan = () => {
            var ahli = $scope.modal_ahli_cawangan
            $http({
                headers: {
                    "Content-Type": "application/json"
                },
                url: `${api_url}/cawangan/cawangan_ahli`,
                method: "PUT",
                data: JSON.stringify(ahli)
            }).then(function() {
                $scope.getListCawanganAhli()
                SweetAlert.swal(
                    "Berjaya!",
                    "Kemaskini cawangan ahli telah berjaya.",
                    "success"
                )
                $scope.modal_ahli_cawangan = {}
                
            })
        }

        $scope.delete_ahli_cawangan = (staff_id) => {
            SweetAlert.swal(
                {
                    title: "Pengesahan",
                    text:
                        "Adakah anda pasti untuk membuang ahli cawangan ini daripada senarai?",
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
                            url: api_url + "/cawangan/cawangan_ahli?id=" + staff_id,
                            method: "DELETE"
                        }).then(function() {
                            $scope.getListCawanganAhli()
                            SweetAlert.swal(
                                "Berjaya!",
                                "Ahli cawangan telah dibuang dari senarai.",
                                "success"
                            )
                        })
                    } else {
                        SweetAlert.swal(
                            "Pembatalan",
                            "Ahli cawangan ini tidak dibuang dari senarai",
                            "error"
                        )
                    }
                }
            )
        }
        getListCawangan()
        getListCawanganLama()
    }
])