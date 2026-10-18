const nev = document.getElementById("nev");
const email = document.getElementById("email");
const tel = document.getElementById("tel");
const datum = document.getElementById("datum");
const fodrasz = document.getElementById("fodrasz");
const idopont = document.getElementById("idopont");
const szolgaltatas = document.getElementById("szolgaltatas");

const params = new URLSearchParams(window.location.search);

nev.innerText = params.get("nev");
email.innerText = params.get("email");
tel.innerText = params.get("tel");
datum.innerText = params.get("datum");
fodrasz.innerText = params.get("fodrasz");
idopont.innerText = params.get("idopont");
szolgaltatas.innerText = params.get("szolgaltatas");

