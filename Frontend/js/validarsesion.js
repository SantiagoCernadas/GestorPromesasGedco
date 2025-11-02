function isCookiePresent(name) {
  const cookies = document.cookie.split(";").map(c => c.trim());
  return cookies.some(c => c.startsWith(name + "="));
}

if (!isCookiePresent("session_token") && window.location.pathname == "/Frontend/main.html") {
    window.location.replace('/Frontend/index.html');
}

if (isCookiePresent("session_token") && window.location.pathname == "/Frontend/index.html") {
    window.location.replace('/Frontend/main.html');
}