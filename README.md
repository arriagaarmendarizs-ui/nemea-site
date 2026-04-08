[README.md](https://github.com/user-attachments/files/26557151/README.md)
# NEMEA — Investor Portal

Sitio web para inversionistas de Nemea Pictures con modelo financiero interactivo.

**Password de acceso:** `nemea2026` (cámbialo en `src/App.jsx` línea 3)

---

## Deployment en Vercel (paso a paso)

### 1. Sube el proyecto a GitHub

```bash
# En tu terminal, navega a esta carpeta
cd nemea-site

# Inicializa git
git init
git add .
git commit -m "Nemea investor portal"

# Crea un repo PRIVADO en github.com y conecta
git remote add origin https://github.com/TU-USUARIO/nemea-investors.git
git branch -M main
git push -u origin main
```

> ⚠️ **IMPORTANTE:** Crea el repo como PRIVADO — contiene información financiera confidencial.

### 2. Conecta con Vercel

1. Ve a [vercel.com](https://vercel.com) y crea cuenta (gratis) con tu GitHub
2. Click **"Add New Project"**
3. Selecciona el repo `nemea-investors`
4. Vercel detecta automáticamente que es Vite — no cambies nada
5. Click **"Deploy"**
6. En ~60 segundos tendrás tu sitio en `nemea-investors.vercel.app`

### 3. Conecta tu dominio

1. En Vercel, ve a **Settings → Domains**
2. Escribe tu dominio (ej: `investors.nemeapictures.com`)
3. Vercel te dará un registro DNS para configurar:
   - Si usas subdominio (investors.nemeapictures.com): agrega un **CNAME** apuntando a `cname.vercel-dns.com`
   - Si usas dominio raíz (nemeapictures.com): agrega un **A record** apuntando a `76.76.21.21`
4. Configura el DNS en tu registrador (GoDaddy, Namecheap, Cloudflare, etc.)
5. Espera 5-30 minutos para propagación
6. Vercel genera SSL automáticamente (https)

### 4. Cambiar el password

Edita `src/App.jsx`, línea 3:
```javascript
const CODE = "tu-nuevo-codigo";
```

Haz push a GitHub y Vercel re-deploya automáticamente.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

---

## Estructura

```
nemea-site/
├── index.html          # HTML base
├── package.json        # Dependencias
├── vite.config.js      # Config de Vite
├── src/
│   ├── main.jsx        # Entry point
│   └── App.jsx         # Todo el sitio (landing + gate + dashboard)
└── public/             # Assets estáticos (favicon, etc.)
```

## Notas

- El sitio tiene `<meta name="robots" content="noindex, nofollow">` para que Google no lo indexe
- Todo el modelo financiero corre en el browser — no hay backend ni base de datos
- El password es client-side (suficiente para disuadir acceso casual, no es seguridad real)
- Para seguridad robusta, considera Vercel Password Protection (plan Pro, $20/mes)
