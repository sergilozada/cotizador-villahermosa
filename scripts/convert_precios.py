import csv
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
INPUT_PATH = ROOT_DIR / 'data' / 'PRECIOS.csv'
OUTPUT_PATH = ROOT_DIR / 'data' / 'precios.json'

with INPUT_PATH.open(newline='', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    rows = [row for row in reader]

header_row = None
header_index = None
for index, row in enumerate(rows):
    if any(cell.strip() == 'N°' for cell in row):
        header_row = [cell.strip().replace('\ufeff', '') for cell in row]
        header_index = index
        break

if header_row is None:
    raise ValueError('No se encontró la fila de encabezado con "N°" en PRECIOS.csv')

if header_row and header_row[0] == '':
    header_row = header_row[1:]

field_map = {
    'N°': 'index',
    'CODIGO': 'codigo',
    'MZ': 'mz',
    'LOTE': 'lote',
    'ETAPA': 'etapa',
    'AREA': 'area',
    'UBICACIÓN': 'ubicacion',
    'PRECIO LISTA': 'precioLista',
    'DSCTO POR PRE-VENTA': 'descuentoPreventa',
    'PRECIO FINAL': 'precioFinal',
    'INICIAL': 'inicial',
}

items = []
for row in rows[header_index + 1:]:
    if not any(cell.strip() for cell in row):
        continue
    if row and row[0] == '':
        row = row[1:]
    row = row[: len(header_row)]
    if len(row) < len(header_row):
        row += [''] * (len(header_row) - len(row))
    raw_item = dict(zip(header_row, [cell.strip() for cell in row]))
    if not raw_item.get('CODIGO'):
        continue
    item = {}
    for source_key, target_key in field_map.items():
        item[target_key] = raw_item.get(source_key, '')
    items.append(item)


def parse_number(value):
    if value is None:
        return None
    value = str(value).strip()
    if not value:
        return None
    value = value.replace('S/', '').replace('s/', '').replace(' ', '').replace(',', '')
    try:
        return float(value)
    except ValueError:
        try:
            return float(value.replace('.', '').replace(',', '.'))
        except ValueError:
            return None

for item in items:
    item['area'] = parse_number(item['area'])
    item['precioLista'] = parse_number(item['precioLista'])
    item['descuentoPreventa'] = parse_number(item['descuentoPreventa'])
    item['precioFinal'] = parse_number(item['precioFinal'])
    item['inicial'] = parse_number(item['inicial'])

with output_path.open('w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print(f'Wrote {len(items)} items to {output_path}')
