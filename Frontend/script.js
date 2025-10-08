const botonContenedorAgregarPP= document.getElementById("boton-contenedor-agregar");
const botonContenedorFiltros = document.getElementById("boton-contenedor-filtros");

const contenedorAgregarPP = document.querySelector('.contenedor-agregar-promesa');
const contenedorFiltros = document.querySelector('.filtros-contenedor');

botonContenedorAgregarPP.addEventListener('click',() => {
    if(contenedorAgregarPP.style.display == 'flex'){
        contenedorAgregarPP.style.display = 'none';
    }
    else{
        contenedorAgregarPP.style.display = 'flex';
    }
});

botonContenedorFiltros.addEventListener('click',() => {
    if(contenedorFiltros.style.display == 'flex'){
        contenedorFiltros.style.display = 'none';
    }
    else{
        contenedorFiltros.style.display = 'flex';
    }
});