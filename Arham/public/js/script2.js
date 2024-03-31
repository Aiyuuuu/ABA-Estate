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

const loader = document.querySelector('.preloader');
const logo = document.querySelector('.preloader>h2');
const header = document.querySelector('.header');
const main = document.getElementById('main');
const footer = document.querySelector('.foooter')

setTimeout(()=>{
    loader.style.display = "none";
},3000)

setTimeout(()=>{
    main.style.display = "block";
    header.style.display = "flex";
    footer.style.display = "block";
},3000)

const Images = document.getElementById('images'); 
const images_array = ['./../Home-Images/home-image-1.jpg','./../Home-Images/home-image-2.jpg','./../Home-Images/home-image-3.jpg','./../Home-Images/home-image-4.jpg','./../Home-Images/home-image-5.jpg',];
Images.src = images_array[0];

let x = 1;
setInterval(()=>{
        Images.src = images_array[x];   
        x++;
        if(x===5){
            x=1;
        } 
},2000)
