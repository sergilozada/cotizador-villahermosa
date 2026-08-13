# Cotizador Villa Hermosa

[](https://github.com/sergilozada/cotizador-villa-hermosa#cotizador-villa-hermosa)
Sistema web para cotizar lotes de segunda etapa de Villa Hermosa desde `data/precios.json`, generado a partir de las listas de contado y financiado de etapa 2.

## Descripción

[](https://github.com/sergilozada/cotizador-villa-hermosa#descripci%C3%B3n)
Cotizador Villa Hermosa es una aplicación web ligera de cotización inmobiliaria que permite consultar precios de lotes de segunda etapa, calcular propuestas de pago y generar cotizaciones listas para imprimir o compartir.

## Funcionalidades principales

[](https://github.com/sergilozada/cotizador-villa-hermosa#funcionalidades-principales)

- Carga de lotes de segunda etapa por código, manzana, lote y ubicación.
- Cálculo automático de precio según modalidad de pago.
- Selección de pago al contado o financiación.
- Ajuste de enganche, plazo y descuento adicional.
- Guardado local de cotizaciones en el navegador.
- Historial de cotizaciones con carga y eliminación.
- Copiar resumen de cotización al portapapeles.
- Impresión optimizada de la propuesta.

## Tecnologías utilizadas

[](https://github.com/sergilozada/cotizador-villa-hermosa#tecnolog%C3%ADas-utilizadas)

- HTML
- CSS
- JavaScript
- Electron (aplicación portátil para Windows)
- Netlify (configuración de despliegue estático)
- Python (scripts de conversión CSV a JSON)

## Datos

Los archivos fuente conservados para precios son:

- `data/LISTAPRECIOSCONTADOSEGUNDAETAPA.xlsx`
- `data/LISTAPRECIOSFINANCIADOSEGUNDAETAPA.xlsx`
- `data/PRECIOS_ETAPA_2_CONTADO.csv`
- `data/PRECIOS_ETAPA_2_FINANCIADO.csv`

La app consume `data/precios.json`, generado con `scripts/import_stage2_prices.py`.

## Sitio web

[](https://github.com/sergilozada/cotizador-villa-hermosa#sitio-web)
[https://cotizadorvillahermosa.netlify.app/](https://cotizadorvillahermosa.netlify.app/)

## Aplicación para Android (PWA)

Abre el sitio en **Google Chrome para Android**, presiona **Instalar en Android**
en el acceso y confirma **Instalar**. El cotizador queda disponible desde el icono
de Villa Hermosa en la pantalla de inicio y se abre sin la barra del navegador.

La aplicación requiere internet para iniciar sesión y cargar precios vigentes. Por
seguridad comercial, el service worker no guarda usuarios, precios ni cotizaciones
en caché. El historial local se separa por agente en cada dispositivo.

## Aplicación portátil para Windows

La versión de escritorio abre el mismo cotizador publicado en Netlify, por lo que
recibe los cambios del sitio al volver a abrirla. Cada vez que inicia muestra un
selector de agente sin contraseña; el sitio móvil continúa usando usuario y
contraseña.

```powershell
npm install
npm run desktop:build
```

El archivo generado queda en
`dist/Cotizador-Villa-Hermosa-Portable.exe`. Para cambiar de agente durante una
sesión, usa **Aplicación → Cambiar agente**. Si se elige un agente diferente, la app
borra el historial local anterior para proteger los datos de clientes.

La aplicación requiere conexión a internet. Un ejecutable sin certificado de firma
puede mostrar la advertencia SmartScreen de Windows en el primer inicio.

## Repositorio

[](https://github.com/sergilozada/cotizador-villa-hermosa#repositorio)
[https://github.com/sergilozada/cotizador-villa-hermosa](https://github.com/sergilozada/cotizador-villa-hermosa)

## Objetivo del proyecto

[](https://github.com/sergilozada/cotizador-villa-hermosa#objetivo-del-proyecto)
El objetivo de este proyecto es facilitar la cotización rápida de lotes de Villa Hermosa mediante una interfaz sencilla y datos estructurados, permitiendo a asesores y clientes tomar decisiones de compra con cálculos claros y accesibles.
