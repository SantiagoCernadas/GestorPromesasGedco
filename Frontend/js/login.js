const botonLogin = document.getElementById('boton-login');
const inputUsuarioDoc = document.getElementById('input-usuario');
const inputContraDoc = document.getElementById('input-contrasenia');

const usuarios = [
    {
        nombreUsuario: "ext_admin",
        nombre: "prueba1",
        contrasenia: "123456",
        rol:"ADMIN"
    },
    {
        nombreUsuario: "ext_usuario",
        nombre: "prueba2",
        contrasenia: "123456",
        rol:"USUARIO"
    }
    ,{
        nombreUsuario: "ext_santiago",
        nombre: "pruebacontra",
        contrasenia: "123456",
        rol:"USUARIO"
    }
]

botonLogin.addEventListener('click',iniciarSesion);
inputUsuarioDoc.addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        iniciarSesion();
    }
})
inputContraDoc.addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        iniciarSesion();
    }
})

function iniciarSesion(){
    const inputUsuario = inputUsuarioDoc.value;
    const inputContrasenia = inputContraDoc.value;
    usuarioEncontrado = false;
    usuarios.forEach((usuario,i) =>{
        if(usuario.nombreUsuario == inputUsuario){
            usuarioEncontrado = true
            if(usuario.contrasenia == inputContrasenia){
                window.location.href = "/Frontend/main.html";
            }
            else{
                document.getElementById("error-mensaje").innerHTML = "Contraseña Incorrecta."
            }
        }
    });
    if(!usuarioEncontrado){
        document.getElementById("error-mensaje").innerHTML = "Usuario inexistente."
    }

}