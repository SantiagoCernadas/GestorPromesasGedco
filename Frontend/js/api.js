const apiUrl = 'http://localhost:8080/';

export async function iniciarSesion(){
    const bodyLogin = {
        "nombreUsuario": document.getElementById('input-usuario').value,
        "contrasenia": document.getElementById('input-contrasenia').value
    }

    const response = await fetch(apiUrl + 'auth/login', {
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
            window.location.href = "/main.html";
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

export async function getPrueba(token) {

    await fetch(apiUrl + 'helloSeguro', {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.text();
    })
        .then(data => {
            console.log(data); // Procesa los datos
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

export async function getDatosUsuario(token) {
    var responseBody;
    await fetch(apiUrl + 'usuario', {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });

    return responseBody;
}

export async function getOperadores(token) {
    var responseBody;
    await fetch(apiUrl + 'usuario/operadores', {
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });

    return responseBody;
}