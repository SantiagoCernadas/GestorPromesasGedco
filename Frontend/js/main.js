import * as api from "./api.js";

const botonContenedorAgregarPP = document.getElementById("boton-contenedor-agregar");
const botonContenedorFiltros = document.getElementById("boton-contenedor-filtros");
const botonAgregarPromesa = document.getElementById("boton-agregar");
//const botonAgregarPromesaExcel = document.getElementById("boton-agregar-excel");
const botonObtenerEstadisticas = document.getElementById("boton-estadisticas");
const mensajePP = document.getElementById("pp-mensaje");
const contenedorAgregarPP = document.querySelector('.contenedor-agregar-promesa');
const contenedorFiltros = document.querySelector('.filtros-contenedor');


const botonCerrarSesion = document.getElementById("boton-cerrar-sesion");
const botonDescargarExcel = document.getElementById("boton-descargar-excel");
let sesiónCerrada = false;

const botonFiltrar = document.getElementById('boton-filtrar');
let paginaActual = 1;
const cantFilasPagina = 18;

let listaPromesas;
let totalPaginas;
const botonAnteriorPaginacion = document.getElementById('boton-paginacion-anterior');
const botonSiguientePaginacion = document.getElementById('boton-paginacion-siguiente');

const loader = document.getElementById("loader");

const modalEditar = document.getElementById('modal-editar-pp');
const modalEstadisticas = document.getElementById('modal-estadisticas');
const modalEliminar = document.getElementById('modal-eliminar');
const modalUsuarios = document.getElementById("modal-usuarios");

const modalAgregarUsuario = document.getElementById("modal-agregar-usuario");
const botonAgregarUsuario = document.getElementById('agregar-usuarios');
const botonCancelarAgregarUsuario = document.getElementById("boton-cancelar-agregar-usuario");
const botonAgregarUsuarioGuardar = document.getElementById("boton-agregar-usuario");

const modalEditarUsuario = document.getElementById("modal-editar-usuario");
const botonCancelarEditarUsuario = document.getElementById("boton-editar-cerrar-usuario");
const botonEditarUsuarioGuardar = document.getElementById("boton-editar-usuario");



const modalEliminarUsuario = document.getElementById("modal-eliminar-usuario");
const botonCancelarEliminarUsuario = document.getElementById("boton-cerrar-usuario");
const botonEliminarUsuario = document.getElementById("boton-eliminar-usuario");

const modalNuevaContraseniaUsuario = document.getElementById("modal-contrasenia-usuario");
const botonCancelarNuevaContrasenia = document.getElementById("boton-cerrar-contrasenia");
const botonNuevaContraseniaUsuario = document.getElementById("boton-nueva-contrasenia-usuario");

const modalAlert = document.getElementById('modal-alert');


const botonGuardarEditar = document.getElementById('boton-guardar-editar');
const botonCerrarEstadistica = document.getElementById("boton-cerrar-estadisticas");

const botonCerrarEliminar = document.getElementById("boton-cerrar-eliminar");
const botonConfirmarEliminar = document.getElementById("boton-confirmar-eliminar");

const mensajeAlert = document.getElementById("mensaje-alert-dialog");
const botonAceptarAlert = document.getElementById('boton-cerrar-alert');

const botonCerrarUsuarios = document.getElementById('boton-cerrar-usuarios');
const botonBuscarUsuarios = document.getElementById('boton-buscar-usuarios');


const filtroOperadorInput = document.getElementById("input-filtro-operador");
const agregarPPOperadorInput = document.getElementById("input-pp-operador");
const editarPPOperadorInput = document.getElementById("input-pp-operador-edit");
let listaUsuarios;
const inputBuscarUsuario = document.getElementById('input-buscar-usuarios');

let idEdit;
let idEliminar = 0;

var filtros = getFiltros();
const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("session_token="))
    ?.split("=")[1];


let datosUsuario;
let usuarios;

try {
    mostrarLoader();
    datosUsuario = await api.getDatosUsuario(token);
    usuarios = await api.getOperadores(token);
    printTablaOperadores();
    filtrarPromesas(filtros);
    document.getElementById("nombre-operador-span").textContent = datosUsuario.nombre;
    if (datosUsuario.rol === "ADMIN") {
        printGestionUsuarios();
    }
}
catch (err) {
    if (err.message == 403) {
        cerrarSesion();
    }
    else {
        alert("ERROR INESPERADO");
        cerrarSesion();
    }
}
finally {
    ocultarLoader();
}






function printTablaOperadores() {
    limpiarTablasOpcionesOperador();
    insertarOpcionTodos();
    printOperadoresTablas();
}

function limpiarTablasOpcionesOperador() {
    agregarPPOperadorInput.innerHTML = '';
    filtroOperadorInput.innerHTML = '';
    editarPPOperadorInput.innerHTML = '';
}

function printGestionUsuarios() {
    const nav = document.querySelector('nav');
    const botonUsuarios = document.createElement("button");
    botonUsuarios.textContent = "Gestionar Usuarios";


    botonUsuarios.addEventListener('click', async () => {
        inputBuscarUsuario.value = "";
        modalUsuarios.showModal();
        generarLista();
    })

    botonBuscarUsuarios.addEventListener('click', async () => {
        await generarLista();
    });

    inputBuscarUsuario.addEventListener('keydown', async function (event) {
        if (event.key === 'Enter') {
            await generarLista();
        }
    })


    botonCerrarUsuarios.addEventListener('click', () => {
        modalUsuarios.close();
    })

    botonAgregarUsuario.addEventListener('click', () => {
        modalAgregarUsuario.showModal();
    })

    botonCancelarAgregarUsuario.addEventListener('click', () => {
        modalAgregarUsuario.close();
    });

    botonCancelarEditarUsuario.addEventListener('click', () => {
        modalEditarUsuario.close();
    });

    botonCancelarEliminarUsuario.addEventListener('click', () => {
        modalEliminarUsuario.close();
    });

    botonCancelarNuevaContrasenia.addEventListener('click', () => {
        modalNuevaContraseniaUsuario.close();
    });



    botonAgregarUsuarioGuardar.addEventListener('click', async () => {
        await agregarUsuario();
    })

    nav.insertBefore(botonUsuarios, nav.firstChild);
}

async function agregarUsuario() {
    const nuevoUsuario = {
        nombre: document.getElementById("input-usuario-nombre").value,
        nombreUsuario: document.getElementById("input-usuario-nombreUsuario").value,
        rol: document.getElementById("input-usuario-rol").value,
        contrasenia: document.getElementById("input-usuario-contraseña").value,
        confirmaContrasenia: document.getElementById("input-usuario-confirmar-contraseña").value
    }

    let validarU = validarUsuario(nuevoUsuario);

    if (!validarU.sinError) {
        generarAlert(validarU.mensaje.innerHTML, "red");
        return;
    }

    let nuevoUsuarioApi;
    try {
        mostrarLoader()
        nuevoUsuarioApi = await api.agregarUsuario(token, nuevoUsuario);
        listaUsuarios.unshift(nuevoUsuarioApi);
        usuarios.unshift(nuevoUsuarioApi);
        printListaUsuarios();
        printTablaOperadores();
        generarAlert("Usuario Generado Correctamente.", "green");
        document.getElementById("input-usuario-nombre").value = "";
        document.getElementById("input-usuario-nombreUsuario").value = "";
        document.getElementById("input-usuario-contraseña").value = "";
        document.getElementById("input-usuario-confirmar-contraseña").value = ""
        document.getElementById("input-usuario-rol").value = "OPERADOR";
        modalAgregarUsuario.close();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert('No fue posible agregar el usuario: ' + err.message, 'red');
        }
    }
    finally {
        ocultarLoader();
    }
}

function validarUsuario(usuario) {
    var validacion = {
        sinError: true,
        mensaje: document.createElement("p")
    }

    if (usuario.nombre == '') {
        validacion.mensaje.innerHTML += 'Ingresar nombre. <br>'
        validacion.sinError = false;
    }
    if (usuario.nombreUsuario == '') {
        validacion.mensaje.innerHTML += 'Ingresar Usuario. <br>'
        validacion.sinError = false;
    }
    if (usuario.contrasenia == '' || usuario.confirmaContrasenia == '') {
        validacion.mensaje.innerHTML += 'Ingresar Contraseña. <br>'
        validacion.sinError = false;
    }
    else if (usuario.contrasenia !== usuario.confirmaContrasenia) {
        validacion.mensaje.innerHTML += 'Las contraseñas no son iguales. <br>';
        validacion.sinError = false;
    }
    if (usuario.rol !== 'SUPERVISOR' && usuario.rol !== 'OPERADOR') {
        validacion.mensaje.innerHTML += 'Rol invalido. <br>';
        validacion.sinError = false;
    }

    return validacion;
}

function validarUsuarioEdit(usuario) {
    var validacion = {
        sinError: true,
        mensaje: document.createElement("p")
    }

    if (usuario.nombre == '') {
        validacion.mensaje.innerHTML += 'Ingresar nombre. <br>'
        validacion.sinError = false;
    }
    if (usuario.nombreUsuario == '') {
        validacion.mensaje.innerHTML += 'Ingresar Usuario. <br>'
        validacion.sinError = false;
    }
    if (usuario.rol !== 'SUPERVISOR' && usuario.rol !== 'OPERADOR') {
        validacion.mensaje.innerHTML += 'Rol invalido. <br>';
        validacion.sinError = false;
    }

    return validacion;
}

function validarContraseniaUsuario(usuario){
     var validacion = {
        sinError: true,
        mensaje: document.createElement("p")
    }

    if (usuario.contrasenia == '' || usuario.confirmaContrasenia == '') {
        validacion.mensaje.innerHTML += 'Ingresar Contraseña. <br>'
        validacion.sinError = false;
    }
    else if (usuario.contrasenia !== usuario.confirmaContrasenia) {
        validacion.mensaje.innerHTML += 'Las contraseñas no son iguales. <br>';
        validacion.sinError = false;
    }

    return validacion;
}

async function generarLista() {
    try {
        mostrarLoader();
        listaUsuarios = await buscarUsuarios(inputBuscarUsuario.value);
        printListaUsuarios();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert("No fue posible generar la tabla: " + err.message, "red");
        }
    }
    finally {
        ocultarLoader();
    }
}



function printListaUsuarios() {
    const contenedorUsuarios = document.querySelector('.contenedor-usuarios');
    contenedorUsuarios.innerHTML = '';
    listaUsuarios.forEach((usuario, i) => {
        const contenedorUsuario = document.createElement('div');
        contenedorUsuario.classList.add('contenedor-usuario-info');
        const infoUsuario = document.createElement('div');
        infoUsuario.classList.add('info-usuario');
        const nombre = document.createElement('p');
        const nombreUsuario = document.createElement('p');
        const rol = document.createElement('p');
        nombre.textContent = usuario.nombre;
        nombreUsuario.textContent = "(" + usuario.nombreUsuario + ")";
        rol.textContent = usuario.rol;

        const botonesUsuario = document.createElement('div');
        botonesUsuario.classList.add('botones-usuario');
        const botonEditar = document.createElement('button');
        const botonEliminar = document.createElement('button');
        const botonNuevaContrasenia = document.createElement('button');

        botonEditar.addEventListener('click', () => {
            idEdit = usuario.id;
            printModalEditarUsuario(usuario);

        })

        botonEliminar.addEventListener('click', () => {
            printModalEliminar(usuario);
        })

        botonNuevaContrasenia.addEventListener('click', () => {
            printModalNuevaContrasenia(usuario);
        })

        botonEditar.textContent = "Editar";
        botonEliminar.textContent = "Eliminar";
        botonNuevaContrasenia.textContent = "Nueva contraseña";

        infoUsuario.appendChild(nombre);
        infoUsuario.appendChild(nombreUsuario);
        infoUsuario.appendChild(rol);
        botonesUsuario.appendChild(botonEditar);
        botonesUsuario.appendChild(botonEliminar);
        botonesUsuario.appendChild(botonNuevaContrasenia);
        contenedorUsuario.appendChild(infoUsuario);
        contenedorUsuario.appendChild(botonesUsuario);
        contenedorUsuarios.appendChild(contenedorUsuario);
    })
}

function printModalEditarUsuario(usuario) {
    idEdit = usuario.id;
    document.getElementById("input-editar-usuario-nombreUsuario").value = usuario.nombreUsuario;
    document.getElementById("input-editar-usuario-nombre").value = usuario.nombre;
    document.getElementById("input-usuario-editar-rol").value = usuario.rol;
    modalEditarUsuario.showModal();
}

botonEditarUsuarioGuardar.addEventListener('click', async () => {
    const usuarioEditado = {
        nombre: document.getElementById("input-editar-usuario-nombre").value,
        nombreUsuario: document.getElementById("input-editar-usuario-nombreUsuario").value,
        rol: document.getElementById("input-usuario-editar-rol").value
    }

    const validacionUsuario = validarUsuarioEdit(usuarioEditado);

    if (!validacionUsuario.sinError) {
        generarAlert(validacionUsuario.mensaje.innerHTML, "red");
        return;
    }

    let usuarioEditadoApi;
    try {
        mostrarLoader()
        usuarioEditadoApi = await api.modificarUsuario(token, idEdit, usuarioEditado);
        var usuario = listaUsuarios.find(u => u.id === idEdit);
        if (usuario) {
            usuario.nombreUsuario = usuarioEditadoApi.nombreUsuario;
            usuario.nombre = usuarioEditadoApi.nombre;
            usuario.rol = usuarioEditadoApi.rol;
        }
        usuario = usuarios.find(u => u.id === idEdit);
        if (usuario) {
            usuario.nombreUsuario = usuarioEditadoApi.nombreUsuario;
            usuario.nombre = usuarioEditadoApi.nombre;
            usuario.rol = usuarioEditadoApi.rol;
        }

        printListaUsuarios();
        printTablaOperadores();
        filtrarPromesas(filtros);
        generarAlert("Usuario Modificado Correctamente.", "green");
        modalEditarUsuario.close();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert('No fue posible editar el usuario: ' + err.message, 'red');
        }
    }
    finally {
        ocultarLoader();
    }






})

function printModalEliminar(usuario) {
    idEliminar = usuario.id;
    document.getElementById("nombre-usuario-eliminar").textContent = usuario.nombreUsuario;
    document.getElementById("input-eliminar-usuario-confirmar").value = "";
    modalEliminarUsuario.showModal();
}

botonEliminarUsuario.addEventListener('click', async () => {
    if(document.getElementById("input-eliminar-usuario-confirmar").value.toLowerCase() !== "confirmar"){
        return;
    }
    eliminarUsuario(idEliminar);
})

async function eliminarUsuario(id){
    try {
        mostrarLoader();
        await api.eliminarUsuario(token, id);
        listaUsuarios = listaUsuarios.filter(u => !(u.id === id));
        usuarios = usuarios.filter(u => !(u.id === id));
        modalEliminarUsuario.close();
        generarAlert("Usuario eliminado correctamente.", "green")
        printListaUsuarios();
        printTablaOperadores();
        filtrarPromesas(filtros);
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        } else {
            generarAlert("No fue posible eliminar al usuario: " + err.message, "red");
        }
    }
    finally {
        ocultarLoader();
    }
}

botonNuevaContraseniaUsuario.addEventListener('click', async () => {
    modificarContraseniaUsuario(idEdit);
})

async function modificarContraseniaUsuario(id){

    const usuarioEditado = {
        contrasenia: document.getElementById("input-usuario-nueva-contraseña").value,
        confirmaContrasenia: document.getElementById("input-usuario-confirmar-nueva-contraseña").value
    }

    const validarUsuario = validarContraseniaUsuario(usuarioEditado);
    if(!validarUsuario.sinError){
        generarAlert(validarUsuario.mensaje.innerHTML,"red");
        return;
    }

    try {
        mostrarLoader()
        await api.modificarContraseniaUsuario(token, id, usuarioEditado);
        generarAlert("Contraseña modificada correctamente.", "green");
        modalNuevaContraseniaUsuario.close();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert('No fue posible modificar la contraseña: ' + err.message, 'red');
        }
    }
    finally {
        ocultarLoader();
    }
}

function printModalNuevaContrasenia(usuario){
    idEdit = usuario.id;
    document.getElementById("nombre-usuario-contrasenia").textContent = usuario.nombreUsuario;
    document.getElementById("input-usuario-nueva-contraseña").value = "";
    document.getElementById("input-usuario-confirmar-nueva-contraseña").value = "";
    modalNuevaContraseniaUsuario.showModal();
}

function printOperadoresTablas() {
    usuarios.forEach((usuario, i) => {
        const opcionPP = document.createElement('option');
        const opcionFiltro = document.createElement('option');
        const opcionEditar = document.createElement('option');
        opcionPP.value = usuario.id;
        opcionPP.textContent = usuario.nombre;
        opcionFiltro.value = usuario.id;
        opcionFiltro.textContent = usuario.nombre;
        opcionEditar.value = usuario.id;
        opcionEditar.textContent = usuario.nombre;
        agregarPPOperadorInput.add(opcionPP);
        filtroOperadorInput.add(opcionFiltro);
        editarPPOperadorInput.add(opcionEditar);
    })

}

async function buscarUsuarios(nombre) {
    try {
        mostrarLoader();
        const Usuarios = await api.getUsuarios(token, "?nombre=" + nombre);
        return Usuarios;
    }
    catch (err) {
        throw err;
    }
    finally {
        ocultarLoader();
    }
}

function insertarOpcionTodos() {
    if (datosUsuario.rol !== "OPERADOR") {
        const opcionPP = document.createElement('option');
        const opcionFiltro = document.createElement('option');
        const opcionEditar = document.createElement('option');
        opcionPP.value = "-";
        opcionPP.textContent = "-";
        opcionFiltro.value = "-";
        opcionFiltro.textContent = "Todos";
        opcionEditar.textContent = "-";
        opcionEditar.value = "-";
        agregarPPOperadorInput.insertBefore(opcionPP, agregarPPOperadorInput.firstChild);
        filtroOperadorInput.insertBefore(opcionFiltro, filtroOperadorInput.firstChild);
        editarPPOperadorInput.insertBefore(opcionEditar, editarPPOperadorInput.firstChild);
    }
}

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

botonFiltrar.addEventListener('click', () =>{
    filtros = getFiltros();
    filtrarPromesas(filtros);
})

async function filtrarPromesas(filtros) {
    var query = "?1=1";
    if (!isNaN(filtros.caso)) {
        query += "&caso=" + filtros.caso;
    }
    if (!isNaN(filtros.id)) {
        query += "&usuarioML=" + filtros.id;
    }
    if (filtros.canal != '-') {
        query += "&canal=" + filtros.canal;
    }
    if (filtros.site != '-') {
        query += "&site=" + filtros.site;
    }
    if (filtros.tipoAcuerdo != '-') {
        query += "&tipoAcuerdo=" + filtros.tipoAcuerdo;
    }
    if (filtros.tipoCumplimiento != '-') {
        query += "&tipoCumplimiento=" + filtros.tipoCumplimiento;
    }

    if (filtros.fechaCargaDesde != '' && filtros.fechaCargaHasta == '') {
        filtros.fechaCargaHasta = filtros.fechaCargaDesde;
        document.getElementById('input-filtro-fecha-carga-hasta').value = filtros.fechaCargaHasta
    }
    else if (filtros.fechaCargaDesde == '' && filtros.fechaCargaHasta != '') {
        filtros.fechaCargaDesde = filtros.fechaCargaHasta;
        document.getElementById('input-filtro-fecha-carga-desde').value = filtros.fechaCargaDesde;

    }
    else if (filtros.fechaCargaDesde != '' && filtros.fechaCargaHasta != '') {
        var fechaDesde = new Date(filtros.fechaCargaDesde);
        var fechaHasta = new Date(filtros.fechaCargaHasta);
        if (fechaHasta < fechaDesde) {
            fechaHasta = fechaDesde;
            filtros.fechaCargaHasta = filtros.fechaCargaDesde;
            document.getElementById('input-filtro-fecha-carga-hasta').value = filtros.fechaCargaDesde;
        }
    }
    else {
        const hoy = new Date();

        const mesAntes = new Date();
        mesAntes.setMonth(hoy.getMonth() - 3);

        const format = (fecha) => {
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, "0");
            const day = String(fecha.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        filtros.fechaCargaDesde = format(mesAntes);
        filtros.fechaCargaHasta = format(hoy);
        document.getElementById('input-filtro-fecha-carga-hasta').value = filtros.fechaCargaHasta;
        document.getElementById('input-filtro-fecha-carga-desde').value = filtros.fechaCargaDesde;
    }

    query += "&fechaCargaDesde=" + filtros.fechaCargaDesde;
    query += "&fechaCargaHasta=" + filtros.fechaCargaHasta;

    if (!isNaN(filtros.operador)) {
        query += "&operador=" + filtros.operador;
    }

    if (filtros.duplica) {
        query += "&duplica=" + filtros.duplica;
    }

    try {
        mostrarLoader()
        const PromesasFiltros = await api.getPromesas(token, query);
        listaPromesas = PromesasFiltros;
        printTablaHTML();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert("No fue posible generar la tabla: " + err.message, "red");
        }
    }
    finally {
        ocultarLoader();
    }

}

const formatFecha = new Intl.DateTimeFormat("es", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})


const tabla = document.querySelector('.tabla').querySelector('tbody');


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



/*
botonAgregarPromesaExcel.addEventListener('click', () => {
    alert("Proximamente");
})
*/

botonCerrarSesion.addEventListener('click', () => {
    cerrarSesion();
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

    const ppsPaginaActual = listaPromesas.slice(inicio, fin);



    ppsPaginaActual.forEach((filaTabla, i) => {
        const fila = document.createElement('tr');
        fila.id = 'tabla-fila-' + i;
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.numCaso, 'columna');
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.idUsuarioML);
        insertarCanal(fila, document.createElement('td'), document.createElement('p'), filaTabla.canal);
        insertarSite(fila, document.createElement('td'), document.createElement('p'), filaTabla.site);
        insertarMonto(fila, document.createElement('td'), document.createElement('p'), filaTabla.monto);
        insertarFecha(fila, document.createElement('td'), document.createElement('p'), filaTabla.fechaCarga);
        insertarFecha(fila, document.createElement('td'), document.createElement('p'), filaTabla.fechaPago);
        insertarTipoAcuerdo(fila, document.createElement('td'), document.createElement('p'), filaTabla.tipoAcuerdo);
        insertarDato(fila, document.createElement('td'), document.createElement('p'), filaTabla.operador);
        insertarTipoCumplimiento(fila, document.createElement('td'), document.createElement('p'), filaTabla.cumplimiento);
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
            modalEliminarPromesa(filaTabla);
        });
        botonEditar.addEventListener('click', () => {
            modalEditarPromesa(filaTabla)
        });

    });
}

function modalEditarPromesa(filaTabla) {
    idEdit = filaTabla.id;
    document.getElementById("input-pp-caso-edit").value = filaTabla.numCaso;
    document.getElementById("input-pp-id-edit").value = filaTabla.idUsuarioML;
    document.getElementById("input-pp-canal-edit").value = filaTabla.canal;
    document.getElementById("input-pp-site-edit").value = filaTabla.site;
    document.getElementById("input-pp-monto-edit").value = filaTabla.monto;
    document.getElementById("input-pp-fecha-carga-edit").value = filaTabla.fechaCarga;
    document.getElementById("input-pp-fecha-pago-edit").value = filaTabla.fechaPago;
    document.getElementById("input-pp-tipo-acuerdo-edit").value = filaTabla.tipoAcuerdo;
    document.getElementById("input-pp-operador-edit").value = getIdOperador(filaTabla.operador);
    document.getElementById("input-pp-cumplimiento-edit").value = filaTabla.cumplimiento;
    modalEditar.showModal();
}

function modalEliminarPromesa(filaTabla) {
    idEliminar = filaTabla.id;
    document.getElementById("eliminar-dato-caso").textContent = filaTabla.numCaso;
    document.getElementById("eliminar-dato-id").textContent = filaTabla.idUsuarioML;
    document.getElementById("eliminar-dato-canal").textContent = filaTabla.canal;
    document.getElementById("eliminar-dato-site").textContent = filaTabla.site;
    document.getElementById("eliminar-dato-monto").textContent = filaTabla.monto;

    const dateFechaCarga = new Date(filaTabla.fechaCarga);
    dateFechaCarga.setMinutes(dateFechaCarga.getMinutes() + dateFechaCarga.getTimezoneOffset());
    document.getElementById("eliminar-dato-fechacarga").textContent = formatFecha.format(dateFechaCarga);

    const dateFechaPago = new Date(filaTabla.fechaPago);
    dateFechaPago.setMinutes(dateFechaPago.getMinutes() + dateFechaPago.getTimezoneOffset());
    document.getElementById("eliminar-dato-fechapago").textContent = formatFecha.format(dateFechaPago);

    document.getElementById("eliminar-dato-acuerdo").textContent = filaTabla.tipoAcuerdo;
    document.getElementById("eliminar-dato-operador").textContent = filaTabla.operador;
    document.getElementById("eliminar-dato-cumplimiento").textContent = filaTabla.cumplimiento;
    modalEliminar.showModal()
}

async function eliminarPromesa(id) {
    try {
        mostrarLoader();
        await api.eliminarPromesa(token, id);
        listaPromesas = listaPromesas.filter(promesa => !(promesa.id === id));
        modalEliminar.close();
        generarAlert("Promesa eliminada correctamente.", "green")
        const totalPaginas = Math.ceil(listaPromesas.length / cantFilasPagina);
        if (paginaActual > totalPaginas) {
            paginaActual = totalPaginas
        };
        printTablaHTML();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        } else {
            generarAlert("No fue posible eliminar la promesa: " + err.message, "red");
        }
    }
    finally {
        ocultarLoader();
    }
}

function getIdOperador(nombreOperador) {
    return usuarios.filter(u => u.nombre == nombreOperador)[0].id;
}

function getNombreOperador(idOperador) {
    return usuarios.filter(u => u.id == idOperador)[0].nombre;
}


function renderPaginacion() {
    totalPaginas = Math.ceil(listaPromesas.length / cantFilasPagina);

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas
    }
    else if (paginaActual <= 0) {
        if (listaPromesas.length >= 1) {
            paginaActual = 1;
        }
    }
    const paginaActualParrafo = document.getElementById('paginacion').querySelector('p');
    paginaActualParrafo.innerHTML = "Pagina " + paginaActual + " de " + totalPaginas + "<br> (" + listaPromesas.length + " promesas)";

}

botonAnteriorPaginacion.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual = paginaActual - 1;
        printTablaHTML();
    }
});

botonSiguientePaginacion.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        paginaActual = paginaActual + 1;
        printTablaHTML();
    }
});

botonGuardarEditar.addEventListener('click', async () => {



    const promesaEdit = {
        numCaso: parseInt(document.getElementById("input-pp-caso-edit").value),
        idUsuarioML: parseInt(document.getElementById("input-pp-id-edit").value),
        canal: document.getElementById("input-pp-canal-edit").value,
        site: document.getElementById("input-pp-site-edit").value,
        monto: parseMonto(document.getElementById("input-pp-monto-edit").value),
        fechaCarga: document.getElementById("input-pp-fecha-carga-edit").value,
        fechaPago: document.getElementById("input-pp-fecha-pago-edit").value,
        tipoAcuerdo: document.getElementById("input-pp-tipo-acuerdo-edit").value,
        operador: parseInt(document.getElementById("input-pp-operador-edit").value),
        cumplimiento: document.getElementById("input-pp-cumplimiento-edit").value
    }


    let promesaCorrecta = validarPromesa(promesaEdit);

    if (!promesaCorrecta.sinError) {
        generarAlert(promesaCorrecta.mensaje.innerHTML, "red");
        return;
    }

    try {
        mostrarLoader();
        await api.modificarPromesa(token, idEdit, promesaEdit);
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert("No fue posible modificar la promesa: " + err.message, "red");
        }
        return;
    }
    finally {
        ocultarLoader();
    }


    var promesa = listaPromesas.find(p => p.id === idEdit);
    if (promesa) {
        promesa.numCaso = promesaEdit.numCaso;
        promesa.idUsuarioML = promesaEdit.idUsuarioML;
        promesa.canal = promesaEdit.canal;
        promesa.site = promesaEdit.site;
        promesa.monto = promesaEdit.monto;
        promesa.fechaCarga = promesaEdit.fechaCarga;
        promesa.fechaPago = promesaEdit.fechaPago;
        promesa.tipoAcuerdo = promesaEdit.tipoAcuerdo;
        promesa.operador = getNombreOperador(promesaEdit.operador);
        promesa.cumplimiento = promesaEdit.cumplimiento;
    }

    modalEditar.close();
    generarAlert("Promesa modificada correctamente.", "green")
    printTablaHTML();
});

botonConfirmarEliminar.addEventListener('click', () => {
    eliminarPromesa(idEliminar);
});



document.getElementById('boton-cancelar-editar').addEventListener('click', () => {
    modalEditar.close();
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
        minimumFractionDigits: 2,
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


async function agregarPromesa() {
    mensajePP.innerHTML = '';

    const nuevaPromesa = {
        numCaso: parseInt(document.getElementById("input-pp-caso").value),
        idUsuarioML: parseInt(document.getElementById("input-pp-id").value),
        canal: document.getElementById("input-pp-canal").value,
        site: document.getElementById("input-pp-site").value,
        monto: parseMonto(document.getElementById("input-pp-monto").value),
        fechaCarga: document.getElementById("input-pp-fecha-carga").value,
        fechaPago: document.getElementById("input-pp-fecha-pago").value,
        tipoAcuerdo: document.getElementById("input-pp-tipo-acuerdo").value,
        operador: parseInt(document.getElementById("input-pp-operador").value),
        cumplimiento: document.getElementById("input-pp-cumplimiento").value
    }


    let validarPP = validarPromesa(nuevaPromesa);
    let nuevaPromesaApi
    if (validarPP.sinError) {
        try {
            mostrarLoader()
            nuevaPromesaApi = await api.agregarPromesa(token, nuevaPromesa);
        }
        catch (err) {
            if (err.message == 403) {
                generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
                sesiónCerrada = true;
            }
            else {
                mensajePP.innerHTML += 'No fue posible generar la promesa. ' + err.message;
                mensajePP.style.color = "red";
            }
            return;
        }
        finally {
            ocultarLoader();
        }


        listaPromesas.unshift(nuevaPromesaApi);

        mensajePP.innerHTML += '¡Promesa agregada con exito!'
        mensajePP.style.color = 'green';

        nuevaPromesa.operador = getNombreOperador(nuevaPromesa.operador);
        document.getElementById("input-pp-caso").value = '';
        document.getElementById("input-pp-id").value = '';
        document.getElementById("input-pp-canal").value = document.getElementById("input-pp-canal").options[0].value;
        document.getElementById("input-pp-site").value = document.getElementById("input-pp-site").options[0].value;
        document.getElementById("input-pp-monto").value = '';
        document.getElementById("input-pp-fecha-carga").value = '';
        document.getElementById("input-pp-fecha-pago").value = '';
        document.getElementById("input-pp-tipo-acuerdo").value = document.getElementById("input-pp-tipo-acuerdo").options[0].value;
        document.getElementById("input-pp-operador").value = filtroOperadorInput.options[0].value;
        document.getElementById("input-pp-cumplimiento").value = document.getElementById("input-pp-cumplimiento").options[0].value;
        printTablaHTML();
    }
    else {
        mensajePP.style.color = "red";
        mensajePP.innerHTML = validarPP.mensaje.innerHTML
    }
}


function validarPromesa(nuevaPromesa) {
    var validacion = {
        sinError: true,
        mensaje: document.createElement("p")
    }

    if (Number.isNaN(nuevaPromesa.numCaso)) {
        validacion.mensaje.innerHTML += 'Ingresar Numero de caso. <br>'
        validacion.sinError = false;
    }
    else if (nuevaPromesa.numCaso <= 0) {
        validacion.mensaje.innerHTML += 'El número de caso debe ser mayor a 0. <br>'
        validacion.sinError = false;
    }
    if (Number.isNaN(nuevaPromesa.idUsuarioML)) {
        validacion.mensaje.innerHTML += 'Ingresar ID.<br>'
        validacion.sinError = false;
    }
    else if (nuevaPromesa.idUsuarioML <= 0) {
        validacion.mensaje.innerHTML += 'El id debe ser mayor a 0. <br>'
        validacion.sinError = false;
    }
    if (nuevaPromesa.canal == '-') {
        validacion.mensaje.innerHTML += 'Ingresar Canal.<br>'
        validacion.sinError = false;
    }
    if (nuevaPromesa.site == '-') {
        validacion.mensaje.innerHTML += 'Ingresar Site.<br>'
        validacion.sinError = false;
    }
    if (Number.isNaN(nuevaPromesa.monto)) {
        validacion.mensaje.innerHTML += 'Monto invalido.<br>';
        validacion.sinError = false;
    }
    else if (nuevaPromesa.monto <= 0) {
        validacion.mensaje.innerHTML += 'El monto debe ser mayor a 0. <br>'
        validacion.sinError = false;
    }
    if (nuevaPromesa.fechaCarga == '') {
        validacion.mensaje.innerHTML += 'Ingresar fecha de carga valida.<br>';
        validacion.sinError = false;
    }
    if (nuevaPromesa.fechaPago == '') {
        validacion.mensaje.innerHTML += 'Ingresar fecha de pago valida.<br>'
        validacion.sinError = false;
    }
    if (nuevaPromesa.fechaCarga != '' && nuevaPromesa.fechaPago != '') {
        const difdias = diferenciaEnDias(nuevaPromesa.fechaCarga, nuevaPromesa.fechaPago);
        if (difdias > 7) {
            validacion.mensaje.innerHTML += 'La diferencia entre la fecha de carga y fecha de pago no puede ser mayor a 7 días.<br>'
            validacion.sinError = false;
        }
        else if (difdias < 0) {
            validacion.mensaje.innerHTML += 'La fecha de pago debe ser igual o posterior a la fecha de carga.<br>'
            validacion.sinError = false;
        }
    }
    if (nuevaPromesa.tipoAcuerdo == '-') {
        validacion.mensaje.innerHTML += 'Ingresar tipo de acuerdo.<br>'
        validacion.sinError = false;
    }
    if (Number.isNaN(nuevaPromesa.operador)) {
        validacion.mensaje.innerHTML += 'Ingresar nombre de operador.<br>'
        validacion.sinError = false;
    }
    return validacion;
}



//Parsear montos mexicanos o argentinos a tipo de dato FLOAT
function parseMonto(montoStr) {
    montoStr = montoStr.trim().replace(/\$/g, '');


    if (!montoStr || /[^0-9.,]/.test(montoStr)) return NaN;

    if (montoStr == '') return NaN;


    const tienePunto = montoStr.includes('.');
    const tieneComa = montoStr.includes(',');

    if (tienePunto && tieneComa) {

        if (montoStr.lastIndexOf(',') > montoStr.lastIndexOf('.')) {
            montoStr = montoStr.replace(/\./g, '').replace(',', '.');
        } else {
            montoStr = montoStr.replace(/,/g, '');
        }
    } else if (tieneComa && !tienePunto) {

        if ((montoStr.match(/,/g) || []).length > 1) {
            montoStr = montoStr.replace(/,/g, '');
        } else {
            const partes = montoStr.split(',');
            if (partes[1]?.length === 3) {
                montoStr = montoStr.replace(/,/g, '');
            } else {
                montoStr = montoStr.replace(',', '.');
            }
        }
    } else if (tienePunto && !tieneComa) {

        if ((montoStr.match(/\./g) || []).length > 1) {
            montoStr = montoStr.replace(/\./g, '');
        } else {
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

    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);

    const diffMs = f2 - f1;

    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    return diffDias;
}

botonObtenerEstadisticas.addEventListener('click', async () => {
    try {
        const estadisticas = await obtenerEstadisticas(listaPromesas)
        printEstadisticas(estadisticas)
        modalEstadisticas.showModal();
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert("No fue posible obtener las estadisticas:" + err.message, "red");
        }
    }
})

function printEstadisticas(estadisticas) {
    document.getElementById("estadisticas-cant-promesas").querySelector('span').textContent = estadisticas.cantPromesas;
    document.getElementById("estadisticas-cant-promesas-cumplidas").querySelector('span').textContent = estadisticas.cantPromesasCumplidas + " (" + (estadisticas.cantPromesasCumplidas / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-cant-promesas-incumplidas").querySelector('span').textContent = estadisticas.cantPromesasIncumplidas + " (" + (estadisticas.cantPromesasIncumplidas / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-cant-promesas-encurso").querySelector('span').textContent = estadisticas.cantPromesasEnCurso + " (" + (estadisticas.cantPromesasEnCurso / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-MLA").querySelector('span').textContent = estadisticas.cantPromesasMLA + " (" + (estadisticas.cantPromesasMLA / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-MLM").querySelector('span').textContent = estadisticas.cantPromesasMLM + " (" + (estadisticas.cantPromesasMLM / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-MLC").querySelector('span').textContent = estadisticas.cantPromesasMLC + " (" + (estadisticas.cantPromesasMLC / estadisticas.cantPromesas * 100).toFixed(2) + "%)";
    document.getElementById("estadisticas-cant-promesas-duplica").querySelector('span').textContent = estadisticas.cantPromesasDuplicadas;
    document.getElementById("estadisticas-cant-promesas-duplica-cumplidas").querySelector('span').textContent = estadisticas.cantPromesasDuplicadasCumplidas + " (" + (estadisticas.cantPromesasDuplicadas !== 0 ? (estadisticas.cantPromesasDuplicadasCumplidas / estadisticas.cantPromesasDuplicadas * 100).toFixed(2) : (0.00)) + "%)";
    document.getElementById("estadisticas-cant-promesas-duplica-incumplidas").querySelector('span').textContent = estadisticas.cantPromesasDuplicadasIncumplidas + " (" + (estadisticas.cantPromesasDuplicadas !== 0 ? (estadisticas.cantPromesasDuplicadasIncumplidas / estadisticas.cantPromesasDuplicadas * 100).toFixed(2) : (0.00)) + "%)";
    document.getElementById("estadisticas-cant-promesas-duplica-encurso").querySelector('span').textContent = estadisticas.cantPromesasDuplicadasEnCurso + " (" + (estadisticas.cantPromesasDuplicadas !== 0 ? (estadisticas.cantPromesasDuplicadasEnCurso / estadisticas.cantPromesasDuplicadas * 100).toFixed(2) : (0.00)) + "%)";
}

botonCerrarEstadistica.addEventListener('click', () => {
    modalEstadisticas.close();
})

botonCerrarEliminar.addEventListener('click', () => {
    modalEliminar.close();
})

function generarAlert(mensaje, color) {
    mensajeAlert.style.color = color
    mensajeAlert.innerHTML = mensaje;
    modalAlert.showModal();
}

botonAceptarAlert.addEventListener('click', () => {
    if (sesiónCerrada === true) {
        cerrarSesion();
    }
    modalAlert.close();
});

async function obtenerEstadisticas(tabla) {
    try {
        mostrarLoader()
        if (tabla.length == 0) {
            throw new Error("La tabla actual no tiene ninguna promesa.");
        }
        const estadisticas = await api.getEstadisticas(token, tabla);
        return estadisticas
    }
    catch (err) {
        throw err
    }
    finally {
        ocultarLoader();
    }
}

botonDescargarExcel.addEventListener('click', async () => {
    try {
        mostrarLoader();
        await descargarExcel(listaPromesas);
    }
    catch (err) {
        if (err.message == 403) {
            generarAlert("Sesión vencida. Vuelva a iniciar sesión", "blue");
            sesiónCerrada = true;
        }
        else {
            generarAlert("No fue posible exportar el excel: " + err.message, "red");
        }
    }
    finally {
        ocultarLoader();
    }

});

async function descargarExcel(tabla) {
    try {
        mostrarLoader();
        if (tabla.length == 0) {
            throw new Error("La tabla actual no tiene ninguna promesa");
        }
        const responseExcel = await api.getExcelTabla(token, tabla);
        const blob = await responseExcel.blob();
        let nombre = "plantillaPromesas.xlsx";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        a.download = nombre;

        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (err) {
        throw err;
    }
    finally {
        ocultarLoader();
    }
}

function mostrarLoader() {
    loader.showModal();
}

function ocultarLoader() {
    loader.close();
}
function cerrarSesion() {
    document.cookie = "session_token=; path=/; max-age=0;"
    window.location.href = "/index.html";
}