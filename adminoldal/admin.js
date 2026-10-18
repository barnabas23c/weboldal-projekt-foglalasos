let foglalasok = [];
let fodraszok = [];
let szolg = [];

let rendezes = document.getElementById("rendezes");
let rendezesgomb = document.getElementById("rendezgomb");
let kartyak = document.getElementById("kartyak");
let tablazat = document.getElementById("tablazat");
let tablegomb = document.getElementById("tablegomb");
let kartyagomb = document.getElementById("kartyagomb");

const torles = (esemeny) => {
    let index = esemeny.target.dataset.index;
    foglalasok[index].torolve = true;
    let kartya = esemeny.target.closest(".col-md-6");
    if (kartya != null) {
        kartya.remove();
    }

    let sor = esemeny.target.closest("tr");
    if (sor != null) {
        sor.remove();
    }
}

const kartyamegjelenit = () =>
{
    if (foglalasok == [] || fodraszok == []) return;
    megjelenites = 0;
    tablazat.hidden = true;
    kartyak.hidden = false;
    tablegomb.className = "btn btn-outline-dark";
    kartyagomb.className = "btn btn-dark";
    const sorted = foglalasok.toSorted((a, b) =>
    {
        if (rendezes.selectedIndex === 0) return ('' + a.nev).localeCompare(b.nev);
        if (rendezes.selectedIndex === 1) return
        new Date(year=b.idopont.ev, monthIndex=b.idopont.honap, date=b.idopont.nap, hours=b.idopont.ora) -
            new Date(year=a.idopont.ev, monthIndex=a.idopont.honap, date=a.idopont.nap, hours=a.idopont.ora);
        if (rendezes.selectedIndex === 2) return ('' + a.fodrasz).localeCompare(b.fodrasz);
        if (rendezes.selectedIndex === 3) return ('' + a.szolgaltatas).localeCompare(b.szolgaltatas);
    });
    kartyak.innerHTML = "";
    for (const data of sorted) {
        data.torolve = false;
        let index = foglalasok.indexOf(data);
        kartyak.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="card mb-3">
                        <div class="card-body">

                            <h5 class="card-title">
                                ${data.nev}
                            </h5>

                            <p>
                                <b>Email:</b>
                                ${data.email}
                            </p>

                            <p>
                                <b>Telefon:</b>
                                ${data.telefonszam}
                            </p>

                            <p>
                                <b>Időpont:</b>
                                ${data.idopont.ev}.${data.idopont.honap}.${data.idopont.nap}. ${data.idopont.ora}:00
                            </p>

                            <p>
                                <b>Fodrász:</b>
                                ${fodraszok[data.fodrasz].neve}
                            </p>

                            <p>
                                <b>Szolgáltatás:</b>
                                ${szolg[data.szolgaltatas].szolgaltatas}
                            </p>

                            <input
                                type="button"
                                value="Törlés"
                                class="btn btn-danger"
                                name="torles"
                                data-index="${index}"
                            >

                        </div>
                    </div>
                </div>
            `;
    }

    let torlesgombok = document.querySelectorAll('input[name="torles"]');

    for (const gomb of torlesgombok) {
        gomb.addEventListener("click", torles);
    }

}

const betolt = () => {
    let fodraszszures = document.getElementById("fodraszszures");
    let szolgaltatasszures = document.getElementById("szolgaltatasszures");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        fodraszok = JSON.parse(xhr.response);
        kartyamegjelenit();
        for (const ember of fodraszok) {
            fodraszszures.innerHTML += `
                <option value="${ember.neve}">
                    ${ember.neve}
                </option>
            `;
        }
    };

    xhr.send();

    const xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/data/szolgaltatasok.json");
    xhr2.onload = () => {
        szolg = JSON.parse(xhr2.response);

        for (const data of szolg) {
            szolgaltatasszures.innerHTML += `
                <option value="${data.szolgaltatas}">
                    ${data.szolgaltatas}
                </option>
            `;
        }
    };

    xhr2.send();

    const xhr3 = new XMLHttpRequest();
    xhr3.open("GET", "/data/foglalasok.json");
    xhr3.onload = () => {
        foglalasok = JSON.parse(xhr3.response);
        kartyamegjelenit();
    };

    xhr3.send();
}

let megjelenites = 0;
const tablazatmegjelenit = () => {
    megjelenites = 1;
    kartyagomb.className = "btn btn-outline-dark";
    tablegomb.className = "btn btn-dark";
    kartyak.hidden = true;
    tablazat.hidden = false;
    let tablazattorzs = document.getElementById("tablazattorzs");
    tablazattorzs.innerHTML = `
        <thead>
            <tr>
                <th>Név</th>
                <th>Email</th>
                <th>Telefonszám</th>
                <th>Időpont</th>
                <th>Fodrász</th>
                <th>Szolgáltatás</th>
                <th>Törlés</th>
            </tr>
        </thead>
    `;

    const sorted = foglalasok.toSorted((a, b) =>
        {
            if (rendezes.selectedIndex === 0) return ('' + a.nev).localeCompare(b.nev);
            if (rendezes.selectedIndex === 1) return
            new Date(year=b.idopont.ev, monthIndex=b.idopont.honap, date=b.idopont.nap, hours=b.idopont.ora) -
                new Date(year=a.idopont.ev, monthIndex=a.idopont.honap, date=a.idopont.nap, hours=a.idopont.ora);
            if (rendezes.selectedIndex === 2) return ('' + a.fodrasz).localeCompare(b.fodrasz);
            if (rendezes.selectedIndex === 3) return ('' + a.szolgaltatas).localeCompare(b.szolgaltatas);
        });
    for (const data of sorted) {
        if (data.torolve == true) {
            continue;
        }

        let index = foglalasok.indexOf(data);

        tablazattorzs.innerHTML += `
            <tr>
                <td>${data.nev}</td>
                <td>${data.email}</td>
                <td>${data.telefonszam}</td>
                <td>
                    ${data.idopont.ev}.${data.idopont.honap}.${data.idopont.nap}. ${data.idopont.ora}:00
                </td>
                <td>${fodraszok[data.fodrasz].neve}</td>
                <td>${szolg[data.szolgaltatas].szolgaltatas}</td>
                <td>
                    <input
                        type="button"
                        value="Törlés"
                        class="btn btn-danger"
                        name="torles"
                        data-index="${index}"
                    >
                </td>
            </tr>
        `;
    }

    let torlesgombok = document.querySelectorAll('input[name="torles"]');

    for (const gomb of torlesgombok) {
        gomb.addEventListener("click", torles);
    }
}

window.addEventListener("load", betolt);
tablegomb.addEventListener("click", tablazatmegjelenit);
kartyagomb.addEventListener("click", kartyamegjelenit);
rendezesgomb.addEventListener("click", () => megjelenites === 0 ? kartyamegjelenit() : tablazatmegjelenit())
