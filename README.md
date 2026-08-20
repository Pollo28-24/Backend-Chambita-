# 🛠️ Backend - Chambitas

API RESTful desarrollada con **NestJS** y **Prisma ORM** para la gestión y conexión entre clientes y proveedores de servicios independientes (chambitas).

---

## 🚀 Tecnologías Utilizadas

* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Base de Datos:** MySQL / MariaDB
* **ORM:** [Prisma v7](https://www.prisma.io/) con `@prisma/adapter-mariadb`
* **Autenticación:** JWT (JSON Web Tokens) & Bcrypt
* **Documentación:** Swagger / OpenAPI

---

## 📋 Requisitos Previos

Asegúrate de contar con lo siguiente instalado en tu entorno local:

* [Node.js](https://nodejs.org/) (v18 o superior)
* [MySQL](https://www.mysql.com/) o [MariaDB](https://mariadb.org/) corriendo en el puerto `3306`
* Gestor de paquetes `npm`

---

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Pollo28-24/Backend-Chambita-.git
cd Backend-Chambita-
```




### 2. Instalar dependencias
Bash


```
npm install
```




### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base el siguiente formato:

Fragmento de código


```
DATABASE_URL="mysql://usuario:password@localhost:3306/chambitas_db"
JWT_SECRET="tu_clave_secreta_aqui"
PORT=3000
```




## 💾 Base de Datos y Seed de Prueba
El proyecto utiliza un esquema mapeado a `snake_case` y un script de sembrado de datos preparado para pruebas y demostraciones.


1. **Sincronizar el esquema y regenerar el cliente de Prisma:**

Bash


```
npx prisma db push
npx prisma generate
```
2. **Cargar datos de prueba (Seed):**

Bash


```
npx prisma db seed
```
3. **Visualizar la base de datos (Opcional):**

Bash


```
npx prisma studio
```

## 🏃‍♂️ Ejecución de la Aplicación
Bash


```
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```




## 📖 Documentación de la API (Swagger)
Una vez iniciada la aplicación en modo desarrollo, la documentación interactiva de los endpoints estará disponible en:

👉 **`http://localhost:3000/api/docs`**


### Credenciales de Prueba (Cargadas con el Seed)

- **Cliente:** `cliente@test.com` | `password123`
- **Trabajador:** `trabajador@test.com` | `password123`