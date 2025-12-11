const apiUrl = 'http://localhost:8080/';

export async function iniciarSesion(nombreUsuario,contrasenia){
    const bodyLogin = {
        "nombreUsuario": nombreUsuario,
        "contrasenia": contrasenia
    }

    await fetch(apiUrl + 'auth/login', {
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
            if (response.status === 401) {
                throw new Error("Credenciales incorrectas");
            }
            else{
               throw new Error("ERROR HTTP: " + response.status);
            }
        }
        })
        .then(data => {
            document.cookie = `session_token=${data.token}; path=/; max-age=86400`;
            window.location.href = "/main.html";
        })
        .catch(error => {
            throw error
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
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.text();
    })
        .then(data => {
            console.log(data); // Procesa los datos
        })
        .catch(error => {
            throw error;
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
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
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
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}


export async function getPromesas(token,query) {
    var responseBody;
    await fetch(apiUrl + 'promesa'+query,{
        method: 'Get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}

export async function agregarPromesa(token,promesa) {
    var responseBody;
    await fetch(apiUrl + 'promesa',{
        method: 'POST',
        body: JSON.stringify(promesa),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}

export async function modificarPromesa(token,id,promesa) {
    var responseBody;
    await fetch(apiUrl + 'promesa/'+id,{
        method: 'PUT',
        body: JSON.stringify(promesa),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}


export async function eliminarPromesa(token,id) {
    var responseBody;
    await fetch(apiUrl + 'promesa/'+id,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response;
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}

export async function getExcelTabla(token,tabla) {
    var responseBody;
    await fetch(apiUrl + 'promesa/excel',{
        method: 'POST',
        body: JSON.stringify(tabla),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response;
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}

export async function getEstadisticas(token,tabla) {
    var responseBody;
    await fetch(apiUrl + 'promesa/estadisticas',{
        method: 'POST',
        body: JSON.stringify(tabla),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("ERROR HTTP: " + response.status);
        }
        return response.json();
    })
    .then(data => {
            responseBody = data;
        })
    .catch(error => {
            throw error;
        });

    return responseBody;
}