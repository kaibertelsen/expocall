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
    "https://kaibertelsen.github.io/expocall/startcontroll.js",
    "https://kaibertelsen.github.io/expocall/innloggingsprosess.js"

];

// Laste inn alle skriptene sekvensielt
cdnScripts.reduce((promise, script) => {
    return promise.then(() => loadScript(script));
}, Promise.resolve()).then(() => {
    console.log("All scripts loaded");

    //sett versjonsnummeret
    const version = "1.096";
    const versiontext = document.getElementById("versiontext");

    if (versiontext) {
        versiontext.textContent = `Versjon: ${version}`;
    }


    // Kjør når Memberstack er klar
    MemberStack.onReady.then(function(member) {
        if (member.loggedIn) {
            localStorage.setItem("loggedIn", "true");

            showUserLoginInfo();
    
            // Rydd opp i auto-login flagg etter faktisk innlogging
            if (localStorage.getItem("doAutoLogin") === "true") {
                localStorage.removeItem("doAutoLogin");
            }
    
            startNormalProcess(member);
        } else {
            // Ikke fjern flagget her – det trengs etter reload
            if (localStorage.getItem("doAutoLogin") === "true") {
                tryAutoLogin();
            } else {
                startManualLogin();
            }
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



