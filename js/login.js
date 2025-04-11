//validacion del login desde el backend
function validarLogin() {
    const usuario = document.getElementById("inputText").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();
    const rol = document.getElementById("rol").value;
    const mensaje = document.getElementById("mensaje");

    // Validación básica
    if (!usuario || !contraseña || !rol) {
        mensaje.textContent = "Todos los campos son obligatorios";
        mensaje.style.color = "red";
        return;
    }

    fetch("https://mi-backend-production-9444.up.railway.app/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, contraseña, rol })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("usuarioLogueado", "true");
            localStorage.setItem("rolUsuario", data.rol);
            localStorage.setItem("usuario", data.usuario);

            // Redirige según el rol
            if (data.rol === "administrador") {
                window.location.href = "principal.html";
            } else if (data.rol === "vigilante") {
                window.location.href = "principal.html";
            } else {
                window.location.href = "principal.html";
            }
        } else {
            mensaje.textContent = data.message;
            mensaje.style.color = "red";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.style.color = "red";
    });
}
