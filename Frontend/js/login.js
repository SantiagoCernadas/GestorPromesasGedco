const usuarios = [
    {
        nombreUsuario: "ext_admin",
        nombre: "admin",
        contrasenia: "123456",
        rol: "ADMIN"
    },
    {
        nombreUsuario: "ext_usuario",
        nombre: "usuario",
        contrasenia: "123456",
        rol: "USUARIO"
    }
    , {
        nombreUsuario: "ext_santiago",
        nombre: "Santiago",
        contrasenia: "123456",
        rol: "USUARIO"
    }
]

const apiUrl = 'http://localhost:8080/';






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
    const bodyLogin = {
        "nombreUsuario": document.getElementById('input-usuario').value,
        "contrasenia": document.getElementById('input-contrasenia').value
    }

    const response = await fetch(apiUrl + 'login', {
        method: 'POST',
        body: JSON.stringify(bodyLogin),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            document.getElementById("error-mensaje").textContent = ""
            return response.json();
        }
        else {
             throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        })
        .then(data => {
            document.cookie = `session_token=${data.token}; path=/; max-age=86400`;
            window.location.href = "/Frontend/main.html";
        })
        .catch(error => {
            if (error.message.includes('401')) {
                document.getElementById("error-mensaje").textContent = "Credenciales incorrectas";
            }
            else{
                document.getElementById("error-mensaje").textContent = "Error inesperado.";
            }
        });

}