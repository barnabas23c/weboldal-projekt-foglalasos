const nev = document.getElementById("nev");
const email = document.getElementById("email");
const tel = document.getElementById("tel");
const datum = document.getElementById("datum");
const fodrasz = document.getElementById("fodrasz");
const idopont = document.getElementById("idopont");
const szolgaltatas = document.getElementById("szolgaltatas");

const ar = document.getElementById("ar");
const afa = document.getElementById("afa");
const vegosszeg = document.getElementById("vegosszeg");

const form = document.getElementById("form");

var today = new Date().toISOString().split('T')[0];
datum.setAttribute("min", today);

let fodraszok = [];
(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            fodrasz.innerHTML += `<option>${data[i].neve}</option>`;
        fodraszok = data;
    };
    xhr.send();
})();

let szolgaltatasok = [];
(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/szolgaltatasok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            szolgaltatas.innerHTML += `<option data-ar=${data[i].ar}>${data[i].szolgaltatas} - ${data[i].ar} Ft (${data[i].ido} perc)</option>`;
        szolgaltatasok = data;
        szolgaltatas.selectedIndex = Number(new URLSearchParams(window.location.search).get("szolgaltatas")) + 1;
    };
    xhr.send();
})();
let foglalhatok = [];
(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/foglalhatok.json");
    xhr.onload = () => foglalhatok = JSON.parse(xhr.response);
    xhr.send();
})();

function getidopontok(idp)
{
    let dayofweek = ((new Date(idp).getDay() + 6) % 7);
    let data = foglalhatok[dayofweek];

    let idopontok = [];
    let ch = data.kezdes, cm = 0;
    while (true)
    {
        idopontok.push({ h: ch, m: cm, free: ch < data.szunetKezdes || ch > data.szunetVege });
        cm += 15;
        if (cm === 60) { ch++; cm = 0; }
        if (ch === data.vege) break;
    }
    return idopontok;
}

function getRelM(idopont) { return idopont.h * 60 + idopont.m; }

function getOccupiedIdopontok(datum, kezdes, idotartam)
{
    let idopontok = getidopontok(datum);
    idopontok = idopontok.filter(x => getRelM(x) >= getRelM(kezdes) && getRelM(x) <= getRelM(kezdes) + idotartam);
    return idopontok;
}

function strToIdopont(str) { let i = str.split(":").map(Number); return { h: i[0], m: i[1] }; }

// NOTE: Ennél roszabb megoldást nem is találhattam volna ki, de mivel működik
//       és nincs energiám/időm újracsinálni: jó lesz.
function idopontUjratoltes()
{
    idopont.innerHTML = `<option name="" disabled selected>-- Válasszon időpontot --</option>`;
    if (datum.value == "" || szolgaltatas.selectedIndex === 0 || fodrasz.selectedIndex === 0)
        {
            idopont.disabled = true;
            idopont.selectedIndex = 0;
            return;
        }
    let idopontok = getidopontok(datum.value);
    idopont.disabled = false;
    let aznapifoglalasok = JSON.parse(localStorage.getItem("foglalasok") ?? "[]").filter(x =>
        x.idopont.ev === Number(datum.value.split("-")[0]) &&
        x.idopont.honap === Number(datum.value.split("-")[1]) &&
        x.idopont.nap === Number(datum.value.split("-")[2]) &&
        x.fodrasz === fodrasz.selectedIndex - 1);
    aznapifoglalasok.forEach(x => idopontok = idopontok.map(y => {
        return { h: y.h, m: y.m, free: y.free && !getOccupiedIdopontok(datum.value, strToIdopont(`${x.idopont.ora}:${x.idopont.perc}`), szolgaltatasok[x.szolgaltatas].ido).some(z => z.h === y.h && z.m === y.m) }
    }))
    let hossz = szolgaltatasok[szolgaltatas.selectedIndex - 1].ido / 15;
    idopontok = idopontok.slice().filter((_, idx) =>
        idx <= idopontok.length - hossz && // nap vége
        idopontok.slice(idx, idx + hossz).every(x => x.free)
    );
    idopontok.forEach(x => idopont.innerHTML += `<option name="${`${x.h}:${`${x.m}`.padStart(2, '0')}`}">${`${x.h}:${`${x.m}`.padStart(2, '0')}`}</option>`)
}

datum.addEventListener('change', () => idopontUjratoltes());
fodrasz.addEventListener('change', () => idopontUjratoltes());
szolgaltatas.addEventListener('change', () => idopontUjratoltes());

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

nev.addEventListener('change', () => nev.setCustomValidity(""));
email.addEventListener('change', () => email.setCustomValidity(""));
tel.addEventListener('change', () => tel.setCustomValidity(""));
datum.addEventListener('change', () => datum.setCustomValidity(""));
fodrasz.addEventListener('change', () => fodrasz.setCustomValidity(""));
szolgaltatas.addEventListener('change', () => szolgaltatas.setCustomValidity(""));
idopont.addEventListener('change', () => idopont.setCustomValidity(""));

form.addEventListener('submit', (e) => {
    let err = false;
    nev.setCustomValidity("");
    email.setCustomValidity("");
    tel.setCustomValidity("");
    datum.setCustomValidity("");
    fodrasz.setCustomValidity("");    
    szolgaltatas.setCustomValidity("");
    if (!/^[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| )([A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| ))?[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+$/.test(nev.value))
    {
        nev.setCustomValidity("Helytelen név formátum!");
        err = true;
    }
    if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value))
    {
        email.setCustomValidity("Heyltelen email cím formátum!");
        err = true;
    }
    if (!/^\+? ?(\d ?){11}$/.test(tel.value))
    {
        tel.setCustomValidity("Helytelen telefonszám!");
        err = true;
    }
    if (((new Date(datum.value).getDay() + 6) % 7) === 6)
    {
        datum.setCustomValidity("Vasárnap nem vagyunk nyitva!");
        err = true;
    }
    if (fodrasz.selectedIndex == 0)
    {
        fodrasz.setCustomValidity("Nem válaszott fodrászt!");
        err = true;
    }
    if (szolgaltatas.selectedIndex == 0)
    {
        szolgaltatas.setCustomValidity("Nem válaszott szolgáltatást!");
        err = true;
    }
    if (idopont.selectedIndex == 0)
    {
        idopont.setCustomValidity("Nem válaszott időpontot!");
        err = true;
    }

    if (err)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    let foglalasok = JSON.parse(localStorage.getItem("foglalasok")) ?? [];
    foglalasok.push({
        nev: nev.value,
        email: email.value,
        telefonszam: tel.value,
        fodrasz: fodrasz.selectedIndex - 1,
        szolgaltatas: szolgaltatas.selectedIndex - 1,
        idopont: {
            ev: Number(datum.value.split("-")[0]),
            honap: Number(datum.value.split("-")[1]),
            nap: Number(datum.value.split("-")[2]),
            ora: Number(idopont.value.split(":")[0]),
            perc: Number(idopont.value.split(":")[0])
        }
    });
    localStorage.setItem("foglalasok", JSON.stringify(foglalasok));
});

