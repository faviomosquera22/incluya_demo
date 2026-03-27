const demoTabs = Array.from(document.querySelectorAll("[data-demo-target]"));
const demoImage = document.getElementById("demo-image");
const demoImageTrigger = document.getElementById("demo-image-trigger");
const demoStatus = document.getElementById("demo-status");
const demoTitle = document.getElementById("demo-title");
const demoDescription = document.getElementById("demo-description");
const demoPoints = document.getElementById("demo-points");
const galleryItems = Array.from(document.querySelectorAll("[data-lightbox-src]"));

let lightboxState = null;

const demoScreens = {
  home: {
    src: "/assets/IMG_2141.PNG",
    alt: "Pantalla principal de Incluya",
    status: "Pantalla principal",
    title: "Accesos rápidos para ver, oír y pedir ayuda",
    description:
      "La pantalla inicial resume los módulos disponibles y deja visibles las rutas críticas para accesibilidad y apoyo inmediato.",
    points: [
      "Entrada clara a los módulos principales.",
      "SOS visible desde la primera pantalla.",
      "Lectura rápida del estado general de la experiencia.",
    ],
  },
  hearing: {
    src: "/assets/IMG_2144.PNG",
    alt: "Modo oír con subtítulos grandes",
    status: "Modo oír",
    title: "Subtítulos grandes para seguir conversaciones",
    description:
      "La demo muestra cómo se vería una experiencia enfocada en escuchar y leer con mayor claridad desde una sola pantalla.",
    points: [
      "Área central para transcripción en gran formato.",
      "Acciones rápidas para iniciar, guardar o limpiar.",
      "Pensado para lectura rápida en contexto real.",
    ],
  },
  conversation: {
    src: "/assets/IMG_2148.PNG",
    alt: "Modo conversar con frases rápidas",
    status: "Conversar",
    title: "Comunicación asistida con frases listas para usar",
    description:
      "La interacción reduce fricción cuando la persona necesita comunicar algo importante sin escribir una frase completa desde cero.",
    points: [
      "Frases rápidas visibles y directas.",
      "Jerarquía clara para situaciones frecuentes.",
      "Diseñado para tocar y resolver rápido.",
    ],
  },
  signs: {
    src: "/assets/IMG_2147.PNG",
    alt: "Avatar clínico del módulo de señas",
    status: "Módulo señas",
    title: "Avatar clínico para apoyar comunicación guiada",
    description:
      "Esta vista explica mejor una parte clave del producto: un avatar visual que ayuda a comunicar frases clínicas de forma más clara y acompañada.",
    points: [
      "Avatar visible como apoyo visual directo.",
      "Frases clínicas rápidas en la misma pantalla.",
      "Extiende la accesibilidad más allá de texto y audio.",
    ],
  },
  sos: {
    src: "/assets/IMG_2149.PNG",
    alt: "Pantalla SOS de Incluya",
    status: "Modo SOS",
    title: "Ayuda inmediata desde una sola ruta crítica",
    description:
      "La pantalla SOS concentra ubicación, llamada, alerta y acción visual para responder rápido en momentos sensibles.",
    points: [
      "Llamada y alerta en la misma vista.",
      "Ubicación visible para compartir contexto.",
      "Ruta clara para emergencia sin navegar de más.",
    ],
  },
  settings: {
    src: "/assets/IMG_2150.PNG",
    alt: "Pantalla de ajustes de accesibilidad de Incluya",
    status: "Ajustes",
    title: "Accesibilidad configurable desde el producto",
    description:
      "La demo también muestra que la personalización no es secundaria: contraste, vibración, voz e idioma forman parte del flujo.",
    points: [
      "Preferencias visuales y de interacción.",
      "Opciones de voz e idioma visibles.",
      "Soporte para distintos contextos de uso.",
    ],
  },
};

function renderPoints(items) {
  demoPoints.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    demoPoints.appendChild(li);
  });
}

function setDemoScreen(key) {
  const screen = demoScreens[key];

  if (!screen) {
    return;
  }

  demoImage.src = screen.src;
  demoImage.alt = screen.alt;
  demoStatus.textContent = screen.status;
  demoTitle.textContent = screen.title;
  demoDescription.textContent = screen.description;
  renderPoints(screen.points);

  demoTabs.forEach((tab) => {
    const isActive = tab.dataset.demoTarget === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function getOrCreateLightbox() {
  if (lightboxState) {
    return lightboxState;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "lightbox";
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <div class="lightbox-backdrop" data-lightbox-close></div>
    <figure class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Vista ampliada de imagen">
      <button type="button" class="lightbox-close" aria-label="Cerrar imagen" data-lightbox-close>×</button>
      <img class="lightbox-image" alt="" />
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
  `;

  document.body.appendChild(backdrop);

  const image = backdrop.querySelector(".lightbox-image");
  const caption = backdrop.querySelector(".lightbox-caption");

  function closeLightbox() {
    backdrop.hidden = true;
    document.body.classList.remove("lightbox-open");
  }

  backdrop.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !backdrop.hidden) {
      closeLightbox();
    }
  });

  lightboxState = { backdrop, image, caption };
  return lightboxState;
}

function openLightbox(src, alt = "") {
  const { backdrop, image, caption } = getOrCreateLightbox();
  image.src = src;
  image.alt = alt;
  caption.textContent = alt;
  backdrop.hidden = false;
  document.body.classList.add("lightbox-open");
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setDemoScreen(tab.dataset.demoTarget);
  });
});

if (demoImageTrigger) {
  demoImageTrigger.addEventListener("click", () => {
    openLightbox(demoImage.currentSrc || demoImage.src, demoImage.alt);
  });
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.lightboxSrc, item.dataset.lightboxAlt || "");
  });
});

setDemoScreen("home");
