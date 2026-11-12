const preguntas = {
    programacion: [
        {
            pregunta: "¿Qué significa HTML?",
            opciones: [
                "HyperText Markup Language",
                "High Transfer Machine Language",
                "Home Tool Markup Language",
                "Hyper Tool Machine Language"
            ],
            correcta: 0
        },
        {
            pregunta: "¿Qué lenguaje se ejecuta en el navegador?",
            opciones: [
                "Java",
                "Python",
                "JavaScript",
                "C++"
            ],
            correcta: 2
        }
    ],

    videojuegos: [
        {
            pregunta: "¿Quién creó Minecraft?",
            opciones: [
                "Notch",
                "Valve",
                "Nintendo",
                "Sony"
            ],
            correcta: 0
        },
        {
            pregunta: "¿Cuál es la mascota de Nintendo?",
            opciones: [
                "Link",
                "Mario",
                "Kirby",
                "Pikachu"
            ],
            correcta: 1
        }
    ],

    cultura: [
        {
            pregunta: "¿Capital de España?",
            opciones: [
                "Barcelona",
                "Madrid",
                "Valencia",
                "Sevilla"
            ],
            correcta: 1
        },
        {
            pregunta: "¿Cuántos continentes existen?",
            opciones: [
                "5",
                "6",
                "7",
                "8"
            ],
            correcta: 2
        }
    ]
};

let categoriaActual;
let preguntaActual;
let puntos;
let tiempo;
let temporizador;

function iniciarJuego(categoria){

    categoriaActual = preguntas[categoria];
    preguntaActual = 0;
    puntos = 0;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("resultado").classList.add("oculto");
    document.getElementById("quiz").classList.remove("oculto");

    mostrarPregunta();
}

function mostrarPregunta(){

    if(preguntaActual >= categoriaActual.length){
        terminarJuego();
        return;
    }

    const pregunta = categoriaActual[preguntaActual];

    document.getElementById("pregunta").textContent =
        pregunta.pregunta;

    const contenedor =
        document.getElementById("respuestas");

    contenedor.innerHTML = "";

    pregunta.opciones.forEach((opcion, indice)=>{

        const boton =
            document.createElement("button");

        boton.textContent = opcion;

        boton.onclick = () =>
            responder(indice);

        contenedor.appendChild(boton);
    });

    iniciarTemporizador();
}

function responder(indice){

    clearInterval(temporizador);

    if(
        indice ===
        categoriaActual[preguntaActual].correcta
    ){
        puntos++;
    }

    document.getElementById("puntos").textContent =
        puntos;

    preguntaActual++;

    mostrarPregunta();
}

function iniciarTemporizador(){

    clearInterval(temporizador);

    tiempo = 20;

    document.getElementById("tiempo").textContent =
        tiempo;

    temporizador = setInterval(()=>{

        tiempo--;

        document.getElementById("tiempo").textContent =
            tiempo;

        if(tiempo <= 0){

            clearInterval(temporizador);

            preguntaActual++;

            mostrarPregunta();
        }

    },1000);
}

function terminarJuego(){

    clearInterval(temporizador);

    document.getElementById("quiz")
        .classList.add("oculto");

    document.getElementById("resultado")
        .classList.remove("oculto");

    document.getElementById("textoResultado")
        .textContent =
        `Has conseguido ${puntos} puntos de ${categoriaActual.length}`;
}

function reiniciarJuego(){

    document.getElementById("resultado")
        .classList.add("oculto");

    document.getElementById("inicio")
        .classList.remove("oculto");
}
