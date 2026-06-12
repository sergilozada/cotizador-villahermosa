import csv
import json
from pathlib import Path
import re

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
INPUT_PATH = ROOT_DIR / 'data' / 'COTIZADOR.csv'
OUTPUT_PATH = ROOT_DIR / 'data' / 'cotizadores.json'

with INPUT_PATH.open(newline='', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    rows = [row for row in reader]

# Helper: get non-empty cells

def clean_cells(row):
    return [cell.strip() for cell in row if cell.strip()]

# Extract advisor names from the top block
advisors = []
months = {'12', '24', '36', '48', '60', '72', '84'}
for row in rows[:10]:
    cells = clean_cells(row)
    if not cells:
        continue
    if any(cell in months for cell in cells):
        for cell in cells:
            if re.match(r'^[A-ZÁÉÍÓÚÑ ]+$', cell) and cell not in {'COTIZADOR DE VENTA', 'ASESOR(A)', 'SISTEMA', 'FINANCIADO', 'AL CONTADO'}:
                advisors.append(cell.title())
    elif len(cells) >= 2 and cells[0] == 'ASESOR(A)' and cells[1]:
        advisors.append(cells[1].title())

# Deduplicate and preserve order
seen = set()
advisors = [a for a in advisors if not (a in seen or seen.add(a))]

# Extract key/value pairs from the rest of the document
fields = {}
for row in rows:
    cells = [cell.strip() for cell in row]
    for idx, cell in enumerate(cells):
        if not cell:
            continue
        if cell.endswith(':'):
            label = cell[:-1].strip()
            value = None
            for next_cell in cells[idx + 1:]:
                if next_cell.strip():
                    value = next_cell.strip()
                    break
            if value is not None:
                fields[label] = value

# Normalize some keys
normalize_map = {
    'CLIENTE': 'cliente',
    'CODIGO': 'codigo',
    'MZ': 'mz',
    'LOTE': 'lote',
    'ETAPA': 'etapa',
    'UBICACIÓN': 'ubicacion',
    'METRAJE': 'metraje',
    'FECHA': 'fecha',
    'SISTEMA': 'sistema',
    'MESES': 'meses',
    'PRECIO LISTA': 'precioLista',
    'DSCTO POR LANZAMIENTO': 'descuentoLanzamiento',
    'PRECIOS FINAL FINANCIADO': 'precioFinalFinanciado',
    'INICIAL': 'inicial',
    'VALOR DE CUOTA': 'valorCuota',
    'DSCTO. AL CONTADO': 'descuentoContado',
    'PRECIOS FINAL AL CONTADO': 'precioFinalContado',
}

result = {
    'advisors': advisors,
    'quote': {},
}

for label, value in fields.items():
    normalized = normalize_map.get(label, None)
    if normalized:
        result['quote'][normalized] = value

with OUTPUT_PATH.open('w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'Wrote {OUTPUT_PATH} with {len(advisors)} advisors and {len(result["quote"])} quote fields.')
