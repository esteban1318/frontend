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

    // Detectar si estamos en entorno local
    const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";

    if (isLocal) {
        // Usuarios de prueba para entorno local
        const usuariosPrueba = [
            { usuario: "admin", contraseña: "1234", rol: "administrador" },
            { usuario: "vigi", contraseña: "5678", rol: "vigilante" }
        ];

        const usuarioValido = usuariosPrueba.find(
            u => u.usuario === usuario && u.contraseña === contraseña && u.rol === rol
        );

        if (usuarioValido) {
            localStorage.setItem("usuarioLogueado", "true");
            localStorage.setItem("rolUsuario", usuarioValido.rol);
            localStorage.setItem("usuario", usuarioValido.usuario);

            window.location.href = "principal.html";
        } else {
            mensaje.textContent = "Usuario o contraseña incorrectos (modo local)";
            mensaje.style.color = "red";
        }
    } else {
        // Validación real contra el backend en Railway
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

                window.location.href = "principal.html";
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
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("https://mi-backend-production-9444.up.railway.app/api/residentes") // usa tu URL real
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector("#miTabla tbody");
        tbody.innerHTML = ""; // Limpiar por si hay contenido previo
  
        data.forEach(residente => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${residente.nombre}</td>
            <td>${residente.torre}</td>
            <td>${residente.apartamento}</td>
            <td>${residente.parqueadero}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("❌ Error al obtener residentes:", error);
      });
  });