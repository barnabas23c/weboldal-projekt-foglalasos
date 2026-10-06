const nev = document.getElementById("nev");
const email = document.getElementById("email");
const tel = document.getElementById("tel");
const datum = document.getElementById("datum");
const fodrasz = document.getElementById("fodrasz");
const szolgaltatas = document.getElementById("szolgaltatas");
const hiba = document.getElementById("formerr");
const ar = document.getElementById("ar");
const afa = document.getElementById("afa");
const vegosszeg = document.getElementById("vegosszeg");
const foglalas = document.getElementById("foglalas");

var today = new Date().toISOString().split('T')[0];
datum.setAttribute("min", today);

(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            fodrasz.innerHTML += `<option name="${i}">${data[i].neve}</option>`;
    };
    xhr.send();
})();

(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/szolgaltatasok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            szolgaltatas.innerHTML += `<option name="${i}" data-ar=${data[i].ar}>${data[i].szolgaltatas} - ${data[i].ar} Ft</option>`;
    };
    xhr.send();
})();

szolgaltatas.addEventListener("change", () => {
    const idx = szolgaltatas.selectedIndex;
    if (idx == 0) {
        ar.innerText = "-";
        afa.innerText = "-";
        vegosszeg.innerText = "-";
    }
    else {
        const opt = szolgaltatas.children[idx];
        ar.innerText = opt.dataset.ar + " Ft";
        afa.innerText = Math.round(opt.dataset.ar * 0.27) + " Ft";
        vegosszeg.innerText = Math.round(opt.dataset.ar * 1.27) + " Ft";
    }
});

foglalas.addEventListener("click", () => {
    let hibak = [];
    if (!nev.value.match(/^[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| )([A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| ))?[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+$/))
        hibak.push("Helytelen név formátum!");
    if (!email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        hibak.push("Heyltelen email cím formátum!");
    if (!tel.value.match(/^\+? ?(\d ?){11}$/))
        hibak.push("Helytelen telefonszám!");

    if (hibak.length == 0) {
        form.requestSubmit();
        hiba.style.display = "none";
    }
    else {
        hiba.innerHTML = hibak.reduce((s, v) => s += v + "<br>", "");
        hiba.style.display = "block";
    }
});
