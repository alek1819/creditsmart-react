# 💳 CreditSmart — Aplicación Web Dinámica con React

**Autores:**  
👩‍💻 Sofía González Herrera  
👨‍💻 Henry Alejandro Giraldo Carmona  

---

## 🎯 Objetivo del Proyecto

Construir una aplicación web dinámica con React que permita:

- Mostrar créditos desde un array de objetos.  
- Simular montos, cuotas y tasas en tiempo real.  
- Gestionar un formulario con validaciones y resumen final.  
- Aplicar diseño responsive y componentes reutilizables.  

---

## 📘 Descripción General

CreditSmart es una SPA desarrollada con **React + Vite**.  
Incluye tres vistas principales:

1. **Home** — Muestra todos los créditos usando tarjetas dinámicas.  
2. **Simulador** — Permite filtrar, buscar y calcular cuotas de crédito.  
3. **Solicitar** — Formulario con validaciones, cálculo automático y resumen previo.

---

## 🧱 Estructura del Proyecto

```bash
📂 CREDITS   MART-REACT/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── CreditSmart.svg
│   │
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── simulador.css
│   │   └── solicitar.css
│   │
│   ├── data/
│   │   └── creditsData.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Simulador.jsx
│   │   └── Solicitar.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md

# Clonar el repositorio
git clone https://github.com/alek1819/credismart-react

# Instalar dependencias
npm install

# Ejecutar modo desarrollo
npm run dev
