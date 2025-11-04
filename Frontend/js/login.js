import * as api from './api.js';


const botonLogin = document.getElementById('boton-login');
const inputUsuarioDoc = document.getElementById('input-usuario');
const inputContraDoc = document.getElementById('input-contrasenia');

botonLogin.addEventListener('click', iniciarSesion);
inputUsuarioDoc.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        iniciarSesion();
    }
})
inputContraDoc.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        iniciarSesion();
    }
})

async function iniciarSesion() {
    api.iniciarSesion();
}