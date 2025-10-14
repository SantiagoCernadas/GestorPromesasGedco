
const botonContenedorAgregarPP = document.getElementById("boton-contenedor-agregar");
const botonContenedorFiltros = document.getElementById("boton-contenedor-filtros");
const botonAgregarPromesa = document.getElementById("boton-agregar");
const botonAgregarPromesaExcel = document.getElementById("boton-agregar-excel");

const contenedorAgregarPP = document.querySelector('.contenedor-agregar-promesa');
const contenedorFiltros = document.querySelector('.filtros-contenedor');

const botonCerrarSesion = document.getElementById("boton-cerrar-sesion");

const listaPromesas = tablaPrueba();

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
    window.location.href = "/Frontend/index.html";
    localStorage.removeItem('sesionUsuario');
})

function printTablaHTML(){
    const filas = document.querySelectorAll('.tabla tr');

    filas.forEach((p,i) => {
        if(i != 0){
            p.remove()
        }
    });

    listaPromesas.forEach((filaTabla) => {
        const fila = document.createElement('tr');   
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.caso);
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.id);
        insertarCanal(fila,document.createElement('td'),document.createElement('p'),filaTabla.canal);
        insertarSite(fila,document.createElement('td'),document.createElement('p'),filaTabla.site);
        insertarMonto(fila,document.createElement('td'),document.createElement('p'),filaTabla.monto);
        insertarFecha(fila,document.createElement('td'),document.createElement('p'),filaTabla.fechaCarga);
        insertarFecha(fila,document.createElement('td'),document.createElement('p'),filaTabla.fechaPago);
        insertarTipoAcuerdo(fila,document.createElement('td'),document.createElement('p'),filaTabla.tipoAcuerdo);
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.nombreOperador);
        insertarTipoCumplimiento(fila,document.createElement('td'),document.createElement('p'),filaTabla.tipoCumplimiento);
        const columnaBotones = document.createElement('td');
        const botonEditar = document.createElement('button');
        botonEditar.innerHTML = "Editar";
        botonEditar.classList.add('boton-editar');
        const botonEliminar = document.createElement('button');
        botonEliminar.innerHTML = "Eliminar";
        botonEliminar.classList.add('boton-eliminar')
        columnaBotones.classList.add('columna-botones')
        columnaBotones.appendChild(botonEditar);
        columnaBotones.appendChild(botonEliminar);
        fila.appendChild(columnaBotones);
        tabla.appendChild(fila);
    });
}

function insertarCanal(fila,columna,valorColumna,canal){
    valorColumna.innerHTML = canal;
    switch(canal){
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
    insertarDato(fila,columna,valorColumna,canal)
}

function insertarSite(fila,columna,valorColumna,site){
    valorColumna.innerHTML = site;
    switch(site){
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
    insertarDato(fila,columna,valorColumna,site)
}

function insertarTipoAcuerdo(fila,columna,valorColumna,tipoAcuerdo){
    valorColumna.innerHTML = tipoAcuerdo;
    switch(tipoAcuerdo){
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
    insertarDato(fila,columna,valorColumna,tipoAcuerdo)
}

function insertarTipoCumplimiento(fila,columna,valorColumna,tipoCumplimiento){
    valorColumna.innerHTML = tipoCumplimiento;
    switch(tipoCumplimiento){
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
    insertarDato(fila,columna,valorColumna,tipoCumplimiento)
}

function insertarFecha(fila,columna,valorColumna,fecha){
    const formatFecha = new Intl.DateTimeFormat("es",{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

    insertarDato(fila,columna,valorColumna,formatFecha.format(date))
}

function formatearAMonedaArgentina(numero) {
  const formateador = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2, // Muestra dos decimales, que es lo estándar para el ARS
  });
  return formateador.format(numero);
}

function insertarMonto(fila,columna,valorColumna,monto){
    insertarDato(fila,columna,valorColumna,formatearAMonedaArgentina(monto));
}

function insertarDato(fila,columna,valorColumna,dato){
    valorColumna.innerHTML = dato;
    valorColumna.classList.add('columna-borde');
    columna.appendChild(valorColumna);
    fila.appendChild(columna);
}


function agregarPromesa(){
    const mensaje = document.getElementById("pp-mensaje");
    mensaje.innerHTML = ''
    var sinErrores = true;
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
            caso: document.getElementById("input-pp-caso").value,
            id: document.getElementById("input-pp-id").value,
            canal: document.getElementById("input-pp-canal").value,
            site: document.getElementById("input-pp-site").value,
            monto: document.getElementById("input-pp-monto").value,
            fechaCarga: document.getElementById("input-pp-fecha-carga").value,
            fechaPago: document.getElementById("input-pp-fecha-pago").value,
            tipoAcuerdo: document.getElementById("input-pp-tipo-acuerdo").value,
            nombreOperador: document.getElementById("input-pp-operador").value,
            tipoCumplimiento: document.getElementById("input-pp-cumplimiento").value
        }

        if(nuevaPromesa.caso == ''){
            document.getElementById("input-pp-caso").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar Numero de caso. <br>'
            sinErrores = false;
        }
        if(nuevaPromesa.id == ''){
            document.getElementById("input-pp-id").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar ID.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.canal == '-'){
            document.getElementById("input-pp-canal").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar Canal.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.site == '-'){
            document.getElementById("input-pp-site").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar Site.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.monto == ''){
            document.getElementById("input-pp-monto").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar Monto valido (Misma forma que en engage).<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.fechaCarga == ''){
            document.getElementById("input-pp-fecha-carga").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar fecha de carga valida.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.fechaPago == ''){
            document.getElementById("input-pp-fecha-pago").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar fecha de pago valida.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.tipoAcuerdo == '-'){
            document.getElementById("input-pp-tipo-acuerdo").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar tipo de acuerdo.<br>'
            sinErrores = false;
        }
        if(nuevaPromesa.nombreOperador == ''){
            document.getElementById("input-pp-operador").style.border = '2px solid red';
            mensaje.innerHTML += 'Ingresar nombre de operador.<br>'
            sinErrores = false;
        }
        if(sinErrores){
            mensaje.innerHTML += '¡Promesa agregada con exito!'
            mensaje.style.color = 'green';
            listaPromesas.push(nuevaPromesa);
            printTablaHTML();
        }
        else{
            mensaje.style.color = 'red';
        }

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
            fechaCarga: "2025-10-13",
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
            fechaCarga: "2025-10-13",
            fechaPago: "2025-10-14",
            tipoAcuerdo: "Parcelamento",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Incumplida"
        }
    ];
}