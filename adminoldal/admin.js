
let foglalasok = JSON.parse(localStorage.getItem("foglalasok") ?? "[]").map(x => { return { ...x, custom: true } });
let fodraszok = [];
let szolg = [];
let szurtfoglalasok = [];

let keres = document.getElementById("keres");
let fodraszszures = document.getElementById("fodraszszures");
let szolgaltatasszures = document.getElementById("szolgaltatasszures");
let rendezes = document.getElementById("rendezes");
let rendezesgomb = document.getElementById("rendezgomb");
let kartyak = document.getElementById("kartyak");
let tablazat = document.getElementById("tablazat");
let tablegomb = document.getElementById("tablegomb");
let kartyagomb = document.getElementById("kartyagomb");
let megjelenites = 0;


const torles = (esemeny) => {
    let index = esemeny.target.dataset.index;
    foglalasok[index].torolve = true;
    let sajatFoglalasok = foglalasok.filter(x => x.custom);
    localStorage.setItem("foglalasok", JSON.stringify(sajatFoglalasok));
    let toroltek = JSON.parse(localStorage.getItem("toroltek") ?? "[]");
    if (!foglalasok[index].custom) {
        toroltek.push(Number(index));
    }
    localStorage.setItem("toroltek", JSON.stringify(toroltek));

    szures();
};


const szures = () => {
    szurtfoglalasok = foglalasok.filter(data =>
        data.torolve !== true &&
        data.nev.toLowerCase().includes(keres.value.toLowerCase()) &&
        (fodraszszures.value == "osszesf" ||
        fodraszok[data.fodrasz].neve == fodraszszures.value) &&
        (szolgaltatasszures.value == "osszessz" ||
        szolg[data.szolgaltatas].szolgaltatas == szolgaltatasszures.value)
    );

    if (megjelenites === 0) kartyamegjelenit();
    else tablazatmegjelenit();
}


const kartyamegjelenit = () => {
    megjelenites = 0;

    tablazat.hidden = true;
    kartyak.hidden = false;

    tablegomb.className = "btn btn-outline-dark";
    kartyagomb.className = "btn btn-dark";

    const sorted = szurtfoglalasok.toSorted((a, b) => {
        if (rendezes.value == "nev")
            return a.nev.localeCompare(b.nev);

        if (rendezes.value == "datum")
            return new Date(a.idopont.ev, a.idopont.honap - 1, a.idopont.nap, a.idopont.ora) -
                   new Date(b.idopont.ev, b.idopont.honap - 1, b.idopont.nap, b.idopont.ora);

        if (rendezes.value == "fodrasz")
            return fodraszok[a.fodrasz].neve.localeCompare(fodraszok[b.fodrasz].neve);

        if (rendezes.value == "szolgaltatas")
            return szolg[a.szolgaltatas].szolgaltatas.localeCompare(szolg[b.szolgaltatas].szolgaltatas);

        return 0;
    });

    kartyak.innerHTML = "";

    for (const data of sorted) {
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

    let torlesgombok = kartyak.querySelectorAll('input[name="torles"]');

    for (const gomb of torlesgombok) {
        gomb.addEventListener("click", torles);
    }
}


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

    const sorted = szurtfoglalasok.toSorted((a, b) => {
        if (rendezes.value === "nev")
            return a.nev.localeCompare(b.nev);

        if (rendezes.value == "datum")
            return new Date(a.idopont.ev, a.idopont.honap - 1, a.idopont.nap, a.idopont.ora) -
                   new Date(b.idopont.ev, b.idopont.honap - 1, b.idopont.nap, b.idopont.ora);

        if (rendezes.value == "fodrasz")
            return fodraszok[a.fodrasz].neve.localeCompare(fodraszok[b.fodrasz].neve);

        if (rendezes.value == "szolgaltatas")
            return szolg[a.szolgaltatas].szolgaltatas.localeCompare(szolg[b.szolgaltatas].szolgaltatas);

        return 0;
    });

    for (const data of sorted) {
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

    let torlesgombok = tablazattorzs.querySelectorAll('input[name="torles"]');

    for (const gomb of torlesgombok) {
        gomb.addEventListener("click", torles);
    }
}


const betolt = () => {
    let betoltve = 0;

    const kesz = () => {
        betoltve++;

        if (betoltve === 3) szures();
    };

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

        kesz();
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

        kesz();
    };

    xhr2.send();

    const xhr3 = new XMLHttpRequest();
    xhr3.open("GET", "/data/foglalasok.json");

  xhr3.onload = () => {
    foglalasok = foglalasok.concat(JSON.parse(xhr3.response));
    let toroltek = JSON.parse(localStorage.getItem("toroltek") ?? "[]");
    toroltek.forEach(index => {
        if (foglalasok[index]) {
            foglalasok[index].torolve = true;
        }
    });

    kesz();
};

    xhr3.send();
}



window.addEventListener("load", betolt);
tablegomb.addEventListener("click", tablazatmegjelenit);
kartyagomb.addEventListener("click", kartyamegjelenit);
keres.addEventListener("input", szures);
fodraszszures.addEventListener("change", szures);
szolgaltatasszures.addEventListener("change", szures);
rendezesgomb.addEventListener("click", szures);
