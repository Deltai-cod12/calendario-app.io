# Personal Calendar & Reminders | Calendario personal y recordatorios

**Repository name suggestion:** `calendar-reminders-app`  
**Nombre en español:** `Calendario personal y recordatorios`  
**Description:** Responsive React calendar and reminders app with local browser storage and optional Google Calendar integration.

## English

### Overview

A responsive personal calendar built with React and Vite. It includes a dashboard, monthly calendar, event creation and editing, and a reminders view. It can work locally in the browser or connect to Google Calendar when API credentials are configured.

### Features

- Dashboard with daily greeting and upcoming events
- Interactive monthly calendar
- Create, edit, delete, search and filter reminders/events
- Local mode for using the app without Google Calendar
- Optional Google Calendar sign-in and synchronization
- Responsive layout, dark mode and mobile navigation

### Technology

- React 18, Vite and JavaScript
- Tailwind CSS
- React Router with `HashRouter` for static hosting
- Day.js and Lucide React
- Google Calendar API and Google Identity Services (optional)
- GitHub Actions workflow for GitHub Pages

### Requirements

- Node.js and npm
- Google Cloud project credentials only if enabling Google Calendar integration

### Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Without Google credentials, the app can be explored in local mode.

### Optional Google Calendar setup

Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id
VITE_GOOGLE_API_KEY=your_api_key
```

Enable the Google Calendar API in Google Cloud and configure the OAuth consent screen and authorized JavaScript origins for local development and the deployed site. Do not commit real credentials. The OAuth flow requests calendar access.

### Build

```bash
npm run build
npm run preview
```

The `main` branch includes a GitHub Actions workflow for GitHub Pages. Its build expects `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY` to be configured as repository Actions secrets if the integration is enabled.

### Documentation

See the repository [README and source](https://github.com/Deltai-cod12/calendario-app.io).

## Español

### Descripción

Calendario personal adaptable a móvil, desarrollado con React y Vite. Incluye un panel principal, calendario mensual, creación y edición de eventos y una vista de recordatorios. Puede funcionar localmente en el navegador o conectarse a Google Calendar al configurar credenciales.

### Funciones

- Panel con saludo diario y próximos eventos
- Calendario mensual interactivo
- Crear, editar, eliminar, buscar y filtrar eventos y recordatorios
- Modo local sin conexión con Google Calendar
- Inicio de sesión y sincronización opcional con Google Calendar
- Diseño adaptable, modo oscuro y navegación móvil

### Tecnologías

- React 18, Vite y JavaScript
- Tailwind CSS
- React Router con `HashRouter` para hosting estático
- Day.js y Lucide React
- Google Calendar API y Google Identity Services (opcional)
- Flujo de GitHub Actions para GitHub Pages

### Requisitos

- Node.js y npm
- Credenciales de Google Cloud únicamente si activarás la integración con Google Calendar

### Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite. La aplicación puede probarse en modo local sin credenciales de Google.

### Configuración opcional de Google Calendar

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_CLIENT_ID=tu_cliente_oauth
VITE_GOOGLE_API_KEY=tu_api_key
```

Activa Google Calendar API en Google Cloud y configura la pantalla de consentimiento OAuth y los orígenes JavaScript autorizados para desarrollo local y el sitio publicado. No subas credenciales reales al repositorio. El flujo OAuth solicita acceso al calendario.

### Compilar

```bash
npm run build
npm run preview
```

La rama `main` incluye un flujo de GitHub Actions para GitHub Pages. Si se activa la integración, la compilación espera que `VITE_GOOGLE_CLIENT_ID` y `VITE_GOOGLE_API_KEY` estén definidos como secretos de Actions.

### Documentación

Consulta el [README y el código fuente del repositorio](https://github.com/Deltai-cod12/calendario-app.io).

---

**Topics:** `react`, `vite`, `javascript`, `tailwindcss`, `calendar`, `reminders`, `google-calendar-api`, `google-identity-services`, `github-pages`, `responsive-design`
