
document.getElementById("multibuttonstart").addEventListener("click", startPremessageList);

function startPremessageList(){
    if(preMessage.length>0){
        listPreMessage(preMessage);
    }
    document.getElementById("startpremessagebuttontab").click();
    getPremessage();
}

function getPremessage() {
    var body = airtablebodylistAND({ klientid: klientid });
    Getlistairtable("appYyqoMRDdL08VXJ", "tbljbPtkSRhx2U9IG", body, "respondPremessage");
}

var preMessage = [];

function respondPremessage(data) {
    console.log(data);
    preMessage = rawdatacleaner(data);  
}

function listPreMessage(data) {
    // Filter og list meldinger
    data = filterPreMessage(data);

    const list = document.getElementById("premessagelist");
    list.innerHTML = ""; // Fjern eksisterende elementer

    const elementLibrary = document.getElementById("elementholdermultibutton");
    const nodeElement = elementLibrary.querySelector(".multibutton");

    for (let message of data) {
        // Klon elementet
        const rowElement = nodeElement.cloneNode(true);
        rowElement.dataset.airtable = message.airtable;

        // Oppdater meldingstekst
        rowElement.querySelector(".messagetextbody").textContent = message.message;

        // Legg til klikk-hendelse
        rowElement.addEventListener("click", function () {
            markMessageButton(rowElement);
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

