
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="sweetalert2.min.js"></script>
<link rel="stylesheet" href="sweetalert2.min.css">


<script>
$(document).ready(function(){
  $(kaydet).click(function(){
    //Swal('code.replyfeed.com sitesindesiniz')
    swal({
  title: "Good job!",
  text: "You clicked the button!",
  icon: "success",
  button: "Aww yiss!",
});
  });
});
</script>


<form action="" method="POST" class="form-horizontal" enctype="multipart/form-data" parsley-validate novalidate>
<button type="button" id="kaydet" >Benim Üzerime Tıklayınız</button>
</form>