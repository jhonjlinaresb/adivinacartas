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

const winAudio = new Audio('./sounds/win.wav');
const clickAudio = new Audio('./sounds/click.wav');
const lose = new Audio('./sounds/lose.wav');
const match = new Audio('./sounds/match.wav');
const wrong = new Audio('./sounds/wrong.wav');

const mostrarMovimientos = document.getElementById('movimientos');
const mostrarAciertos = document.getElementById('aciertos');
const mostrarTiempo = document.getElementById('tiempo');
const tablero = document.getElementById('tablero');

function recargarSeccion() {
    const modo = document.getElementById('modo').value;
    localStorage.setItem('modoSeleccionado', modo);
    location.reload();
}

window.onload = function() {
    const modoSeleccionado = localStorage.getItem('modoSeleccionado');
    if (modoSeleccionado)
    {
        document.getElementById('modo').value = modoSeleccionado;
        seleccionarModo();
        localStorage.removeItem('modoSeleccionado');
    }
}

let numeros = {
    "16": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8],
    "20": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10],
    "36": [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18]
};

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
    switch(modo)
    {
        case "16":
            timerInicial = 60;
          break;
        case "20":
            timerInicial = 90;
          break;
        case "36":
            timerInicial = 120
          break; 
        default:
            timerInicial = 60
      }
    timer = timerInicial;
    mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;

    tarjetasDestapadas = 0;
    movimientos = 0;
    aciertos = 0;
    mostrarMovimientos.innerHTML = `Movimientos: 0`;
    mostrarAciertos.innerHTML = `Puntaje: 0`;

    if (temporizador)
    {
        clearInterval(tiempoRegresivo);
        temporizador = false;
    }
};

const generarTablero = (totalTarjetas) => {
    let filas = Math.ceil(Math.sqrt(totalTarjetas));
    let contenido = '<table>';

    for (let i = 0; i < filas; i++)
    {
        contenido += '<tr>';
        for (let j = 0; j < filas; j++)
        {
            let id = i * filas + j;
            if (id < totalTarjetas)
            {
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
        if (timer == 0)
        {
            Swal.fire({
                title: 'Has perdido',
                text: 'Inténtalo de nuevo',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            clearInterval(tiempoRegresivo);
            bloquearTarjetas();
            lose.play();
        }
    }, 1000);
};

const bloquearTarjetas = () => {
    let modo = document.getElementById('modo').value;
    let numeroTarjetas = numeros[modo];

    for (let i = 0; i < numeroTarjetas.length; i++)
    {
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = `<img src="img/${numeroTarjetas[i]}.png" alt="${numeroTarjetas[i]}">`;
        tarjetaBloqueada.disabled = true;
    }
};

const destapar = (id) => {
    let modo = document.getElementById('modo').value;
    let numeroTarjetas = numeros[modo];

    if (temporizador == false)
    {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas == 1)
    {
        tarjeta1 = document.getElementById(id);
        primerResultado = numeroTarjetas[id];
        clickAudio.play();
        tarjeta1.innerHTML = `<img src="img/${primerResultado}.png" alt="${primerResultado}">`;

        tarjeta1.disabled = true;
    } 
    else if (tarjetasDestapadas == 2)
    {
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeroTarjetas[id];
        tarjeta2.innerHTML = `<img src="img/${segundoResultado}.png" alt="${segundoResultado}">`;

        tarjeta2.disabled = true;

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

        if (primerResultado == segundoResultado)
        {
            tarjetasDestapadas = 0;

            aciertos++;
            mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            match.play();

            if (aciertos == numeroTarjetas.length / 2)
            {
                winAudio.play();
                clearInterval(tiempoRegresivo);
                Swal.fire({
                    title: 'Felicitaciones',
                    text: `Ganaste en ${movimientos} movimientos y ${timerInicial - timer} segundos`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            }
        } 
        else
        {
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

function actualizarSeccion() {
    const modo = document.getElementById('modo').value;
    const contenido = document.getElementById('contenido');

    switch(modo) {
        case "16":
            contenido.innerHTML = "<p>Contenido para el modo Fácil.</p>";
            break;
        case "20":
            contenido.innerHTML = "<p>Contenido para el modo Medio.</p>";
            break;
        case "36":
            contenido.innerHTML = "<p>Contenido para el modo Difícil.</p>";
            break;
        default:
            contenido.innerHTML = "<p>Selecciona un modo para ver el contenido actualizado.</p>";
    }
}
