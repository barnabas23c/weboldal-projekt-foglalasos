let fodraszok=document.getElementById("fodraszok");

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
                        <img src="./teszt.png" alt="" id="kepek">
                            <p class="card-title">
                                ${ember.neve}
                            </p>
                            <p>
                                <b>Telefon:</b>
                                ${ember.telefonszam}
                            </p>
                            <p>Értékelése: ${ember.rating}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    xhr.send();
}

window.addEventListener("load",betolt);