function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${url}`);
        document.head.appendChild(script);
    });
}

// Liste over CDN-URL-er som skal lastes inn
const cdnScripts = [
    "https://kaibertelsen.github.io/expocall/startmultifunctionbutton.js",
    "https://kaibertelsen.github.io/expocall/apicom.js",
    "https://kaibertelsen.github.io/expocall/elementtrigger.js",
    "https://kaibertelsen.github.io/expocall/startcontroll.js"

];

// Laste inn alle skriptene sekvensielt
cdnScripts.reduce((promise, script) => {
    return promise.then(() => loadScript(script));
}, Promise.resolve()).then(() => {
    console.log("All scripts loaded");
    MemberStack.onReady.then(function(member) {
        if (member.loggedIn){
            //hvis autologin inneholder brukernavn og passord
            const autologin = JSON.parse(sessionStorage.getItem("autologin"));
            if(autologin){
            localStorage.setItem("autologin", JSON.stringify(autologin));
            }

            loggFunction("member.loggedIn");
            console.log("startup functions");
            loggedinn=true;
            loggconsole("logginn");
            saveUserNameIOS(member.name);
            tokenkontroll();
            userid = member.airtable;
            klientid = member.klientid;
            memberobject = member;
            panelObjectControll(member);
            IOSlayout()
            //skjul coverbilde
            stoploadingscreen();
                document.getElementById('sectionfooter').style.display = "block";
            document.getElementById('headerwrapper').style.display = "block";
            writeToIndexDb(member);
            writelogginupdate();
            modulControll();
        }else{
          
            document.getElementById('sectionfooter').style.display = "none";
                stoploadingscreen();
                innloggingstart(); // starter innlogging
        }

    });
}).catch(error => {
    console.error(error);
});


//sjekke om det er første gang bruker logger inn
if(!localStorage.getItem("firsttimeloggin")){
    
    document.getElementById('welcomscreen').style.display = "flex";
    document.getElementById('headerwrapper').style.display = "none";
    localStorage.setItem("firsttimeloggin", "false");
}

document.getElementById("email-form").addEventListener("submit", function(e) {
    e.preventDefault(); // hindrer reload
    // kall evt. din egen login-funksjon her
});
