# Cotizador Villa Hermosa

Prototipo web para cotizar lotes de Villa Hermosa directamente desde los datos de `data/PRECIOS.csv`.

## Estructura de archivos

- `src/index.html` — interfaz de usuario principal.
- `src/styles.css` — estilos visuales y layout responsivo.
- `src/script.js` — lógica de carga de datos, filtrado, cotización y guardado.
- `data/precios.json` — dataset normalizado generado desde `data/PRECIOS.csv`.
- `data/PRECIOS.csv` — datos de precios originales.
- `data/COTIZADOR.csv` — datos de cotización originales.
- `scripts/convert_precios.py` — script para generar `data/precios.json` desde el CSV.
- `scripts/parse_cotizador.py` — script para generar `data/cotizadores.json` desde el CSV.

## Qué incluye ahora

- Filtro de lotes por código, etapa y ubicación.
- Cálculo de cotización para lote seleccionado.
- Elección de tipo de pago: financiado o contado.
- Ajuste de plazo, enganche y descuento adicional.
- Guardado de cotizaciones en el navegador.
- Historial de propuestas con carga y eliminación.
- Copiar resumen al portapapeles.
- Impresión de cotización.

## Cómo usar

1. Instala dependencias en la carpeta del proyecto:
   - `npm install`
2. Inicia el servidor de desarrollo:
   - `npm run dev`
3. Abre en el navegador la URL que se muestre (por ejemplo `http://127.0.0.1:4173`).
4. Selecciona un lote de la tabla.
5. Ajusta tipo de pago, plazo, enganche y descuento.
6. Usa los botones para copiar, imprimir o guardar la cotización.

## Despliegue en Netlify

1. Crea un repositorio en GitHub y sube este proyecto.
2. Abre Netlify y conecta tu repositorio.
3. En los ajustes del sitio, establece el directorio de publicación en la raíz del repositorio (`.`).
4. Netlify usará `src/index.html` como página de inicio gracias al archivo `_redirects`.
5. Al desplegar, la aplicación quedará disponible como sitio estático.

## Cómo actualizar datos

1. Modifica `PRECIOS.csv` con tus precios.
2. Ejecuta `python convert_precios.py` para regenerar `precios.json`.
3. Recarga `index.html` en el navegador.
