import * as api from './api.js';


const botonLogin = document.getElementById('boton-login');
const inputUsuarioDoc = document.getElementById('input-usuario');
const inputContraDoc = document.getElementById('input-contrasenia');

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
  document.getElementById("loader").classList.remove("hidden");
}

function ocultarLoader() {
  document.getElementById("loader").classList.add("hidden");
}
