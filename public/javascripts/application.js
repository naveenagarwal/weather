$(document).ready(function(){
  if($('form#weather-form').length > 0){
    $('form#weather-form').submit(function(e){
      e.preventDefault();
      if($('input#location').val()){
        window.location.href = '/weather/' + $('input#location').val()
      }else{
        return false;
      }
    })
  }
});
