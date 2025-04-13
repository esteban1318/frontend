
function filtrarTabla() {
    let input = document.getElementById("busqueda");
    let input2 = document.getElementById("busqueda-movil");
    // Usar el input de búsqueda móvil si está visible, de lo contrario usar el input de escritorio
    let filtro = input.value.toLowerCase();
    let tabla = document.getElementById("miTabla");
    let filas = tabla.getElementsByTagName("tr");

    for (let i = 1; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName("td");
        let mostrar = false;

        for (let j = 0; j < celdas.length; j++) {
            let textoCelda = celdas[j].innerText.toLowerCase();
            if (textoCelda.includes(filtro)) {
                mostrar = true;
                break;
            }
            if (textoCelda.trim() === "entregado") {
                celdas[j].classList.add("estado-entregado");
            } else {
                celdas[j].classList.remove("estado-entregado");
            }
        }

        filas[i].style.display = mostrar ? "" : "none";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const menuInicio = document.querySelector(".sidebar-nav li:nth-child(1) a");
    const menuResidentes = document.querySelector(".sidebar-nav li:nth-child(2) a");
    const menuRecibos = document.querySelector(".sidebar-nav li:nth-child(3) a");
    const menuRegistros = document.querySelector(".sidebar-nav li:nth-child(4) a");

    const tablaResidentes = document.getElementById("tabla-residentes");
    const tablaRecibos = document.getElementById("tabla-recibos");
    const contenedorRegistros = document.getElementById("contenedor-registros");
    const btnMedidor = document.getElementById("btnMedidor");
    const inputBusqueda = document.getElementById("inputBusqueda");
    const searchContainer = document.querySelector(".mobile-search-container");

    const textHeader = document.getElementById("textHeader");
    const statsContainer = document.getElementById("statusContainer");

    function esVistaMovil() {
        return window.innerWidth <= 768;
    }

    function ocultarBusquedaSiMovil(seccionMostrada) {
        if (esVistaMovil()) {
            if (seccionMostrada === contenedorRegistros || seccionMostrada === null) {
                if (searchContainer) searchContainer.classList.add("hidden");
            } else {
                if (searchContainer) searchContainer.classList.remove("hidden");
            }
        } else {
            if (searchContainer) searchContainer.classList.remove("hidden");
        }
    }

    function mostrarSeccion(seccionMostrada) {
        tablaResidentes.classList.add("hidden");
        tablaRecibos.classList.add("hidden");
        contenedorRegistros.classList.add("hidden");

        seccionMostrada.classList.remove("hidden");

        if (btnMedidor) {
            // Mostrar el botón solo en la sección de Recibos
            if (seccionMostrada === tablaRecibos) {
                btnMedidor.style.display = "block"; // Mostrar el botón
            } else {
                btnMedidor.style.display = "none"; // Ocultar el botón
            }
        }

        if(btnAgregarPropietario){
            if(seccionMostrada === tablaResidentes) {
                btnAgregarPropietario.style.display = "block"; // Mostrar el botón
            }
            else {
                btnAgregarPropietario.style.display = "none"; // Ocultar el botón
            }
        }

        textHeader.style.display = (seccionMostrada === contenedorRegistros) ? "none" : "block";
        statsContainer.style.display = (seccionMostrada === contenedorRegistros) ? "none" : "flex";

        ocultarBusquedaSiMovil(seccionMostrada);
    }

    menuInicio.addEventListener("click", function (event) {
        event.preventDefault();
        tablaResidentes.classList.add("hidden");
        tablaRecibos.classList.add("hidden");
        contenedorRegistros.classList.add("hidden");
        textHeader.style.display = "block";
        statsContainer.style.display = "flex";

        if (btnMedidor) btnMedidor.style.display = "none";
        ocultarBusquedaSiMovil(null);
    });

    menuResidentes.addEventListener("click", function (event) {
        event.preventDefault();
        mostrarSeccion(tablaResidentes);
    });

    menuRecibos.addEventListener("click", function (event) {
        event.preventDefault();
        mostrarSeccion(tablaRecibos);
    });

    menuRegistros.addEventListener("click", function (event) {
        event.preventDefault();
        mostrarSeccion(contenedorRegistros);
    });

    // ✅ Agregado: proteger el input durante resize
    let searchJustFocused = false;

    if (searchContainer) {
        const input = searchContainer.querySelector('input');
        if (input) {
            input.addEventListener('focus', () => {
                searchJustFocused = true;
            });
            input.addEventListener('blur', () => {
                searchJustFocused = false;
            });
        }
    }

    // ✅ Modificado: ahora respeta el enfoque del input
    window.addEventListener("resize", () => {
        if (!searchJustFocused) {
            const activeSection = document.querySelector(".content-container:not(.hidden)");
            ocultarBusquedaSiMovil(activeSection);
        }
    });
});



document.addEventListener("DOMContentLoaded", cargarDatosDesdePHP);
setInterval(actualizarTablaConFiltro, 5000);

function actualizarTablaConFiltro() {
    let filtroActual = (document.getElementById("busqueda").value || document.getElementById("busqueda-movil").value).toLowerCase().trim();
    cargarDatosDesdePHP();
    setTimeout(() => {
        filtrarTabla();
    }, 500);
}

function filtrarTabla() {
    let input = document.getElementById("busqueda");
    let input2 = document.getElementById("busqueda-movil");
    let filtro = (input.value || input2.value).toLowerCase().trim();

    let tablaResidentes = document.getElementById("tabla-residentes");
    let tablaRecibos = document.getElementById("tabla-recibos");

    let tabla;
    if (!tablaResidentes.classList.contains("hidden")) {
        tabla = document.getElementById("miTabla");
    } else if (!tablaRecibos.classList.contains("hidden")) {
        tabla = document.getElementById("miTabla2");
    }

    if (!tabla) {
        console.error("No se encontró ninguna tabla visible.");
        return;
    }

    let filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName("td");
        let mostrar = false;

        for (let j = 0; j < celdas.length; j++) {
            let textoCelda = celdas[j].textContent || celdas[j].innerText;
            if (textoCelda.toLowerCase().includes(filtro)) {
                mostrar = true;
                break;
            }
        }

        filas[i].style.display = mostrar ? "" : "none";
    }
}

const API_URL = "https://mi-backend-production-9444.up.railway.app";

function actualizarFilas(medidores) {
    const tabla = document.querySelector("#miTabla2 tbody");
    if (!tabla) {
        console.error("Error: No se encontró la tabla en el DOM.");
        return;
    }

    const clavesNuevas = new Set();
    const datosPorClave = {};

    medidores.sort((a, b) => {
        if (a.torre !== b.torre) return a.torre.localeCompare(b.torre);
        return a.apartamento.localeCompare(b.apartamento);
    });

    medidores.forEach(medidor => {
        const clave = `${medidor.torre}-${medidor.apartamento}`;
        clavesNuevas.add(clave);
        datosPorClave[clave] = medidor;
    });

    const filasActuales = Array.from(tabla.rows);
    const clavesActuales = new Set();

    filasActuales.forEach(fila => {
        const torre = fila.cells[0]?.textContent.trim();
        const apto = fila.cells[1]?.textContent.trim();
        const clave = `${torre}-${apto}`;
        clavesActuales.add(clave);

        if (!clavesNuevas.has(clave)) {
            tabla.removeChild(fila);
        } else {
            const medidorNuevo = datosPorClave[clave];
            const estadoNormalizado = medidorNuevo.estado.trim().toLowerCase();

            const contenidoActual = [
                fila.cells[0].textContent.trim(),
                fila.cells[1].textContent.trim(),
                fila.cells[2].textContent.trim(),
                fila.cells[3].textContent.trim()
            ];

            const contenidoNuevo = [
                medidorNuevo.torre,
                medidorNuevo.apartamento,
                medidorNuevo.medidor,
                medidorNuevo.estado
            ];

            if (JSON.stringify(contenidoActual) !== JSON.stringify(contenidoNuevo)) {
                fila.cells[2].textContent = medidorNuevo.medidor;
                fila.cells[3].innerHTML = `<span class="estado-${estadoNormalizado}">${medidorNuevo.estado}</span>`;

                if (estadoNormalizado === "entregado") {
                    fila.classList.add("fila-entregado");
                } else {
                    fila.classList.remove("fila-entregado");
                }
            }
        }
    });

    clavesNuevas.forEach(clave => {
        if (!clavesActuales.has(clave)) {
            const medidor = datosPorClave[clave];
            const fila = document.createElement("tr");
            const estadoNormalizado = medidor.estado.trim().toLowerCase();

            if (estadoNormalizado === "entregado") {
                fila.classList.add("fila-entregado");
            }

            fila.innerHTML = `
                <td>${medidor.torre}</td>
                <td>${medidor.apartamento}</td>
                <td>${medidor.medidor}</td>
                <td><span class="estado-${estadoNormalizado}">${medidor.estado}</span></td>
            `;

            const filas = Array.from(tabla.rows);
            let insertado = false;

            for (let i = 0; i < filas.length; i++) {
                const filaExistente = filas[i];
                const torreExistente = filaExistente.cells[0]?.textContent.trim();
                const aptoExistente = filaExistente.cells[1]?.textContent.trim();

                const comp = medidor.torre.localeCompare(torreExistente);
                if (comp < 0 || (comp === 0 && medidor.apartamento.localeCompare(aptoExistente) < 0)) {
                    tabla.insertBefore(fila, filaExistente);
                    insertado = true;
                    break;
                }
            }

            if (!insertado) {
                tabla.appendChild(fila);
            }
        }
    });
}

function cargarDatosDesdePHP() {
    fetch("https://mi-backend-production-9444.up.railway.app/api/medidores")
        .then(response => response.json())
        .then(data => {
            actualizarFilas(data);
            filtrarTabla();
        })
        .catch(error => console.error("Error al cargar datos:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove("show");
            }
        });
    }
});

document.getElementById("cerrarSesion").addEventListener("click", function () {
  localStorage.removeItem("usuarioLogueado");
 window.location.href = "index.html";
});

document.getElementById("btnMedidor").addEventListener("click", function () {
    let formContainer = document.getElementById("form-container");
    formContainer.classList.toggle("hidden");
});

document.getElementById("medidorForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let torre = document.getElementById("torreMedidor").value.trim();
    let apartamento = document.getElementById("apartamento").value.trim();
    let medidor = document.getElementById("medidor").value.trim();
    let estado = document.getElementById("estado").value;

    let datos = { torre, apartamento, medidor, estado };

    fetch("https://mi-backend-production-9444.up.railway.app/api/medidores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => {
            alert("Medidor agregado correctamente");
            document.getElementById("medidorForm").reset();
            cargarDatosDesdePHP();
        })
        .catch(error => {
            console.error("Error al agregar medidor:", error);
            alert("Hubo un error al agregar el medidor.");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    function toggleVisibility(selectId, targetId) {
        const selectElement = document.getElementById(selectId);
        const targetElement = document.getElementById(targetId);

        if (selectElement && targetElement) {
            selectElement.addEventListener("change", function () {
                targetElement.classList.toggle("hidden", selectElement.value === "no");
            });
        }
    }

    toggleVisibility("segundoProp", "segundoPropietario");
    toggleVisibility("vehiculo", "vehiculoInfo");
    toggleVisibility("moto", "motoInfo");
    toggleVisibility("mascota", "mascotaInfo");
});

const tbody = document.querySelector("#miTabla2 tbody");

datos.forEach(dato => {
    const fila = document.createElement("tr");
    const estadoNormalizado = dato.estado.trim().toLowerCase();

    if (estadoNormalizado === "entregado") {
        fila.classList.add("fila-entregado");
    }

    fila.innerHTML = `
        <td>${dato.torre}</td>
        <td>${dato.apartamento}</td>
        <td>${dato.medidor}</td>
        <td>${dato.estado}</td>
    `;

    tbody.appendChild(fila);
});


document.getElementById('btnAgregarPropietario').addEventListener('click', () => {
    document.getElementById('formNuevoPropietario').style.display = 'block';
});



