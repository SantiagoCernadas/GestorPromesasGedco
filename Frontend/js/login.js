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
        if (!response.ok) {
            throw new Error("Credenciales Incorrectas")
        }
        else {
            document.getElementById("error-mensaje").textContent = ""
            return response.json();
        }
    })
        .then(data => {
            document.cookie = `session_token=${data.token}; path=/; max-age=86400`;
            
            const token = document.cookie
                .split("; ")
                .find(row => row.startsWith("session_token="))
                ?.split("=")[1];
            console.log(token);
            window.location.href = "/Frontend/main.html";
        })
        .catch(error => {
            document.getElementById("error-mensaje").textContent = error.message;
        });

}