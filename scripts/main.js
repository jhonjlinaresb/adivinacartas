let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let tiempoRegresivo = null;
let timerInicial = 60;
let timer = 60;

let winAudio = new Audio('./sounds/win.wav');
let clickAudio = new Audio('./sounds/click.wav');
let lose = new Audio('./sounds/lose.wav');
let match = new Audio('./sounds/match.wav');
let wrong = new Audio('./sounds/wrong.wav');

let mostrarMovimientos = document.getElementById('movimientos');
let mostrarAciertos = document.getElementById('aciertos');
let mostrarTiempo = document.getElementById('tiempo');
let tablero = document.getElementById('tablero'); // Hola Jhonnie, esta es la nueva variable, para poder crear el tablero, lo he hecho creando una id en un div del html

let numeros = {
    "16": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8],
    "20": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10],
    "36": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18]
};

// Aqui he puesto todo lo que es el selector de modo, y la transición de pantalla de inicio.
const seleccionarModo = () => {
    let modo = document.getElementById('modo').value;

    document.getElementById('pantallaInicial').style.display = 'none';

    document.getElementById('juego').style.display = 'block';

    iniciarJuego(modo);
};

const iniciarJuego = (modo) => {
    let numeroTarjetas = numeros[modo];
    generarTablero(numeroTarjetas.length);
    numeroTarjetas = numeroTarjetas.sort(() => { return 0.5 - Math.random() });
    console.log(numeroTarjetas);

    timerInicial = modo == "36" ? 90 : 60; // Aqui, he añadido 30 segundos mas si se elige el modo difícil, porque lo he intentado con 60 segundos varias veces y era mas bien imposible...
    timer = timerInicial;
    mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;

    tarjetasDestapadas = 0;
    movimientos = 0;
    aciertos = 0;
    mostrarMovimientos.innerHTML = `Movimientos: 0`;
    mostrarAciertos.innerHTML = `Puntaje: 0`;

    if (temporizador) {
        clearInterval(tiempoRegresivo);
        temporizador = false;
    }
};

// Esto es lo que más me ha costado... casi 3 horas para entenderlo, es una función para crear el tablero dinámicamente, según el número de tarjetas que tenga el modo que se haya seleccionado
const generarTablero = (totalTarjetas) => {
    let filas = Math.sqrt(totalTarjetas);
    let contenido = '<table>';

    for (let i = 0; i < filas; i++) {
        contenido += '<tr>';
        for (let j = 0; j < filas; j++) {
            let id = i * filas + j;
            if (id < totalTarjetas) {
                contenido += `<td><button id="${id}" onclick="destapar(${id})"></button></td>`;
            }
        }
        contenido += '</tr>';
    }

    contenido += '</table>';
    tablero.innerHTML = contenido;
};

const contarTiempo = () => {
    tiempoRegresivo = setInterval(() => {
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer} Segundos`;
        if (timer == 0) {
            alert('Perdiste, intenta de nuevo');
            clearInterval(tiempoRegresivo);
            bloquearTarjetas();
            lose.play();
        }
    }, 1000);
};

const bloquearTarjetas = () => {
    let modo = document.getElementById('modo').value;
    let numeroTarjetas = numeros[modo];

    for (let i = 0; i < numeroTarjetas.length; i++) {
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = `<img src="img/${numeroTarjetas[i]}.png" alt="${numeroTarjetas[i]}">`;
        tarjetaBloqueada.disabled = true;
    }
};

const destapar = (id) => {
    let modo = document.getElementById('modo').value;
    let numeroTarjetas = numeros[modo];

    if (temporizador == false) {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas == 1) {
        //mostrar primer numero
        tarjeta1 = document.getElementById(id);
        primerResultado = numeroTarjetas[id];
        clickAudio.play();
        tarjeta1.innerHTML = `<img src="img/${primerResultado}.png" alt="${primerResultado}">`;

        //desahabilitar la tarjeta
        tarjeta1.disabled = true;
    } else if (tarjetasDestapadas == 2) {
        //mostrar segundo numero
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeroTarjetas[id];
        tarjeta2.innerHTML = `<img src="img/${segundoResultado}.png" alt="${segundoResultado}">`;

        //desahabilitar la tarjeta
        tarjeta2.disabled = true;

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

        if (primerResultado == segundoResultado) {
            tarjetasDestapadas = 0;

            aciertos++;
            mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            match.play();

            if (aciertos == numeroTarjetas.length / 2) { // Aqui he tenido que cambiar el método de identificar los aciertos que pusiste porque ahora hay mas niveles, pero vamos que es lo mismito
                winAudio.play();
                clearInterval(tiempoRegresivo);
                alert(`Felicidades, ganaste en ${movimientos} movimientos y ${timerInicial - timer} segundos`);
                mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            }
        } 
        else {
            wrong.play();
            setTimeout(() => {
                tarjeta1.innerHTML = '';
                tarjeta2.innerHTML = '';
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 800);
        }
    }
};