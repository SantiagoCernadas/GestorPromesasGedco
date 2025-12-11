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
        await api.iniciarSesion(document.getElementById('input-usuario').value,document.getElementById('input-contrasenia').value);
    }
    catch(err){
        document.getElementById("error-mensaje").textContent = err.message;
    }
}