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
},2000)

setTimeout(()=>{
    main.style.display = "block";
    header.style.display = "flex";
    footer.style.display = "block";
},2000)

const Images = document.getElementById('images'); 
const images_array = ['./Home-Images/home-image-1.jpg','./Home-Images/home-image-2.jpg','./Home-Images/home-image-3.jpg','./Home-Images/home-image-4.jpg','./Home-Images/home-image-5.jpg',];
Images.src = images_array[0];

let x = 1;
setInterval(()=>{
        Images.src = images_array[x];   
        x++;
        if(x===5){
            x=1;
        } 
},2000)




let json= {
    "Price": "PKR7.9 Crore",
    "ID": 34881234,
    "Address": "DHA Phase 6, DHA Defence, Karachi, Sindh",
    "Bathrooms": 4,
    "Bedrooms": 5,
    "Size/Area": "300 Sq. Yd.",
    "Purpose": "For Sale",
    "Type": "House",
    "Real State Agency": "Bukhari Properties",
    "Real State Agent Name": "Bukhari Properties  Builders"
  }


function addCard(feFrFs, json){
    if(feFrFs==="featured"){
        document.querySelector(`.${feFrFs} .CardsContainer`).innerHTML+=`<div class="featuredCard">
        <div class="img">
            <img src="https://media.zameen.com/thumbnails/225048243-800x600.webp" alt="">
        </div>

        <div class="text">
            <div class="price">${json.Price}</div>
            <div class="location">${json.Address}</div>
            <div class="saleRent">House ${json.Purpose}</div>
            <div class="bedBathArea">
                <div class="bedrooms"><img src="icons/bedroomicon.svg" alt="">
                </div>
                <p>${json.Bedrooms}</p>
                <div class="bathrooms"><img src="icons/bathroomicon.svg" alt=""></div>
                <p>${json.Bathrooms}</p>
                <div class="area"><img src="icons/areaicon.svg" alt=""></div>
                <p>${json["Size/Area"]}</p>
            </div>

        </div>

    </div>`


    }
    
}


function removeCards(feFrFs){
    document.querySelector(`.${feFrFs} .CardsContainer`).innerHTML=""
};


addCard("featured", json);

// let availableKeywords = [
//     'Cantt',
//   'Gulistan-e-Jauhar',
//   'DHA Defence',
//   'Malir',
//   'Gadap Town',
//   'Gulshan-e-Iqbal Town',
//   'Scheme 33',
//   'Manzoor Colony',
//   'Aisha Manzil',
//   'Delhi Colony',
//   'Airport',
//   'Jamshed Road',
//   'Shah Faisal Town',
//   'Civil Lines',
//   'University Road',

// ];
let availableKeywords = [];
fetch('/location')
.then((result)=>{
    return result.json();
}).then((data)=>{
    availableKeywords = [...data.data];
})
.catch(err=>{
    console.log(err);
})
const resultBox = document.querySelector(".result_box");
const inputBox = document.querySelector(".search-input");


inputBox.onkeyup = function(){
    let result = [];
    let input  = inputBox.value;
    if(input.length){
        result = availableKeywords.filter((keyword)=>{
            return keyword.toLocaleLowerCase().includes(input.toLocaleLowerCase());
        });
        console.log(result);
    }
    display(result);
    if(!result.length){
        resultBox.innerHTML = '';
    }
}
function display(result){
    const content = result.map((list)=>{
        return "<li onclick = selectInput(this)>" + list + "</li>"
    })
    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>";

}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultBox.innerHTML = '';
}

const city = document.getElementById('city');
const property = document.getElementById('property');
const min_range = document.getElementById('min_ran');
const max_range = document.getElementById('max_ran');
const min_area = document.getElementById('min_area');
const max_area = document.getElementById('max_area');
const beds = document.getElementById('beds');

city.onchange = function(){
    console.log(city.options[city.selectedIndex].text);

}
property.onchange = function(){
    console.log(property.options[property.selectedIndex].text);
}

min_range.onchange = function(){
    console.log(min_range.options[min_range.selectedIndex].text);
}

max_range.onchange = function(){
    console.log(max_range.options[max_range.selectedIndex].text);
}

max_area.onchange = function(){
    console.log(max_area.options[max_area.selectedIndex].text);
}
min_area.onchange = function(){
    console.log(min_area.options[min_area.selectedIndex].text);
}

beds.onchange = function(){
    console.log(beds.options[beds.selectedIndex].text);
}



// function getSelectedValue(){
// }

// console.log(property.value);
// console.log(min_range.value);
// console.log(max_range.value);
// console.log(min_area.value);





