
document.getElementById("headersoneselector").addEventListener("change", (e) => {
    soneselected(document.getElementById("headersoneselector"));
});
       
document.getElementById('footpanel').onclick = function() {
    loggFunction("Valgt Panel side");
    pageid = "panel"
    //scrolltest
    setTimeout(scrollUp, 100);
    document.getElementById('tabpanel').click()
    stopsonemodul();
    markthisNavigationbutton(document.getElementById('footpanel'));
    updatemodul();
}
document.getElementById('footsone').onclick = function() {
    loggFunction("Valgt Sone side");
    pageid = "sone"
    document.getElementById('tabsone').click()
    startsonemodul();
    markthisNavigationbutton(document.getElementById('footsone'))
}
document.getElementById('footchat').onclick = function() {
    loggFunction("Valgt Chat side");
    pageid = "chat"
    document.getElementById('tabalert').click()
    stopsonemodul();
    markthisNavigationbutton(document.getElementById('footchat'));
    
    nameFilterbuttonMessage();
    makelocalListMessage();
    setTimeout(scrollDown, 100);
    
    //hente liste fra server
    getListMessage();
}

function scrollDown(){
    if(pageid = "chat"){
    window.scrollTo(0, document.body.scrollHeight);
    }
}

function scrollUp(){
    if(pageid = "panel"){
    window.scrollTo(0, 0);
    }
}
    
    /*
    document.getElementById('reloadbuttons').onclick = function() {
    //delete panelobjectreloadbuttons
    updatemodul();
    }
    */
    
    document.getElementById('logginbutton').onclick = function() {
        // Hent verdier
        const email = document.getElementById("email").value;
        const password = document.getElementById("passwordloginn").value;
    
        // Lagre i localStorage
        localStorage.setItem("savedUser", email);
        localStorage.setItem("savedPass", password);
    
    };
    
    
    
    
    document.getElementById('settingsbutton').onclick = function() {
        loggFunction("Valgt Settings side");
        pageid = "settings"
        //finne mine devicer
        //findmyDeviceOnServer();
        updatesettingspages();
        
        document.getElementById('settingsbuttontab').click()
        stopsonemodul();
        markthisNavigationbutton(document.getElementById('settingsbutton'));
    }
    /*
    document.getElementById('sendtonative').onclick = function() {
    //finne mine devicer
    getIOSToken()
    }
    */
    document.getElementById('fullscreenmode').onclick = function() {
    //last ned siste data user, sone, button
    startfullscreenMode();
    
    }
    
    
    document.getElementById('updatepanelbutton').onclick = function() {
    //last ned siste data user, sone, button
    //manuelupdate();  
    loggFunction("Trykket på reloader i settings")
    location.reload();
    
    }
    
    document.getElementById('loggoutsettings').onclick = function() {
    loggFunction("Trykket på loggout")
    deleteLocalData();
    //slette elle databaser
    manuellogout();
    }

    const loggoutsettingsauto = document.getElementById('loggoutsettingsauto');
    if (loggoutsettingsauto) {
        loggoutsettingsauto.onclick = function() {
            //for å simulere automatisk utlogging
            automaticLogout();
        }
    }
    
    
    document.getElementById('testfunctionbutton').onclick = function() {
    
    }
    
    document.getElementById('sendloggtoserverbutton').onclick = function() {
    sendLoggToserver();
    }
    
    