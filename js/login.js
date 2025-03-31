console.log("login.js cargado");

const usuario = "admin";
const contraseña = "1234";

function validarLogin() {
    let user = document.getElementById("inputText").value.trim();
    let pass = document.getElementById("contraseña").value.trim();
    let mensaje = document.getElementById("mensaje");

    if (user === usuario && pass === contraseña) {
        // Guardar sesión en localStorage
        localStorage.setItem("usuarioLogueado", "true");

        setTimeout(() => {
            window.location.href = "principal.html";
        }, 200);
    } else {
        mensaje.textContent = "Usuario o contraseña incorrecta";
        mensaje.style.color = "red";
    }
}
