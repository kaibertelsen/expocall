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


    // Kjør når Memberstack er klar
MemberStack.onReady.then(function(member) {
    checkScheduledLogout();
    if (member.loggedIn) {
        const email = localStorage.getItem("tempUserEmail") || member.email || null;
        const password = gPassword || localStorage.getItem("tempUserPass") || null;

        // Bare hvis begge finnes – unngår å lagre tomme verdier
        if (email && password) {
            onLoginSuccess(email, password);
        }

        
        startNormalProcess(member);
    } else {
        handleAutoLoginFlow();
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


