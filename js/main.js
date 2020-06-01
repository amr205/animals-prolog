function showTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  if(evt!=null)
    evt.currentTarget.className += " active";
} 

//FUNCION PARA MOSTRAR U OCULTAR MÁS INFORMACIÓN
function toggle_info(){
  var element = document.getElementById("moreinfo-div");
  element.classList.toggle("hidden");
}

document.addEventListener('DOMContentLoaded', function(){ 
  showTab(null,'basic')
  var element = document.getElementById("basic-tab");
  element.classList.add("active");
  $('.js-example-basic-multiple').select2();
}, false);

