let foglalasok={}
let fodraszok = {};
let szolg={};
let kartyak=document.getElementById("kartyak");
let tablazat=document.getElementById("tablazat");
let tablegomb=document.getElementById("tablegomb");
let kartyagomb=document.getElementById("kartyagomb");

const betolt = () => {
    let fodraszszures=document.getElementById("fodraszszures");
    let szolgaltatasszures=document.getElementById("szolgaltatasszures");
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        fodraszok = JSON.parse(xhr.response);
        for (const ember of fodraszok) {
            fodraszszures.innerHTML+=`<option value="${ember.neve}">${ember.neve}</option>`;
        }
    };
    xhr.send();

    const xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/data/szolgaltatasok.json");
    xhr2.onload = () => {
        szolg = JSON.parse(xhr2.response);;
        for (const data in szolg) {
            szolgaltatasszures.innerHTML+=`<option value="${data.szolgaltatas}">${data.szolgaltatas}</option>`;
        }
    };
    xhr2.send();

    const xhr3 = new XMLHttpRequest();
    xhr3.open("GET", "/data/foglalasok.json");
    xhr3.onload = () => {
        foglalasok = JSON.parse(xhr3.response);;
        for (const data of foglalasok) {
            kartyak.innerHTML+=`  <div class="col-md-6 col-lg-4">
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
                            ${data.idopont.ev}.${data.idopont.honap}.${data.idopont.nap}.${data.idopont.ora}:00
                        </p>

                        <p>
                            <b>Fodrász:</b>
                            ${fodraszok[data.fodrasz].neve}
                        </p>

                        <p>
                            <b>Szolgáltatás:</b>
                            ${szolg[data.szolgaltatas].szolgaltatas}
                        </p>
                        <input type="button" value="Törlés" class="btn btn-danger" name="torles">
                    </div>
                </div>
            </div>`;
        }
    };
    xhr3.send();


}

const tablazatmegjelenit=()=>{
    kartyagomb.class="btn btn-outline-dark";
    tablegomb.class="btn btn-dark";
    kartyak.hidden=true;
    tablazat.hidden=false
    let tablazattorzs=document.getElementById("tablazattorzs");
    for (const data of foglalasok) {
        tablazattorzs.innerHTML+=`<td>${data.nev}</td><td>${data.email}</td><td>${data.telefonszam}</td><td>${data.idopont.ev}.${data.idopont.honap}.${data.idopont.nap}.${data.idopont.ora}:00</td><td>${fodraszok[data.fodrasz].neve}</td><td>${szolg[data.szolgaltatas].szolgaltatas}</td>`;
    }
}

const torles=()=>{
    
}


window.addEventListener("load",betolt);
tablegomb.addEventListener("click",tablazat);
// kartyagomb.addEventListener("click",tablazat);
// let torlesgomb=document.querySelectorAll(`button[name="torles"`).addEventListener("click",torles);