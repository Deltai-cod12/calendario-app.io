#  Mi Calendario

Aplicación web de calendario y recordatorios, hecha con amor. Funciona completamente en el frontend y puede desplegarse en GitHub Pages.

##  Características

-  Vista de dashboard con saludo, mensaje del día y eventos
-  Calendario mensual interactivo
-  Gestión de recordatorios con filtros y búsqueda
-  Integración opcional con Google Calendar (sincronización, recordatorios por correo)
-  Modo local (sin Google Calendar): los eventos se guardan en el navegador
-  Diseño responsive para móvil y escritorio

##  Inicio rápido (sin Google Calendar)

```bash
npm install
npm run dev
```

Abre http://localhost:5173 — los eventos se guardarán localmente en el navegador.

##  Configurar Google Calendar (opcional)

### 1. Crear credenciales en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (o selecciona uno existente)
3. En el menú lateral → **APIs y servicios** → **Biblioteca**
4. Busca y habilita **Google Calendar API**
5. Ve a **APIs y servicios** → **Credenciales**

### 2. Crear API Key

1. Clic en **Crear credenciales** → **Clave de API**
2. Copia la clave generada
3. (Opcional) Restringe la clave a Google Calendar API

### 3. Crear OAuth 2.0 Client ID

1. Clic en **Crear credenciales** → **ID de cliente de OAuth**
2. Tipo de aplicación: **Aplicación web**
3. En **Orígenes JavaScript autorizados** agrega:
   - `http://localhost:5173` (desarrollo local)
   - `https://TU_USUARIO.github.io` (producción)
4. Copia el **Client ID**

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=tu_api_key
```

##  Despliegue en GitHub Pages

### Opción A: Automático con GitHub Actions

1. Sube el código a un repositorio de GitHub
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Agrega los secrets:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_API_KEY`
4. Ve a **Settings** → **Pages** → Source: **GitHub Actions**
5. El workflow se ejecuta automáticamente en cada push a `main`

### Opción B: Manual

```bash
npm run build
# Sube la carpeta /dist a tu servidor o GitHub Pages manualmente
```

### Ajustar la base URL

En `vite.config.js`, cambia la base al nombre de tu repositorio:

```js
base: '/nombre-de-tu-repo/',
```

##  Tecnologías

- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router** (HashRouter para GitHub Pages)
- **Google Calendar API** + **Google Identity Services**

##  Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx        # Navegación lateral (desktop) y bottom (móvil)
│   ├── EventModal.jsx    # Modal para crear/editar eventos
│   ├── EventCard.jsx     # Tarjeta de evento
│   └── MiniCalendar.jsx  # Calendario pequeño para dashboard
├── context/
│   └── GoogleCalendarContext.jsx  # Estado global + API de Google
├── data/
│   └── messages.js       # Mensajes del día (65 mensajes únicos)
├── utils/
│   └── dateUtils.js      # Funciones de fechas
└── views/
    ├── Dashboard.jsx     # Vista principal
    ├── CalendarView.jsx  # Vista de calendario mensual
    └── RemindersView.jsx # Vista de recordatorios
```

##  Créditos

Hecho con amor como regalo personal.
