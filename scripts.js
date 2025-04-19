const contadorCalorias = document.getElementById('calorie-counter');
const presupuestoInput = document.getElementById('budget');
const dropdownEntrada = document.getElementById('entry-dropdown');
const botonAgregarEntrada = document.getElementById('add-entry');
const botonLimpiar = document.getElementById('clear');
const salida = document.getElementById('output');
let hayError = false;

function limpiarCadenaEntrada(cadena) {
  const regex = /[+-\s]/g;
  return cadena.replace(regex, '');
}

function esEntradaInvalida(cadena) {
  const regex = /\d+e\d+/i;
  return cadena.match(regex);
}

function agregarEntrada() {
  const contenedorEntrada = document.querySelector(`#${dropdownEntrada.value} .input-container`);
  const numeroEntrada = contenedorEntrada.querySelectorAll('input[type="text"]').length + 1;
  const cadenaHTML = `
  <label for="${dropdownEntrada.value}-${numeroEntrada}-name">Nombre de la Entrada ${numeroEntrada}</label>
  <input type="text" id="${dropdownEntrada.value}-${numeroEntrada}-name" placeholder="Nombre" />
  <label for="${dropdownEntrada.value}-${numeroEntrada}-calories">Calorías de la Entrada ${numeroEntrada}</label>
  <input
    type="number"
    min="0"
    id="${dropdownEntrada.value}-${numeroEntrada}-calories"
    placeholder="Calorías"
  />`;
  contenedorEntrada.insertAdjacentHTML('beforeend', cadenaHTML);
}

function calcularCalorias(e) {
  e.preventDefault();
  hayError = false;

  const entradasDesayuno = document.querySelectorAll("#breakfast input[type='number']");
  const entradasAlmuerzo = document.querySelectorAll("#lunch input[type='number']");
  const entradasCena = document.querySelectorAll("#dinner input[type='number']");
  const entradasBocadillos = document.querySelectorAll("#snacks input[type='number']");
  const entradasEjercicio = document.querySelectorAll("#exercise input[type='number']");

  const caloriasDesayuno = obtenerCaloriasDeEntradas(entradasDesayuno);
  const caloriasAlmuerzo = obtenerCaloriasDeEntradas(entradasAlmuerzo);
  const caloriasCena = obtenerCaloriasDeEntradas(entradasCena);
  const caloriasBocadillos = obtenerCaloriasDeEntradas(entradasBocadillos);
  const caloriasEjercicio = obtenerCaloriasDeEntradas(entradasEjercicio);
  const caloriasPresupuesto = obtenerCaloriasDeEntradas([presupuestoInput]);

  if (hayError) {
    return;
  }

  const caloriasConsumidas = caloriasDesayuno + caloriasAlmuerzo + caloriasCena + caloriasBocadillos;
  const caloriasRestantes = caloriasPresupuesto - caloriasConsumidas + caloriasEjercicio;
  const excedenteODeficit = caloriasRestantes < 0 ? 'Excedente' : 'Déficit';
  salida.innerHTML = `
  <span class="${excedenteODeficit.toLowerCase()}">${Math.abs(caloriasRestantes)} Calorías ${excedenteODeficit}</span>
  <hr>
  <p>${caloriasPresupuesto} Calorías Presupuestadas</p>
  <p>${caloriasConsumidas} Calorías Consumidas</p>
  <p>${caloriasEjercicio} Calorías Quemadas</p>
  `;

  salida.classList.remove('hide');
}

function obtenerCaloriasDeEntradas(lista) {
  let calorias = 0;

  for (const item of lista) {
    const valorActual = limpiarCadenaEntrada(item.value);
    const entradaInvalida = esEntradaInvalida(valorActual);

    if (entradaInvalida) {
      alert(`Entrada Inválida: ${entradaInvalida[0]}`);
      hayError = true;
      return null;
    }
    calorias += Number(valorActual);
  }
  return calorias;
}

function limpiarFormulario() {
  const contenedoresEntrada = Array.from(document.querySelectorAll('.input-container'));

  for (const contenedor of contenedoresEntrada) {
    contenedor.innerHTML = '';
  }

  presupuestoInput.value = '';
  salida.innerText = '';
  salida.classList.add('hide');
}

botonAgregarEntrada.addEventListener("click", agregarEntrada);
contadorCalorias.addEventListener("submit", calcularCalorias);
botonLimpiar.addEventListener("click", limpiarFormulario);