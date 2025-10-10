const botonContenedorAgregarPP = document.getElementById("boton-contenedor-agregar");
const botonContenedorFiltros = document.getElementById("boton-contenedor-filtros");
const botonAgregarPromesa = document.getElementById("boton-agregar");

const contenedorAgregarPP = document.querySelector('.contenedor-agregar-promesa');
const contenedorFiltros = document.querySelector('.filtros-contenedor');

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

function printTablaHTML(){

    listaPromesas.forEach((filaTabla) => {
        const fila = document.createElement('tr');   
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.caso);
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.id);
        insertarCanal(fila,document.createElement('td'),document.createElement('p'),filaTabla.canal);
        insertarSite(fila,document.createElement('td'),document.createElement('p'),filaTabla.site);
        insertarDato(fila,document.createElement('td'),document.createElement('p'),filaTabla.monto);
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
    console.log(fecha)
    console.log(formatFecha.format(new Date(fecha)));
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

    insertarDato(fila,columna,valorColumna,formatFecha.format(date))
}

function insertarDato(fila,columna,valorColumna,dato){
    valorColumna.innerHTML = dato;
    valorColumna.classList.add('columna-borde');
    columna.appendChild(valorColumna);
    fila.appendChild(columna);
}

function agregarPromesa(){
    const fecha = document.getElementById('input-pp-fecha-carga').value;
    const date = new Date(fecha);
    alert(fecha);
}

function tablaPrueba() {
    //Formato Fecha: YYYY-MM-DD
    return [
        {
            caso: 123141243,
            id: 1231412453,
            canal: "CHAT",
            site: "MLA",
            monto: 123124,
            fechaCarga: "2025-09-25",
            fechaPago: "2025-10-02",
            tipoAcuerdo: "Condonación",
            nombreOperador: "Pepito92",
            tipoCumplimiento: "En curso"
        },
        {
            caso: 123141243,
            id: 123143435,
            canal: "OFFLINE",
            site: "MLM",
            monto: 123124,
            fechaCarga: "2025-10-25",
            fechaPago: "2025-10-27",
            tipoAcuerdo: "Pago parcial",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Cumplida"
        },
        {
            caso: 543636364,
            id: 123143435,
            canal: "C2C",
            site: "MLC",
            monto: 123124,
            fechaCarga: "2025-10-31",
            fechaPago: "2025-11-04",
            tipoAcuerdo: "Parcelamento",
            nombreOperador: "Santiago",
            tipoCumplimiento: "Incumplida"
        }
    ];
}