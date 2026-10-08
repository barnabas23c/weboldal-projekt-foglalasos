let foglalasok = {};
let fodraszok = {};
let szolg = {};

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

const betolt = () => {
    let fodraszszures = document.getElementById("fodraszszures");
    let szolgaltatasszures = document.getElementById("szolgaltatasszures");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        fodraszok = JSON.parse(xhr.response);

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

        for (const data of foglalasok) {
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
    };

    xhr3.send();
}

const tablazatmegjelenit = () => {
    kartyagomb.className = "btn btn-outline-dark";
    tablegomb.className = "btn btn-dark";
    kartyak.hidden = true;
    tablazat.hidden = false;
    let tablazattorzs = document.getElementById("tablazattorzs");
    tablazattorzs.innerHTML = `
        <thead>
            <tr>
                <td>Név</td>
                <td>Email</td>
                <td>Telefonszám</td>
                <td>Időpont</td>
                <td>Fodrász</td>
                <td>Szolgáltatás</td>
                <td>Törlés</td>
            </tr>
        </thead>
    `;

    for (const data of foglalasok) {
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

const kartyamegjelenit = () => {
    tablazat.hidden = true;
    kartyak.hidden = false;
    tablegomb.className = "btn btn-outline-dark";
    kartyagomb.className = "btn btn-dark";
}

window.addEventListener("load", betolt);
tablegomb.addEventListener("click", tablazatmegjelenit);
kartyagomb.addEventListener("click", kartyamegjelenit);