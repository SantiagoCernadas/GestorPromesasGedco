import * as api from './api.js';


const botonLogin = document.getElementById('boton-login');
const inputUsuarioDoc = document.getElementById('input-usuario');
const inputContraDoc = document.getElementById('input-contrasenia');

const loader = document.getElementById("loader");

botonLogin.addEventListener('click', async () => {
    await inicioSesion()
});
inputUsuarioDoc.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        await inicioSesion()
    }
})
inputContraDoc.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        await inicioSesion()
    }
})


async function inicioSesion(){
    try{
        mostrarLoader();
        await api.iniciarSesion(document.getElementById('input-usuario').value,document.getElementById('input-contrasenia').value);
    }
    catch(err){
        document.getElementById("error-mensaje").textContent = err.message;
    }
    finally{
        ocultarLoader();
    }
}

function mostrarLoader() {
    loader.showModal();
}

function ocultarLoader() {
    loader.close();
}
