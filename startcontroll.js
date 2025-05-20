

function panelObjectControll(member){
    if(localStorage.getItem("panelObject")){
    //Det er et lagret
    reloadPanel(JSON.parse(localStorage.getItem("panelObject")),"full");
    updatemodul();
    //laster ned databaser om nødvendig
    localDataControll(member.klientid);
  }else{
    //startloadingscreen();
    //det finnes ikke et panel
    getuserobjectfromserver(member);
    }

}


function localDataControll(klientid){
    console.log("localDatabaseKontroll");
    if(!localStorage.getItem("user")){
    loaddatafromServer(klientid,"user");
    }
    if(!localStorage.getItem("sone")){
    loaddatafromServer(klientid,"sone");
    }
    if(!localStorage.getItem("button")){
    loaddatafromServer(klientid,"button");
    }
    if(!localStorage.getItem("group")){
    loaddatafromServer(klientid,"group");
    }

    if(!localStorage.getItem("status")){
    loaddatafromServer(klientid,"status");
    }else{
    //det er lagret en lokalt sjekk om den er tom
        if(localStorage.getItem("status")){
        var statuses = JSON.parse(localStorage.getItem("status"));
            if(statuses.length == 0){
            //den er tom last ned statuser
            loaddatafromServer(klientid,"status");
            }
        }
    }

    if(!localStorage.getItem("klient")){
    getklientobjectfromserver(klientid);
    }

}



function innloggingstart() {
    document.getElementById('tablogginn').click();
    
    const storedData = localStorage.getItem("autologin");
    if (!storedData) return; // Avslutt hvis ingen autologin-data finnes

    //sjekke at stordata har nøkler med verdier "email" og "password"
    if(!storedData.includes("email") || !storedData.includes("password")) return;


    autologin = JSON.parse(storedData);

    // Hent tidspunkt for siste autoinnlogging
    const lastLoginTime = localStorage.getItem("lastAutoLoginTime");
    const now = Date.now();

    // Sjekk om det har gått mindre enn 5 minutter (300000 millisekunder)
    if (lastLoginTime && now - parseInt(lastLoginTime, 10) < 300000) {
    console.log("Autoinnlogging ble nylig utført. Venter...");
    return;
    }

    // Hent elementer for å unngå gjentatte kall til `document.getElementById`
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const loginButton = document.getElementById("logginbutton");

    // Sjekk om elementene finnes før vi prøver å bruke dem
    if (autologin?.email && emailField) {
        //sjekke om det er en gyldig mailadresse
        var mail = autologin.email;
        var mailformat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
        if(mail.match(mailformat)){
        //det er en gyldig mailadresse
        emailField.value = autologin.email;
        }else{
        //det er ikke en gyldig mailadresse}
        return;
        }
    }
    if (autologin?.password && passwordField) {
    passwordField.value = autologin.password;
    }

    // Hvis autologin er aktivert, klikk på login-knappen automatisk og autologinPressAutomatickly er ikke satt
    if (autologin?.autologin && loginButton && !localStorage.getItem("autologinPressAutomatickly")) {
    //loginButton.click();

    // **Oppdater siste autoinnloggingstidspunkt etter klikk**
    localStorage.setItem("lastAutoLoginTime", now.toString());

    //lagre at det har foregått en autologin
    lokalStorage.setItem("autologinPressAutomatickly", "true");

    //fjerne "autologinPressAutomatickly" etter 5 minutter
    setTimeout(() => {
        localStorage.removeItem("autologinPressAutomatickly");
    }
    , 300000); // 5 minutter i millisekunder
    }

}


function manuelupdate(){
    console.log("manuel update")
    dataresponslog.sone = false;
    dataresponslog.user = false;
    dataresponslog.button = false;
    dataresponslog.status = false;
    dataresponslog.reload = true;

    //laste ned sonedata
    var bodysone = makelistbody("FIND",klientid,"klientid");
    apilistcall(baseid,"tbl8QTc26JZ7Lj22a",bodysone,"sone");

    //last ned userdata
    var bodysone = makelistbody("FIND",klientid,"klientid");
    apilistcall(baseid,"tblwG8wo09G40iNFA",bodysone,"user");

    //last ned button
    var bodybutton = makelistbody("FIND",klientid,"klientid");
    apilistcall(baseid,"tblOdPAVb9YQkIUMm",bodybutton,"button");

    //last ned status
    var bodybutton = makelistbody("FIND","1","segment");
    apilistcall(baseid,"tblhyUFQheDfEmTDR",bodybutton,"status");

}

function returdatacontroll(data,id){
   console.log("returkontroll")
    if(id=="user"){
    dataresponslog.user = true;
    //oppdater dato 
    updateloggtext(document.getElementById("userupdatedate"));
    }else if(id=="sone"){
    dataresponslog.sone = true;
    //oppdater dato 
    updateloggtext(document.getElementById("soneupdatedate"));

    }else if(id=="button"){
    dataresponslog.button = true;
    //oppdater dato 
    updateloggtext(document.getElementById("buttonupdatedate"));
    }else if(id=="status"){
    dataresponslog.status = true;
    //oppdater dato 
    }




    //kontrollere om alle db er oppdatert
    if(dataresponslog.reload){
    if (dataresponslog.user){
    if(dataresponslog.sone){
        if(dataresponslog.button){
        if(dataresponslog.status){
    //sone user og button er oppdatert
    console.log("ferdig")
            var selectedobject = JSON.parse(localStorage.getItem("panelObject"));
            let airtable = selectedobject.sonecurrent.airtable;
            dataresponslog.reload = false;
            dataresponslog.sone = false;
            dataresponslog.user = false;
            dataresponslog.button = false;
            dataresponslog.sone = false;
            soneselectValue(airtable);
            }
        }
    }
    }

    }

}

function updateinnloggingstart(){

   var autologinswitsjh = document.getElementById("remembermy").checked;
   var autologin = {email:document.getElementById("email").value,password:document.getElementById("password").value,autologin:autologinswitsjh}

  //skriv autologin til sessionstore
    sessionStorage.setItem("autologin", JSON.stringify(autologin));
}


function updateloggtext(element){
const d = new Date();

const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

let month = months[d.getMonth()];
let year = d.getFullYear();
let day = d.getDate();

let hours = d.getHours();
let minutes = d.getMinutes();
let sec = d.getSeconds();

element.innerHTML = day+"."+month+"-"+year+" "+hours+":"+minutes+":"+sec;
}

function setUserObjecttoDB(userObject){


}

function writelogginupdate(){
if(localStorage.getItem("firsttimeloggin")){
 if(localStorage.getItem("firsttimeloggin")=="true"){
   writeupdatelogg("user");
   localStorage.setItem("firsttimeloggin", "false"); 
   }
}else{
localStorage.setItem("firsttimeloggin", "true"); 
}

}

function modulControll(){
//sjekke hvilke miduler som er på klient


}


