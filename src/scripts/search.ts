/**
 * Client-Side Search
 * Reads the "q" query parameter from the URL, filters a static data array
 * of Sophy Music pages, and renders matching results into #search-results.
 */

interface SearchItem {
  title: string;
  description: string;
  path: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const resultContainer = document.getElementById('search-results');
  const resultTitle = document.getElementById('result-title');

  if (!resultContainer) return;

  // Detect current language from URL path
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const lang = pathParts[0] || 'es';

  const data: SearchItem[] = [
    {
      title: 'Sophy Music - Home',
      description:
        'Tu Música, Sin Límites, En Todas Partes. Sophy Music es la plataforma ideal para músicos que buscan agilizar el proceso de difusión y monetización de sus canciones. Distribución global, regalías al 100%, analíticas en tiempo real.',
      path: '',
    },
    {
      title: 'About - Sobre Nosotros',
      description:
        'Quiénes somos y qué ofrecemos. Nos especializamos en crear estrategias prácticas de exposición digital que impulsan el crecimiento de los artistas. Más de 10 años de experiencia en distribución musical.',
      path: 'about',
    },
    {
      title: 'Contact - Contacto',
      description:
        'Contáctanos para soluciones personalizadas de distribución musical. Email: info@sophymusic.com. Dirección: 8206 Louisiana Blvd Ne, Ste A #8279, Albuquerque, New Mexico.',
      path: 'contact',
    },
    {
      title: 'Solo Sound',
      description:
        'Plan ideal para artistas individuales. Distribución en más de 450 plataformas, canciones y álbumes ilimitados, códigos ISRC y UPC incluidos. Te quedas con el 100% de tus regalías. $10/año.',
      path: 'solo-sound',
    },
    {
      title: 'Two Fusion',
      description:
        'Ideal si gestionas dos artistas o tienes un proyecto musical dual. Gestión de hasta 2 perfiles de artista, prioridad en revisión y entrega, reparto de regalías automáticas. $20/año.',
      path: 'two-fusion',
    },
    {
      title: 'Label Epic',
      description:
        'Gestión total y distribución para un número ilimitado de artistas. Suite completa de gestión para sellos discográficos, panel de control completo, acceso multiusuario, analíticas avanzadas. $50/año.',
      path: 'label-epic',
    },
    {
      title: 'Services - Servicios',
      description:
        'Nuestras especialidades: Distribución Global en Tiendas, Regalías y Pagos, Análisis de Tendencias, Derechos y Monetización, Colaboración y Repartos, Catálogo y Automatización de Flujo de Trabajo.',
      path: 'service',
    },
    {
      title: 'Team - Equipo',
      description:
        'Conoce al equipo detrás de Sophy Music. Un equipo apasionado por la música y la tecnología, dedicado a impulsar la carrera de artistas en todo el mundo.',
      path: 'team',
    },
    {
      title: 'Privacy Policy - Política de Privacidad',
      description:
        'Política de Privacidad de Sophy Music LLC. Información sobre cómo recopilamos, utilizamos y protegemos sus datos personales.',
      path: 'privacy-policy',
    },
    {
      title: 'Terms of Use - Términos de Uso',
      description:
        'Términos y condiciones de uso de los servicios de Sophy Music LLC. Derechos, responsabilidades y acuerdos legales.',
      path: 'terms-of-use',
    },
    {
      title: 'GDPR',
      description:
        'Cumplimiento del Reglamento General de Protección de Datos. Derechos de los usuarios de la Unión Europea respecto a sus datos personales.',
      path: 'gdpr',
    },
    {
      title: 'Anti-Fraud Policy - Política Anti-Fraude',
      description:
        'Política contra el fraude de Sophy Music LLC. Medidas de protección contra streaming artificial, manipulación de metadatos y actividades fraudulentas.',
      path: 'anti-fraud-policy',
    },
  ];

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('q');

  if (keyword) {
    if (resultTitle) {
      resultTitle.textContent = `"${keyword}" — Sophy Music`;
    }

    const results = data.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (results.length > 0) {
      results.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'result';
        div.innerHTML = `
          <a href="/${lang}/${item.path}"><h2>${item.title}</h2></a>
          <p>${item.description}</p>
        `;
        resultContainer.appendChild(div);
      });
    } else {
      resultContainer.innerHTML = '<p>No results found.</p>';
    }
  } else {
    if (resultTitle) {
      resultTitle.textContent = '';
    }
  }
});
