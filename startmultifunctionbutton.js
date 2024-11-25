
document.getElementById("multibuttonstart").addEventListener("click", getPremessage);

function getPremessage() {
    var body = airtablebodylistAND({klientid:klientid,standard:1});
    Getlistairtable("appYyqoMRDdL08VXJ","tbljbPtkSRhx2U9IG",body,"respondPremessage");
}

function respondPremessage(data){
  console.log(data);

  //sjekke user
}