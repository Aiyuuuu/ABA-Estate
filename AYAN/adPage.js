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






// -----------------------------------------------------------------------------------------------------------------------------


let json ={
    "Description":"3 spacious bedrooms with attached bath 1150 square feet",
    "Price": "PKR7.9 Crore",
    "ID": 34881234,
    "Address": "DHA Phase 6, DHA Defence, Karachi, Sindh",
    "Bathrooms": 4,
    "Bedrooms": 5,
    "Size/Area": "300 Sq. Yd.",
    "Purpose": "For Saaale",
    "Type": "House",
    "Real State Agency": "Bukhari Properties",
    "Real State Agent Name": "Bukhari Properties  Builders"
}



function changeHTML(json){
document.querySelector(".head_and_price_inner").innerHTML=`<h1>${json.Description}</h1><h1>${json.Price}</h1>`;
document.querySelector(".head_and_price > .address").innerHTML=`${json.Address}`;
document.querySelector(".head_and_price .but_div").innerHTML=`<button class="btn">FEATURED</button><button class="btn">${json.Purpose.toUpperCase()}</button>`
document.querySelector(".pics_and_form .side_form .textarea").innerHTML=`<textarea name="inquire" id="inquire" cols="36"
rows="4">I would like to inquire about your property Zameen - ID${json.ID}. Please contact me at your earliest convenience.</textarea>`
document.querySelector(".page2 .details").innerHTML=`<table>
                                                    <tr>
                                                        <td>
                                                            <h2>Overview</h2>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h3>Details</h3>
                                                        </td>
                                                    </tr>
                                                    <tr class="clr_row">
                                                        <td>Type</td>
                                                        <td>${json.Type}</td>
                                                        <td>Area</td>
                                                        <td>${json["Size/Area"]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Price</td>
                                                        <td>${json.Price}</td>
                                                        <td>Purpose</td>
                                                        <td>${json.Purpose}</td>
                                                    </tr>
                                                    <tr class="clr_row">
                                                        <td>Location</td>
                                                        <td>${json.Address}</td>
                                                        <td>Bedrooms(s)</td>
                                                        <td>${json.Bedrooms}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Bathrooms(s)</td>
                                                        <td>${json.Bathrooms}</td>
                                                        <td>Property ID</td>
                                                        <td>${json.ID}</td>
                                                    </tr>
                                                    <tr class="clr_row">
                                                        <td colspan="2">
                                                            <h4>Real State Agency</h4>
                                                        </td>
                                                        <td>
                                                            <h4>${json["Real State Agency"]}</h4>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <h4>Real State Agent Name</h4>
                                                        </td>
                                                        <td>
                                                            <h4>${json["Real State Agent Name"]}</h4>
                                                        </td>
                                                    </tr>
                                                </table>`
document.querySelector(".page2 .map .add_map").innerHTML=`${json.Address} - Map`

}


changeHTML(json)






/* <div class="item" style="background-image: url('./ad1/ad1-1.jpg');">
                    <div class="content">
                        <div class="name">3 BEDROOMS <i class="fa-solid fa-bed"></i></div>                    
                    </div>
                </div> */





function getRandomNumber() {
    return Math.floor(Math.random() * 37) + 1;
    }
    
    // .style.backgroundImage = `url(${adFolderPath})`;


async function changeImages(json){
    getRandomNumber();
    let adFolderPath=`./ad_images/ad (${getRandomNumber()})/`
    console.log(adFolderPath)

    let imgContainer =  document.querySelector(".pics_and_form .container .slide")

    let appendHTMLString="";
    let arr=[" Bedrooms"," Bathrooms", " Sq.Yd"]
    for (let i = 1; i < 4; i++) {
        appendHTMLString+=`<div class="item" style="background-image: url('${adFolderPath+`img (${i}).jpeg`}');">
        <div class="content">
            <div class="name"> ${i==1? arr[0]:i==2?arr[1]:i==3?arr[2]:console.log("error in changeImages function")}<i class="fa-solid fa-bed"></i></div>
        </div>`
    
    imgContainer.innerHTML=appendHTMLString;
  
        
    }
    console.log(appendHTMLString)

    

}



changeImages();