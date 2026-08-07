import csv
import json
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"

FINANCED_CSV = DATA_DIR / "PRECIOS_ETAPA_2_FINANCIADO.csv"
CASH_CSV = DATA_DIR / "PRECIOS_ETAPA_2_CONTADO.csv"
OUTPUT_PATH = DATA_DIR / "precios.json"


def parse_number(value):
    if value is None:
        return None

    text = str(value).strip()

    if not text:
        return None

    text = text.replace("S/", "").replace("s/", "").replace(" ", "")
    text = text.replace(",", "")

    try:
        return float(text)
    except ValueError:
        return None


def clean_row(row):
    if row and row[0].strip() == "":
        row = row[1:]

    return [cell.strip().replace("\ufeff", "") for cell in row]


def read_csv(path):
    with path.open(newline="", encoding="utf-8-sig") as file:
        reader = csv.reader(file, delimiter=";")
        rows = [clean_row(row) for row in reader]

    header = rows[0]
    items = []

    for row in rows[1:]:
        if len(row) < len(header):
            row += [""] * (len(header) - len(row))

        item = dict(zip(header, row))

        if not item.get("CODIGO"):
            continue

        items.append(item)

    return items


def build_items():
    financed_rows = read_csv(FINANCED_CSV)
    cash_rows = read_csv(CASH_CSV)
    cash_by_code = {row["CODIGO"]: row for row in cash_rows}
    items = []

    for index, row in enumerate(financed_rows, start=1):
        cash = cash_by_code.get(row["CODIGO"], {})

        items.append(
            {
                "index": str(index),
                "codigo": row.get("CODIGO", ""),
                "mz": row.get("MZ", ""),
                "lote": row.get("LOTE", ""),
                "etapa": "2",
                "area": parse_number(row.get("AREA")),
                "ubicacion": row.get("UBICACIÓN", ""),
                "precioLista": parse_number(row.get("PRECIO LISTA")),
                "descuentoPreventa": parse_number(row.get("DSCTO POR PRE-VENTA")),
                "precioFinal": parse_number(row.get("PRECIO FINAL")),
                "inicial": parse_number(row.get("INICIAL")),
                "cuota84": parse_number(row.get("84 CUOTAS")),
                "descuentoContado": parse_number(cash.get("DSCTO AL CONTADO")),
                "precioFinalContado": parse_number(cash.get("PRECIO FINAL")),
            }
        )

    return items


def main():
    items = build_items()

    with OUTPUT_PATH.open("w", encoding="utf-8") as file:
        json.dump(items, file, indent=2, ensure_ascii=False)

    print(f"Wrote {len(items)} stage 2 items to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
