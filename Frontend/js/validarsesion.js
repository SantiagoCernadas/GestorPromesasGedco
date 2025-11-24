function isCookiePresent(name) {
  const cookies = document.cookie.split(";").map(c => c.trim());
  return cookies.some(c => c.startsWith(name + "="));
}

if (!isCookiePresent("session_token") && window.location.pathname == "/main.html") {
    window.location.replace('/index.html');
}

if (isCookiePresent("session_token") && window.location.pathname == "/index.html") {
    window.location.replace('/main.html');
}