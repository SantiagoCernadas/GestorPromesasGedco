
const botonContenedorAgregarPP = document.getElementById("boton-contenedor-agregar");
const botonContenedorFiltros = document.getElementById("boton-contenedor-filtros");
const botonAgregarPromesa = document.getElementById("boton-agregar");
const botonAgregarPromesaExcel = document.getElementById("boton-agregar-excel");
const mensajePP = document.getElementById("pp-mensaje");
const contenedorAgregarPP = document.querySelector('.contenedor-agregar-promesa');
const contenedorFiltros = document.querySelector('.filtros-contenedor');

const botonCerrarSesion = document.getElementById("boton-cerrar-sesion");

const paginacionDiv = document.getElementById('paginacion');

const botonFiltrar = document.getElementById('boton-filtrar');
let paginaActual = 1;
const cantFilasPagina = 8;

var idOriginal = 0;
var fechaOriginal = '';

const modal = document.getElementById('modal-editar-pp');
const botonGuardarEditar = document.getElementById('boton-guardar-editar');

var listaPromesas = tablaPrueba();
var listaPromesasFiltrada = listaPromesas;

var filtros = getFiltros();

const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("session_token="))
    ?.split("=")[1];


const apiUrl = 'http://localhost:8080/';

async function getPrueba() {

    await fetch(apiUrl + 'helloSeguro', {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.text();
    })
        .then(data => {
            console.log(data); // Procesa los datos
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

getPrueba();

function getFiltros() {
    return {
        caso: parseInt(document.getElementById('input-filtro-caso').value),
        id: parseInt(document.getElementById('input-filtro-id').value),
        canal: document.getElementById('input-filtro-canal').value,
        site: document.getElementById('input-filtro-site').value,
        tipoAcuerdo: document.getElementById('input-filtro-tipo-acuerdo').value,
        tipoCumplimiento: document.getElementById('input-filtro-cumplimiento').value,
        fechaCargaDesde: document.getElementById('input-filtro-fecha-carga-desde').value,
        fechaCargaHasta: document.getElementById('input-filtro-fecha-carga-hasta').value,
        operador: document.getElementById('input-filtro-operador').value,
        duplica: document.getElementById('input-filtro-duplica').checked,
    };
}

botonFiltrar.addEventListener('click', () => {
    filtros = getFiltros();
    console.log(filtros);
    listaPromesasFiltrada = listaPromesas;
    console.log(listaPromesasFiltrada);
    if (!isNaN(filtros.caso)) {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.caso === filtros.caso);
    }
    if (!isNaN(filtros.id)) {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.id === filtros.id);
    }
    if (filtros.canal != '-') {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.canal === filtros.canal);
    }
    if (filtros.site != '-') {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.site === filtros.site);
    }
    if (filtros.tipoAcuerdo != '-') {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.tipoAcuerdo === filtros.tipoAcuerdo);
    }
    if (filtros.tipoCumplimiento != '-') {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.tipoCumplimiento === filtros.tipoCumplimiento);
    }

    if (filtros.fechaCargaDesde != '' && filtros.fechaCargaHasta == '') {
        filtros.fechaCargaHasta = filtros.fechaCargaDesde;
        document.getElementById('input-filtro-fecha-carga-hasta').value = filtros.fechaCargaHasta
    }
    else if (filtros.fechaCargaDesde == '' && filtros.fechaCargaHasta != '') {
        filtros.fechaCargaDesde = filtros.fechaCargaHasta;
        document.getElementById('input-filtro-fecha-carga-desde').value = filtros.fechaCargaDesde;
    }

    if (filtros.fechaCargaDesde != '' && filtros.fechaCargaHasta != '') {
        var fechaDesde = new Date(filtros.fechaCargaDesde);
        var fechaHasta = new Date(filtros.fechaCargaHasta);
        if (fechaHasta < fechaDesde) {
            fechaHasta = fechaDesde;
            filtros.fechaCargaHasta = filtros.fechaCargaDesde;
            document.getElementById('input-filtro-fecha-carga-hasta').value = filtros.fechaCargaDesde;
        }
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => {
            const fechaCarga = new Date(promesa.fechaCarga);
            return fechaCarga >= fechaDesde && fechaCarga <= fechaHasta;
        })
    }

    if (filtros.duplica) {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => PromesaDuplica(promesa));
    }

    if (filtros.operador != '-') {
        listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => promesa.nombreOperador === filtros.operador);
    }
    console.log(listaPromesasFiltrada);
    printTablaHTML();
})


function PromesaDuplica(promesa) {
    /*Requisitos para que una promesa sea "duplicada" (mas valor):
    
    MLA= Monto mayor a 250.000
    MLM= Monto mayor a 250.000
    MLC= Monto mayor a 250.000
    */
    if (promesa.site == 'MLA' && promesa.monto >= 250000) return true;
    if (promesa.site == 'MLM' && promesa.monto >= 5000) return true;
    if (promesa.site == 'MLC' && promesa.monto >= 200000) return true;

    return false;
}

const formatFecha = new Intl.DateTimeFormat("es", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})

const sesion = JSON.parse(localStorage.getItem('sesionUsuario'));

document.getElementById('nombre-operador-span').innerHTML = "";

//Formatea un número a pesos argentinos.
const formateadorDeMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
});

const tabla = document.querySelector('.tabla').querySelector('tbody');
printTablaHTML();

botonContenedorAgregarPP.addEventListener('click', () => {
    if (contenedorAgregarPP.style.display == 'flex') {
        contenedorAgregarPP.style.display = 'none';
    }
    else {
        contenedorAgregarPP.style.display = 'flex';
        mensajePP.innerHTML = ''
        document.getElementById("input-pp-caso").style.border = '1px solid black';
        document.getElementById("input-pp-id").style.border = '1px solid black';
        document.getElementById("input-pp-canal").style.border = '1px solid black';
        document.getElementById("input-pp-site").style.border = '1px solid black';
        document.getElementById("input-pp-monto").style.border = '1px solid black';
        document.getElementById("input-pp-fecha-carga").style.border = '1px solid black';
        document.getElementById("input-pp-fecha-pago").style.border = '1px solid black';
        document.getElementById("input-pp-tipo-acuerdo").style.border = '1px solid black';
        document.getElementById("input-pp-operador").style.border = '1px solid black';
        document.getElementById("input-pp-cumplimiento").style.border = '1px solid black';
    }
});

botonContenedorFiltros.addEventListener('click', () => {
    if (contenedorFiltros.style.display == 'flex') {
        contenedorFiltros.style.display = 'none';
    }
    else {
        contenedorFiltros.style.display = 'flex';
    }
});

botonAgregarPromesa.addEventListener('click', () => {
    agregarPromesa();
})

botonAgregarPromesaExcel.addEventListener('click', () => {
    alert("Proximamente");
})

botonCerrarSesion.addEventListener('click', () => {
    document.cookie = "session_token=; path=/; max-age=0;"
    window.location.href = "/Frontend/index.html";
})

function printTablaHTML() {
    const filas = document.querySelectorAll('.tabla tr');


    filas.forEach((p, i) => {
        if (i != 0) {
            p.remove()
        }
    });

    renderPaginacion();

    const inicio = (paginaActual - 1) * cantFilasPagina;
    const fin = inicio + cantFilasPagina;

    const ppsPaginaActual = listaPromesasFiltrada.slice(inicio, fin);



    ppsPaginaActual.forEach((filaTabla, i) => {
        const fila = document.createElement('tr');
        fila.id = 'tabla-fila-' + i;
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.caso, 'columna');
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.id);
        insertarCanal(fila, document.createElement('td'), document.createElement('p'), filaTabla.canal);
        insertarSite(fila, document.createElement('td'), document.createElement('p'), filaTabla.site);
        insertarMonto(fila, document.createElement('td'), document.createElement('p'), filaTabla.monto);
        insertarFecha(fila, document.createElement('td'), document.createElement('p'), filaTabla.fechaCarga);
        insertarFecha(fila, document.createElement('td'), document.createElement('p'), filaTabla.fechaPago);
        insertarTipoAcuerdo(fila, document.createElement('td'), document.createElement('p'), filaTabla.tipoAcuerdo);
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.nombreOperador);
        insertarTipoCumplimiento(fila, document.createElement('td'), document.createElement('p'), filaTabla.tipoCumplimiento);
        const columnaBotones = document.createElement('td');
        const botonEditar = document.createElement('button');
        botonEditar.innerHTML = "Editar";
        botonEditar.classList.add('boton-editar');
        const botonEliminar = document.createElement('button');
        botonEliminar.innerHTML = "Eliminar";
        botonEliminar.classList.add('boton-eliminar');
        columnaBotones.classList.add('columna-botones');
        columnaBotones.appendChild(botonEditar);
        columnaBotones.appendChild(botonEliminar);

        fila.appendChild(columnaBotones);
        tabla.appendChild(fila);

        botonEliminar.addEventListener('click', () => {
            const fila = document.getElementById('tabla-fila-' + i);
            fila.remove();
            listaPromesasFiltrada = listaPromesasFiltrada.filter(promesa => !(promesa.id === filaTabla.id && promesa.fechaCarga === filaTabla.fechaCarga));
            listaPromesas = listaPromesas.filter(promesa => !(promesa.id === filaTabla.id && promesa.fechaCarga === filaTabla.fechaCarga));
            console.log(listaPromesas.length);
            console.log(listaPromesasFiltrada.length);
            alert("Promesa con id: " + filaTabla.id + " y fecha de carga: " + filaTabla.fechaCarga + ' eliminada correctamente.');
            const totalPaginas = Math.ceil(listaPromesas.length / cantFilasPagina);
            if (paginaActual > totalPaginas) {
                paginaActual = totalPaginas
            };
            printTablaHTML();
        });
        botonEditar.addEventListener('click', () => {
            //const fila = document.getElementById('tabla-fila-'+i);
            document.getElementById("input-pp-caso-edit").value = filaTabla.caso;
            document.getElementById("input-pp-id-edit").value = filaTabla.id;
            document.getElementById("input-pp-canal-edit").value = filaTabla.canal;
            document.getElementById("input-pp-site-edit").value = filaTabla.site;
            document.getElementById("input-pp-monto-edit").value = filaTabla.monto;
            document.getElementById("input-pp-site-edit").value = filaTabla.site;
            document.getElementById("input-pp-fecha-carga-edit").value = filaTabla.fechaCarga;
            document.getElementById("input-pp-fecha-pago-edit").value = filaTabla.fechaPago;
            document.getElementById("input-pp-tipo-acuerdo-edit").value = filaTabla.tipoAcuerdo;
            document.getElementById("input-pp-operador-edit").value = filaTabla.nombreOperador;
            document.getElementById("input-pp-cumplimiento-edit").value = filaTabla.tipoCumplimiento;

            fechaOriginal = filaTabla.fechaCarga;
            idOriginal = filaTabla.id;

            modal.showModal();
        });

    });



}
function renderPaginacion() {
    paginacionDiv.innerHTML = '';

    const totalPaginas = Math.ceil(listaPromesasFiltrada.length / cantFilasPagina);

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas
    }
    else if (paginaActual <= 0) {
        if (listaPromesasFiltrada.length >= 1) {
            paginaActual = 1;
        }
    }

    paginacionDiv.appendChild(crearBoton('Anterior', paginaActual - 1, paginaActual <= 1));

    paginaActualParrafo = document.createElement('p');
    paginaActualParrafo.textContent = paginaActual + " de " + totalPaginas;
    paginacionDiv.appendChild(paginaActualParrafo)

    paginacionDiv.appendChild(crearBoton('Siguiente', paginaActual + 1, paginaActual >= totalPaginas));
}

function crearBoton(texto, pagina, deshabilitado = false) {
    const btn = document.createElement('button');
    btn.textContent = texto;


    if (!deshabilitado) {
        btn.addEventListener('click', () => {
            paginaActual = pagina;
            printTablaHTML();
        });
    }
    return btn;
};

botonGuardarEditar.addEventListener('click', () => {



    const promesaEdit = {
        caso: parseInt(document.getElementById("input-pp-caso-edit").value),
        id: parseInt(document.getElementById("input-pp-id-edit").value),
        canal: document.getElementById("input-pp-canal-edit").value,
        site: document.getElementById("input-pp-site-edit").value,
        monto: parseMonto(document.getElementById("input-pp-monto-edit").value),
        fechaCarga: document.getElementById("input-pp-fecha-carga-edit").value,
        fechaPago: document.getElementById("input-pp-fecha-pago-edit").value,
        tipoAcuerdo: document.getElementById("input-pp-tipo-acuerdo-edit").value,
        nombreOperador: document.getElementById("input-pp-operador-edit").value,
        tipoCumplimiento: document.getElementById("input-pp-cumplimiento-edit").value
    }

    const nuevoId = promesaEdit.id;
    const nuevaFecha = promesaEdit.fechaCarga;


    promesaCorrecta = validarPromesa(promesaEdit);

    if (!promesaCorrecta) {
        alert('ERROR AL GENERAR LA NUEVA PROMESA.');
        return;
    }

    const duplicado = listaPromesas.some(p =>
        p.id === nuevoId && p.fechaCarga === nuevaFecha &&
        !(p.id === idOriginal && p.fechaCarga === fechaOriginal)
    );

    if (duplicado) {
        alert('⚠️ Ya existe una persona con ese ID y fecha de carga.');
        return;
    }

    var promesa = listaPromesas.find(p => p.id === idOriginal && p.fechaCarga === fechaOriginal);
    if (promesa) {
        promesa.caso = promesaEdit.caso;
        promesa.id = promesaEdit.id;
        promesa.canal = promesaEdit.canal;
        promesa.site = promesaEdit.site;
        promesa.monto = promesaEdit.monto;
        promesa.fechaCarga = promesaEdit.fechaCarga;
        promesa.fechaPago = promesaEdit.fechaPago;
        promesa.tipoAcuerdo = promesaEdit.tipoAcuerdo;
        promesa.nombreOperador = promesaEdit.nombreOperador;
        promesa.tipoCumplimiento = promesaEdit.tipoCumplimiento;
    }

    alert('PP Modificada.');
    modal.close();
    printTablaHTML();
});

document.getElementById('boton-cancelar-editar').addEventListener('click', () => {
    modal.close();
});

function insertarCanal(fila, columna, valorColumna, canal) {
    valorColumna.innerHTML = canal;
    switch (canal) {
        case "OFFLINE":
            valorColumna.classList.add('columna-offline');
            break;
        case "CHAT":
            valorColumna.classList.add('columna-chat');
            break;
        case "C2C":
            valorColumna.classList.add('columna-c2c');
            break;
    }
    insertarDato(fila, columna, valorColumna, canal)
}

function insertarSite(fila, columna, valorColumna, site) {
    valorColumna.innerHTML = site;
    switch (site) {
        case "MLA":
            valorColumna.classList.add('columna-mla');
            break;
        case "MLM":
            valorColumna.classList.add('columna-mlm');
            break;
        case "MLC":
            valorColumna.classList.add('columna-mlc');
            break;
    }
    insertarDato(fila, columna, valorColumna, site)
}

function insertarTipoAcuerdo(fila, columna, valorColumna, tipoAcuerdo) {
    valorColumna.innerHTML = tipoAcuerdo;
    switch (tipoAcuerdo) {
        case "Pago total":
            valorColumna.classList.add('columna-pagototal');
            break;
        case "Condonación":
            valorColumna.classList.add('columna-condonacion');
            break;
        case "Parcelamento":
            valorColumna.classList.add('columna-parcelamento');
            break;
        case "Pago parcial":
            valorColumna.classList.add('columna-pagoparcial');
            break;
    }
    insertarDato(fila, columna, valorColumna, tipoAcuerdo)
}

function insertarTipoCumplimiento(fila, columna, valorColumna, tipoCumplimiento) {
    valorColumna.innerHTML = tipoCumplimiento;
    switch (tipoCumplimiento) {
        case "En curso":
            valorColumna.classList.add('columna-encurso');
            break;
        case "Cumplida":
            valorColumna.classList.add('columna-cumplida');
            break;
        case "Incumplida":
            valorColumna.classList.add('columna-incumplida');
            break;
    }
    insertarDato(fila, columna, valorColumna, tipoCumplimiento)
}

function insertarFecha(fila, columna, valorColumna, fecha) {
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    insertarDato(fila, columna, valorColumna, formatFecha.format(date));
}

function formatearAMonedaArgentina(numero) {
    const formateador = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2, // Muestra dos decimales, que es lo estándar para el ARS
    });
    return formateador.format(numero);
}

function insertarMonto(fila, columna, valorColumna, monto) {
    insertarDato(fila, columna, valorColumna, formatearAMonedaArgentina(monto));
}

function insertarDato(fila, columna, valorColumna, dato) {
    valorColumna.innerHTML = dato;
    valorColumna.classList.add('columna-borde');
    columna.appendChild(valorColumna);
    fila.appendChild(columna);
}


function agregarPromesa() {
    mensajePP.innerHTML = '';
    //1px solid black;
    document.getElementById("input-pp-caso").style.border = '1px solid black';
    document.getElementById("input-pp-id").style.border = '1px solid black';
    document.getElementById("input-pp-canal").style.border = '1px solid black';
    document.getElementById("input-pp-site").style.border = '1px solid black';
    document.getElementById("input-pp-monto").style.border = '1px solid black';
    document.getElementById("input-pp-fecha-carga").style.border = '1px solid black';
    document.getElementById("input-pp-fecha-pago").style.border = '1px solid black';
    document.getElementById("input-pp-tipo-acuerdo").style.border = '1px solid black';
    document.getElementById("input-pp-operador").style.border = '1px solid black';
    document.getElementById("input-pp-cumplimiento").style.border = '1px solid black';

    const nuevaPromesa = {
        caso: parseInt(document.getElementById("input-pp-caso").value),
        id: parseInt(document.getElementById("input-pp-id").value),
        canal: document.getElementById("input-pp-canal").value,
        site: document.getElementById("input-pp-site").value,
        monto: parseMonto(document.getElementById("input-pp-monto").value),
        fechaCarga: document.getElementById("input-pp-fecha-carga").value,
        fechaPago: document.getElementById("input-pp-fecha-pago").value,
        tipoAcuerdo: document.getElementById("input-pp-tipo-acuerdo").value,
        nombreOperador: document.getElementById("input-pp-operador").value,
        tipoCumplimiento: document.getElementById("input-pp-cumplimiento").value
    }

    promesaCorrecta = validarPromesa(nuevaPromesa);

    if (promesaCorrecta) {
        if (listaPromesas.some(promesa => promesa.id === nuevaPromesa.id && promesa.fechaCarga === nuevaPromesa.fechaCarga)) {
            mensajePP.innerHTML += 'Ya existe una promesa con el id y la fecha de carga ingresada.'
            mensajePP.style.color = 'red';
        }
        else {
            mensajePP.innerHTML += '¡Promesa agregada con exito!'
            mensajePP.style.color = 'green';
            listaPromesas.unshift(nuevaPromesa);
            listaPromesasFiltrada.unshift(nuevaPromesa);
            printTablaHTML();
        }
    }
}

function validarPromesa(nuevaPromesa) {
    var sinError = true;
    if (Number.isNaN(nuevaPromesa.caso)) {
        document.getElementById("input-pp-caso").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar Numero de caso. <br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (Number.isNaN(nuevaPromesa.id)) {
        document.getElementById("input-pp-id").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar ID.<br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.canal == '-') {
        document.getElementById("input-pp-canal").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar Canal.<br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.site == '-') {
        document.getElementById("input-pp-site").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar Site.<br>'
        sinError = false;
    }
    if (Number.isNaN(nuevaPromesa.monto)) {
        document.getElementById("input-pp-monto").style.border = '2px solid red';
        mensajePP.innerHTML += 'Monto invalido.<br>';
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.fechaCarga == '') {
        document.getElementById("input-pp-fecha-carga").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar fecha de carga valida.<br>';
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.fechaPago == '') {
        document.getElementById("input-pp-fecha-pago").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar fecha de pago valida.<br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.fechaCarga != '' && nuevaPromesa.fechaPago != '') {
        const difdias = diferenciaEnDias(nuevaPromesa.fechaCarga, nuevaPromesa.fechaPago);
        if (difdias > 7) {
            document.getElementById("input-pp-fecha-pago").style.border = '2px solid red';
            mensajePP.innerHTML += 'La diferencia entre la fecha de carga y fecha de pago no puede ser mayor a 7 días.<br>'
            mensajePP.style.color = 'red';
            sinError = false;
        }
        else if (difdias < 0) {
            document.getElementById("input-pp-fecha-pago").style.border = '2px solid red';
            mensajePP.innerHTML += 'La fecha de pago debe ser igual o posterior a la fecha de carga.<br>'
            mensajePP.style.color = 'red';
            sinError = false;
        }
    }
    if (nuevaPromesa.tipoAcuerdo == '-') {
        document.getElementById("input-pp-tipo-acuerdo").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar tipo de acuerdo.<br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    if (nuevaPromesa.nombreOperador == '') {
        document.getElementById("input-pp-operador").style.border = '2px solid red';
        mensajePP.innerHTML += 'Ingresar nombre de operador.<br>'
        mensajePP.style.color = 'red';
        sinError = false;
    }
    return sinError;
}



function parseMonto(montoStr) {
    montoStr = montoStr.trim().replace(/\$/g, '');

    //Verifica que no tenga caracteres que no sean parseables
    if (!montoStr || /[^0-9.,]/.test(montoStr)) return NaN;

    if (montoStr == '') return NaN;


    const tienePunto = montoStr.includes('.');
    const tieneComa = montoStr.includes(',');

    if (tienePunto && tieneComa) {
        // Ambos separadores presentes
        // Si la coma está al final -> formato argentino
        if (montoStr.lastIndexOf(',') > montoStr.lastIndexOf('.')) {
            montoStr = montoStr.replace(/\./g, '').replace(',', '.');
        } else {
            // Si el punto está al final -> formato mexicano
            montoStr = montoStr.replace(/,/g, ''); // elimina comas
        }
    } else if (tieneComa && !tienePunto) {
        // 👉 Solo comas
        // Si hay más de una coma → son miles, quitarlas
        if ((montoStr.match(/,/g) || []).length > 1) {
            montoStr = montoStr.replace(/,/g, '');
        } else {
            // Si solo hay una coma, decidir si decimal o miles
            const partes = montoStr.split(',');
            if (partes[1]?.length === 3) {
                montoStr = montoStr.replace(/,/g, '');
            } else {
                montoStr = montoStr.replace(',', '.');
            }
        }
    } else if (tienePunto && !tieneComa) {
        // 👉 Solo puntos
        // Si hay más de un punto → son separadores de miles
        if ((montoStr.match(/\./g) || []).length > 1) {
            montoStr = montoStr.replace(/\./g, '');
        } else {
            // Si solo hay uno, verificar si decimal o miles
            const partes = montoStr.split('.');
            if (partes[1]?.length === 3) {
                montoStr = montoStr.replace(/\./g, '');
            }
        }
    }

    const result = parseFloat(montoStr);
    return isNaN(result) ? NaN : result;
}

function diferenciaEnDias(fecha1, fecha2) {
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);

    // Normalizar las horas para que solo cuente la diferencia de fechas
    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);

    // Diferencia en milisegundos (fecha2 - fecha1)
    const diffMs = f2 - f1;

    // Convertir milisegundos → días (positivo o negativo)
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    return diffDias;
}


function tablaPrueba() {
    //Formato Fecha: YYYY-MM-DD
    //Formato monto: Pesos Argentinos.
    return [
        {
            caso: 123141243,
            id: 10000,
            canal: "CHAT",
            site: "MLA",
            monto: 852.42,
            fechaCarga: "2025-10-13",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Condonación",
            nombreOperador: "Pepito92",
            tipoCumplimiento: "En curso"
        },
        {
            caso: 123141243,
            id: 20000,
            canal: "OFFLINE",
            site: "MLM",
            monto: 5000,
            fechaCarga: "2025-10-14",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Pago parcial",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Cumplida"
        },
        {
            caso: 543636364,
            id: 30000,
            canal: "C2C",
            site: "MLC",
            monto: 1000000,
            fechaCarga: "2025-10-15",
            fechaPago: "2025-10-16",
            tipoAcuerdo: "Parcelamento",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Incumplida"
        },
        {
            caso: 123141243,
            id: 40000,
            canal: "CHAT",
            site: "MLA",
            monto: 852.42,
            fechaCarga: "2025-10-16",
            fechaPago: "2025-10-20",
            tipoAcuerdo: "Condonación",
            nombreOperador: "Pepito92",
            tipoCumplimiento: "En curso"
        },
        {
            caso: 123141243,
            id: 50000,
            canal: "OFFLINE",
            site: "MLM",
            monto: 3000,
            fechaCarga: "2025-10-17",
            fechaPago: "2025-10-17",
            tipoAcuerdo: "Pago parcial",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Cumplida"
        },
        {
            caso: 543636364,
            id: 60000,
            canal: "C2C",
            site: "MLC",
            monto: 1000000,
            fechaCarga: "2025-10-17",
            fechaPago: "2025-10-17",
            tipoAcuerdo: "Parcelamento",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Incumplida"
        },
        {
            caso: 123141243,
            id: 70000,
            canal: "CHAT",
            site: "MLA",
            monto: 500000,
            fechaCarga: "2025-10-13",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Condonación",
            nombreOperador: "Pepito92",
            tipoCumplimiento: "En curso"
        },
        {
            caso: 123141243,
            id: 80000,
            canal: "OFFLINE",
            site: "MLM",
            monto: 5000,
            fechaCarga: "2025-10-13",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Pago parcial",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Cumplida"
        },
        {
            caso: 543636364,
            id: 90000,
            canal: "C2C",
            site: "MLC",
            monto: 1000000,
            fechaCarga: "2025-10-13",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Parcelamento",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Incumplida"
        }
    ];
}