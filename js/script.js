//creación de la tabla

var botonMatriz = document.getElementById("btnMatriz");
botonMatriz.addEventListener("click", crear);

//Mover la aspiradora

var botonMovimiento = document.getElementById("btnMovimiento");
botonMovimiento.disabled = true;
botonMovimiento.addEventListener("click", autoProcess);

//Limpieza auto
var botonMovimientoAuto = true;

/*Funciones*/

var letras = []; //Crear un arreglo que almacene las letras generadas.
var n = 2; //tendra el tamaño de la matriz
var matriz = []; //arreglo bidimensional que contiene las coordenadas x,y

function autoProcess() {
  while (true) {
    //crear();
    if (botonMovimientoAuto) {
      moverAspiradoraAuto();
    }
  }
}

function asignarNivelSuciedad() {
  for (var i = 0; i < n; i++) {
    //Esto va a devolver un número del 1-4.
    var num = parseInt(getRandomArbitrary(1, 3), 10);
    //1 = a 2 = b 3 = c 4 = d
    //agrega al arreglo el valor que recibe de la función, es decir el nivel de suciedad.
    letras.push(asignarLetra(num));
  }
}

function asignarLetra(num) {
  //de acuerdo al numero generado, asigna el nivel de suciedad
  var letra = "";
  switch (num) {
    case 1:
      letra = "c";
      break;
    default:
      letra = "d";
  }
  return letra;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function crearMatriz() {
  var tabla = document.getElementsByTagName("table")[0];
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }
  var tableBody = document.createElement("tbody");
  tabla.classList.add("table");

  for (var i = 0; i < 1; i++) {
    //crear la celda (fila)
    var celda = document.createElement("tr");
    celda.classList.add("celda");
    //agrego un arreglo al arreglo
    matriz.push([]);
    for (var x = 0; x < n; x++) {
      //crear las columnas
      var columnas = document.createElement("td");
      var suciedad = letras.shift();
      switch (suciedad) {
        case "a":
          columnas.classList.add("a");
          break;
        case "b":
          columnas.classList.add("b");
          break;
        case "c":
          columnas.classList.add("c");
          break;
        default:
          //solo setea el color a transparente para tener el valor de d almacenado
          columnas.classList.add("d");
      }
      columnas.appendChild(document.createTextNode(suciedad));
      celda.appendChild(columnas);
      //poner de hija de la fila
      columnas.classList.add("cuadros");
      matriz[i][x] = suciedad;
    }
    //poner la celda como hija del tbody
    tableBody.appendChild(celda);
  }
  tabla.appendChild(tableBody);
  setearEventListenerDeAsignacionDeInicio();
  botonMovimientoAuto = true;
  botonMovimiento.disabled = true;
}

function posicionarAgente(x, y) {
  var inicio = document.getElementsByTagName("tr")[x].childNodes[y];
  matriz[x][y] = "";
  inicio.textContent = "";
  inicio.classList.add("agente");
  posAspiradoraX = x;
  posAspiradoraY = y;
  console.log(inicio.offset);
}

function crear() {
  limpiarTabla();
  asignarNivelSuciedad();
  crearMatriz();
}

function limpiarTabla() {
  contadorDeClicks = 0;
  contadorPasos = 0;
  matriz = [];
}

var letraPrioridad = ""; //nos sirve para almacenar la letra a comparar
var posAspiradoraX;
var posAspiradoraY;
var xFinal;
var yFinal;

function determinarLetra() {
  if (buscarLetra("c")) {
    letraPrioridad = "c";
    return true;
  }
  return false;
}

//metodo para detectar las letras. Es utilizado en la función determinarLetra. Ahí se le envia el parametro del nivel de suciedad
function buscarLetra(suciedad) {
  for (var i = 0; i < 1; i++) {
    if (matriz[i].includes("" + suciedad)) {
      return true;
    }
  }
  return false;
}

//metodo para calcular la distancia

function calcularDistancia(x, y) {
  var distancia = Math.sqrt(
    Math.pow(posAspiradoraX - x, 2) + Math.pow(posAspiradoraY - y, 2)
  );
  return distancia;
}

//metodo de la ruta
var distancia = [];
var xVal = [];
var yVal = [];

function moverAspiradora() {
  //si hay más lugares sucios, entonces intentará mover.
  if (determinarLetra()) {
    for (i = 0; i < 1; i++) {
      for (x = 0; x < n; x++) {
        if (matriz[i][x] === letraPrioridad) {
          distancia.push(calcularDistancia(i, x));
          xVal.push(i);
          yVal.push(x);
        }
      }
    }
    //el mover aspiradora nos llena la matriz, por lo tanto lo que prosigue es determinar la distancia menor y guardar la posicion.
    var distanciaMen = Math.sqrt(Math.pow(n, 2) + Math.pow(n, 2)) + 1;
    for (var i = 0; i < distancia.length; i++) {
      if (distancia[i] < distanciaMen) {
        distanciaMen = distancia[i];
        xFinal = xVal[i];
        yFinal = yVal[i];
      }
    }
    //Despues de ejecutar esto, ya tenemos la distancia menor y sus posiciones en "X" y "Y".
    limpiar(xFinal, yFinal);
    //ahora debemos actualizar la visualización de la tabla
    actualizarVisualizacionTabla(xFinal, yFinal);
    //limpiar los arreglos
    limpiarVariablesDeMovimiento();
  } else {
    notificarLimpiezaCompleta();
  }
}

//metodo para actualizar la tabla html

function actualizarVisualizacionTabla(x, y) {
  //trae el "td" que tiene a la aspiradora
  var aspiradora = document.getElementsByClassName("agente")[0];
  //trae el td que tendrá la nueva posición del agente
  var espacio = document.getElementsByTagName("tr")[x].childNodes[y];
  //Ese agente puede tener la imagen verde, amarilla o verde. Se las quitamos
  espacio.classList.remove("a", "b", "c");
  // Le agregamos las propiedades del agente
  espacio.classList.add("agente");
  //quitamos la imagen del aspiradora del "td" anterior
  aspiradora.classList.remove("agente", "a", "b", "c");
  //al "td" en el que estaba la aspiradora, se le pone "d" que equivale a limpio.
  aspiradora.classList.add("d");
  //se asgina la nueva posición del agente
  posicionarAgente(x, y);
}

//metodo para poner datos de la limpieza completa.
function notificarLimpiezaCompleta() {
  alert("Ya est\u00e1 limpio");
  botonMovimiento.disabled = true;
  botonMovimientoAuto = true;
}
//metodo de limpiar arreglos y asignar nuevas posiciones a la aspiradora

function limpiarVariablesDeMovimiento() {
  distancia = [];
  xVal = [];
  yVal = [];
  posAspiradoraX = xFinal;
  posAspiradoraY = yFinal;
}

//método de la limpieza
function limpiar(xFinal, yFinal) {
  matriz[xFinal][yFinal] = "";
}

//probando

function setearEventListenerDeAsignacionDeInicio() {
  var tr = document.getElementsByTagName("tr");
  for (var i = 0; i < 1; i++) {
    for (var y = 0; y < n; y++) {
      tr[i].childNodes[y].addEventListener("click", asignarPosicionDeInicio);
    }
  }
}
// var inicio = document.getElementsByTagName("tr")[x].childNodes[y]
var contadorDeClicks = 0;
function asignarPosicionDeInicio() {
  if (contadorDeClicks < 1) {
    var posx = this.parentNode.sectionRowIndex;
    var posy = this.cellIndex;
    posicionarAgente(posx, posy);
    botonMovimiento.disabled = false;
    botonMovimientoAuto = false;
    contadorDeClicks++;
  }
}

//permite realizar la limpieza en un solo click
function moverAspiradoraAuto() {
  while (determinarLetra()) {
    setTimeout(moverAspiradora, 1000);
  }
}
//
