var nomorAdmin = "6283125227588";
var hargaperkm = 1000;
var linkupload = "https://script.google.com/macros/s/AKfycbzUL0m3cBD4-HrEr20Et912dTfP9lrJUXZV2kUmT7LzP6t22goCvgDf66Aa94STHyI6aA/exec";
var apikeyFirebase = "AIzaSyDl_QxPtwdwI9P5zwOZeWhql0IOT4lYS8o";
var projectID = "lelang-1a6e5";
var appID = "1:646706085539:web:c7c5160b21eb16c99cc916";
var splitappID = appID.split(":");
var senderID = splitappID[1];

// Pembayaran
var pembayaran = [
    { "id": "via BRI", "norek": "987979798798 A/n Achsin (BRI)" },
    { "id": "via BNI", "norek": "987979798798 A/n Achsin (BNI)" },
    { "id": "via BCA", "norek": "987979798798 A/n Achsin (BCA)" },
    { "id": "via DANA", "norek": "987979798798 A/n Achsin (DANA)" }
];

//Url
var url_string = window.location.href;
var urlParameter = new URL(url_string);
var paramID = urlParameter.searchParams.get("id");
var urlHome = urlParameter.origin;

// Firebase Config
const firebaseConfig = {
    apiKey: apikeyFirebase,
    authDomain: projectID+".firebaseapp.com",
    projectId: projectID,
    storageBucket: projectID+".appspot.com",
    messagingSenderId: senderID,
    appId: appID
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

//Format Rupiah
function angkaToRp(angka) {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return 'Rp' + rupiah.split('', rupiah.length - 1).reverse().join('');
};

// Set Notifikasi Peringatan
var timeout_notif;
var berhasil = "<div class='peringatan sukses'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z' /></svg></div>";
var gagal = "<div class='peringatan gagal'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z' /></svg></div>";
function notification(o) {
    $("#informasi").remove(),
        window.clearTimeout(timeout_notif),
        $("body").append('<div id="informasi"></div>'),
        $("#informasi").html(o).fadeIn(100),
        (timeout_notif = window.setTimeout(function () {
            $("#informasi").fadeOut(1e3),
                setTimeout(function () {
                    $("#informasi").remove();
                }, 1e3);
        }, 4e3));
}

// Format Nama
function formatNama(item) {
    var format = item.toLowerCase();
    format = format.replace(/[^\w ]+/g, "").replace(/ +/g, "-");
    return format;
}
function backNama(item) {
    var format = item.split("-").join(" ");
    return format.replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

// Format ID
function formatID(date, inv) {
    var date = new Date(date);
    var day = date.getDate(),
        month = parseInt(date.getMonth()),
        yearFull = date.getFullYear().toString(),
        year = yearFull.substring(2),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        code = inv,
        invoice = code + day.toString() + (month + 1) + year + hour.toString() + minute.toString() + second.toString();
    return invoice;
}

// Format Countdown
function countdown(date, element) {
    if (date == "") {
        element.html("");
        return;
    } else {
        var endTime = new Date(date) - new Date().getTime();
        var interval = setInterval(function () {
            endTime -= 1000;
            var days = Math.floor(endTime / 86400000);
            var hours = Math.floor((endTime % 86400000) / 3600000);
            var minutes = Math.floor((endTime % 3600000) / 60000);
            var seconds = Math.floor((endTime / 1000) % 60);
            if (endTime > 0) {
                var count = days + " : " + ("0" + hours).slice(-2) + " : " + ("0" + minutes).slice(-2) + " : " + ("0" + seconds).slice(-2);
                var htmlcount = "<i><svg fill='currentColor' viewBox='0 0 24 24'><path d='M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M17 11.5V13H11V7H12.5V11.5H17Z'></path></svg> " + count + "</i>";
            } else if (endTime < 0) {
                var htmlcount = "";
            }
            element.html(htmlcount);
        }, 1000);
    }
}

//Upload File
$(document).ready(function () {
    $(document).on('change', '#upload', function () {
        var file = $("#upload").prop("files")[0];
        var fr = new FileReader();
        fr.readAsArrayBuffer(file);
        notification("Proses upload foto, silahkan ditunggu");
        fr.onload = f => {
            var newName = file.name;
            var orgName = file.name;
            if (orgName.includes(".")) {
                var orgExt = orgName.split(".").pop();
                if (orgExt != newName.split(".").pop()) {
                    newName = newName ? `${newName}.${orgExt}` : orgName;
                }
            }
            var qs = new URLSearchParams({ filename: newName, mimeType: file.type });  // Modified
            fetch(`${linkupload}?${qs}`, { method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)]) })
                .then(res => res.json())
                .then(e => {
                    var idDrive = e.fileId;
                    var imageDrive = 'https://lh3.googleusercontent.com/u/0/d/' + idDrive;
                    $("#uploaded").append("<input class='linkfile' data-file='https://lh3.googleusercontent.com/u/0/d/" + idDrive + "' value='" + idDrive + "' type='hidden'/><img src='" + imageDrive + "' width='80' height='80' alt='image google drive'/>");
                    notification(berhasil + "File berhasil terupload")
                })
                .catch(err => console.log(err));
        }
    });
});

// Autocomplete Kabupaten
var searchKabupaten = localStorage.getItem("searchKabupaten")
function autoKabupaten(itemselect, itemdata) {
    var datajs = new autoComplete({
        selector: itemselect,
        threshold: 2,
        data: {
            src: itemdata,
            keys: ["name"],
            cache: true,
        },
        resultsList: {
            tag: "ul",
            id: "autoComplete_list",
            class: "results_list",
            destination: itemselect,
            position: "afterend",
            maxResults: 20,
            element: (list, data) => {
                if (!data.results.length) {
                    const message = document.createElement("li");
                    message.setAttribute("class", "no_result");
                    message.innerHTML = `<span>Hasil pencarian <span class='autoComplete_highlighted'>"${data.query}"</span> tidak ditemukan!</span>`;
                    list.prepend(message);
                }
            },
            noResults: true,
        },
        resultItem: {
            tag: "li",
            class: "autoComplete_result",
            element: (item, data) => {
                item.setAttribute("data-parent", data.value.parent);
            },
            highlight: "autoComplete_highlighted",
            selected: "autoComplete_selected",
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    if (selection.parent == "Kabupaten") {
                        var destination = "Kab.";
                    } else if (selection.parent == "Kota") {
                        var destination = "Kota";
                    }
                    datajs.input.value = destination + " " + selection.name;
                },
            },
        },
    });
}

// Funngsi Kabupaten
function eventKabupaten(itemkab) {
    if (searchKabupaten === null) {
        $.ajax({
            url: "/Lelang/kabupaten.json",
            dataType: "json",
            type: "GET",
            success: function (data) {
                var itemdata = data.items;
                localStorage.setItem("searchKabupaten", JSON.stringify(itemdata));
                var itemselect = itemkab
                autoKabupaten(itemselect, itemdata);
            },
        });
    } else {
        var itemdata = JSON.parse(searchKabupaten);
        var itemselect = itemkab;
        autoKabupaten(itemselect, itemdata);
    }
}

// Event List Menu
$(".list-menu").click(function () {
    $(".fixed-menu").toggleClass("active");
    return false;
});

// Event Icon Checkout
$(".list-cart").click(function () {
    $(".box-data-produk").fadeIn();
    return false;
});
$(".tombol-close,.box-checkout .kembali").click(function () {
    $(".box-data-produk").fadeOut();
    return false;
});

var lokUser = document.querySelector("#lokasiuser");
if (lokUser != null) {
    var itemkab = "#lokasiuser";
    eventKabupaten(itemkab);
}

// Upload Produk
$("#kirim-produk").click(function () {
    var checkupload = $("#upload");
    var lokasiuser = $("#lokasiuser").val();
    var labelproduk = $("#labelproduk").val();
    var namaproduk = $("#namaproduk").val();
    var harga = $("#harga").val();
    var hargakelipatan = $("#hargakelipatan").val();
    var waktupromo = $("#waktupromo").val();
    var username = $("#username").val();
    var logouser = $("#logotoko").val();
    var foto = "";
    $("#uploaded .linkfile").each(function () {
        foto += $(this).attr("data-file") + "|";
    });
    var image = foto.slice(0, -1);
    if (checkupload[0].files.length == 0) {
        notification("Foto Produk diperlukan");
        return false;
    } else if (lokasiuser == "") {
        notification("Lokasi User diperlukan");
        return false;
    } else if (labelproduk == "") {
        notification("Label Produk diperlukan");
        return false;
    } else if (namaproduk == "") {
        notification("Nama Produk diperlukan");
        return false;
    } else if (harga == "") {
        notification("Harga Produk diperlukan");
        return false;
    } else if (hargakelipatan == "") {
        notification("Harga Kelipatan diperlukan");
        return false;
    } else {
        var date = new Date();
        var id = formatID(date, "ID");
        db.collection('dataproduk').add({
            id: id,
            username: username,
            logo: logouser,
            lokasi: lokasiuser,
            label: labelproduk,
            nama: namaproduk,
            image: image,
            harga: harga,
            harganow: harga,
            kelipatan: hargakelipatan,
            promo: waktupromo
        }).then(res => {
            notification(berhasil + "Produk Anda berhasil diupload");
        }).catch(e => {
            notification(gagal + "Produk gagal diupload, silahkan coba lagi");
        });
        return false;
    }
});

// Data In Home
var checkinhome = document.getElementById("content-inhome");
if (checkinhome) {
    db.collection("dataproduk").orderBy("id", "desc").get().then((data) => {
        var checkempty = data.empty;
        if (checkempty == false) {
            var postHTML = "";
            data.forEach(function (doc) {
                var data = doc.data();
                var id = data.id;
                var label = data.label;
                var produk = data.nama;
                var image = data.image;
                var harga = data.harganow;
                var promo = data.promo;
                image = image.split("|");
                image = image[0];
                postHTML += "<article class='post-content'>";
                postHTML += "<div class='post-content-wrap'>";
                postHTML += "<div class='post-thumb'>";
                postHTML += "<img class='item-thumb' src='" + image + "' width='400' height='400' alt='" + produk + "'/>";
                postHTML += "</div>";
                postHTML += "<div class='post-summary'>";
                postHTML += "<h2 class='title'><span>" + produk + "</span></h2>";
                postHTML += "<div class='harga'><span class='price'>" + angkaToRp(harga) + "</span></div>"
                postHTML += "<div class='detail'><span>" + label + "</span></div>";
                postHTML += "</div>";
                postHTML += "</div>";
                postHTML += "<div class='bottom-box'>";
                postHTML += "<div class='html-countdown' data-promo='"+promo+"'></div>";
                postHTML += "<div class='tombol-beli'><a href='lelang/produk.html?id=" + id + "' class='beli-produk tombol'>Lihat</a></div>";
                postHTML += "</div>";
                postHTML += "</article>";
            });
            $("#content-inhome").html(postHTML);
            $("#content-inhome .html-countdown").each(function () {
                var date = $(this).attr("data-promo");
                var element = $(this);
                console.log(date);
                console.log(element);
                countdown(date, element);
            })
        } else {
            $("#content-inhome").html("<p class='none'>Produk belum tersedia</p>");
        }
    });
}

// Fungsi History Bid
function historyBid(item, element) {
    db.collection("datacheckout").where("id", "==", item).get().then((data) => {
        var checkempty = data.empty;
        if (checkempty == false) {
            var html = "<div class='box-title'>History Bid</div>";
            html += "<div class='box-history'>";
            data.forEach(function (doc) {
                var data = doc.data();
                var user = data.username;
                var harganow = data.harganow;
                html += "<div class='history-bid-wrap'>";
                html += "<div class='text'>" + user + "</div>";
                html += "<div class='price'>" + angkaToRp(harganow) + "</div>";
                html += "</div>";
            });
            html += "</div>";
            element.html(html);
        } else {
            var text = "<p>Belum ada history pelelangan pada produk ini</p>";
            element.html(text);
        }
    });
}

// Data In Product
if (paramID != null) {
    var idproduk = paramID;
    db.collection("dataproduk").where("id", "==", idproduk).get().then((data) => {
        var checkempty = data.empty;
        if (checkempty == false) {
            var postHTML = "";
            data.forEach(function (doc) {
                var data = doc.data();
                var uid = doc.id;
                var id = data.id;
                var username = data.username;
                var logo = data.logo;
                var lokasi = data.lokasi;
                var label = data.label;
                var produk = data.nama;
                var image = data.image;
                var harga = data.harga;
                var harganow = data.harganow;
                var kelipatan = data.kelipatan;
                var promo = data.promo;
                var total = parseFloat(harganow) + parseFloat(kelipatan);
                image = image.split("|");
                var htmlimage = "";
                for (i = 0; i < image.length; i++){
                    htmlimage += "<img class='item-thumb' src='" + image[i] + "' width='400' height='400' alt='" + produk + "'/>"
                }
                postHTML += "<article class='post-content' data-id='" + id + "' data-uid='" + uid + "'>";
                postHTML += "<div class='post-content-wrap'>";
                postHTML += "<div class='post-thumb'>";
                postHTML += "<div class='image-carousel owl-carousel owl-theme'>" + htmlimage + "</div>";
                postHTML += "</div>";
                postHTML += "<div class='post-summary'>";
                postHTML += "<div class='detail'><span>" + label + "</span></div>";
                postHTML += "<h2 class='title'><span>" + produk + "</span></h2>";
                postHTML += "<div class='harga now'><span>Harga Saat Ini</span><div class='price-now' data-newprice='" + harganow + "'>" + angkaToRp(harganow) + "</div></div>"
                postHTML += "<div class='harga'><span>Harga Awal: </span><div class='price' data-price='" + harga + "' data-markup='" + kelipatan + "'>" + angkaToRp(harga) + "</div></div>";
                postHTML += "<div class='harga'><span>Harga Bid Anda: </span><div class='your-price' data-price=''>-</div></div>";
                if (promo != "") {
                    postHTML += "<div class='harga'><div>Berakhir dalam: </div><div class='html-countdown' data-promo='" + promo + "'></div></div>";
                }
                postHTML += "<div class='information-user'>";
                postHTML += "<div class='author'>";
                postHTML += "<span class='avatar' style='background-image: url(" + logo + ")'></span>"; 
                postHTML += "<div class='identitas'><span class='name'><strong>" + username + "</strong></span><span class='location'><svg class='svg-icon' viewBox='0 0 24 24'><path d='M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z'></path></svg><span class='text'>" + lokasi + "</span></span></div>";
                postHTML += "</div >";
                postHTML += "</div>";
                postHTML += "<div class='history-bid'></div>";
                postHTML += "<div class='content-bid'>";
                postHTML += "<p>Ikuti Pelelangan Produk Disini</p>";
                postHTML += "<p class='nominal'>Nominal Kelipatan Bid " + angkaToRp(kelipatan) + "</p>";
                postHTML += "<div class='bottom-box'>";
                postHTML += "<div class='tombol-qty'><div class='tombol-qty-wrap'><button aria-label='minus' class='minus'>-</button><div class='input-qty'><input class='qyt qty' min='1' value='1' type='text'></div><button aria-label='plus' class='plus'>+</button></div></div>";
                postHTML += "<div class='harga price-markup' data-price='" + harganow + "' data-markup='" + kelipatan + "'>" + angkaToRp(kelipatan) + "</div>";
                postHTML += "</div>";
                postHTML += "<div class='bottom-box'>";
                postHTML += "<div class='text-harga'>Harga Saat Ini</div><div class='harga'>" + angkaToRp(harganow) + "</div>";
                postHTML += "</div>";
                postHTML += "<div class='bottom-box box-total'>";
                postHTML += "<div class='text-total'>Total Bid Anda</div><div class='total-harga harga' data-total='" + total + "'>" + angkaToRp(total) + "</div>";
                postHTML += "</div>";
                postHTML += "<button class='bid-now' role='button'>Bid Now</button>";
                postHTML += "</div>";
                postHTML += "</div>";
                postHTML += "</div>";
                postHTML += "</article>";
            });
            $("#content-produk").html(postHTML);
            var item = idproduk;
            var element = $("#content-produk .history-bid");
            historyBid(item, element);
            $("#content-produk .html-countdown").each(function () {
                var element = $(this);
                var date = $(this).attr("data-promo");
                countdown(date, element);
            });
            $(".image-carousel").owlCarousel({
                loop: false,
                margin: 0,
                nav: false,
                dots: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        autoplay: false
                    },
                }
            });
            var count = 1;
            var slidecount = 1;
            $(".image-carousel .owl-dot").each(function () {
                $(this).addClass("number" + count);
                $(this).attr("data-info", count);
                count += 1;
            });
            $(".image-carousel .owl-item").not(".cloned").each(function () {
                $(this).addClass("slidenumber" + slidecount);
                slidecount += 1;
            });
            $(".image-carousel .owl-dot").each(function () {
                var grab = $(this).data("info");
                var img = $(".slidenumber" + grab + " img").attr("src");
                var title = $(".slidenumber" + grab + " img").attr("alt");
                $(this).html("<img src='" + img + "' alt='" + title + "' width='100' height='100'/>");
            });
            $("#content-produk").each(function () {
                // Mengubah Quantity Produk
                $(this).find(".tombol-qty-wrap .minus").on("click", function () {
                    var el = $(this).parents(".post-content-wrap").find(".qty");
                    var value = $(this).parents(".post-content-wrap").find(".qty").val();
                    var qty = Number(value) - 1;
                    var price = $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").attr("data-price");
                    var subtotal = $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").attr("data-markup");
                    if (qty <= 1) {
                        $(el).val(1);
                        var total = subtotal * 1;
                    } else {
                        $(el).val(qty);
                        var total = subtotal * qty;
                    }
                    var totalprice = parseFloat(price) + parseFloat(total);
                    $(this).parents(".post-content-wrap").find(".bottom-box .total-harga").attr("data-total", totalprice).text(angkaToRp(totalprice));
                    $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").text(angkaToRp(total));
                });
                $(this).find(".tombol-qty-wrap .plus").on("click", function () {
                    var el = $(this).parents(".post-content-wrap").find(".qty");
                    var value = $(this).parents(".post-content-wrap").find(".qty").val();
                    var qty = Number(value) + 1;
                    $(el).val(qty);
                    var price = $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").attr("data-price");
                    var subtotal = $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").attr("data-markup");
                    var total = subtotal * qty;
                    var totalprice = parseFloat(price) + parseFloat(total);
                    $(this).parents(".post-content-wrap").find(".bottom-box .total-harga").attr("data-total", totalprice).text(angkaToRp(totalprice));
                    $(this).parents(".post-content-wrap").find(".bottom-box .price-markup").text(angkaToRp(total));
                });
                $(this).find(".tombol-qty-wrap .qty").on("change blur", function () {
                    var value = $(this).val();
                    if (value <= 1) {
                        $(this).val(1);
                    }
                });
                $(document).ready(function () {
                    var user = $("#username").val();
                    var itemid = $("#content-produk .post-content").attr("data-id");
                    var idcheck = user + itemid;
                    db.collection("datacheckout").where("idcheckout", "==", idcheck).get().then((data) => {
                        var checkempty = data.empty;
                        if (checkempty == false) {
                            data.forEach(function (doc) {
                                var uid = doc.id;
                                var data = doc.data();
                                var harganow = data.harganow;
                                $("#content-produk").attr("data-checkout", uid);
                                $("#content-produk .your-price").attr("data-price", harganow).text(angkaToRp(harganow));
                            });
                        } else {
                            $("#content-produk .your-price").html("-");
                        }
                    });
                })
                $("#content-produk .bid-now").click(function () {
                    var uid = $(this).parents(".post-content").attr("data-uid");
                    var id = $(this).parents(".post-content").attr("data-id");
                    var username = $("#username").val();
                    var image = $(this).parents(".post-content").find(".slidenumber1 img").attr("src");
                    var nama = $(this).parents(".post-content").find(".post-summary .title span").text();
                    var harga = $(this).parents(".post-content").find(".post-summary .harga .price").attr("data-price");
                    var harganow = $(this).parents(".post-content").find(".post-summary .box-total .total-harga").attr("data-total");
                    var update = db.collection("dataproduk").doc(uid);
                      return update.update({
                          harganow: harganow
                      }).then(() => {
                          notification(berhasil + "Bid Berhasil Ditambahkan");
                          var idcheckout = username + id;
                          db.collection("datacheckout").where("idcheckout", "==", idcheckout).get().then((data) => {
                              var checkempty = data.empty;
                              var date = new Date();
                              var idbid = formatID(date, "ID");
                              if (checkempty == true) {
                                  db.collection('datacheckout').add({
                                      id: id,
                                      idbid: idbid,
                                      userid: uid,
                                      idcheckout: idcheckout,
                                      username: username,
                                      image: image,
                                      nama: nama,
                                      harga: harga,
                                      harganow: harganow
                                  }).then(res => {
                                      console.log(res);
                                    //
                                  }).catch(e => {
                                      console.log(e);
                                    //
                                  });
                              } else if (checkempty == false) {
                                  var uidcheckout = $("#content-produk").attr("data-checkout");
                                  var update = db.collection("datacheckout").doc(uidcheckout);
                                  return update.update({
                                      harganow: harganow
                                  }).then((res) => {
                                      console.log(res);
                                  }).catch((error) => {
                                      console.log(error);
                                  });
                              }
                          });
                      }).catch((error) => {
                         notification(gagal+"Syistem Error, silahkan coba lagi");
                      });
                });
            })
        } else {
            $("#content-produk").html("<p class='none'>ID Produk tidak tersedia</p>");
        }
    });
}

// Data History
var checkhistory = document.querySelector("#content-history");
if (checkhistory) {
    $(document).ready(function () {
        var username = $("#username").val();
        db.collection("datacheckout").where("username", "==", username).orderBy("idbid", "desc").get().then((data) => {
            var checkempty = data.empty;
            if (checkempty == false) {
                var postHTML = "";
                data.forEach(function (doc) {
                    var data = doc.data();
                    var id = data.id;
                    var produk = data.nama;
                    var image = data.image;
                    var harga = data.harganow;
                    postHTML += "<article class='post-content'>";
                    postHTML += "<div class='post-content-wrap'>";
                    postHTML += "<div class='post-thumb'>";
                    postHTML += "<img class='item-thumb' src='" + image + "' width='400' height='400' alt='" + produk + "'/>";
                    postHTML += "</div>";
                    postHTML += "<div class='post-summary'>";
                    postHTML += "<h2 class='title'><span>" + produk + "</span></h2>";
                    postHTML += "<div class='harga'><span class='price'>" + angkaToRp(harga) + "</span></div>";
                    postHTML += "<div class='bottom-box'>";
                    postHTML += "<div></div>"
                    postHTML += "<div class='tombol-beli'><a href='/Lelang/produk.html?id=" + id + "' class='beli-produk tombol'>Lihat</a></div>";
                    postHTML += "</div>";
                    postHTML += "</div>";
                    postHTML += "</div>";
                    postHTML += "</article>";
                });
                $("#content-history").html(postHTML);
            } else {
                $("#content-history").html("<p class='none'>Tidak Ada Apapun Disini</p>");
            }
        });
    })
}
