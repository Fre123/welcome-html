(() => {
  const canvas = document.getElementById("particulas");
  const ctx = canvas.getContext("2d");
  const lienzoExplosion = document.getElementById("explosion");
  const ctxExplosion = lienzoExplosion.getContext("2d");

  const COLOR = "37, 99, 235";
  const DISTANCIA_MAX = 120;
  const VELOCIDAD = 0.35;
  const COLORES_EXPLOSION = [
    "37, 99, 235",
    "59, 130, 246",
    "96, 165, 250",
    "14, 165, 233",
    "255, 255, 255",
  ];

  let particulas = [];
  let explosion = [];
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
    lienzoExplosion.width = ancho;
    lienzoExplosion.height = alto;

    const total = cantidadParticulas();
    particulas = Array.from({ length: total }, crearParticula);
  }

  function mover(particula) {
    particula.x += particula.vx;
    particula.y += particula.vy;

    if (particula.x < 0 || particula.x > ancho) particula.vx *= -1;
    if (particula.y < 0 || particula.y > alto) particula.vy *= -1;
  }

  function crearExplosion(x, y) {
    const total = 64;

    for (let i = 0; i < total; i += 1) {
      const angulo = (Math.PI * 2 * i) / total + (Math.random() - 0.5) * 0.5;
      const velocidad = Math.random() * 8 + 3;

      explosion.push({
        x,
        y,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        radio: Math.random() * 3.4 + 1.4,
        vida: 1,
        decaimiento: Math.random() * 0.016 + 0.012,
        color: COLORES_EXPLOSION[Math.floor(Math.random() * COLORES_EXPLOSION.length)],
      });
    }
  }

  function dibujarExplosion() {
    ctxExplosion.clearRect(0, 0, ancho, alto);
    explosion = explosion.filter((particula) => particula.vida > 0);

    for (const particula of explosion) {
      particula.x += particula.vx;
      particula.y += particula.vy;
      particula.vx *= 0.95;
      particula.vy *= 0.95;
      particula.vida -= particula.decaimiento;

      const opacidad = Math.max(particula.vida, 0);
      ctxExplosion.beginPath();
      ctxExplosion.arc(particula.x, particula.y, particula.radio * particula.vida, 0, Math.PI * 2);
      ctxExplosion.fillStyle = `rgba(${particula.color}, ${opacidad})`;
      ctxExplosion.fill();
    }
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

    dibujarExplosion();
    animacionId = requestAnimationFrame(dibujar);
  }

  window.explosionParticulas = crearExplosion;

  window.addEventListener("resize", redimensionar);
  redimensionar();
  dibujar();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animacionId);
  });
})();
