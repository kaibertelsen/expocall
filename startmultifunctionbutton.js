
document.getElementById("multibuttonstart").addEventListener("click", getPremessage);

function getPremessage() {
    var body = airtablebodylistAND({klientid:klientid});
    Getlistairtable("appYyqoMRDdL08VXJ","tbljbPtkSRhx2U9IG",body,"respondPremessage");
}
var preMessage = [];
function respondPremessage(data){
  console.log(data);
  preMessage = rawdatacleaner(data);

  //sjekke user
}