(() => {
  const canvas = document.getElementById("particulas");
  const ctx = canvas.getContext("2d");

  const COLOR = "37, 99, 235";
  const DISTANCIA_MAX = 120;
  const VELOCIDAD = 0.35;

  let particulas = [];
  let ancho = 0;
  let alto = 0;
  let animacionId = 0;

  function cantidadParticulas() {
    return Math.max(28, Math.floor((ancho * alto) / 18000));
  }

  function crearParticula() {
    return {
      x: Math.random() * ancho,
      y: Math.random() * alto,
      vx: (Math.random() - 0.5) * VELOCIDAD,
      vy: (Math.random() - 0.5) * VELOCIDAD,
      radio: Math.random() * 1.8 + 0.8,
    };
  }

  function redimensionar() {
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho;
    canvas.height = alto;

    const total = cantidadParticulas();
    particulas = Array.from({ length: total }, crearParticula);
  }

  function mover(particula) {
    particula.x += particula.vx;
    particula.y += particula.vy;

    if (particula.x < 0 || particula.x > ancho) particula.vx *= -1;
    if (particula.y < 0 || particula.y > alto) particula.vy *= -1;
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);

    for (let i = 0; i < particulas.length; i += 1) {
      const a = particulas[i];
      mover(a);

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 0.55)`;
      ctx.fill();

      for (let j = i + 1; j < particulas.length; j += 1) {
        const b = particulas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < DISTANCIA_MAX) {
          const opacidad = 1 - distancia / DISTANCIA_MAX;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${COLOR}, ${opacidad * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animacionId = requestAnimationFrame(dibujar);
  }

  window.addEventListener("resize", redimensionar);
  redimensionar();
  dibujar();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animacionId);
  });
})();
