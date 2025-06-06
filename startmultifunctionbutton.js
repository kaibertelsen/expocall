
document.getElementById("sendmultimessage").addEventListener("click", sendMultiMessage);
document.getElementById("backfrommultimessage").addEventListener("click", rollbackMessageModule);

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
        if (message?.standard) {
            deletebutton.style.display = "none";
        } else {
            deletebutton.style.display = "block";
            deletebutton.addEventListener("click", function () {
                // Bruk egendefinert bekreftelsesdialog
                showCustomConfirm(
                    "Ønsker du å slette denne meldingen?",
                    () => {
                        // Hvis brukeren klikker "JA"
                        deletemultiProMessage(deletebutton);
                        console.log("Meldingen blir slettet.");
                    },
                    () => {
                        // Hvis brukeren klikker "NEI"
                        console.log("Meldingen blir ikke slettet.");
                    }
                );
            });
        }

        // Legg til klikk-hendelse
        rowElement.addEventListener("click", function () {
            if (markMessageButton(rowElement)) {
                document.getElementById("messageproareatextfield").value = message.message;
            } else {
                document.getElementById("messageproareatextfield").value = "";
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

function responddeletemultimessage(data){
console.log(data);
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

function markGroupButton(selectbutton) {
    // Hent alle knapper i samme element som selectbutton
    const parentElement = selectbutton.parentElement;
    const buttons = parentElement.querySelectorAll(".multibutton");

    // Sjekk om knappen allerede har klassen 'selectbutton'
    if (selectbutton.classList.contains("selectbutton")) {
        selectbutton.classList.remove("selectbutton"); // Fjern klassen

        // Hvis dataset.airtable er "Alle", fjern 'selectbutton' fra alle knapper
        if (selectbutton.dataset.airtable === "Alle") {
            buttons.forEach(button => button.classList.remove("selectbutton"));
        }

        return false; // Returner false
    } else {
        // Legg til valgt-klasse på klikket knapp
        selectbutton.classList.add("selectbutton");

        // Hvis dataset.airtable er "Alle", legg til 'selectbutton' på alle knapper
        if (selectbutton.dataset.airtable === "Alle") {
            buttons.forEach(button => button.classList.add("selectbutton"));
        }

        return true;
    }
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
    data.push({ name: "Alle", airtable: "Alle" });

    // Sorter data etter group.name
    data.sort((a, b) => {
        if (a.name.toLowerCase() === 'a') return -1; // Sett "a" øverst
        if (b.name.toLowerCase() === 'a') return 1;  // Sett "a" øverst
        return a.name.localeCompare(b.name); // Sorter alfabetisk for andre navn
    });

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
            markGroupButton(rowElement);
            // Markere sendeknapp
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

function controllSenderstatus() {
    let textarea = document.getElementById("messageproareatextfield");
    let resivergroupbuttons = document.getElementById("groupmessagelist")?.querySelectorAll(".selectbutton");

    if (textarea.value !== "" && resivergroupbuttons.length !== 0) {
        document.getElementById("sendmultimessage").classList.add("select");

        // Lag en array med alle dataset.airtable-verdier
        let airtableValues = Array.from(resivergroupbuttons)
            .map(button => button.dataset.airtable) // Hent dataset.airtable
            .filter(value => value !== "Alle"); // Fjern "Alle" fra arrayen

        return airtableValues; // Returner arrayen
    } else {
        document.getElementById("sendmultimessage").classList.remove("select");
        return false; // Ingen data å returnere
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
        callgroup:callgroup,
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
    const button = document.querySelector(".multibuttondiv")
    alertbuttonClick(button);
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
        // Vis egendefinert bekreftelsesdialog
        showCustomConfirm(
            "Ønsker du å lagre denne meldingen til fremtidig bruk?",
            () => {
                // Hvis JA, kjør savemultiProMessage
                savemultiProMessage(textareatext);
                rollbackMessageModule();
            },
            () => {
                console.log("Brukeren valgte å ikke lagre meldingen.");
                rollbackMessageModule();
            }
        );
    } else {
        rollbackMessageModule();
        console.log("Tekstene er like. Ingen handling nødvendig.");
    }
}

function rollbackMessageModule(){
    // Hent tekst fra textarea
    document.getElementById("messageproareatextfield").value = "";
    document.getElementById("footpanel").click();
}

// Egendefinert bekreftelsesdialog
function showCustomConfirm(message, onConfirm, onCancel) {
    const confirmDialog = document.getElementById("customConfirmDialog");
    const messageElement = confirmDialog.querySelector(".confirm-message");
    const confirmButton = confirmDialog.querySelector(".confirm-yes");
    const cancelButton = confirmDialog.querySelector(".confirm-no");

    // Sett meldingen
    messageElement.textContent = message;

    // Legg til eventlisteners
    confirmButton.onclick = () => {
        confirmDialog.style.display = "none"; // Skjul dialogen
        onConfirm(); // Kjør bekreftelsesfunksjon
    };
    cancelButton.onclick = () => {
        confirmDialog.style.display = "none"; // Skjul dialogen
        onCancel(); // Kjør avbrytfunksjon
    };

    // Vis dialogen
    confirmDialog.style.display = "flex";
}

function stoploadingscreen(){
    document.getElementById("loadingcover").style.display = "none";
}
    
function startloadingscreen(){
    document.getElementById("loadingcover").style.display = "flex";
}


function reinitWebflowInteractions() {
    if (typeof Webflow !== 'undefined' && Webflow.require) {
      try {
        Webflow.destroy();                      // Fjerner eksisterende bindings
        Webflow.ready();                        // Setter opp på nytt
        Webflow.require('ix2').init();          // Initierer Interactions 2.0
        console.log("✅ Webflow interactions reinitialisert.");
      } catch (e) {
        console.warn("⚠️ Klarte ikke å reinitiere Webflow interactions:", e);
      }
    } else {
      console.warn("⚠️ Webflow er ikke klar eller tilgjengelig enda.");
    }
  }
  