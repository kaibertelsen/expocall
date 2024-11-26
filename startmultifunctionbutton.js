
document.getElementById("multibuttonstart").addEventListener("click", startPremessageList);
var preMessage = [];


function startPremessageList(){
    if(preMessage.length>0){
        listPreMessage(preMessage);
    }else{
        getPremessage();
    }
    document.getElementById("startpremessagebuttontab").click();
    getGroupPremessage();
}

function getPremessage() {
    var body = airtablebodylistAND({ klientid: klientid });
    Getlistairtable("appYyqoMRDdL08VXJ", "tbljbPtkSRhx2U9IG", body, "respondPremessage");
}

function respondPremessage(data) {
    console.log(data);
    preMessage = rawdatacleaner(data);
    listPreMessage(preMessage);
}

function listPreMessage(data) {
    // Filter og list meldinger
    data = filterPreMessage(data);

    const list = document.getElementById("premessagelist");
    list.innerHTML = ""; // Fjern eksisterende elementer

    const elementLibrary = document.getElementById("elementholdermultibutton");
    const nodeElement = elementLibrary.querySelector(".standardbuttonfield");

    for (let message of data) {
        // Klon elementet
        const rowElement = nodeElement.cloneNode(true);
        rowElement.dataset.airtable = message.airtable;

        // Oppdater meldingstekst
        rowElement.querySelector(".messagetextbody").textContent = message.message;

        if(message?.standard){
            rowElement.querySelector(".deletebuttonmessage").style.display = "none";
        }else{
            rowElement.querySelector(".deletebuttonmessage").style.display = "block";
        }

        // Legg til klikk-hendelse
        rowElement.addEventListener("click", function () {
            markMessageButton(rowElement);
            document.getElementById("messageproareatextfield").textContent = message.message;
            controllSenderstatus();
        });

        // Legg til elementet i listen
        list.appendChild(rowElement);
    }

}

function markMessageButton(selectbutton) {
    // Finn alle multibutton-elementer i samme parent
    let buttons = selectbutton.parentElement.querySelectorAll(".multibutton");

    // Fjern valgt-klasse fra alle
    for (let button of buttons) {
        button.classList.remove("selectbutton"); // Rettet fra classlist til classList
    }

    // Legg til valgt-klasse på klikket knapp
    selectbutton.classList.add("selectbutton");
}

function filterPreMessage(data) {
    // Hent panelObject fra localStorage
    let panelObject = JSON.parse(localStorage.getItem("panelObject"));
    if (!panelObject) {
        console.error("panelObject finnes ikke i localStorage!");
        return [];
    }

    // Filtrere meldinger basert på vilkårene
    let array = [];
    for (let message of data) {
        if (message?.standard) {
            array.push(message);
        } else if (message.user[0] === panelObject.usercurrent.airtable) {
            array.push(message);
        }
    }

    return array;
}


function getGroupPremessage() {
    
// Hente arrayen fra localStorage og tilordne til en let-variabel
let group =  JSON.parse(localStorage.getItem("group"));
// Her kan du bruke variabelen group som ønsket
listGroupMessage(group);
}

function listGroupMessage(data) {
    // Filter og list meldinger
    data = filterGroupPreMessage(data);

    const list = document.getElementById("groupmessagelist");
    list.innerHTML = ""; // Fjern eksisterende elementer

    const elementLibrary = document.getElementById("elementholdermultibutton");
    const nodeElement = elementLibrary.querySelector(".groupbutton");

    for (let group of data) {
        // Klon elementet
        const rowElement = nodeElement.cloneNode(true);
        rowElement.dataset.airtable = group.airtable;

        // Oppdater meldingstekst
        rowElement.querySelector(".textgroupname").textContent = group.name;

        // Legg til klikk-hendelse
        rowElement.addEventListener("click", function () {
            markMessageButton(rowElement);
            //markere sendeknapp
            controllSenderstatus();
        });

        // Legg til elementet i listen
        list.appendChild(rowElement);
    }
}

function filterGroupPreMessage(data) {

    // Filtrere meldinger basert på vilkårene
    let array = [];
    for (let group of data) {
        if (group?.multibutton) {
            array.push(group);
        }
    }
    return array;
}


function controllSenderstatus(){
    let textarea = document.getElementById("messageproareatextfield");
    let resivergroupbutton = document.getElementById("groupmessagelist").querySelector(".selectbutton");

    if(textarea.value !="" && resivergroupbutton.dataset.airtable ){
        document.getElementById("sendmultimessage").classList.add("select");
    }
}