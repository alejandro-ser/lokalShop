# LokalShop

**Versión en inglés:** la misma guía está en [README.md](README.md).

Tienda e-commerce demo construida con **SvelteKit**, **adapter-static** (GitHub Pages), **IndexedDB** para carrito y caché, **Supabase** para pedidos en la nube y **melibo** para chat y formulario de contacto.

|                       Inicio                       |                  Carrito                  |
| :------------------------------------------------: | :---------------------------------------: |
| ![Página de inicio](src/lib/assets/img/0_home.png) | ![Carrito](src/lib/assets/img/1_cart.png) |

|                     Mis pedidos                      |                             Panel admin                              |
| :--------------------------------------------------: | :------------------------------------------------------------------: |
| ![Mis pedidos](src/lib/assets/img/2_user_orders.png) | ![Panel de administración](src/lib/assets/img/3_admin_dashboard.png) |

---

## Requisitos previos

- **Node.js** 25.9.0 (ver `package.json` → `engines` y `mise.toml`)
- **pnpm** — este proyecto usa **solo** `pnpm` para dependencias y scripts

Instalar pnpm (si no lo tienes):

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

---

## 1. Clonar e instalar dependencias

```bash
git clone https://github.com/alejandro-ser/lokalShop.git
cd lokalShop
pnpm install
```

`pnpm install` respeta `pnpm-lock.yaml` y deja el entorno listo para desarrollo y build.

---

## 2. Variables de entorno (`.env`)

Copia el ejemplo y edítalo:

```bash
cp .env.example .env
```

Contenido esperado de **`.env.example`** / **`.env`** (todas son `PUBLIC_*` para que Vite y SvelteKit las inyecten en build con `$env/static/public`):

| Variable                    | Descripción                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `PUBLIC_API_BASE`           | URL base de la API de productos (por defecto Platzi Fake Store). |
| `PUBLIC_SUPABASE_URL`       | URL del proyecto Supabase.                                       |
| `PUBLIC_SUPABASE_ANON_KEY`  | Clave anónima (`anon` / `public`) de Supabase.                   |
| `PUBLIC_ADMIN_HASH`         | Hash SHA-256 del secreto de admin (ver sección Admin).           |
| `PUBLIC_MELIBO_WIDGET_KEY`  | Clave del widget de chat melibo.                                 |
| `PUBLIC_MELIBO_CONTACT_KEY` | Clave del canal del formulario melibo en `/contacto`.            |

Tras cambiar `.env`, regenera tipos de SvelteKit:

```bash
pnpm exec svelte-kit sync
```

---

## 3. API de productos (Platzi Fake Store)

Los listados de productos y categorías vienen de una API HTTP configurada con **`PUBLIC_API_BASE`**.

- **Documentación / exploración:** [Fake Store API (EscuelaJS)](https://fakeapi.platzi.com/) — ahí puedes ver endpoints, filtros y el esquema de datos.
- **Base URL típica:** `https://api.escuelajs.co/api/v1`  
  En `.env`:

```env
PUBLIC_API_BASE=https://api.escuelajs.co/api/v1
```

No necesitas cuenta en Platzi solo para consumir la API pública; basta con la URL correcta.

---

## 4. Supabase (pedidos en la nube)

El checkout guarda pedidos en **IndexedDB** y en paralelo en Supabase (tabla `orders`), para panel admin, perfil “mis pedidos” e integraciones (p. ej. melibo).

### 4.1 Crear proyecto

1. Entra en [Supabase](https://supabase.com/) e inicia sesión.
2. **New project** → elige organización, nombre, región y contraseña de la base de datos.
3. En el dashboard del proyecto: **Settings → API**:
   - Copia **Project URL** → `PUBLIC_SUPABASE_URL`
   - Copia **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`

### 4.2 Tabla `orders`

En **SQL Editor** (Supabase → **SQL Editor**) puedes crear la tabla alineada con el tipo `Order` de la app (`src/lib/types/api.ts`). Ejemplo mínimo:

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(12,2) not null,
  customer_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
```

Ajusta tipos o el `default` de `id` si en tu código generas el UUID en el cliente (entonces `id` puede ser `text` o `uuid` sin default en base).

### 4.3 Row Level Security (RLS)

Sin políticas adecuadas, los `insert`/`update`/`delete` desde el cliente pueden **no afectar filas** sin error claro. Configura políticas para el rol **`anon`** según tu modelo de seguridad (demo: a menudo se permiten insert/select/update/delete para pruebas; en producción restringe por usuario o usa Edge Functions).

---

## 5. melibo (chat y formulario de contacto)

- **Panel melibo:** [melibo](https://melibo.de) (inicia sesión en tu cuenta).
- **Widget de chat:** crea o abre un **widget / canal de chat** y copia la **key** del widget → `PUBLIC_MELIBO_WIDGET_KEY` (se usa en `+layout.svelte` al cargar `melibo-widget`).
- **Formulario de contacto:** crea un **formulario / canal de contacto** y copia el **channel-key** (o equivalente que indique la documentación) → `PUBLIC_MELIBO_CONTACT_KEY` (página `/contacto`).

Si dejas estas variables vacías, la app sigue funcionando; simplemente no cargará el widget ni el formulario externo.

---

## 6. Contraseña de administrador (`PUBLIC_ADMIN_HASH`)

El acceso a **`/admin-preview`** compara el hash del navegador con el valor compilado en `PUBLIC_ADMIN_HASH`.

1. Elige un **usuario** y una **contraseña** (solo para demo).
2. El hash esperado es **SHA-256 en hexadecimal** de la cadena:

   `usuario:contraseña`  
   (literalmente dos puntos entre usuario y contraseña, sin espacios extra).

3. Genera el hash en la terminal:

```bash
printf '%s' 'miUsuario:miContraseñaSegura' | shasum -a 256
```

En Linux sin `shasum`:

```bash
printf '%s' 'miUsuario:miContraseñaSegura' | sha256sum
```

4. Copia solo los **64 caracteres hex** del resultado a `.env`:

```env
PUBLIC_ADMIN_HASH=abcdef0123...
```

5. En la pantalla de login de admin usa **exactamente** el mismo `miUsuario` y `miContraseñaSegura`.

---

## 7. Arrancar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:5173](http://localhost:5173) (o la URL que muestre Vite).

Rutas útiles:

| Ruta                       | Uso                                    |
| -------------------------- | -------------------------------------- |
| `/`                        | Inicio                                 |
| `/products`, `/categories` | Catálogo                               |
| `/cart`                    | Carrito y checkout (email + pedido)    |
| `/profile`                 | Perfil y búsqueda de pedidos por email |
| `/contacto`                | Formulario melibo                      |
| `/admin-preview/login`     | Login admin                            |
| `/admin-preview`           | Panel de pedidos (requiere sesión)     |

---

## 8. Build de producción

```bash
pnpm build
pnpm preview
```

Salida estática en la carpeta **`build/`**, pensada para **GitHub Pages** con `fallback: '404.html'` en `svelte.config.js`.

---

## 9. Despliegue en GitHub Pages (CI/CD)

El workflow **`.github/workflows/deploy.yml`** instala con `pnpm`, ejecuta `pnpm build` inyectando **secrets** `PUBLIC_*`, y publica el artefacto con **GitHub Pages**.

En el repositorio: **Settings → Secrets and variables → Actions** — añade los mismos nombres que en `.env` (por ejemplo `PUBLIC_SUPABASE_URL`, `PUBLIC_ADMIN_HASH`, etc.).

En **Settings → Pages**: origen **GitHub Actions** (no la rama `gh-pages` clásica, salvo que lo cambies tú).

Para un repo **`usuario.github.io/nombre-repo/`**, el workflow define `BASE_PATH` como `/${{ github.event.repository.name }}` para que enlaces y assets resuelvan bien.

---

## 10. Scripts útiles (`package.json`)

| Comando        | Descripción                 |
| -------------- | --------------------------- |
| `pnpm dev`     | Servidor de desarrollo      |
| `pnpm build`   | Build estático              |
| `pnpm preview` | Previsualizar el build      |
| `pnpm check`   | `svelte-check` + TypeScript |
| `pnpm lint`    | Prettier + ESLint           |

---

## 11. Datos locales (IndexedDB)

El nombre de la base IndexedDB está en `src/lib/services/db.ts` (`DB_NAME`). Si lo cambias, el navegador usará una base nueva (carrito y caché “limpios”).

---

## Licencia y datos de demo

Los textos legales y el catálogo son orientativos; la API de Platzi sirve datos ficticios. Ajusta Impressum, privacidad y RLS antes de un uso real.
