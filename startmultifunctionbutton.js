
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

        // Sorter meldingene etter nøkkelen 'date', nyeste dato først
        data.sort((a, b) => {
            const dateA = new Date(a.date); // Konverter dato til Date-objekt
            const dateB = new Date(b.date); // Konverter dato til Date-objekt
            return dateB - dateA; // Sorter i synkende rekkefølge
        });

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

        let deletebutton = rowElement.querySelector(".deletebuttonmessage");
        if(message?.standard){
            deletebutton.style.display = "none";
        }else{
            
            deletebutton.style.display = "block";
            deletebutton.addEventListener("click", function () {
                const confirmation = confirm("Ønsker du å slette denne meldingen?");
                if (confirmation) {
                    // Hvis brukeren klikker "JA" (OK)
                    deletemultiProMessage(deletebutton);
                    console.log("Meldingen blir slettet.");
                    // Her legger du inn logikk for å slette meldingen
                } else {
                    // Hvis brukeren klikker "NEI" (Avbryt)
                    savemultiProMessage(deletebutton);
                    console.log("Meldingen blir ikke slettet.");
                }
            });
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

function deletemultiProMessage(button) {
    // Hent airtable-id fra knappen
    let airtable = button.parentElement.dataset.airtable;

    // Fjern objektet fra preMessage-arrayen som har denne airtable-id
    preMessage = preMessage.filter(message => message.airtable !== airtable);

    // Logg for å bekrefte at elementet er fjernet fra preMessage
    console.log("Oppdatert preMessage:", preMessage);

    // Fjern elementet fra DOM-en
    const parentElement = button.parentElement;
    if (parentElement) {
        parentElement.remove(); // Fjerner elementet fra DOM-en
        console.log("Element fjernet fra DOM-en.");
    } else {
        console.error("parentElement ikke funnet.");
    }

    // Fjern objektet fra serveren
    DELETEairtable("appYyqoMRDdL08VXJ", "tbljbPtkSRhx2U9IG", airtable, "responddeletemultimessage");
}


function savemultiProMessage(text){
    let panelObject = JSON.parse(localStorage.getItem("panelObject"));
    let userid = panelObject.usercurrent.airtable


let body = {klient:[klientid],user:[userid],message:text};
    POSTairtable("appYyqoMRDdL08VXJ", "tbljbPtkSRhx2U9IG",JSON.stringify(body),"respondsavemultimessage")
}

function respondsavemultimessage(data){

preMessage.push(data.fields);
listPreMessage(preMessage);

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
    let panelObject = JSON.parse(localStorage.getItem("panelObject"));
    let body = text +"\nFra " +panelObject.usercurrent.name;
    let sonename = panelObject.sonecurrent.name;
    let respondcollection = document.getElementById("respondcollectionselector").value;
    let respond = true;
    if(respondcollection == ""){respond = false;}
   
    let data = {
        callgroup:[callgroup],
        title:sonename,
        body:body,
        includesender:true,
        respond:respond,
        includesender:true,
        elementid:"multibuttonstart",
        respondcollection:respondcollection
        }
    callingRecivers(data);
    presaveMultimessage(data);
    rollbackMessageModule();
  }
}



function presaveMultimessage(data) {
    // Hent valgt knapp, sjekk om den finnes
    let rowElement = document.getElementById("premessagelist")?.querySelector(".selectbutton");
    let buttontext = ""; // Default til tom streng hvis rowElement er null

    if (rowElement) {
        // Hvis rowElement finnes, hent tekstinnholdet
        buttontext = rowElement.querySelector(".messagetextbody").textContent;
    }

    // Hent tekst fra textarea
    let textareatext = document.getElementById("messageproareatextfield").value;

    // Sjekk om tekstene er forskjellige
    if (buttontext !== textareatext) {
        // Vis alert med valget JA/NEI
        let confirmation = confirm("Ønsker du å lagre denne meldingen til fremtidig bruk?");
        if (confirmation) {
            // Hvis JA, kjør savemultiProMessage
            savemultiProMessage(textareatext);
        } else {
            console.log("Brukeren valgte å ikke lagre meldingen.");
        }
    } else {
        console.log("Tekstene er like. Ingen handling nødvendig.");
    }
}

function rollbackMessageModule(){

// Hent tekst fra textarea
//document.getElementById("messageproareatextfield").value = "";
//document.getElementById("tabpanel").click();

}
