const titulo = document.getElementById("titulo");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("comenzar");

function saludoPorHora() {
  const hora = new Date().getHours();

  if (hora < 12) return "Buenos dias";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

boton.addEventListener("click", (evento) => {
  evento.preventDefault();

  const nombre = window.prompt("¿Como te llamas?");

  if (!nombre || !nombre.trim()) {
    return;
  }

  const nombreLimpio = nombre.trim();

  titulo.textContent = `${saludoPorHora()}, ${nombreLimpio}`;
  mensaje.textContent =
    "Que gusto tenerte aqui. Tu pagina de bienvenida ya esta lista para personalizar.";
  boton.textContent = "Saludar de nuevo";
});
