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

const foglalas = document.getElementById("foglalas");
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
            fodrasz.innerHTML += `<option name="${i}">${data[i].neve}</option>`;
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
            szolgaltatas.innerHTML += `<option name="${i}" data-ar=${data[i].ar}>${data[i].szolgaltatas} - ${data[i].ar} Ft (${data[i].ido} perc)</option>`;
        szolgaltatasok = data;
    };
    xhr.send();
})();

function getidopontok()
{
    let idopontok = [];
    let ch = 9, cm = 0;
    while (true)
    {
        idopontok.push({ h: ch, m: cm });
        cm += 15;
        if (cm === 60) { ch++; cm = 0; }
        if (ch === 12) ch++;
        if (ch === 17) break;
    }
    return idopontok;
}

function getRelM(idopont) { return idopont.h * 60 + idopont.m; }

function getOccupiedIdopontok(kezdes, idotartam)
{
    let idopontok = getidopontok();
    idopontok = idopontok.filter(x => getRelM(x) >= getRelM(kezdes) && getRelM(x) <= getRelM(kezdes) + idotartam);
    return idopontok;
}

function getIdotartamForFoglalas(foglalas)
{
    return szolgaltatasok[foglalas.szolgaltatas].ido;
}

function idopontUjratoltes()
{
    idopont.innerHTML = `<option name="" disabled selected>-- Válasszon időpontot --</option>`;
    let idopontok = getidopontok();
    if (datum.value == "" || szolgaltatas.selectedIndex === 0)
    {
        idopont.disabled = true;
        idopont.selectedIndex = 0;
        return;
    }
    idopont.disabled = false;
    let aznapifoglalasok = (localStorage.getItem("foglalasok") ?? []).filter(x => x.datum === datum.value);
    aznapifoglalasok.forEach(x =>
        idopontok = idopontok.filter(y =>
            !getOccupiedIdopontok(x.idopont,
                getIdotartamForFoglalas(x)
            ).includes(y)
        )
    )
    // TODO: ki kell szűrni azokat az időpontokat amik belelőgnak következő foglalásokba vagy a nap végébe
    idopontok.forEach(x => idopont.innerHTML += `<option name="${`${x.h}:${`${x.m}`.padStart(2, '0')}`}">${`${x.h}:${`${x.m}`.padStart(2, '0')}`}</option>`)
}

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
    if (!nev.value.match(/^[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| )([A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+(-| ))?[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+$/)) { nev.setCustomValidity("Helytelen név formátum!"); return; }
    else nev.setCustomValidity("");
    if (!email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) { email.setCustomValidity("Heyltelen email cím formátum!"); return; }
    else email.setCustomValidity("");
    if (!tel.value.match(/^\+? ?(\d ?){11}$/)) { tel.setCustomValidity("Helytelen telefonszám!"); return; }
    else tel.setCustomValidity("");
    if (fodrasz.selectedIndex == 0) { fodrasz.setCustomValidity("Nem válaszott fodrászt!"); return; }
    else fodrasz.setCustomValidity("");
    if (szolgaltatas.selectedIndex == 0) { szolgaltatas.setCustomValidity("Nem válaszott szolgáltatást!"); return; }
    else szolgaltatas.setCustomValidity("");

    let foglalasok = localStorage.getItem("foglalasok") ?? [];
    foglalasok.push({
        nev: nev.value,
        email: email.value,
        tel: tel.value,
        datum: datum.value,
        fodrasz: fodrasz.selectedIndex - 1,
        szolgaltatas: szolgaltatas.selectedIndex - 1,
        idopont: idopont.value
    });
    console.log(foglalasok)
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
});
