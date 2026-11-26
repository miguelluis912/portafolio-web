<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import goodPracticesImage from './assets/reconocimientos/buenas-practicas.webp';
import covidResponseImage from './assets/reconocimientos/atencion-covid.webp';
import cybersecurityImage from './assets/reconocimientos/duriva-con.webp';

import scrumImage from './assets/reconocimientos/scrum-fundamentals.webp';
import cssImage from './assets/reconocimientos/css-moderno.webp';
import aspNetImage from './assets/reconocimientos/aspnet-core-apis.webp';

const credentials = [
  {
    title: 'Buenas Prácticas para las Américas 2023',
    type: 'Reconocimiento',
    issuer: 'ISSSTE',
    description:
      'Por la participación en el concurso de buenas prácticas en seguridad social.',
    image: goodPracticesImage,
    width: 1085,
    height: 1450,
  },
  {
    title: 'Herramientas tecnológicas para la atención de COVID',
    type: 'Reconocimiento',
    issuer: 'ISSSTE · 2021',
    description:
      'Por la puesta en operación de herramientas tecnológicas de apoyo para la atención de COVID.',
    image: covidResponseImage,
    width: 1536,
    height: 1024,
  },
  {
    title: 'Ciclo de conferencias de ciberseguridad',
    type: 'Constancia de participación',
    issuer: 'Duriva Con · 2018',
    description:
      'Participación en un ciclo de conferencias de ciberseguridad de 16 horas.',
    image: cybersecurityImage,
    width: 1435,
    height: 1096,
  },
  {
    title: 'Scrum Fundamentals Certified',
    type: 'Certificación',
    issuer: 'SCRUMstudy',
    description:
      'Certificación obtenida al aprobar el examen de fundamentos de Scrum. La captura original tiene una zona cubierta.',
    image: scrumImage,
    width: 974,
    height: 770,
  },
  {
    title: 'CSS moderno: Flexbox y CSS Grid avanzado',
    type: 'Certificado de finalización',
    issuer: 'Udemy · 2025',
    description: 'Curso de 10 horas impartido por Jordan Alexander.',
    image: cssImage,
    width: 978,
    height: 714,
  },
  {
    title: 'Construyendo Web APIs RESTful con ASP.NET Core 6',
    type: 'Certificado de finalización',
    issuer: 'Udemy · 2022',
    description: 'Curso de 22 horas impartido por Felipe Gavilán.',
    image: aspNetImage,
    width: 986,
    height: 802,
  },
];

const portfolioMain = ref(null);
let revealObserver;

onMounted(() => {
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;

  revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      entry.target.classList.replace(
        'scroll-reveal-pending',
        'scroll-reveal-visible',
      );
      observer.unobserve(entry.target);
    }
  });

  for (const block of portfolioMain.value.querySelectorAll(
    '[data-scroll-reveal]',
  )) {
    if (block.getBoundingClientRect().top < window.innerHeight) continue;

    block.classList.add('scroll-reveal-pending');
    revealObserver.observe(block);
  }
});

onUnmounted(() => revealObserver?.disconnect());

const credentialTrack = ref(null);
const activeCredential = ref(0);

const autoplayPaused = ref(false);
const carouselVisible = ref(false);
const pageVisible = ref(true);
const carouselHovered = ref(false);
const carouselFocused = ref(false);
const carouselTouched = ref(false);

const autoplayRunning = computed(
  () =>
    carouselVisible.value &&
    pageVisible.value &&
    !autoplayPaused.value &&
    !carouselHovered.value &&
    !carouselFocused.value &&
    !carouselTouched.value,
);

let autoplayTimer;
let carouselObserver;
let motionPreference;

function syncPageVisibility() {
  pageVisible.value = !document.hidden;
}

function syncMotionPreference(event) {
  if (event.matches) autoplayPaused.value = true;
}

function handleCarouselFocusOut(event) {
  carouselFocused.value = event.currentTarget.contains(event.relatedTarget);
}

watch([autoplayRunning, activeCredential], () => {
  clearTimeout(autoplayTimer);
  if (!autoplayRunning.value) return;

  autoplayTimer = setTimeout(() => {
    showCredential((activeCredential.value + 1) % credentials.length);
  }, 6000);
});

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotionPreference(motionPreference);
  motionPreference.addEventListener?.('change', syncMotionPreference);

  syncPageVisibility();
  document.addEventListener('visibilitychange', syncPageVisibility);

  if ('IntersectionObserver' in window) {
    carouselObserver = new IntersectionObserver(
      ([entry]) => {
        carouselVisible.value =
          entry.isIntersecting && entry.intersectionRatio >= 0.15;
      },
      { threshold: 0.15 },
    );
    carouselObserver.observe(credentialTrack.value);
  } else {
    carouselVisible.value = true;
  }
});

onUnmounted(() => {
  clearTimeout(autoplayTimer);
  carouselObserver?.disconnect();
  motionPreference?.removeEventListener?.('change', syncMotionPreference);
  document.removeEventListener('visibilitychange', syncPageVisibility);
});

function syncCredentialPosition() {
  const track = credentialTrack.value;
  if (!track?.clientWidth) return;
  const index = Math.round(track.scrollLeft / track.clientWidth);
  activeCredential.value = Math.max(0, Math.min(credentials.length - 1, index));
}

function showCredential(index) {
  const track = credentialTrack.value;
  const next = Math.max(0, Math.min(credentials.length - 1, index));
  if (!track || next === activeCredential.value) return;

  track.scrollTo({
    left: track.clientWidth * next,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });
}

const isLoaded = ref(false);
const isDark = ref(false);
const emailCopied = ref(false);
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '';
const contactPhone = import.meta.env.VITE_CONTACT_PHONE?.trim() ?? '';
const whatsappNumber = contactPhone.replace(/\D/g, '');
const whatsappMessage = [
  'Hola, Luis. Vi tu portafolio y me gustaría ponerme en contacto contigo.',
  '',
  'Mi nombre:',
  'Motivo de la consulta:',
  'Detalles del proyecto o solicitud:',
].join('\n');
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const contactForm = reactive({
  name: '',
  email: '',
  message: '',
});
const submitContactForm = () => {
  const { name, email, message } = contactForm;
  if (!contactEmail || !name || !email || !message) return;

  const subject = encodeURIComponent('Contacto desde el portafolio');
  const body = encodeURIComponent(
    `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
  );
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};

const copyEmail = () => {
  const email = contactEmail;
  const tempInput = document.createElement('input');
  tempInput.value = email;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    emailCopied.value = true;
    setTimeout(() => {
      emailCopied.value = false;
    }, 2500);
  } catch (err) {
    console.error('Error al copiar correo:', err);
  }
  document.body.removeChild(tempInput);
};

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/luismiguel912' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/luis-miguel-mora-rocha-266006b2/',
  },
  { name: 'X / Twitter', url: 'https://twitter.com/ReyMiguelluis' },
  { name: 'Instagram', url: 'https://www.instagram.com/d.e.v.c.o.d.e/' },
];

const projects = ref([
  {
    id: 1,
    title: 'Caribe Go — Reservas de Traslados',
    category: 'Frontend & UI',
    year: '2025',
    stack: ['Vue.js', 'JavaScript', 'Tailwind CSS', 'UI/UX'],
    description:
      'Plataforma web de reserva y gestión de traslados para hoteles y aeropuertos, desarrollada con Vue.js y JavaScript, optimizada para ofrecer una experiencia de usuario fluida y rápida en cualquier dispositivo.',
    githubUrl: 'https://caribe-go.site/',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    metrics: [
      { label: 'Tipo', value: 'Landing / App' },
      { label: 'Stack', value: 'Vue.js + JS' },
      { label: 'Estado', value: 'En Vivo ↗' },
    ],
  },
  {
    id: 2,
    title: 'Llantas Store — Reserva y Consulta',
    category: 'Frontend & UI',
    year: '2025',
    stack: ['Vue.js', 'JavaScript', 'Cloudflare Workers', 'E-commerce'],
    description:
      'Sistema web interactivo para la reserva, compra y consulta en tiempo real de neumáticos (llantas), desarrollado con Vue.js y desplegado sobre infraestructura edge de Cloudflare Workers.',
    githubUrl: 'https://web-llantera.912prueba.workers.dev/',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #115E59 100%)',
    metrics: [
      { label: 'Plataforma', value: 'E-commerce UI' },
      { label: 'Stack', value: 'Vue.js + Workers' },
      { label: 'Estado', value: 'En Vivo ↗' },
    ],
  },
  {
    id: 3,
    title: 'Microservicio Directorio Activo',
    category: 'Microservicios .NET',
    year: 'ISSSTE',
    stack: ['.NET', 'Entity Framework', 'Arq. en Capas', 'Auth'],
    description:
      'Servicio backend de autenticación y validación centralizada mediante credenciales institucionales integrado con Directorio Activo, estructurado bajo arquitectura en capas.',
    githubUrl: '',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #059669 100%)',
    metrics: [
      { label: 'Arquitectura', value: 'En Capas' },
      { label: 'ORM / Core', value: '.NET + EF' },
      { label: 'Seguridad', value: 'Active Directory' },
    ],
  },
  {
    id: 2,
    title: 'Microservicio Médicos Nacional',
    category: 'Microservicios .NET',
    year: 'ISSSTE',
    stack: ['.NET', 'Entity Framework', 'Arq. en Capas', 'REST API'],
    description:
      'Microservicio de consulta y gestión del padrón de médicos registrados a nivel nacional en todas las unidades e instituciones del ISSSTE, desarrollado bajo arquitectura en capas.',
    githubUrl: '',
    gradient: 'linear-gradient(135deg, #18181B 0%, #2563EB 100%)',
    metrics: [
      { label: 'Cobertura', value: 'Nacional ISSSTE' },
      { label: 'Arquitectura', value: 'En Capas' },
      { label: 'Tecnología', value: '.NET + EF' },
    ],
  },
  {
    id: 3,
    title: 'Microservicio Trabajadores Nacional',
    category: 'Microservicios .NET',
    year: 'ISSSTE',
    stack: ['.NET 8', 'C#', 'REST API'],
    description:
      'Microservicio que consulta fuentes institucionales por RFC o CURP y consolida las respuestas en un formato común.',
    githubUrl: '',
    gradient: 'linear-gradient(135deg, #18181B 0%, #0F766E 100%)',
    metrics: [
      { label: 'Cobertura', value: 'Nacional ISSSTE' },
      { label: 'Consultas', value: 'RFC / CURP' },
      { label: 'Tecnología', value: '.NET 8' },
    ],
  },
]);

const filterCategories = [
  'Todos',
  ...new Set(projects.value.map((project) => project.category)),
];
const activeFilter = ref('Todos');
const filteredProjects = computed(() =>
  projects.value.filter(
    (project) =>
      activeFilter.value === 'Todos' || project.category === activeFilter.value,
  ),
);
const getCategoryCount = (category) =>
  projects.value.filter(
    (project) => category === 'Todos' || project.category === category,
  ).length;

const timeline = [
  {
    id: 1,
    period: '2023 — Actualidad',
    type: 'Experiencia Laboral',
    role: 'Desarrollador Full Stack & Tech Lead',
    organization: 'Infotec · Ciudad de México',
    current: true,
    description:
      'Desarrollador full stack con perfil de líder técnico, apoyando, guiando y coordinando al equipo de desarrollo en la construcción de soluciones tecnológicas escalables.',
  },
  {
    id: 2,
    period: '2025 — Actualidad',
    type: 'Freelance & Independent Projects',
    role: 'Frontend Developer & Vue Specialist',
    organization: 'Caribe Go & Llantas Store',
    current: true,
    description:
      'Desarrollo de aplicaciones web interactivas con Vue.js y JavaScript, destacando plataformas de reserva de traslados turísticos (Caribe Go) y sistemas de consulta, compra y reserva de neumáticos (Llantas Store).',
  },
  {
    id: 3,
    period: '2020 — 2023',
    type: 'Experiencia Laboral & Reconocimientos',
    role: 'Desarrollador de Software Full Stack',
    organization: 'ISSSTE · Ciudad de México',
    current: false,
    description:
      'Desarrollo de sistemas institucionales de salud, análisis y optimización de bases de datos MySQL y Laravel. Reconocido oficialmente durante mi trayectoria por el desarrollo de tecnología aplicada e innovadora para el sector salud.',
  },
  {
    id: 4,
    period: '2018 — 2019',
    type: 'Experiencia Laboral',
    role: 'Analista Programador',
    organization: 'Secretaría de Marina (SEMAR) · Ciudad de México',
    current: false,
    description:
      'Desarrollo de sistemas locales de escritorio y web en ambiente visual Java, bases de datos y soporte técnico de software.',
  },
  // {
  //   id: 5,
  //   period: '2015 — 2019',
  //   type: 'Formación Académica & Certificaciones',
  //   role: 'Ingeniería en Computación / Sistemas',
  //   organization: 'Universidad Autónoma del Estado de México (UAEMex)',
  //   current: false,
  //   description:
  //     '100% de créditos concluidos. Especialización en ingeniería de software, arquitectura de sistemas y bases de datos relacionales. Complementado con certificaciones continuas en programación y desarrollo avanzado.',
  // },
];

const skillGroups = [
  {
    index: '01 // CORE',
    title: 'Lenguajes & Bases de Datos',
    subtitle:
      'Fundamentos sólidos para lógica de negocio, persistencia relacional e interfaces web.',
    items: [
      'C# / .NET',
      'PHP',
      'Java',
      'JavaScript',
      'MySQL',
      'SQL Server',
      'HTML5 / CSS3',
    ],
  },
  {
    index: '02 // FRAMEWORKS',
    title: 'Frameworks & Arquitecturas',
    subtitle:
      'Ecosistemas empresariales aplicando patrones de diseño limpios y desacoplados.',
    items: [
      'Entity Framework',
      'Laravel & Blade',
      'Spring Boot',
      'Vue.js',
      'Arquitectura Hexagonal',
      'Arquitectura en Capas',
    ],
  },
];

const hasFinePointer = ref(false);
const cursorState = ref('default');
const hoveredProject = ref(null);

const mouseTarget = reactive({ x: -100, y: -100 });
const cursorCurrent = reactive({ x: -100, y: -100 });
const previewCurrent = reactive({ x: -100, y: -100 });

const targetScrollY = ref(0);
const smoothScrollY = ref(0);
let rafId = null;

const setCursor = (state) => {
  cursorState.value = state;
};

const onProjectEnter = (project) => {
  hoveredProject.value = project;
  setCursor('project');
};

const onProjectLeave = () => {
  hoveredProject.value = null;
  setCursor('default');
};

const handleMouseMove = (e) => {
  mouseTarget.x = e.clientX;
  mouseTarget.y = e.clientY;
};

const handleScroll = () => {
  targetScrollY.value = window.scrollY || window.pageYOffset;
};

const animateLoop = () => {
  cursorCurrent.x += (mouseTarget.x - cursorCurrent.x) * 0.22;
  cursorCurrent.y += (mouseTarget.y - cursorCurrent.y) * 0.22;

  previewCurrent.x += (mouseTarget.x + 24 - previewCurrent.x) * 0.12;
  previewCurrent.y += (mouseTarget.y - 24 - previewCurrent.y) * 0.12;

  smoothScrollY.value += (targetScrollY.value - smoothScrollY.value) * 0.08;

  rafId = requestAnimationFrame(animateLoop);
};

const cursorTransformStyle = computed(() => ({
  transform: `translate3d(${cursorCurrent.x.toFixed(1)}px, ${cursorCurrent.y.toFixed(1)}px, 0)`,
}));

const previewTransformStyle = computed(() => ({
  transform: `translate3d(${previewCurrent.x.toFixed(1)}px, ${previewCurrent.y.toFixed(1)}px, 0)`,
}));

const parallaxLayers = computed(() => {
  const sy = smoothScrollY.value;
  const mx = hasFinePointer.value
    ? (cursorCurrent.x - window.innerWidth / 2) * 0.015
    : 0;
  const my = hasFinePointer.value
    ? (cursorCurrent.y - window.innerHeight / 2) * 0.015
    : 0;

  return {
    grid: {
      transform: `translate3d(${(-mx * 0.5).toFixed(1)}px, ${(-sy * 0.08 - my * 0.5).toFixed(1)}px, 0)`,
    },
    watermark: {
      transform: `translate3d(${(-sy * 0.16 - mx * 1.1).toFixed(1)}px, ${(-sy * 0.18).toFixed(1)}px, 0)`,
    },
    accents: {
      transform: `translate3d(${(mx * 1.4).toFixed(1)}px, ${(-sy * 0.28 + my * 1.4).toFixed(1)}px, 0)`,
    },
  };
});

const heroTilt = reactive({ rotateX: 0, rotateY: 0, offsetX: 0, offsetY: 0 });

const handleHeroCardMove = (event) => {
  if (!hasFinePointer.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const normX = (event.clientX - rect.left) / rect.width - 0.5;
  const normY = (event.clientY - rect.top) / rect.height - 0.5;
  heroTilt.rotateY = normX * 9;
  heroTilt.rotateX = -normY * 9;
  heroTilt.offsetX = normX * 14;
  heroTilt.offsetY = normY * 14;
};

const resetHeroCardMove = () => {
  heroTilt.rotateX = 0;
  heroTilt.rotateY = 0;
  heroTilt.offsetX = 0;
  heroTilt.offsetY = 0;
};

const heroCardTiltStyle = computed(() => {
  const isReset = heroTilt.rotateX === 0 && heroTilt.rotateY === 0;
  return {
    transform: `perspective(1000px) rotateX(${heroTilt.rotateX.toFixed(2)}deg) rotateY(${heroTilt.rotateY.toFixed(2)}deg)`,
    transition: isReset
      ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      : 'transform 0.12s ease-out',
  };
});

const heroInnerParallax = computed(() => {
  return {
    nodes: {
      transform: `translate3d(${-heroTilt.offsetX * 0.9}px, ${-heroTilt.offsetY * 0.9}px, 0)`,
      transition: 'transform 0.18s ease-out',
    },
    monitor: {
      transform: `translate3d(${heroTilt.offsetX * 0.35}px, ${heroTilt.offsetY * 0.35}px, 0)`,
      transition: 'transform 0.18s ease-out',
    },
    developer: {
      transform: `translate3d(${heroTilt.offsetX * 0.7}px, ${heroTilt.offsetY * 0.7}px, 0)`,
      transition: 'transform 0.18s ease-out',
    },
  };
});

const magnetOffsets = reactive({
  theme: { x: 0, y: 0 },
  primaryCta: { x: 0, y: 0 },
  secondaryCta: { x: 0, y: 0 },
});

const handleMagnet = (event, key) => {
  if (!hasFinePointer.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  magnetOffsets[key].x = (event.clientX - centerX) * 0.3;
  magnetOffsets[key].y = (event.clientY - centerY) * 0.3;
};

const resetMagnet = (key) => {
  magnetOffsets[key].x = 0;
  magnetOffsets[key].y = 0;
};

const magnetStyles = computed(() => {
  const buildStyle = (offset) => ({
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'transform 0.1s ease-out',
  });
  return {
    theme: buildStyle(magnetOffsets.theme),
    primaryCta: buildStyle(magnetOffsets.primaryCta),
    secondaryCta: buildStyle(magnetOffsets.secondaryCta),
  };
});

const selectedProject = ref(null);

const openProjectModal = (project) => {
  selectedProject.value = project;
  hoveredProject.value = null;
  setCursor('default');
  document.body.style.overflow = 'hidden';
};

const closeProjectModal = () => {
  selectedProject.value = null;
  document.body.style.overflow = '';
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && selectedProject.value) {
    closeProjectModal();
  }
};

onMounted(() => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  hasFinePointer.value =
    !reduceMotion && window.matchMedia('(pointer: fine)').matches;
  targetScrollY.value = window.scrollY || window.pageYOffset;
  smoothScrollY.value = targetScrollY.value;

  if (hasFinePointer.value) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  if (!reduceMotion) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animateLoop);
  }
  window.addEventListener('keydown', handleKeyDown);

  requestAnimationFrame(() => {
    setTimeout(() => {
      isLoaded.value = true;
    }, 60);
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeyDown);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div :class="{ 'is-loaded': isLoaded }" class="min-h-screen relative isolate">
    <div
      aria-hidden="true"
      class="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div
        :style="parallaxLayers.grid"
        class="parallax-layer absolute -inset-32 bg-swiss-grid opacity-90"
      ></div>

      <div
        :style="parallaxLayers.watermark"
        class="parallax-layer absolute top-28 -left-10 select-none font-display font-bold text-[16vw] leading-none tracking-tighter text-ink/[0.025] dark:text-paper/[0.03] whitespace-nowrap"
      >
        LMMR.SYS—26
      </div>

      <div
        :style="parallaxLayers.accents"
        class="parallax-layer absolute inset-0"
      >
        <div
          class="absolute top-24 right-[10%] w-72 h-72 rounded-full border border-neutral-300/60 dark:border-neutral-800/80"
        ></div>
        <div
          class="hidden sm:block absolute top-0 bottom-0 left-[8%] w-px bg-neutral-200/60 dark:bg-neutral-800/60"
        ></div>
        <div
          class="hidden sm:block absolute top-0 bottom-0 right-[8%] w-px bg-neutral-200/60 dark:bg-neutral-800/60"
        ></div>

        <span
          class="hidden md:block absolute top-32 left-[9%] font-mono text-[10px] tracking-widest text-neutral-400/70 dark:text-neutral-600"
        >
          01 // AXIS.X
        </span>
        <span
          class="hidden md:block absolute top-[48%] right-[9%] font-mono text-[10px] tracking-widest text-neutral-400/70 dark:text-neutral-600"
        >
          GRID.96PX
        </span>
        <span
          class="hidden md:block absolute bottom-24 left-[9%] font-mono text-[10px] tracking-widest text-neutral-400/70 dark:text-neutral-600"
        >
          CDMX // 19.43°N
        </span>
      </div>
    </div>

    <div
      v-if="hasFinePointer"
      aria-hidden="true"
      :style="cursorTransformStyle"
      class="fixed top-0 left-0 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <div
        class="rounded-full bg-white text-black flex items-center justify-center font-mono text-[10px] uppercase tracking-wider font-medium transition-all duration-300 ease-out"
        :class="{
          'w-3 h-3': cursorState === 'default',
          'w-10 h-10 opacity-80': cursorState === 'interactive',
          'w-16 h-16': cursorState === 'project',
        }"
      >
        <span v-if="cursorState === 'project'">Ver</span>
      </div>
    </div>

    <transition name="preview-scale">
      <div
        v-if="hoveredProject && hasFinePointer"
        aria-hidden="true"
        :style="previewTransformStyle"
        class="fixed top-0 left-0 z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden lg:block"
      >
        <div
          class="w-72 rounded-2xl p-5 text-white shadow-2xl border border-white/15 backdrop-blur-md flex flex-col justify-between h-44"
          :style="{ background: hoveredProject.gradient }"
        >
          <div
            class="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest opacity-85"
          >
            <span>0{{ hoveredProject.id }} // PREVIEW</span>
            <span>{{ hoveredProject.year }}</span>
          </div>
          <div>
            <p class="font-display text-lg font-semibold leading-snug">
              {{ hoveredProject.title }}
            </p>
            <p class="text-[11px] font-mono opacity-80 mt-1 truncate">
              {{ hoveredProject.stack.join(' · ') }}
            </p>
          </div>
        </div>
      </div>
    </transition>

    <header
      class="sticky top-0 z-30 backdrop-blur-md bg-paper/75 dark:bg-obsidian/75 border-b border-neutral-200/70 dark:border-neutral-800/70"
    >
      <nav
        class="w-full max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between"
      >
        <a
          href="#"
          @mouseenter="setCursor('interactive')"
          @mouseleave="setCursor('default')"
          class="font-display font-semibold text-sm sm:text-base tracking-tight flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-ink dark:bg-paper"></span>
          <span
            >LMMR<span class="text-neutral-400 font-normal">.dev</span></span
          >
        </a>

        <div
          class="hidden md:flex items-center gap-4 lg:gap-7 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        >
          <a
            href="#proyectos"
            @mouseenter="setCursor('interactive')"
            @mouseleave="setCursor('default')"
            class="hover:text-ink dark:hover:text-paper transition-colors"
            >Proyectos</a
          >
          <a
            href="#trayectoria"
            @mouseenter="setCursor('interactive')"
            @mouseleave="setCursor('default')"
            class="hover:text-ink dark:hover:text-paper transition-colors"
            >Trayectoria</a
          >
          <a
            href="#reconocimientos"
            @mouseenter="setCursor('interactive')"
            @mouseleave="setCursor('default')"
            class="hover:text-ink dark:hover:text-paper transition-colors"
            >Reconocimientos</a
          >
          <a
            href="#stack"
            @mouseenter="setCursor('interactive')"
            @mouseleave="setCursor('default')"
            class="hover:text-ink dark:hover:text-paper transition-colors"
            >Stack</a
          >
          <a
            href="#contacto"
            @mouseenter="setCursor('interactive')"
            @mouseleave="setCursor('default')"
            class="hover:text-ink dark:hover:text-paper transition-colors"
            >Contacto</a
          >
        </div>

        <button
          @click="toggleDarkMode"
          @mousemove="handleMagnet($event, 'theme')"
          @mouseleave="
            resetMagnet('theme');
            setCursor('default');
          "
          @mouseenter="setCursor('interactive')"
          :style="magnetStyles.theme"
          aria-label="Cambiar tema claro u oscuro"
          class="px-3.5 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-mono flex items-center gap-2 hover:border-ink dark:hover:border-paper transition-colors"
        >
          <span>{{ isDark ? '☀ Claro' : '☾ Oscuro' }}</span>
        </button>
      </nav>
    </header>

    <main ref="portfolioMain" class="w-full max-w-6xl mx-auto px-6 sm:px-10">
      <section
        class="pt-10 pb-20 sm:pt-16 sm:pb-28 border-b border-neutral-200 dark:border-neutral-800/80"
      >
        <div
          class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center"
        >
          <div class="lg:col-span-7">
            <div
              class="mb-7 inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-sm"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                ></span>
              </span>
              <span
                class="text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-300"
              >
                Ciudad de México · Disponible para Freelance
              </span>
            </div>

            <p
              class="font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3"
            >
              Luis Miguel Mora Rocha
            </p>

            <h1
              class="font-display text-5xl sm:text-6xl xl:text-[4.5rem] font-bold tracking-tight leading-[1.02] mb-4"
            >
              <span class="reveal-mask block pb-1">
                <span class="reveal-line" style="transition-delay: 80ms">
                  Luis Miguel
                </span>
              </span>
              <span class="reveal-mask block pb-1">
                <span
                  class="reveal-line text-emerald-600 dark:text-emerald-400"
                  style="transition-delay: 160ms"
                >
                  Mora Rocha
                </span>
              </span>
              <span class="reveal-mask block pb-2">
                <span
                  class="reveal-line text-neutral-400 dark:text-neutral-500 text-3xl sm:text-4xl xl:text-5xl"
                  style="transition-delay: 260ms"
                >
                  Desarrollador Full Stack.
                </span>
              </span>
            </h1>

            <div class="mt-7 reveal-mask max-w-xl">
              <p
                class="reveal-line text-base sm:text-[17px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal"
                style="transition-delay: 380ms"
              >
                Ingeniero en Computación,
                especializado en desarrollo web y empresarial, arquitectura
                de bases de datos, APIs REST y seguridad de la información.
              </p>
            </div>

            <div class="mt-9 flex flex-wrap items-center gap-3.5">
              <a
                href="#proyectos"
                @mousemove="handleMagnet($event, 'primaryCta')"
                @mouseleave="
                  resetMagnet('primaryCta');
                  setCursor('default');
                "
                @mouseenter="setCursor('interactive')"
                :style="magnetStyles.primaryCta"
                class="px-7 py-3.5 rounded-full bg-ink text-paper dark:bg-paper dark:text-ink font-display text-sm font-medium tracking-wide inline-flex items-center gap-2.5 shadow-lg shadow-black/5 dark:shadow-white/5 hover:opacity-90 transition-opacity"
              >
                <span>Ver portafolio</span>
                <span aria-hidden="true">↓</span>
              </a>

              <button
                v-if="contactEmail"
                @click="copyEmail"
                @mousemove="handleMagnet($event, 'secondaryCta')"
                @mouseleave="
                  resetMagnet('secondaryCta');
                  setCursor('default');
                "
                @mouseenter="setCursor('interactive')"
                :style="magnetStyles.secondaryCta"
                class="px-5 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-ink dark:hover:border-paper text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <span>{{
                  emailCopied ? '¡Correo copiado!' : contactEmail
                }}</span>
              </button>
            </div>

            <div
              class="mt-9 pt-6 border-t border-neutral-200/70 dark:border-neutral-800/60 flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-500 dark:text-neutral-400"
            >
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="setCursor('interactive')"
                @mouseleave="setCursor('default')"
                class="hover:text-ink dark:hover:text-paper transition-colors inline-flex items-center gap-1.5"
              >
                <span>{{ social.name }}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div
              @mousemove="handleHeroCardMove"
              @mouseleave="resetHeroCardMove"
              :style="heroCardTiltStyle"
              class="relative rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white/75 dark:bg-neutral-900/65 backdrop-blur-md p-5 sm:p-6 shadow-2xl shadow-black/[0.04] dark:shadow-black/40 overflow-hidden select-none"
            >
              <div
                class="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3"
              >
                <span class="inline-flex items-center gap-1.5">
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  ></span>
                  DEV.SESSION // LIVE
                </span>
                <span>VUE.3 + SPRING</span>
              </div>

              <div
                class="relative w-full aspect-[4/3.6] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/90 bg-paper/90 dark:bg-obsidian/90 overflow-hidden flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 420 360"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-full h-full"
                  role="img"
                  aria-label="Ilustración vectorial minimalista de un desarrollador programando en su estación de trabajo"
                >
                  <defs>
                    <clipPath id="screen-clip">
                      <rect x="118" y="64" width="184" height="106" rx="6" />
                    </clipPath>
                    <radialGradient id="screen-glow" cx="50%" cy="40%" r="55%">
                      <stop
                        offset="0%"
                        stop-color="#10B981"
                        stop-opacity="0.16"
                      />
                      <stop
                        offset="100%"
                        stop-color="#10B981"
                        stop-opacity="0"
                      />
                    </radialGradient>
                  </defs>

                  <g
                    class="stroke-neutral-300/60 dark:stroke-neutral-800/80"
                    stroke-width="0.75"
                  >
                    <line x1="0" y1="72" x2="420" y2="72" />
                    <line x1="0" y1="144" x2="420" y2="144" />
                    <line x1="0" y1="216" x2="420" y2="216" />
                    <line x1="0" y1="288" x2="420" y2="288" />
                    <line x1="84" y1="0" x2="84" y2="360" />
                    <line x1="210" y1="0" x2="210" y2="360" />
                    <line x1="336" y1="0" x2="336" y2="360" />
                  </g>

                  <circle cx="210" cy="145" r="135" fill="url(#screen-glow)" />

                  <path
                    d="M36 125 C 80 95, 95 155, 114 130"
                    stroke="#10B981"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    class="anim-wave opacity-60"
                  />
                  <path
                    d="M306 112 C 332 88, 354 138, 386 108"
                    stroke="#EF4444"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    class="anim-wave opacity-60"
                  />

                  <g class="anim-float-1" :style="heroInnerParallax.nodes">
                    <rect
                      x="34"
                      y="52"
                      width="58"
                      height="24"
                      rx="6"
                      class="fill-white dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-700"
                      stroke-width="1"
                    />
                    <circle cx="45" cy="64" r="3" fill="#10B981" />
                    <text
                      x="54"
                      y="67"
                      class="fill-neutral-700 dark:fill-neutral-300 font-mono text-[8.5px]"
                    >
                      API.REST
                    </text>
                  </g>

                  <g class="anim-float-2" :style="heroInnerParallax.nodes">
                    <rect
                      x="326"
                      y="46"
                      width="60"
                      height="24"
                      rx="6"
                      class="fill-white dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-700"
                      stroke-width="1"
                    />
                    <circle cx="337" cy="58" r="3" fill="#EF4444" />
                    <text
                      x="346"
                      y="61"
                      class="fill-neutral-700 dark:fill-neutral-300 font-mono text-[8.5px]"
                    >
                      MYSQL.DB
                    </text>
                  </g>

                  <g class="anim-float-3" :style="heroInnerParallax.nodes">
                    <rect
                      x="328"
                      y="156"
                      width="56"
                      height="22"
                      rx="6"
                      class="fill-white dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-700"
                      stroke-width="1"
                    />
                    <text
                      x="338"
                      y="170"
                      class="fill-neutral-600 dark:fill-neutral-400 font-mono text-[8px]"
                    >
                      &lt;Vue3/&gt;
                    </text>
                  </g>

                  <g :style="heroInnerParallax.monitor">
                    <path
                      d="M194 176 L226 176 L232 204 L188 204 Z"
                      class="fill-neutral-300 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-600"
                      stroke-width="1"
                    />
                    <rect
                      x="170"
                      y="203"
                      width="80"
                      height="5"
                      rx="2.5"
                      class="fill-neutral-800 dark:fill-neutral-300"
                    />

                    <rect
                      x="110"
                      y="56"
                      width="200"
                      height="122"
                      rx="10"
                      class="fill-neutral-900 dark:fill-neutral-950 stroke-neutral-700 dark:stroke-neutral-700"
                      stroke-width="1.5"
                    />

                    <rect
                      x="118"
                      y="64"
                      width="184"
                      height="106"
                      rx="6"
                      fill="#111111"
                    />

                    <circle cx="127" cy="72" r="2.2" fill="#EF4444" />
                    <circle cx="135" cy="72" r="2.2" fill="#F59E0B" />
                    <circle cx="143" cy="72" r="2.2" fill="#10B981" />
                    <line
                      x1="118"
                      y1="79"
                      x2="302"
                      y2="79"
                      stroke="#262626"
                      stroke-width="1"
                    />

                    <g clip-path="url(#screen-clip)">
                      <g class="anim-code-stream">
                        <rect
                          x="128"
                          y="88"
                          width="34"
                          height="4"
                          rx="2"
                          fill="#10B981"
                        />
                        <rect
                          x="167"
                          y="88"
                          width="52"
                          height="4"
                          rx="2"
                          fill="#E5E5E5"
                          opacity="0.85"
                        />

                        <rect
                          x="138"
                          y="99"
                          width="24"
                          height="4"
                          rx="2"
                          fill="#EF4444"
                          opacity="0.9"
                        />
                        <rect
                          x="167"
                          y="99"
                          width="68"
                          height="4"
                          rx="2"
                          fill="#737373"
                        />

                        <rect
                          x="138"
                          y="110"
                          width="46"
                          height="4"
                          rx="2"
                          fill="#A3A3A3"
                        />
                        <rect
                          x="189"
                          y="110"
                          width="32"
                          height="4"
                          rx="2"
                          fill="#10B981"
                          opacity="0.85"
                        />

                        <rect
                          x="148"
                          y="121"
                          width="62"
                          height="4"
                          rx="2"
                          fill="#E5E5E5"
                          opacity="0.7"
                        />
                        <rect
                          x="215"
                          y="121"
                          width="22"
                          height="4"
                          rx="2"
                          fill="#EF4444"
                        />

                        <rect
                          x="128"
                          y="132"
                          width="28"
                          height="4"
                          rx="2"
                          fill="#737373"
                        />
                        <rect
                          x="161"
                          y="132"
                          width="44"
                          height="4"
                          rx="2"
                          fill="#10B981"
                        />

                        <rect
                          x="128"
                          y="144"
                          width="34"
                          height="4"
                          rx="2"
                          fill="#10B981"
                        />
                        <rect
                          x="167"
                          y="144"
                          width="52"
                          height="4"
                          rx="2"
                          fill="#E5E5E5"
                          opacity="0.85"
                        />

                        <rect
                          x="138"
                          y="155"
                          width="24"
                          height="4"
                          rx="2"
                          fill="#EF4444"
                          opacity="0.9"
                        />
                        <rect
                          x="167"
                          y="155"
                          width="68"
                          height="4"
                          rx="2"
                          fill="#737373"
                        />

                        <rect
                          x="138"
                          y="166"
                          width="46"
                          height="4"
                          rx="2"
                          fill="#A3A3A3"
                        />
                        <rect
                          x="189"
                          y="166"
                          width="32"
                          height="4"
                          rx="2"
                          fill="#10B981"
                          opacity="0.85"
                        />

                        <rect
                          x="148"
                          y="177"
                          width="62"
                          height="4"
                          rx="2"
                          fill="#E5E5E5"
                          opacity="0.7"
                        />
                        <rect
                          x="215"
                          y="177"
                          width="22"
                          height="4"
                          rx="2"
                          fill="#EF4444"
                        />

                        <rect
                          x="128"
                          y="188"
                          width="28"
                          height="4"
                          rx="2"
                          fill="#737373"
                        />
                        <rect
                          x="161"
                          y="188"
                          width="44"
                          height="4"
                          rx="2"
                          fill="#10B981"
                        />
                      </g>

                      <rect
                        x="252"
                        y="154"
                        width="6"
                        height="9"
                        rx="1"
                        fill="#10B981"
                        class="anim-caret"
                      />
                    </g>
                  </g>

                  <g :style="heroInnerParallax.developer">
                    <path
                      d="M144 294 C146 248, 174 232, 210 232 C246 232, 274 248, 276 294 Z"
                      class="fill-neutral-900 dark:fill-neutral-100"
                    />
                    <path
                      d="M196 233 L210 249 L224 233"
                      class="stroke-paper dark:stroke-obsidian"
                      stroke-width="2"
                      fill="none"
                    />

                    <circle
                      cx="210"
                      cy="202"
                      r="21"
                      class="fill-paper dark:fill-obsidian stroke-neutral-900 dark:stroke-neutral-100"
                      stroke-width="2.2"
                    />
                    <path
                      d="M190 197 C192 181, 228 181, 230 197 C223 191, 197 191, 190 197 Z"
                      class="fill-neutral-900 dark:fill-neutral-100"
                    />
                    <rect
                      x="196"
                      y="198"
                      width="11"
                      height="6"
                      rx="1.5"
                      class="stroke-neutral-900 dark:stroke-neutral-100 fill-emerald-500/20"
                      stroke-width="1.3"
                    />
                    <rect
                      x="213"
                      y="198"
                      width="11"
                      height="6"
                      rx="1.5"
                      class="stroke-neutral-900 dark:stroke-neutral-100 fill-emerald-500/20"
                      stroke-width="1.3"
                    />
                    <line
                      x1="207"
                      y1="201"
                      x2="213"
                      y2="201"
                      class="stroke-neutral-900 dark:stroke-neutral-100"
                      stroke-width="1.3"
                    />

                    <line
                      x1="54"
                      y1="294"
                      x2="366"
                      y2="294"
                      class="stroke-neutral-900 dark:stroke-neutral-200"
                      stroke-width="2"
                      stroke-linecap="round"
                    />

                    <rect
                      x="156"
                      y="286"
                      width="108"
                      height="7"
                      rx="3"
                      class="fill-neutral-200 dark:fill-neutral-800 stroke-neutral-500 dark:stroke-neutral-600"
                      stroke-width="1"
                    />

                    <g transform="translate(302, 272)">
                      <rect
                        x="0"
                        y="4"
                        width="16"
                        height="18"
                        rx="3"
                        class="fill-white dark:fill-neutral-900 stroke-neutral-700 dark:stroke-neutral-300"
                        stroke-width="1.3"
                      />
                      <path
                        d="M16 8 H20 C21.5 8 21.5 16 20 16 H16"
                        class="stroke-neutral-700 dark:stroke-neutral-300"
                        stroke-width="1.3"
                        fill="none"
                      />
                      <circle
                        cx="8"
                        cy="1"
                        r="1.5"
                        fill="#10B981"
                        class="anim-float-1"
                      />
                    </g>

                    <g class="anim-hand-left">
                      <path
                        d="M152 262 L175 283"
                        class="stroke-neutral-900 dark:stroke-neutral-100"
                        stroke-width="6"
                        stroke-linecap="round"
                      />
                      <circle cx="178" cy="284" r="4.5" fill="#10B981" />
                    </g>

                    <g class="anim-hand-right">
                      <path
                        d="M268 262 L245 283"
                        class="stroke-neutral-900 dark:stroke-neutral-100"
                        stroke-width="6"
                        stroke-linecap="round"
                      />
                      <circle cx="242" cy="284" r="4.5" fill="#10B981" />
                    </g>
                  </g>
                </svg>

                <div
                  class="absolute bottom-3 inset-x-3 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono"
                >
                  <span class="text-neutral-600 dark:text-neutral-300 truncate">
                    <span class="text-emerald-500">❯</span> git commit -m "feat:
                    architecture"
                  </span>
                  <span class="text-neutral-400 shrink-0 ml-2">60 FPS</span>
                </div>
              </div>

              <div
                class="mt-3.5 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400"
              >
                <span>ING. COMPUTACIÓN · UAEMEX</span>
                <span class="text-ink dark:text-paper font-medium"
                  >FULL STACK SYS</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" class="py-20 sm:py-28">
        <div
          data-scroll-reveal
          class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p
              class="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
            >
              01 / Repositorios &amp; Sistemas
            </p>
            <h2
              class="font-display text-3xl sm:text-4xl font-medium tracking-tight"
            >
              Proyectos Destacados
            </h2>
          </div>

          <div
            class="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filtrar proyectos por categoría"
          >
            <button
              v-for="tag in filterCategories"
              :key="tag"
              type="button"
              :aria-pressed="activeFilter === tag"
              @click="activeFilter = tag"
              @mouseenter="setCursor('interactive')"
              @mouseleave="setCursor('default')"
              class="px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300"
              :class="[
                activeFilter === tag
                  ? 'bg-emerald-800 text-white dark:bg-emerald-300 dark:text-emerald-950 shadow-sm'
                  : 'bg-neutral-200/60 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300/60 dark:hover:bg-neutral-800',
              ]"
            >
              {{ tag }}
              <span class="ml-1 opacity-60 text-[11px]">
                ({{ getCategoryCount(tag) }})
              </span>
            </button>
          </div>
        </div>

        <div
          class="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
        >
          <div class="col-span-1">No.</div>
          <div class="col-span-5">Proyecto</div>
          <div class="col-span-4">Stack / Tecnologías</div>
          <div class="col-span-2 text-right">Categoría</div>
        </div>

        <div data-scroll-reveal class="relative min-h-[320px]">
          <transition-group
            name="project-list"
            tag="div"
            class="divide-y divide-neutral-200 dark:divide-neutral-800/80"
          >
            <article
              v-for="project in filteredProjects"
              :key="project.id"
              @click="openProjectModal(project)"
              @mouseenter="onProjectEnter(project)"
              @mouseleave="onProjectLeave"
              role="button"
              tabindex="0"
              @keydown.enter="openProjectModal(project)"
              @keydown.space.prevent="openProjectModal(project)"
              class="group py-7 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center transition-colors duration-300 hover:bg-neutral-200/35 dark:hover:bg-neutral-900/40 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
            >
              <div
                class="md:col-span-1 font-mono text-xs text-neutral-400 dark:text-neutral-500"
              >
                0{{ project.id }}
              </div>

              <div
                class="md:col-span-5 flex items-center justify-between md:justify-start gap-3"
              >
                <h3
                  class="font-display text-xl sm:text-2xl font-medium tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-2.5"
                >
                  {{ project.title }}
                </h3>
                <span
                  class="md:hidden text-[11px] font-mono text-neutral-400"
                  >{{ project.category }}</span
                >
              </div>

              <div class="md:col-span-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tech in project.stack"
                  :key="tech"
                  class="px-2.5 py-1 rounded-md text-xs font-normal border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 bg-white/40 dark:bg-neutral-950/40"
                >
                  {{ tech }}
                </span>
              </div>

              <span
                class="font-mono text-xs font-medium text-emerald-800 dark:text-emerald-300 md:hidden"
                >Ver detalle <span aria-hidden="true">↗</span></span
              >

              <div
                class="hidden md:flex md:col-span-2 items-center justify-end gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400"
              >
                <span class="truncate">{{ project.category }}</span>
                <span
                  class="w-7 h-7 shrink-0 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-all duration-300 group-hover:bg-ink group-hover:text-paper dark:group-hover:bg-paper dark:group-hover:text-ink group-hover:rotate-45"
                >
                  ↗
                </span>
              </div>
            </article>
          </transition-group>
        </div>
      </section>

      <section
        id="trayectoria"
        class="py-20 sm:py-24 border-t border-neutral-200 dark:border-neutral-800/80"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div data-scroll-reveal class="lg:col-span-4">
            <p
              class="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
            >
              02 / Experiencia &amp; Formación
            </p>
            <h2
              class="font-display text-3xl sm:text-4xl font-medium tracking-tight"
            >
              Trayectoria Profesional
            </h2>
            <p
              class="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              Experiencia consolidada en el sector público y desarrollo de
              software institucional, abarcando desde sistemas empresariales y
              bases de datos hasta infraestructura de red.
            </p>
          </div>

          <div class="lg:col-span-8">
            <div
              class="career-timeline relative border-l border-neutral-300 dark:border-neutral-800 pl-6 sm:pl-8 space-y-12"
            >
              <div
                v-for="item in timeline"
                data-scroll-reveal
                :key="item.id"
                class="relative group"
              >
                <span
                  class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full border-2 border-paper dark:border-obsidian transition-transform duration-300 group-hover:scale-125"
                  :class="
                    item.current ? 'bg-emerald-500' : 'bg-ink dark:bg-paper'
                  "
                ></span>

                <div
                  class="flex flex-wrap items-center justify-between gap-2 mb-1.5"
                >
                  <span
                    class="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                  >
                    {{ item.period }}
                  </span>
                  <span
                    class="font-mono text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    {{ item.type }}
                  </span>
                </div>

                <h3 class="font-display text-xl sm:text-2xl font-medium mt-2">
                  {{ item.role }}
                </h3>
                <p
                  class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5"
                >
                  {{ item.organization }}
                </p>
                <p
                  class="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="reconocimientos"
        aria-labelledby="reconocimientos-titulo"
        @pointerenter="carouselHovered = $event.pointerType === 'mouse'"
        @pointerleave="carouselHovered = false"
        @focusin="carouselFocused = true"
        @focusout="handleCarouselFocusOut"
        class="scroll-mt-20 py-20 sm:py-24 border-t border-neutral-200 dark:border-neutral-800/80"
      >
        <h2
          id="reconocimientos-titulo"
          data-scroll-reveal
          class="mb-10 font-display text-3xl sm:text-4xl font-medium tracking-tight"
        >
          Reconocimientos y certificaciones
        </h2>

        <div
          id="carrusel-reconocimientos"
          ref="credentialTrack"
          data-scroll-reveal
          role="region"
          aria-roledescription="carrusel"
          aria-label="Documentos de reconocimiento y formación"
          tabindex="0"
          @scroll.passive="syncCredentialPosition"
          @touchstart.passive="carouselTouched = true"
          @touchend.passive="carouselTouched = $event.touches.length > 0"
          @touchcancel.passive="carouselTouched = $event.touches.length > 0"
          @keydown.left.self.prevent="showCredential(activeCredential - 1)"
          @keydown.right.self.prevent="showCredential(activeCredential + 1)"
          class="credential-track grid auto-cols-[100%] grid-flow-col snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl border border-neutral-200 bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:border-neutral-800 dark:bg-neutral-900/40"
        >
          <article
            v-for="(credential, index) in credentials"
            :key="credential.title"
            :aria-label="`${index + 1} de ${credentials.length}`"
            class="grid min-w-0 snap-start md:grid-cols-[1.15fr_1fr]"
          >
            <div
              class="flex h-56 items-center justify-center border-b border-neutral-200 bg-gradient-to-br from-emerald-50 to-neutral-100 p-4 sm:h-72 md:border-b-0 md:border-r md:p-6 dark:border-neutral-800 dark:from-emerald-950/40 dark:to-neutral-900"
            >
              <img
                :src="credential.image"
                :alt="'Vista del documento: ' + credential.title"
                :width="credential.width"
                :height="credential.height"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-contain"
              />
            </div>
            <div
              class="flex min-w-0 flex-col items-start justify-center gap-3 p-6 sm:p-8 lg:p-10"
            >
              <p
                class="font-mono text-xs text-emerald-800 dark:text-emerald-300"
                >{{ credential.type }}</p
              >
              <h3
                class="font-display text-2xl font-medium leading-tight lg:text-3xl"
                >{{ credential.title }}</h3
              >
              <p
                class="font-mono text-xs text-neutral-600 dark:text-neutral-400"
                >{{ credential.issuer }}</p
              >
              <p
                class="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                >{{ credential.description }}</p
              >
              <a
                :href="credential.image"
                :aria-label="
                  'Ampliar documento: ' +
                  credential.title +
                  ' (abre en otra pestaña)'
                "
                target="_blank"
                rel="noopener"
                @mouseenter="setCursor('interactive')"
                @mouseleave="setCursor('default')"
                class="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 px-4 py-2.5 font-mono text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-emerald-300/30 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >Ampliar documento <span aria-hidden="true">↗</span></a
              >
            </div>
          </article>
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div
            class="flex items-center gap-1"
            role="group"
            aria-label="Elegir documento"
          >
            <button
              v-for="(credential, index) in credentials"
              :key="credential.title"
              type="button"
              :aria-label="credential.title"
              :aria-current="index === activeCredential ? 'true' : undefined"
              aria-controls="carrusel-reconocimientos"
              @click="showCredential(index)"
              @mouseenter="setCursor('interactive')"
              @mouseleave="setCursor('default')"
              class="grid h-10 w-7 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 sm:w-9"
            >
              <span
                aria-hidden="true"
                class="h-1.5 rounded-full transition-all"
                :class="
                  index === activeCredential
                    ? 'w-5 bg-emerald-700 dark:bg-emerald-300'
                    : 'w-1.5 bg-neutral-400 dark:bg-neutral-600'
                "
              ></span>
            </button>
          </div>
          <div class="flex items-center gap-2 sm:gap-3">
            <span
              :aria-live="autoplayRunning ? 'off' : 'polite'"
              class="mr-1 font-mono text-xs tabular-nums text-neutral-600 dark:text-neutral-400"
            >
              {{ activeCredential + 1 }} / {{ credentials.length }}
            </span>
            <button
              type="button"
              :aria-label="
                autoplayPaused
                  ? 'Reanudar avance automático'
                  : 'Pausar avance automático'
              "
              aria-controls="carrusel-reconocimientos"
              @click="autoplayPaused = !autoplayPaused"
              @mouseenter="setCursor('interactive')"
              @mouseleave="setCursor('default')"
              class="grid size-10 place-items-center rounded-full border border-neutral-300 text-sm transition-colors hover:border-emerald-700 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-neutral-700 dark:hover:border-emerald-300 dark:hover:text-emerald-300"
            >
              <span aria-hidden="true">{{ autoplayPaused ? '▶' : '❚❚' }}</span>
            </button>
            <button
              v-for="direction in [-1, 1]"
              :key="direction"
              type="button"
              :aria-label="
                direction < 0 ? 'Documento anterior' : 'Documento siguiente'
              "
              :disabled="
                direction < 0
                  ? activeCredential === 0
                  : activeCredential === credentials.length - 1
              "
              aria-controls="carrusel-reconocimientos"
              @click="showCredential(activeCredential + direction)"
              @mouseenter="setCursor('interactive')"
              @mouseleave="setCursor('default')"
              class="grid size-10 place-items-center rounded-full border border-neutral-300 text-lg transition-colors enabled:hover:border-emerald-700 enabled:hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-35 dark:border-neutral-700 dark:enabled:hover:border-emerald-300 dark:enabled:hover:text-emerald-300"
            >
              <span aria-hidden="true">{{ direction < 0 ? '←' : '→' }}</span>
            </button>
          </div>
        </div>
      </section>

      <section
        id="stack"
        class="py-20 sm:py-24 border-t border-neutral-200 dark:border-neutral-800/80"
      >
        <div data-scroll-reveal class="mb-12">
          <p
            class="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
          >
            03 / Capacidades Técnicas
          </p>
          <h2
            class="font-display text-3xl sm:text-4xl font-medium tracking-tight"
          >
            Stack Tecnológico e Intereses
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="group in skillGroups"
            data-scroll-reveal
            :key="group.title"
            class="p-6 sm:p-7 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm flex flex-col justify-between transition-colors hover:border-neutral-400 dark:hover:border-neutral-700"
          >
            <div>
              <span
                class="font-mono text-xs text-neutral-400 dark:text-neutral-500"
                >{{ group.index }}</span
              >
              <h3 class="font-display text-xl font-medium mt-1.5 mb-2.5">
                {{ group.title }}
              </h3>
              <p
                class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6"
              >
                {{ group.subtitle }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in group.items"
                :key="skill"
                class="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-paper/80 dark:bg-obsidian/80 text-ink dark:text-paper"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        class="py-20 sm:py-24 border-t border-neutral-200 dark:border-neutral-800/80"
      >
        <div
          class="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md p-8 sm:p-12"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div data-scroll-reveal class="lg:col-span-6 space-y-6">
              <div>
                <p
                  class="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2"
                >
                  04 / Sobre Mí &amp; Contacto
                </p>
                <h2
                  class="font-display text-3xl sm:text-4xl font-medium tracking-tight leading-tight"
                >
                  Construyamos soluciones de software robustas y escalables.
                </h2>
              </div>

              <p
                class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed"
              >
                Abierto a colaboraciones freelance, consultoría en arquitectura
                web, desarrollo de APIs, microservicios y sistemas a la medida.
                Envía un mensaje directo mediante el formulario.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  class="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-paper/70 dark:bg-obsidian/60"
                >
                  <span
                    class="font-mono text-[11px] uppercase tracking-wider text-neutral-400"
                    >Ubicación</span
                  >
                  <p class="font-display text-sm font-medium mt-1"
                    >Ciudad de México, México</p
                  >
                </div>

                <div
                  class="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-paper/70 dark:bg-obsidian/60"
                >
                  <span
                    class="font-mono text-[11px] uppercase tracking-wider text-neutral-400"
                    >Disponibilidad</span
                  >
                  <p
                    class="font-display text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400"
                  >
                    Freelance Activo
                  </p>
                </div>
              </div>

              <div class="pt-2 flex flex-wrap items-center gap-3">
                <button
                  v-if="contactEmail"
                  @click="copyEmail"
                  @mouseenter="setCursor('interactive')"
                  @mouseleave="setCursor('default')"
                  class="px-5 py-3 rounded-full bg-ink text-paper dark:bg-paper dark:text-ink font-display text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>{{
                    emailCopied ? '✓ Correo copiado' : 'Copiar correo'
                  }}</span>
                </button>

                <a
                  v-if="whatsappNumber"
                  :href="whatsappHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir WhatsApp en otra pestaña"
                  @mouseenter="setCursor('interactive')"
                  @mouseleave="setCursor('default')"
                  class="px-5 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm font-medium hover:border-ink dark:hover:border-paper transition-colors"
                >
                  Abrir WhatsApp <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div v-if="contactEmail" data-scroll-reveal class="lg:col-span-6">
              <form
                @submit.prevent="submitContactForm"
                class="p-6 sm:p-8 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-paper/80 dark:bg-obsidian/80 backdrop-blur-md space-y-4"
              >
                <div>
                  <h3 class="font-display text-xl font-semibold mb-1"
                    >Envíame un mensaje</h3
                  >
                  <p
                    class="text-xs text-neutral-500 dark:text-neutral-400 font-mono"
                    >Se abrirá tu aplicación de correo con el mensaje
                    preparado.</p
                  >
                </div>

                <div class="space-y-3">
                  <div>
                    <label
                      for="contact-name"
                      class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
                      >Nombre</label
                    >
                    <input
                      type="text"
                      id="contact-name"
                      v-model.trim="contactForm.name"
                      required
                      placeholder="Tu nombre o empresa"
                      class="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-ink dark:focus:border-paper transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      for="contact-email"
                      class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
                      >Correo Electrónico</label
                    >
                    <input
                      type="email"
                      id="contact-email"
                      v-model.trim="contactForm.email"
                      required
                      placeholder="correo@ejemplo.com"
                      class="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-ink dark:focus:border-paper transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      for="contact-message"
                      class="block font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
                      >Mensaje / Proyecto</label
                    >
                    <textarea
                      id="contact-message"
                      v-model.trim="contactForm.message"
                      required
                      rows="4"
                      placeholder="Cuéntame sobre tu requerimiento, sistema o proyecto..."
                      class="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-ink dark:focus:border-paper transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    @mouseenter="setCursor('interactive')"
                    @mouseleave="setCursor('default')"
                    class="w-full py-3.5 rounded-xl bg-ink text-paper dark:bg-paper dark:text-ink font-display text-sm font-medium hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Abrir correo ↗
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer
      class="w-full max-w-6xl mx-auto px-6 sm:px-10 py-12 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400"
    >
      <p
        >© 2026 Luis Miguel Mora Rocha — Desarrollado con Vue 3 &amp; Tailwind
        CSS.</p
      >
      <div class="flex flex-wrap items-center gap-6">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          @mouseenter="setCursor('interactive')"
          @mouseleave="setCursor('default')"
          class="hover:text-ink dark:hover:text-paper transition-colors"
        >
          {{ social.name }} ↗
        </a>
      </div>
    </footer>

    <transition name="modal-fade">
      <div
        v-if="selectedProject"
        @click.self="closeProjectModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 dark:bg-black/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'modal-title-' + selectedProject.id"
      >
        <div
          class="modal-panel w-full max-w-2xl rounded-3xl bg-paper dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        >
          <div
            class="h-44 sm:h-52 p-6 sm:p-8 flex flex-col justify-between relative text-white"
            :style="{ background: selectedProject.gradient }"
          >
            <div class="flex items-center justify-between">
              <span
                class="px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-xs font-mono uppercase tracking-wider"
              >
                {{ selectedProject.category }} · {{ selectedProject.year }}
              </span>

              <button
                @click="closeProjectModal"
                @mouseenter="setCursor('interactive')"
                @mouseleave="setCursor('default')"
                aria-label="Cerrar detalle del proyecto"
                class="w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 backdrop-blur-md flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div>
              <h3
                :id="'modal-title-' + selectedProject.id"
                class="font-display text-2xl sm:text-3xl font-semibold tracking-tight"
              >
                {{ selectedProject.title }}
              </h3>
            </div>
          </div>

          <div class="p-6 sm:p-8 space-y-6">
            <div>
              <h4
                class="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2"
              >
                Descripción &amp; Alcance
              </h4>
              <p
                class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
              >
                {{ selectedProject.description }}
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div
                v-for="metric in selectedProject.metrics"
                :key="metric.label"
                class="p-3.5 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/60"
              >
                <div class="font-display text-base sm:text-lg font-semibold">{{
                  metric.value
                }}</div>
                <div
                  class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5"
                  >{{ metric.label }}</div
                >
              </div>
            </div>

            <div>
              <h4
                class="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5"
              >
                Stack Tecnológico
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in selectedProject.stack"
                  :key="tech"
                  class="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-200/70 dark:bg-neutral-800 text-ink dark:text-paper"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div
              class="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4"
            >
              <button
                @click="closeProjectModal"
                @mouseenter="setCursor('interactive')"
                @mouseleave="setCursor('default')"
                class="text-sm text-neutral-500 hover:text-ink dark:hover:text-paper transition-colors"
              >
                ← Volver al portafolio
              </button>

              <a
                v-if="selectedProject.githubUrl"
                :href="selectedProject.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="setCursor('interactive')"
                @mouseleave="setCursor('default')"
                class="px-6 py-3 rounded-full bg-ink text-paper dark:bg-paper dark:text-ink font-display text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>Visitar proyecto</span>
                <span>↗</span>
              </a>
              <span
                v-else
                class="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-500 dark:text-neutral-400"
              >
                Sistema Institucional Privado
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
