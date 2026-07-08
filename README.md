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

## Repositorio

[](https://github.com/sergilozada/cotizador-villa-hermosa#repositorio)
[https://github.com/sergilozada/cotizador-villa-hermosa](https://github.com/sergilozada/cotizador-villa-hermosa)

## Objetivo del proyecto

[](https://github.com/sergilozada/cotizador-villa-hermosa#objetivo-del-proyecto)
El objetivo de este proyecto es facilitar la cotización rápida de lotes de Villa Hermosa mediante una interfaz sencilla y datos estructurados, permitiendo a asesores y clientes tomar decisiones de compra con cálculos claros y accesibles.
