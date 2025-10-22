if(localStorage.getItem('sesionUsuario') == null && window.location.pathname == "/Frontend/main.html"){
    window.location.replace('/Frontend/index.html');
}

if(localStorage.getItem('sesionUsuario') != null && window.location.pathname == "/Frontend/index.html"){
    window.location.replace('/Frontend/main.html');
}