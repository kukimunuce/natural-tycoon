let saldo = 100000;
let slotsComprados = 0;
let slotsDisponibles = 0;
let arboles = 0;
let arbolesAdultos = 0;
let arbolesProtegidos = 0;
let areasProtegidas = 0;
let tiempo = { anios: 0, meses: 0 };

let bosqueArray = [];

// Función para actualizar la UI
function actualizarUI() {
    document.getElementById('saldo-texto').innerText = '💸 $' + saldo.toFixed(2);
    document.getElementById('slots-texto').innerText = slotsComprados;
    document.getElementById('slots-disponibles').innerText = slotsDisponibles;
    document.getElementById('areas-protegidas').innerText = areasProtegidas;
    document.getElementById('arboles-texto').innerText = arboles;
    document.getElementById('arboles-adultos').innerText = arbolesAdultos;
    document.getElementById('arboles-protegidos').innerText = arbolesProtegidos;

    // Habilitar o deshabilitar botones según la disponibilidad de recursos
    document.getElementById('boton-tierra').disabled = saldo < 90;
    document.getElementById('boton-arbol').disabled = slotsDisponibles == 0 || saldo < 10;
    document.getElementById('boton-talar').disabled = arbolesAdultos == 0;
    document.getElementById('boton-proteger').disabled = arbolesAdultos == 0;

    // Actualizar el bosque de emojis
    actualizarBosque();
}

// Función para comprar un slot
function comprarSlot() {
    if (saldo >= 90) {
        saldo -= 90;
        slotsComprados += 1;
        slotsDisponibles += 1;
        actualizarUI();
    }
}

// Función para comprar un árbol
function comprarArbol() {
    if (slotsDisponibles > 0 && saldo >= 10) {
        saldo -= 10;
        slotsDisponibles -= 1;
        arboles += 1;
        bosqueArray.push({ tipo: 'joven', protegido: false, tiempoPlantacion: tiempo.anios * 12 + tiempo.meses });
        actualizarUI();
    }
}

// Función para talar y vender
function talarYVender() {
    if (arbolesAdultos > 0) {
        for (let i = 0; i < bosqueArray.length; i++) {
            if (bosqueArray[i].tipo === 'adulto' && !bosqueArray[i].protegido) {
                bosqueArray[i].tipo = 'talar';
                setTimeout(function() {
                    bosqueArray.splice(i, 1);
                    actualizarUI();
                }, 5000);
                break;
            }
        }
        saldo += 15;
        arbolesAdultos -= 1;
        slotsDisponibles += 1;
        actualizarUI();
    }
}

// Función para proteger un árbol
function protegerArbol() {
    if (arbolesAdultos > 0) {
        for (let i = 0; i < bosqueArray.length; i++) {
            if (bosqueArray[i].tipo === 'adulto' && !bosqueArray[i].protegido) {
                bosqueArray[i].protegido = true;
                areasProtegidas += 1;
                arbolesAdultos -= 1;
                arbolesProtegidos += 1;
                actualizarUI();
                break;
            }
        }
    }
}

// Función para actualizar el bosque de emojis
function actualizarBosque() {
    const bosque = document.getElementById('main-body');
    bosque.innerHTML = '';
    for (let i = 0; i < bosqueArray.length; i++) {
        let div = document.createElement('div');
        div.style.display = 'inline-block';
        div.style.padding = '5px';
        if (bosqueArray[i].protegido) div.style.backgroundColor = '#A5C140';
        if (bosqueArray[i].tipo === 'adulto') div.innerText = '🌲';
        else if (bosqueArray[i].tipo === 'joven') div.innerText = '🌱';
        else div.innerText = '🪵';
        bosque.appendChild(div);
    }
}

// Función para actualizar el tiempo y crecer los árboles
setInterval(function() {
    tiempo.meses += 1;
    if (tiempo.meses == 12) {
        tiempo.anios += 1;
        tiempo.meses = 0;
    }
    document.getElementById('reloj-texto').innerText = '📅 ' + tiempo.anios + ' años ' + tiempo.meses + ' mes';

    for (let i = 0; i < bosqueArray.length; i++) {
        if (bosqueArray[i].tipo === 'joven' && tiempo.anios * 12 + tiempo.meses >= bosqueArray[i].tiempoPlantacion + 12) {
            bosqueArray[i].tipo = 'adulto';
            arboles -= 1;
            arbolesAdultos += 1;
        }
    }
    
    // Actualiza el saldo con el ingreso de los árboles protegidos
    saldo += arbolesProtegidos * 0.125;

    actualizarUI();
}, 1000);

// Inicializar la UI
actualizarUI();
