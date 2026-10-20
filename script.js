let fodraszok=document.getElementById("fodraszok_inner");
let szolgaltatasok=document.getElementById("szolgaltatasok_inner");
let nyitvatartas=document.getElementById("nyitvatartas_inner");

(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/szolgaltatasok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            szolgaltatasok.innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h3 class="card-title h5">${data[i].szolgaltatas}</h3>
                        <p class="card-text">
                            <b>Ár:</b> ${data[i].ar} Ft
                            <br>
                            <b>Időtartam:</b> ${data[i].ido} perc
                        </p>
                        <a href="/foglalas/?szolgaltatas=${i}" class="btn" id="szolgGomb">Foglalás most</a>
                    </div>
                </div>
            `;
    };
    xhr.send();
})();

const betolt=()=>{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/fodraszok.json");
    xhr.onload = () => {
        let fodrasz = JSON.parse(xhr.response);
        for (const ember of fodrasz) {
            fodraszok.innerHTML += `
             <div class="col-md-4 col-lg-3">
                    <div class="card mb-3">
                        <div class="card-body">
                        <img src="./media/user.png" alt="" id="kepek">
                            <h3 class="card-title">
                                ${ember.neve}
                            </h3>
                            <p class="mb-0">
                                <b>Telefon:</b>
                                ${ember.telefonszam}
                                <br>
                                <b>Értékelése:</b>
                                ${ember.rating}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    xhr.send();
}

(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/foglalhatok.json");
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        for (let i = 0; i < data.length; i++)
            nyitvatartas.innerHTML += `
                <tr>
                    <td>${data[i].nap}</td>
                    <td>${data[i].kezdes !== 0 ? data[i].kezdes + ":00" : "-"}</td>
                    <td>${data[i].vege !== 0 ? data[i].vege + ":00" : "-"}</td>
                    <td>${data[i].szunetKezdes !== 0 ? data[i].szunetKezdes + ":00" : "-"}</td>
                    <td>${data[i].szunetVege !== 0 ? data[i].szunetVege + ":00" : "-"}</td>
                </tr>
            `;
    };
    xhr.send();
})();


const velemenyekInner = document.getElementById("velemenyek_inner");

let velemenyek = JSON.parse(localStorage.getItem("velemenyek") ?? "[]");

velemenyek.forEach((adat) => {
    let kartya = document.createElement("div");
    kartya.className = "carousel-item";

    let csillagok = "★".repeat(adat.csillag) + "☆".repeat(5 - adat.csillag);

    kartya.innerHTML = `
        <div class="card mx-auto velemeny-kartya">
            <div class="card-body">
                <h5 class="card-title"></h5>
                <p class="text-warning">${csillagok}</p>
                <p class="card-text"></p>
            </div>
        </div>
    `;

    kartya.querySelector(".card-title").textContent = adat.nev;
    kartya.querySelector(".card-text").textContent = adat.velemeny;

    velemenyekInner.appendChild(kartya);
});

window.addEventListener("load",betolt);
