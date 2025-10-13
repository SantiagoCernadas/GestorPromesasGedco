const botonLogin = document.getElementById('boton-login');

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

function iniciarSesion(){
    const inputUsuario = document.getElementById('input-usuario').value;
    const inputContrasenia = document.getElementById('input-contrasenia').value;
    usuarioEncontrado = false;
    usuarios.forEach((usuario,i) =>{
        if(usuario.nombreUsuario == inputUsuario){
            usuarioEncontrado = true
            if(usuario.contrasenia == inputContrasenia){
                window.location.href = "http://127.0.0.1:5500/Frontend/main.html";
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