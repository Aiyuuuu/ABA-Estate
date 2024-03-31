const menu = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");
const close = document.querySelector("#close-icon");
menu.addEventListener("click",(e)=>{
    navbar.style.top="100%";
    menu.style.display="none";
    close.style.display="block";
})
close.addEventListener("click",()=>{
    navbar.style.top="-1200px";
    menu.style.display="block";
    close.style.display="none";
});

const prev = document.querySelector('.buttons>.prev')
const next = document.querySelector('.buttons>.next')

next.addEventListener('click',function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').appendChild(items[0]);
})

prev.addEventListener('click', function(){
    let items = document.querySelectorAll('.item')
    document.querySelector('.slide').prepend(items[items.length - 1]) // here the length of items = 6
})

// Embed maps
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById(".google_map"), {
    center: { lat: -30.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();