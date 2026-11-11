
/* =========================================
   QUIZ MASTER - LOGICA DEL JUEGO
========================================= */

// BANCO DE PREGUNTAS

const preguntas = {
    programacion: [
        {
            texto: "¿Qué lenguaje añade interactividad a una web?",
            opciones: ["HTML", "CSS", "JavaScript", "SQL"],
            correcta: 2
        },
        {
            texto: "¿Qué etiqueta HTML crea un botón?",
            opciones: ["div", "button", "p", "span"],
            correcta: 1
        }
    ],

    videojuegos: [
        {
            texto: "¿Qué juego contiene creepers?",
            opciones: ["Fortnite", "Minecraft", "Valorant", "Roblox"],
            correcta: 1
        },
        {
            texto: "¿Qué empresa desarrolla Fortnite?",
            opciones: ["Mojang", "Valve", "Epic Games", "Nintendo"],
            correcta: 2
        }
    ],

    cultura: [
        {
            texto: "¿Cuál es la capital de Francia?",
            opciones: ["Madrid", "Roma", "París", "Lisboa"],
            correcta: 2
        },
        {
            texto: "¿Cuántos lados tiene un triángulo?",
            opciones: ["3", "4", "5", "6"],
            correcta: 0
        }
    ]
};

// VARIABLES DEL JUEGO

let preguntasActuales = [];
let indicePregunta = 0;
let puntuacion = 0;
let puntos = 125.50;
let respondida = false;
let juegoIniciado = false;

let totalAciertos = 7;
let rachaActual = 0;
let mejorRacha = 3;

let puntosDoblesRestantes = 0;
let eliminarDisponible = 0;
let segundaOportunidad = 0;
let segundaOportunidadUsada = false;

// MEJORAS PERMANENTES

let bonusPrincipiante = false;
let bonusExperto = false;
let ayudaExtra = false;

// =========================================
// NAVEGACION ENTRE PANTALLAS
// =========================================

function mostrarPantalla(id) {

    // Si se entra a preguntas por primera vez,
    // se inicia automáticamente una partida.

    if (id === "juego" && !juegoIniciado) {
        iniciarJuego();
        return;
    }

    document.querySelectorAll("main section").forEach(seccion => {
        seccion.classList.add("oculto");
    });

    document.getElementById(id).classList.remove("oculto");

    actualizarMenuActivo(id);
    actualizarMarcador();

    if (id === "logros") {
        mostrarLogros();
    }

    if (id === "tienda") {
        mostrarTienda();
    }
}

// MARCAR EL BOTON ACTIVO DEL MENU INFERIOR

function actualizarMenuActivo(pantalla) {

    const botones = document.querySelectorAll(
        ".menu-inferior button"
    );

    botones.forEach(boton => {
        boton.classList.remove("activo");
        boton.setAttribute("aria-pressed", "false");
    });

    const ids = {
        juego: "navPreguntas",
        logros: "navLogros",
        tienda: "navTienda"
    };

    if (ids[pantalla]) {
        const boton = document.getElementById(ids[pantalla]);
        boton.classList.add("activo");
        boton.setAttribute("aria-pressed", "true");
    }
}

// =========================================
// SISTEMA DE PUNTOS
// =========================================

function actualizarMarcador() {

    document.getElementById("puntos").textContent =
        puntos.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}

// =========================================
// INICIAR JUEGO
// =========================================

function iniciarJuego(categoria = null) {

    if (categoria && preguntas[categoria]) {
        preguntasActuales = [...preguntas[categoria]];
    } else {
        // Combinar todas las categorías
        preguntasActuales = Object.values(preguntas).flat();
    }

    indicePregunta = 0;
    puntuacion = 0;
    respondida = false;
    juegoIniciado = true;

    mostrarPantalla("juego");
    mostrarPregunta();
}

// =========================================
// MOSTRAR PREGUNTA
// =========================================

function mostrarPregunta() {

    respondida = false;
    segundaOportunidadUsada = false;

    const pregunta = preguntasActuales[indicePregunta];

    document.getElementById("progreso").textContent =
        `Pregunta ${indicePregunta + 1} de ${preguntasActuales.length}`;

    document.getElementById("textoPregunta").textContent =
        pregunta.texto;

    document.getElementById("mensaje").textContent = "";

    document.getElementById("btnSiguiente")
        .classList.add("oculto");

    const contenedor = document.getElementById("respuestas");

    contenedor.innerHTML = "";

    // Crear botones dinámicamente
    pregunta.opciones.forEach((opcion, indice) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent =
            `${String.fromCharCode(65 + indice)}. ${opcion}`;

        boton.addEventListener("click", () => {
            comprobarRespuesta(indice);
        });

        contenedor.appendChild(boton);
    });

    // Aplicar ayuda para eliminar una respuesta
    if (eliminarDisponible > 0 || ayudaExtra) {
        const incorrecta = pregunta.opciones.findIndex(
            (_, i) => i !== pregunta.correcta
        );

        const botones = contenedor.querySelectorAll("button");

        botones[incorrecta].disabled = true;
        botones[incorrecta].style.visibility = "hidden";

        if (eliminarDisponible > 0) {
            eliminarDisponible--;
        }
    }
}

// =========================================
// COMPROBAR RESPUESTA
// =========================================

function comprobarRespuesta(indice) {

    if (respondida) {
        return;
    }

    const pregunta = preguntasActuales[indicePregunta];
    const botones = document.querySelectorAll(
        "#respuestas button"
    );

    const mensaje = document.getElementById("mensaje");

    if (indice === pregunta.correcta) {

        respondida = true;
        puntuacion++;
        totalAciertos++;
        rachaActual++;

        if (rachaActual > mejorRacha) {
            mejorRacha = rachaActual;
        }

        comprobarLogros();

        let puntosGanados = 1;

        if (bonusPrincipiante) {
            puntosGanados *= 1.05;
        }

        if (bonusExperto) {
            puntosGanados *= 1.10;
        }

        if (puntosDoblesRestantes > 0) {
            puntosGanados *= 2;
        }

        puntos += puntosGanados;

        botones[indice].classList.add("correcta");

        mensaje.textContent =
            `¡Correcto! +${puntosGanados.toFixed(2)} puntos`;

    } else {

        botones[indice].classList.add("incorrecta");

        if (segundaOportunidad > 0 &&
            !segundaOportunidadUsada) {

            segundaOportunidad--;
            segundaOportunidadUsada = true;

            botones[indice].disabled = true;

            mensaje.textContent =
                "¡Segunda oportunidad! Inténtalo otra vez.";

            return;
        }

        respondida = true;
        rachaActual = 0;

        botones[pregunta.correcta].classList.add("correcta");

        mensaje.textContent =
            "Respuesta incorrecta.";
    }

    botones.forEach(boton => {
        boton.disabled = true;
    });

    if (puntosDoblesRestantes > 0) {
        puntosDoblesRestantes--;
    }

    actualizarMarcador();

    document.getElementById("btnSiguiente")
        .classList.remove("oculto");
}

// =========================================
// SIGUIENTE PREGUNTA
// =========================================

function siguientePregunta() {

    indicePregunta++;

    if (indicePregunta < preguntasActuales.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

// =========================================
// RESULTADOS
// =========================================

function mostrarResultados() {

    juegoIniciado = false;

    mostrarPantalla("resultados");

    document.getElementById("puntuacion").textContent =
        `Has acertado ${puntuacion} de ${preguntasActuales.length} preguntas.`;
}

// =========================================
// LOGROS
// =========================================

function comprobarLogros() {

    if (totalAciertos >= 10) {
        bonusPrincipiante = true;
    }

    if (mejorRacha >= 5) {
        ayudaExtra = true;
    }

    if (totalAciertos >= 100) {
        bonusExperto = true;
    }
}

function mostrarLogros() {

    const contenedor = document.getElementById("listaLogros");

    const logros = [
        {
            icono: "🏆",
            nombre: "Principiante",
            descripcion: "Responde correctamente 10 preguntas",
            actual: totalAciertos,
            objetivo: 10,
            recompensa: "+5% de puntos"
        },
        {
            icono: "🔥",
            nombre: "Racha perfecta",
            descripcion: "Responde 5 preguntas seguidas",
            actual: mejorRacha,
            objetivo: 5,
            recompensa: "Una ayuda adicional"
        },
        {
            icono: "⭐",
            nombre: "Experto",
            descripcion: "Responde correctamente 100 preguntas",
            actual: totalAciertos,
            objetivo: 100,
            recompensa: "+10% de puntos"
        }
    ];

    contenedor.innerHTML = "";

    logros.forEach(logro => {

        const progreso = Math.min(
            logro.actual / logro.objetivo * 100,
            100
        );

        const completado = logro.actual >= logro.objetivo;

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-logro";

        tarjeta.innerHTML = `
            <h3>${logro.icono} ${logro.nombre}</h3>
            <p>${logro.descripcion}</p>
            <p>${Math.min(logro.actual, logro.objetivo)}/${logro.objetivo}</p>

            <div class="barra-progreso">
                <div class="barra-completada"
                     style="width:${progreso}%">
                </div>
            </div>

            <p class="recompensa">
                ${completado ? "CONSEGUIDO · " : ""}
                ${logro.recompensa}
            </p>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// =========================================
// TIENDA
// =========================================

const productos = [
    {
        id: "dobles",
        icono: "⚡",
        nombre: "Puntos dobles",
        descripcion: "Duplica los puntos durante 5 preguntas.",
        precio: 25
    },
    {
        id: "eliminar",
        icono: "🧠",
        nombre: "Eliminar respuesta",
        descripcion: "Elimina una respuesta incorrecta en la próxima pregunta.",
        precio: 10
    },
    {
        id: "oportunidad",
        icono: "💫",
        nombre: "Segunda oportunidad",
        descripcion: "Permite repetir una respuesta fallada.",
        precio: 20
    }
];

function mostrarTienda() {

    const contenedor = document.getElementById("listaTienda");

    contenedor.innerHTML = "";

    productos.forEach(producto => {

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-tienda";

        tarjeta.innerHTML = `
            <h3>${producto.icono} ${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">
                🪙 ${producto.precio.toFixed(2)} puntos
            </p>
            <button class="btn-comprar"
                    data-producto="${producto.id}">
                COMPRAR
            </button>
        `;

        tarjeta.querySelector("button").addEventListener(
            "click",
            () => comprarMejora(producto.id)
        );

        contenedor.appendChild(tarjeta);
    });
}

// =========================================
// COMPRAR MEJORAS
// =========================================

function comprarMejora(id) {

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return;
    }

    if (puntos < producto.precio) {
        alert("No tienes suficientes puntos.");
        return;
    }

    puntos -= producto.precio;

    switch (id) {
        case "dobles":
            puntosDoblesRestantes += 5;
            break;

        case "eliminar":
            eliminarDisponible++;
            break;

        case "oportunidad":
            segundaOportunidad++;
            break;
    }

    actualizarMarcador();

    alert(`Has comprado: ${producto.nombre}`);
}

// =========================================
// INICIALIZACION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    actualizarMarcador();
    mostrarPantalla("menu");

});
