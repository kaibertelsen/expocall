var gPassword;
var gEmail;

setInterval(checkScheduledLogout, 60 * 60 * 1000); // Hver time

function checkScheduledLogout() {
    const now = new Date();
    const currentHour = now.getHours();
    const todayDate = now.toISOString().split("T")[0];

    const lastLogoutTimestamp = localStorage.getItem("automaticOutlogDate");

    // Bare fortsett hvis klokka er 02:00
    if (currentHour !== 2) return;

    // Hvis det er første gang (ingen tidligere logout registrert) → logg ut og sett startpunkt
    if (!lastLogoutTimestamp) {
        loggFunction("checkScheduledLogout: første gang – logger ut og setter startpunkt");
        automaticLogout();
        return;
    }

    const lastLogoutDate = new Date(lastLogoutTimestamp);
    const lastLogoutDateOnly = lastLogoutTimestamp.split("T")[0];

    // Unngå å logge ut flere ganger samme dag
    if (lastLogoutDateOnly === todayDate) return;

    // Krev at det har gått minst 2 dager
    const diffInDays = Math.floor((now - lastLogoutDate) / (1000 * 60 * 60 * 24));
    if (diffInDays < 2) return;

    automaticLogout();
}

function automaticLogout() {
    localStorage.setItem("doAutoLogin", "true");
    localStorage.setItem("automaticOutlogDate", new Date().toISOString());

    MemberStack.logout();

}


// Forsøker automatisk innlogging
function tryAutoLogin() {
    const savedEmail = localStorage.getItem("savedUser");
    const savedPass = localStorage.getItem("savedPass");

    if (savedEmail && savedPass) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("passwordloginn").value = savedPass;

        // Klikker innloggingsknappen etter delay
        setTimeout(() => {
            document.getElementById("logginbutton").click();
        }, 1000);
    } else {
        startManualLogin();
    }
}

// Lagrer tidspunkt for automatisk utlogging
function storeOutlogKey() {
    localStorage.setItem("automaticOutlog", new Date().toISOString());
}

function startManualLogin() {
  
    //starter manuell innlogging    
    const savedEmail = localStorage.getItem("savedUser");
    const savedPass = localStorage.getItem("savedPass");

    

    if (savedEmail) {
        //legger disse inn i inputfeltene
        document.getElementById("email").value = savedEmail;
    }

    if (savedPass) {
        //legger disse inn i inputfeltene
        document.getElementById("passwordloginn").value = savedPass;
    }

    //vis innloggingsvindu
    showLoginWindow();

    //hvis det er passord og email klikk på loginknapp etter 1 minutt
    if (savedEmail && savedPass) {
        setTimeout(() => {
            document.getElementById("logginbutton").click();
        }, 60000);
    }
 
}


document.getElementById('logginbutton').onclick = function() {
    // Hent verdier
    const email = document.getElementById("email").value;
    const password = document.getElementById("passwordloginn").value;

    // Lagre i localStorage
    saveEmailAndPass(email, password);

};

// Kalles ved vellykket innlogging
function saveEmailAndPass(email, password) {
    localStorage.setItem("savedUser", email);
    localStorage.setItem("savedPass", password);
}

// Viser evt. innloggingsvindu
function showLoginWindow() {
    document.getElementById('tablogginn').click();
    document.getElementById('headerwrapper').style.display = "none";
    document.getElementById('sectionfooter').style.display = "none";
}

// Starter app/prosess etter innlogging
function startNormalProcess(member) {
   
    document.getElementById('tabpanel').click();

    //hvis autologin inneholder brukernavn og passord
    //const autologin = JSON.parse(sessionStorage.getItem("autologin"));
    //if(autologin){
    //localStorage.setItem("autologin", JSON.stringify(autologin));
    //}

    loggFunction("member.loggedIn");
    console.log("startup functions");
    loggedinn=true;
    loggconsole("logginn");

    //Lagrer Navnet i IOS App
    saveUserNameIOS(member.name);

    //henter token for å lagre på server
    tokenkontroll();

    //setter globale variabler
    userid = member.airtable;
    klientid = member.klientid;
    memberobject = member;

    //henter panelobjektet
    panelObjectControll(member);

    //setter opp IOS layout
    IOSlayout()

    //skjul coverbilde
    stoploadingscreen();

    //viser footer og header
    document.getElementById('sectionfooter').style.display = "block";
    document.getElementById('headerwrapper').style.display = "block";

    //lagrer medlemmet i IndexedDB
    writeToIndexDb(member);

    //oppdaterer logginn
    //writelogginupdate();

    //starter moduler
    //modulControll();
}

function showUserLoginInfo() {
    const email = localStorage.getItem("savedUser") || "ukjent";
    const password = localStorage.getItem("savedPass") || "";
    const lastOutlog = localStorage.getItem("automaticOutlogDate");

    let formattedDate = "ukjent tidspunkt";

    if (lastOutlog) {
        const date = new Date(lastOutlog);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Datoformat: 2. mai (liten forbokstav og uten punktum etter måned)
        const day = date.getDate();
        const monthNames = [
            "januar", "februar", "mars", "april", "mai", "juni",
            "juli", "august", "september", "oktober", "november", "desember"
        ];
        const month = monthNames[date.getMonth()];
        formattedDate = `${time} ${day}.${month}`;
    }

    const info = `
        Sist oppdaterte autologin:<br>${formattedDate}<br>
        Bruker: ${email}<br>
        Passord: ${'*'.repeat(password.length)}
    `;

    const el = document.getElementById("userInfoLogin");
    if (el) el.innerHTML = info;
}




// uppdater panel 
//48timer 
var updateinterval = 86400000; // 24 timer i millisekunder

if(localStorage.getItem("klient")){
    var klient = JSON.parse(localStorage.getItem("klient"));
    if(klient?.updateinterval){
        updateinterval = Number(klient.updateinterval)*60000;
    }else{
        //hvert tiende minutt
        updateinterval = 600000; // 10 minutter i millisekunder
    }
}

let updateOntime = setInterval(myupdatePanel,updateinterval);
function myupdatePanel() {
  updatemodul();
  //om det er mer en 50 linjer med logg sen denne
  testLogData(50);
}

////onlinetester
let connectionTest = setInterval(isDeviceOnline, 60000);

function isDeviceOnline(){
    const connectionicon = document.getElementById("connectionstatus");
    connectionicon.style.display = "inline-block";
    if (navigator.onLine) {
        connectionicon.style.backgroundColor = "#37723a";
        console.log('Enheten er tilkoblet nettverket.');
    } else {
        connectionicon.style.backgroundColor = "#8f0000";
        console.log('Enheten er ikke tilkoblet nettverket.');
        loggFunction("isDeviceOnline"+'Enheten er ikke tilkoblet nettverket.',"error");
        
    }

}

///eldre kode fra webflow
function updatesettingspages(){

    if(localStorage.getItem("autologin")){
          if(JSON.parse(localStorage.getItem("autologin")).autologin){
          document.getElementById('logginnautomatisk').checked = true;
          }else{
          document.getElementById('logginnautomatisk').checked = false;
          }
    }
    //
    document.getElementById("contentupdatetext").innerHTML = localStorage.getItem("updatenr");
    
    var userobject = JSON.parse(localStorage.getItem("userobject"));
    loadprofilImageSetting(userobject);
    listmygroup(userobject);
    
}

function loadprofilImageSetting(userobject){
        
        var image = document.getElementById('settingsprofilimage');
        if(userobject?.image){
        image.src = userobject.image;
        }else{
        image.style.display = "none";
        }
}

function listmygroup(userobject){
    
    var bgroup = [];
    var choicebgroup = [];
    
    
    
    if (userobject?.bgroup){
      bgroup = userobject.bgroup;
    }
    
    if(userobject?.choicebgroup){
    choicebgroup =  userobject.choicebgroup;
    }
    
    //finne de aktive gruppene
    var listgroupstatus = mergelistgroupstatus(bgroup,choicebgroup);
    
    var list = document.getElementById("mygrpuplist");
    var nodelocked = list.getElementsByClassName("locked")[0];
    var nodeswitch = list.getElementsByClassName("switchwrapper")[0];
    nodelocked.style.display = "none";
    nodeswitch.style.display = "none";
    
    const saveboxwrapper = list.getElementsByClassName("saveboxwrapper")[0];
    saveboxwrapper.style.display = "none";
    
    removeelement(list,"copy");
    
       for (var i = 0;i<listgroupstatus.length;i++){
        
        var clone;
        
        if(listgroupstatus[i].liststatus == "locked"){
            //dette er en låst gruppe
            clone = nodelocked.cloneNode(true);
            clone.style.display = "inline-block";
        }else{
            //dette er en brytergruppe
            clone = nodeswitch.cloneNode(true);
            var switchelement = clone.getElementsByClassName("switch")[0];
            let elementid = "groupswitch"+listgroupstatus[i].airtable;
            switchelement.id = elementid;
            if(listgroupstatus[i].liststatus == "on"){
            switchelement.checked = true;
            }else{
            switchelement.checked = false; 
            }
            switchelement.onclick = function(){setgroupactive(elementid);};
            switchelement.dataset.group = listgroupstatus[i].airtable;
            clone.style.display = "block";
        }
     
          var lable = clone.getElementsByClassName("lable")[0];
          lable.innerHTML = listgroupstatus[i].name;
          clone.classList.add("copy");
          list.appendChild(clone); 
    
        }
        list.appendChild(saveboxwrapper)
      
}
    
function setgroupactive(elementid){
        var element = document.getElementById(elementid);
       var groupid = element.dataset.group;
       console.log("Gruppeid er:",groupid);
       
       var list = document.getElementById("mygrpuplist"); 
       //gjøre synlig lagreknapp
       const saveboxwrapper = list.getElementsByClassName("saveboxwrapper")[0];
       saveboxwrapper.style.display = "block";
       const savebutton = saveboxwrapper.getElementsByClassName("save")[0];
       savebutton.onclick = function(){savegrouponuser();};
       
       const cancelbutton = saveboxwrapper.getElementsByClassName("cancel")[0];
       cancelbutton.onclick = function(){cancelgrouponuser();};
}
    
function savegrouponuser(){
    
    //finne grupene som er låst og usynlig
    var userobject = JSON.parse(localStorage.getItem("userobject"));
    
    var bgroup = [];
    var choicebgroup = [];
    
    if (userobject?.bgroup){
      bgroup = userobject.bgroup;
    }
    
    if(userobject?.choicebgroup){
    choicebgroup =  userobject.choicebgroup;
    }
    
    var lockedgroups = removechoiceablegroup(bgroup,choicebgroup);
    var choicegroups = getlistgroupchoice();
    
    var listtosave = lockedgroups.concat(choicegroups);
    
    var body = {bgroup:listtosave};
    
    callapi(baseid,"tblwG8wo09G40iNFA",userobject.airtable,JSON.stringify(body),"PATCH","airtable","grouponuserupdatretur") 
    
     //updatelogg
      writeupdatelogg("user");
      
      //update lokalt
      userobject.bgroup = listtosave;
      
      //lagre userobject
      localStorage.setItem("userobject", JSON.stringify(userobject)); 
    
}
    
function cancelgrouponuser(){
    var userobject = JSON.parse(localStorage.getItem("userobject"));
    listmygroup(userobject);
    
}

function removechoiceablegroup(bgroup,choicebgroup){
        
      var returngroup = [];
      for (var i = 0;i<bgroup.length;i++){
          
          if (choicebgroup.includes(bgroup[i])){
              //dette er en valgbar gruppe ikke legge den til
          }else{
              //dette er ikke en valgbar gruppe legg den til
              returngroup.push(bgroup[i]);
          }
          
      }
    
       return returngroup;
}
    
function getlistgroupchoice(){
    var returngroup = [];
    
    var list = document.getElementById("mygrpuplist"); 
    
    var switchelements = list.getElementsByClassName("switch");
    
    for (var i=0;i<switchelements.length;i++){
        
        if(switchelements[i]?.dataset?.group){
            if(switchelements[i].checked){
             returngroup.push(switchelements[i].dataset.group); 
            } 
        }
    }
    return returngroup;
}
    
function grouponuserupdatretur(data,id){
    
    console.log("userobject retur",data);
    
    var list = document.getElementById("mygrpuplist"); 
       //gjøre synlig lagreknapp
       const saveboxwrapper = list.getElementsByClassName("saveboxwrapper")[0];
       saveboxwrapper.style.display = "none";
    
    
    
}
    
function mergelistgroupstatus(bgroupid,choicebgroupid){
       var groups = JSON.parse(localStorage.getItem("group"));
       var returgroups = [];
       
    // er bgroup i choicegroup? sett status, om ikke lag en tekst av gruppens navn
       
       
    //lager valgbare listen
       for (var i = 0;i<choicebgroupid.length;i++){
            var group = findObject(choicebgroupid[i],groups);
            if(bgroupid.includes(choicebgroupid[i])){
            //da er denne en aktiv gruppe
            group.liststatus = "on";
            }else{
            //sett bruter til inaktiv
            group.liststatus = "off";
            }
        returgroups.push(group);
        }
        
    //legger til de låste gruppene
       for (var i = 0;i<bgroupid.length;i++){
            
            if(choicebgroupid.includes(bgroupid[i])){
            //denne gruppen er alt lagt til i retur array
            }else{
            //denne gruppen er låst evt. skal ikke vises
            var group = findObject(bgroupid[i],groups);
                if(group?.iscallingroup){
                   //denne gruppen skal vises som låst
                   group.liststatus = "locked";
                   returgroups.push(group);
                }
            }
            
         }
         
        return returgroups;
}
    
function logginswitsjchange(elementid){
    var logginnfo = JSON.parse(localStorage.getItem("autologin"));
     if(localStorage.getItem("autologin")){
          if(document.getElementById(elementid).checked){
          logginnfo.autologin = true
          localStorage.setItem ("autologin",JSON.stringify(logginnfo));
          }else{
          logginnfo.autologin = false
          localStorage.setItem ("autologin",JSON.stringify(logginnfo));
          }
        }else{
          //logg ut for å kunne lagre data
                MemberStack.logout();
        }
}
    
function manuellogout(){
    // fjern "automaticOutlogDate" fra localStorage
    MemberStack.logout();
}
    
    