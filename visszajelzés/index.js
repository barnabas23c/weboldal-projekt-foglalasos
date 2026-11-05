const nev = document.getElementById("nev");
const email = document.getElementById("email");
const tel = document.getElementById("tel");
const datum = document.getElementById("datum");
const fodrasz = document.getElementById("fodrasz");
const idopont = document.getElementById("idopont");
const szolgaltatas = document.getElementById("szolgaltatas");

const params = new URLSearchParams(window.location.search);

let datum2 = JSON.parse(params.get("datum"));

nev.innerText = params.get("nev");
email.innerText = params.get("email");
tel.innerText = params.get("tel");
datum.innerText =idopont.innerText = datum2.ev + "." + datum2.honap + "." + datum2.nap + ". " + datum2.ora + ":" + String(datum2.perc).padStart(2, "0");
fodrasz.innerText = params.get("fodrasz");
idopont.innerText = params.get("idopont");
szolgaltatas.innerText = params.get("szolgaltatas");

