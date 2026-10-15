document.body.innerHTML += "<a id=\"scrollup\" href=\"#\" class=\"material-symbols-rounded\">keyboard_double_arrow_up</a>";
const scrollup = document.getElementById("scrollup");
window.addEventListener('scroll', () => scrollup.classList.toggle("visible", window.scrollY > 50))
