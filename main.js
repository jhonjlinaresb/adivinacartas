
let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let tiempoRegresivo= null;
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


let numero = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];

//generar un numero aleatorio
numero = numero.sort(()=>{return 0.5 - Math.random()});
console.log(numero);

const contarTiempo = () => {
    
    tiempoRegresivo = setInterval(() => {
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer} Segundos`;
        if(timer == 0){
            alert('Perdiste, intenta de nuevo');
            clearInterval(tiempoRegresivo);
            bloquearTarjetas();
            lose.play();
        }
    }
    , 1000);
}

const bloquearTarjetas = () => {
    for(let i = 0; i < numero.length; i++){
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = `<img src="img/${numero[i]}.png" alt="${numero[i]}">`;
        tarjetaBloqueada.disabled = true;
    }
}

const destapar = (id) => {

    if(temporizador == false){
        contarTiempo();
        temporizador = true;  
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if(tarjetasDestapadas == 1 ){
        //mostrar primer numero
        tarjeta1 = document.getElementById(id);
        primerResultado = numero[id];
        clickAudio.play();
        tarjeta1.innerHTML = `<img src="img/${primerResultado}.png" alt="${primerResultado}">`;

        //desahabilitar la tarjeta
        tarjeta1.disabled = true;
    }else if (tarjetasDestapadas == 2){
        //mostrar segundo numero
        tarjeta2 = document.getElementById(id);
        segundoResultado = numero[id];
        tarjeta2.innerHTML = `<img src="img/${segundoResultado}.png" alt="${segundoResultado}">`;

        //desahabilitar la tarjeta
        tarjeta2.disabled = true;

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

        if(primerResultado == segundoResultado){
            tarjetasDestapadas = 0;

            aciertos++;
            mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            match.play();

            if(aciertos == 8){
                winAudio.play();
                clearInterval(tiempoRegresivo);
                alert(`Felicidades, ganaste en ${movimientos} movimientos y ${timerInicial - timer} segundos`);
                mostrarAciertos.innerHTML = `Puntaje: ${aciertos}`;
            }
        }
        else{
            wrong.play();
            setTimeout(()=>{
                tarjeta1.innerHTML = '';
                tarjeta2.innerHTML = '';
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 800);
        }
    }
}
