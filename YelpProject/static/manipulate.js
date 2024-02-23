const xhttp = new XMLHttpRequest();
const geohttp = new XMLHttpRequest();
const geoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const baseURL = "http://127.0.0.1:5000/";
const geocodingKey = "";
const autoLocationURL = "https://ipinfo.io/?token=";
const autoLocationKey = "";

let autoLocation = document.getElementById("auto-location-check");
let formLocation = document.getElementById("location");
let formCatagory = document.getElementById("catagory");
let formKeyWord = document.getElementById("keyword");
let formDistance = document.getElementById("distance");
var myForm = document.getElementById("form-to-submit");
let submitButton = document.getElementById("submit");



// click checkbox and change state

function init() {
    autoLocation.addEventListener('change', () => {
        if (autoLocation.checked) {
            formLocation.disabled = "disabled";
            formLocation.value = "";
        } else {
            formLocation.disabled = "";
        }
});
    myForm.addEventListener('submit', (events) => {
        events.preventDefault();
        search();
    });
}


init();


function search() {
    let location = formLocation.value;
    let validLocation = location.replace(" ", "+");
    let autoLocationValidURL = autoLocationURL + autoLocationKey;
    let geoValidURL = geoURL + validLocation + "&key=" + geocodingKey;
    if (autoLocation.checked) {
        geoValidURL = autoLocationValidURL;
    }
    
    geohttp.open("GET", geoValidURL);
    geohttp.send();
    geohttp.onreadystatechange = function () {
        if (geohttp.readyState == 4 && geohttp.status == 200) {
            let geoResult = JSON.parse(geohttp.responseText);
            console.log(geoResult);
            let lat;
            let lon;
            if (autoLocation.checked) {
                lat = geoResult.loc.split(",")[0];
                lon = geoResult.loc.split(",")[1];
            } else {
                lat = geoResult.results[0].geometry.location.lat;
                lon = geoResult.results[0].geometry.location.lng;
            }
            let validParams = "search/" + encodeURIComponent(formKeyWord.value) + '/' + encodeURIComponent(formCatagory.value) + "/" 
                + encodeURIComponent(formDistance.value * 1609) + '/' + encodeURIComponent(lat) + '/' + encodeURIComponent(lon);
            let validURL = baseURL + validParams;
            let entityTag = document.getElementById("entity");
            var result
            console.log(validURL);
            xhttp.open('GET', validURL);
            xhttp.send();
            xhttp.onreadystatechange = function() {
                if(xhttp.readyState == 4 && xhttp.status == 200){
                result = JSON.parse(xhttp.responseText);
                console.log(result);
                if (result.businesses.length == 0) {
                    let tableHeaderTag = document.getElementById("headers-to-add");
                    let tbodyTag = document.getElementById("result-body");
                    let detailPage = document.getElementsByClassName("detail-page")[0];
                    let wrongTag = document.getElementById("wrongTag");
                    removeAllChildOfTag(wrongTag);
                    removeAllChildOfTag(tableHeaderTag);
                    removeAllChildOfTag(tbodyTag);
                    removeAllChildOfTag(detailPage);
                    wrongTag.innerHTML = "<div id=wrongText>No record has been found</div>";
                } else {
                    //window.location.hash = "#returned-table";
                    let tableHeaderTag = document.getElementById("headers-to-add");
                    let tbodyTag = document.getElementById("result-body");
                    let detailPage = document.getElementsByClassName("detail-page")[0];
                    let wrongTag = document.getElementById("wrongTag");
                    removeAllChildOfTag(wrongTag);
                    removeAllChildOfTag(tableHeaderTag);
                    removeAllChildOfTag(tbodyTag);
                    removeAllChildOfTag(detailPage);
                    
                    
                    let tableHeaderTr = document.createElement("tr");
                    let arr = ["No.", "Image", "Business Name", "Rating", "Distance(miles)"];
                    let flag = 0;
                    for (let j = 0; j < 5; j++) {
                        let newthTag = document.createElement("th");
                        newthTag.className = "table-header";
                        newthTag.innerHTML = arr[j];
                        if (j >= 2) {
                            newthTag.addEventListener("click", (e) => {
                                removeAllChildOfTag(tbodyTag);
                                removeAllChildOfTag(detailPage);
                                let sortedBusinessArr = sortCurTag(result.businesses, newthTag.innerHTML, flag);
                                flag = 1 - flag;
                                appendValidChildInTable(sortedBusinessArr, tbodyTag);
                            });
                        }
                        tableHeaderTr.appendChild(newthTag);
                    }
                    tableHeaderTag.appendChild(tableHeaderTr);
                    appendValidChildInTable(result.businesses, tbodyTag);
                    window.location.href = "#move-here";
                }
                }
                
            }
        }
    }
    
}
function sortCurTag (array, sortTag, flag){
    console.log(sortTag);
    console.log(flag);
    if (sortTag === "Rating") {
        if (flag === 0) {
            array.sort(function(a, b) {
                if (a.rating < b.rating) {
                    return -1;
                } else if (a.rating > b.rating) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            array.sort(function(a, b) {
                if (a.rating < b.rating) {
                    return 1;
                } else if (a.rating > b.rating) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    } else if (sortTag === "Distance(miles)") {
        if (flag === 0) {
            array.sort(function(a, b) {
                if (a.distance < b.distance) {
                    return -1;
                } else if (a.distance > b.distance) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            array.sort(function(a, b) {
                if (a.distance < b.distance) {
                    return 1;
                } else if (a.distance > b.distance) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    } else if (sortTag === "Business Name") {
        if (flag === 0) {
            array.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            array.sort(function(a, b) {
                if (a.name < b.name) {
                    return 1;
                } else if (a.name > b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    }
    return array;
}
function appendValidChildInTable(businessArr, tbodyTag) {
    for (let i = 0; i < businessArr.length; i++) {
        let newtrTag = document.createElement("tr");
        newtrTag.className = "tr-back";
        // num
        let numTag = document.createElement("td");
        numTag.className = "num-back";
        numTag.innerHTML = (i + 1).toString();
        // picture
        let picTag = document.createElement("td");
        picTag.className = "image-back";
        picTag.innerHTML = "<img src=" + businessArr[i].image_url + ">";
        // name
        let nameTag = document.createElement("td");
        nameTag.className = "name-back";
        nameTag.id = businessArr[i].id;
        nameTag.innerHTML = "<div class=nameText id=" + businessArr[i].id  + ">" + businessArr[i].name + "</div>";
        
        // rate
        let rateTag = document.createElement("td");
        rateTag.className = "rate-back";
        rateTag.innerHTML = businessArr[i].rating;
        // distance
        let distTag = document.createElement("td");
        distTag.className = "dist-back";
        distTag.innerHTML = (businessArr[i].distance * 0.0006213711).toFixed(2);
        // add
        newtrTag.appendChild(numTag);
        newtrTag.appendChild(picTag);
        newtrTag.appendChild(nameTag);
        newtrTag.appendChild(rateTag);
        newtrTag.appendChild(distTag);
        tbodyTag.appendChild(newtrTag);
    }
    let nameTags = document.getElementsByClassName("nameText");
    for (let i = 0; i < nameTags.length; i++) {
        nameTags[i].addEventListener("click", (e) => {
            let id = e.target.id;
            console.log(id);
            searchBussinessById(id);
        });
    }
}

function searchBussinessById(id) {
    let detailURL = baseURL + "details/" + id;
    xhttp.open("GET", detailURL);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let detailResult = JSON.parse(xhttp.responseText);
            console.log(detailResult);
            let detailPage = document.getElementsByClassName("detail-page")[0];
            let name = detailResult.name;
            let cur_status = detailResult.hours == undefined ? undefined : detailResult.hours[0].is_open_now;
            let catagory = detailResult.categories;
            let address = detailResult.location.display_address;
            let phone_number = detailResult.display_phone;
            let trans_sup = detailResult.transactions;
            let cur_price = detailResult.price;
            let more_info = detailResult.url;
            let allFeedBack = [cur_status,  catagory, address, 
                 phone_number, trans_sup, 
                cur_price, more_info];
            console.log(allFeedBack);
            let contentArr = ["Status", "Category", "Address", "Phone Number", "Transactions Supported", "Price", "More info"];
            removeAllChildOfTag(detailPage);
            let detailContainer = document.createElement("div");
            detailContainer.className = "detail-container";
            detailPage.appendChild(detailContainer);
            let nameContainer = document.createElement("div");
            nameContainer.className = "name-container";
            nameContainer.innerHTML = name;
            detailContainer.appendChild(nameContainer);
            detailContainer.appendChild(document.createElement("hr"));
            
            // container
            let containMessage = document.createElement("div");
            containMessage.id = "contain-message";
            detailContainer.appendChild(containMessage);

            let containLine;
            let containLine2;
            let validNum = 0;
            for (let j = 0; j < allFeedBack.length; j++) {
                if (allFeedBack[j] !== undefined && allFeedBack[j] !== "" && allFeedBack[j] !== null && allFeedBack[j].length !== 0) {
                    if (validNum % 2 == 0) {
                        containLine = document.createElement("div");
                        containLine2 = document.createElement("div");
                        containLine.className = "contain-line";
                        containLine2.className = "contain-line";
                        containMessage.appendChild(containLine);
                        containMessage.appendChild(containLine2);
                    }
                    validNum++;
                    let detailContent = document.createElement("div");
                    detailContent.className = "detail-content";
                    detailContent.innerHTML = contentArr[j];
                    containLine.appendChild(detailContent);
                    let detailValue = document.createElement("div");
                    detailValue.className = "detail-value";
                    detailValue.innerHTML = getValidInnerHTML(allFeedBack[j], j, contentArr);
                    containLine2.appendChild(detailValue);
                }
            }
            // pictures
            let picContainer = document.createElement("div");
            picContainer.className = "pic-container";
            let detailPics = detailResult.photos;
            for (let i = 0; i < 3; i++) {
                if (i < detailPics.length) {
                    let picDiv = document.createElement("div");
                    picDiv.className = "picDiv";
                    let picEle = document.createElement("img");
                    let textDiv = document.createElement("div");
                    textDiv.innerHTML = "<br>" + "photo" + (i + 1);
                    picEle.src = detailPics[i];
                    picDiv.appendChild(picEle);
                    picDiv.appendChild(textDiv);
                    picContainer.appendChild(picDiv);
                }
            }
            detailContainer.appendChild(picContainer);
            window.location.href = "#move-here-two";
        }
    }
}

function getValidInnerHTML(temp, index, contentArr) {
    if (contentArr[index] === "Status") {
        if (temp === true) {
            return "<button id=" + "status-button-open" + ">Open Now" + "</button>";
        } else {
            return "<button id=" + "status-button-close" + ">Closed Now" + "</button>";
        }
    } else if (contentArr[index] === "Category") {
        let res = "";
        for (let i = 0; i < temp.length - 1; i++) {
            res = res + temp[i].title + " | ";
        }
        res = res + temp[temp.length - 1].title;
        console.log(res);
        return res;
    } else if (contentArr[index] === "Address") {
        let res = "";
        for (let i = 0; i < temp.length - 1; i++) {
            res = res + temp[i] + ", ";
        }
        res = res + temp[temp.length - 1];
        return res;
    } else if (contentArr[index] === "Phone Number") {
        let res = temp;
        return res;
    } else if (contentArr[index] === "Transactions Supported") {
        let res = "";
        for (let i = 0; i < temp.length - 1; i++) {
            res = res + temp[i] + ", ";
        }
        res = res + temp[temp.length - 1];
        return res;
    } else if (contentArr[index] === "Price") {
        return temp;
    } else {
        return "<a href=" + temp + " target=_blank>Yelp</a>";
    }
}

function getLonLat (location) {
    // get lontitude and latitude of current location using geocoding
    let validLocation = location.replace(" ", "+");
    let geoValidURL = geoURL + validLocation + "&key=" + geocodingKey;
    geohttp.open("GET", geoValidURL);
    let values = [];
    if (geohttp.readyState == 4 && geohttp.status == 200) {
        let geoResult = JSON.parse(geohttp.responseText);
        console.log(geoResult);
        let lat = geoResult.results[0].geometry.location.lat;
        let lon = geoResult.results[0].geometry.location.lng;
        values.push(lat, lon);
        return values;
    }
}
// remove all child of curNode
function removeAllChildOfTag(parent){
    while(parent.hasChildNodes()){
        parent.removeChild(parent.firstChild);
    }
  }
// click CLEAR button
function searchClear() {
    formKeyWord.value = "";
    formLocation.value = "";
    formCatagory.value = "All";
    autoLocation.checked = false;
    formLocation.disabled = "";
    let tableHeaderTag = document.getElementById("headers-to-add");
    removeAllChildOfTag(tableHeaderTag);
    let tbodyTag = document.getElementById("result-body");
    removeAllChildOfTag(tbodyTag);
    let detailPage = document.getElementsByClassName("detail-page")[0];
    removeAllChildOfTag(detailPage);
    let wrongTag = document.getElementById("wrongTag");
    removeAllChildOfTag(wrongTag);
}













