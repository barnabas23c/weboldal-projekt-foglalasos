
const nev = document.getElementById("nev");
const csillag = document.getElementById("csillag");
const szoveg = document.getElementById("szoveg");
const form = document.querySelector("form");

[nev, csillag, szoveg].forEach(mezo => {
    mezo.addEventListener("input", () => {
        mezo.setCustomValidity("");
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nev.value.match(/^[A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+( [A-ZÖÜÓŐÚŰÉÁÍ][a-zöüóőúűéáí]+)*$/)) {
        nev.setCustomValidity("Helytelen név formátum!");
        nev.reportValidity();
        return;
    }
    else nev.setCustomValidity("");

    if (!csillag.value.match(/^[0-5]$/)) {
        csillag.setCustomValidity("Az értékelés 0 és 5 között lehet!");
        csillag.reportValidity();
        return;
    }
    else csillag.setCustomValidity("");

    if (!szoveg.value.trim().match(/^[\s\S]{10,}$/)) {
        szoveg.setCustomValidity("A vélemény legalább 10 karakter legyen!");
        szoveg.reportValidity();
        return;
    }
    else szoveg.setCustomValidity("");

    let velemenyek = JSON.parse(localStorage.getItem("velemenyek") ?? "[]");

    velemenyek.push({
        nev: nev.value,
        csillag: Number(csillag.value),
        velemeny: szoveg.value
    });

    localStorage.setItem("velemenyek", JSON.stringify(velemenyek));

    window.location.href = "/#velemenyek";
});
