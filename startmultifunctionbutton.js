
document.getElementById("multibuttonstart").addEventListener("click", startPremessageList);
document.getElementById("sendmultimessage").addEventListener("click", sendMultiMessage);

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
            
            if(markMessageButton(rowElement)){
                document.getElementById("messageproareatextfield").textContent = message.message;
            }else{
                 document.getElementById("messageproareatextfield").textContent = ""
            }
            controllSenderstatus();
        });

        // Legg til elementet i listen
        list.appendChild(rowElement);
    }

}

function markMessageButton(selectbutton) {
    // Sjekk om knappen allerede har klassen 'selectbutton'
    if (selectbutton.classList.contains("selectbutton")) {
        selectbutton.classList.remove("selectbutton"); // Fjern klassen
        return false; // Returner false
    }

    // Hvis ikke, finn alle multibutton-elementer i samme parent
    let buttons = selectbutton.parentElement.querySelectorAll(".multibutton");

    // Fjern valgt-klasse fra alle
    for (let button of buttons) {
        button.classList.remove("selectbutton");
    }

    // Legg til valgt-klasse på klikket knapp
    selectbutton.classList.add("selectbutton");
    return true;
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

    if(textarea.value !="" && resivergroupbutton){
        document.getElementById("sendmultimessage").classList.add("select");
        return resivergroupbutton.dataset.airtable;
    }else{
        document.getElementById("sendmultimessage").classList.remove("select");
        return false;
    }
}


function sendMultiMessage(){
  if(controllSenderstatus()){
    let callgroup = controllSenderstatus();
    let text = document.getElementById("messageproareatextfield").value;

    //data?.respond


    let data = {
        callgroup:[callgroup],
        title:"Sone 1",
        body:text,
        includesender:true,
        respond:true,
        includesender:true
        }
    callingRecivers(data);
  }
}



