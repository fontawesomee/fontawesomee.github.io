function AutoRefresh( t ) { setTimeout("location.reload(true);", t); } 

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}

  function openCity(evt, cityName) {
  var i, tabcontent, Pilihanjenispulsa;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("Pilihanjenispulsa");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "style.background-color:red;");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}        document.getElementById("defaultOpen").click();
console.log("Gunakan Console ini dengan baik tanpa merugikan orang lain atau pihak lain");
                                console.info("Powered By codingasik");
                                console.info("Username Telegram Owner = codinasik.my.id");
                                console.info("SERVER : [NORMAL][200] ;");
  
$("#show").on('click', function (){
    $("#content").removeClass("d-none")
    $("#content-input").addClass("d-none")
  })
  
  $("#close").on('click', function(){
    $("#content").addClass("d-none")
    $("#content-input").removeClass("d-none")
  })
  function test(){
    function rubah(angka) {
              var reverse = angka.toString().split('').reverse().join(''),
                  ribuan = reverse.match(/\d{1,3}/g);
              ribuan = ribuan.join('.').split('').reverse().join('');
              return "Rp"+ribuan;
          }
          document.getElementById("jumlah").innerText = rubah(document.getElementById("jml").textContent);
          
      function rubah(angka) {
              var reverse = angka.toString().split('').reverse().join(''),
                  ribuan = reverse.match(/\d{1,3}/g);
              ribuan = ribuan.join('.').split('').reverse().join('');
              return "Rp"+ribuan;
          }
          document.getElementById("hslttl").innerText = rubah(document.getElementById("ttl").textContent);
          
      function rubah(angka) {
              var reverse = angka.toString().split('').reverse().join(''),
                  ribuan = reverse.match(/\d{1,3}/g);
              ribuan = ribuan.join('.').split('').reverse().join('');
              return "Rp"+ribuan;
          }
          document.getElementById("ttlbyr").innerText = rubah(document.getElementById("jml2").textContent);
  }
  
  
  function test2(){
    var toSend = document.getElementById('jumlah').innerHTML;
    sendWa = toSend;
  }
  
  setInterval(function(){
    test2();
    test();
  },500)
  
  var qris = document.getElementById('qris')
  qris.style.display = "none"
  document.getElementById('msg').style.display = "none"
     
      function inputan(){
        var myInput = document.getElementById('input').value
        let printNom = document.getElementById('ttl')
        let printCode = document.getElementById('code')
        let printJml = document.getElementById('jml')
        let printJml2 = document.getElementById('jml2')
        let hasil = document.getElementById('jml3')
        var unikNum = Math.floor(Math.random() * 228) + 1
      
        if(myInput < (length = 10000)){
          document.getElementById('msg').style.display = "block"
          document.getElementById('ttl').style.display = "none"
          qris.style.display = "none"
        }else{
          qris.style.display = "block"
          document.getElementById('msg').style.display = "none"
          document.getElementById('ttl').style.display = "block"
          
          var  a = unikNum
          var  b = myInput
          
          printNom.innerHTML = "Rp" + myInput
          printCode.innerHTML = "Rp" + unikNum
          printJml.innerHTML = "Rp" + (parseInt(a)+parseInt(b))
          printJml2.innerHTML = "Rp" + (parseInt(a)+parseInt(b))
          
        }
      }
     
     
     $("input[name=inputCepat]").on('click',function(){
      var nomCpt = $("input[name=inputCepat]:checked").attr("id")
       // $("#input").addClass("d-none")
        qris.style.display = "block"
        var ress = nomCpt;
        $("#input").val(ress)
        inputan();
     })
      
      document.getElementById('trf').addEventListener('click', function(){
        var btnTutor = document.getElementById('tutor')
        var btnQris = document.getElementById('trf')
        var btnQris2 = document.getElementById('qris2')
        var cntnQris2 = document.getElementById('content-qris2')
        var cntnQris = document.getElementById('content-qris')
        var cntnTutor = document.getElementById('content-tutor')
  
        btnTutor.classList.remove('text-bg-primary')
        btnQris.classList.add('text-bg-primary')
        btnQris2.classList.remove('text-bg-primary')
        cntnQris.classList.remove('d-none')
        cntnQris2.classList.add('d-none')
        cntnTutor.classList.add('d-none')
      })
      
      document.getElementById('qris2').addEventListener('click', function(){
        var btnQris = document.getElementById('trf')
        var btnQris2 = document.getElementById('qris2')
        var btnTutor = document.getElementById('tutor')
        var cntnQris = document.getElementById('content-qris')
        var cntnQris2 = document.getElementById('content-qris2')
        var cntnTutor = document.getElementById('content-tutor')
  
        cntnQris.classList.add('d-none')
        cntnQris2.classList.remove('d-none')
        cntnTutor.classList.add('d-none')
        btnQris.classList.remove('text-bg-primary')
        btnQris2.classList.add('text-bg-primary')
        btnTutor.classList.remove('text-bg-primary')
      })
      
      
      document.getElementById('tutor').addEventListener('click', function(){
        var btnTutor = document.getElementById('tutor')
        var btnQris = document.getElementById('trf')
        var cntnQris = document.getElementById('content-qris')
        var btnQris2 = document.getElementById('qris2')
        var cntnTutor = document.getElementById('content-tutor')
        var cntnQris2 = document.getElementById('content-qris2')
        
        
        btnTutor.classList.add('text-bg-primary')
        btnQris.classList.remove('text-bg-primary')
        btnQris2.classList.remove('text-bg-primary')
        cntnQris.classList.add('d-none')
        cntnQris2.classList.add('d-none')
        cntnTutor.classList.remove('d-none')
      })
      
      /*---konfirm to whatsapp---*/
      function kirimData() {
        const linkWa = "https://wa.me/6288744876557?text=";
        const textHead = "*Saya Mau konfirmasi Top-Up* %0A>>>>>%0A";
        const username ="*Nama:* " + "*{{nama_user}}*%0A";
        const email = "*Email:* " + "*{{email_user}}*%0A";
        const jumlah = "*Jumlah :* " +  "*"+sendWa+"*%0A";
        const metodeBayar = " "
    
       window.location.href=linkWa+textHead+username+email+jumlah+metodeBayar
      }
      

             const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
    });
});

 function copy_rek0() {
 document.getElementById("bca").select();
 document.execCommand("copy");
                    swal("", "Nomor Rekening Berhasil Disalin", "success");
                }                   
 function copy_rek1() {
 document.getElementById("permata").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }
 function copy_rek2() {
 document.getElementById("briva").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }
 function copy_rek3() {
 document.getElementById("dana").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }
 function copy_rek4() {
 document.getElementById("ovo").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }
function copy_rek5() {
 document.getElementById("linkaja").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }  
function copy_rek6() {
 document.getElementById("shopee").select();
 document.execCommand("copy");
 swal("", "Nomor Rekening Berhasil Disalin", "success");
                }
