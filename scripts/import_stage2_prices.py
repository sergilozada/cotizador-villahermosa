import csv
import json
from pathlib import Path

import openpyxl


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

FINANCED_XLSX = DATA_DIR / "LISTAPRECIOSFINANCIADOSEGUNDAETAPA.xlsx"
CASH_XLSX = DATA_DIR / "LISTAPRECIOSCONTADOSEGUNDAETAPA.xlsx"
CURRENT_JSON = DATA_DIR / "precios.json"

STAGE2_FINANCED_CSV = DATA_DIR / "PRECIOS_ETAPA_2_FINANCIADO.csv"
STAGE2_CASH_CSV = DATA_DIR / "PRECIOS_ETAPA_2_CONTADO.csv"


def clean_text(value):
    if value is None:
        return ""
    return str(value).strip()


def clean_code_part(value):
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def number_or_none(value):
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text:
        return None

    text = text.replace("S/", "").replace("s/", "").replace(" ", "")
    text = text.replace(",", "")

    try:
        return float(text)
    except ValueError:
        return None


def money(value):
    parsed = number_or_none(value)
    if parsed is None:
        return ""
    return f"S/ {parsed:,.2f}"


def area_text(value):
    parsed = number_or_none(value)
    if parsed is None:
        return ""
    if parsed.is_integer():
        return str(int(parsed))
    return f"{parsed:.2f}".rstrip("0").rstrip(".")


def read_rows(path, mode):
    workbook = openpyxl.load_workbook(path, data_only=True, read_only=True)
    sheet = workbook.worksheets[0]
    rows = []

    for row in sheet.iter_rows(min_row=2, values_only=True):
        index = row[0]
        mz = clean_text(row[1])
        lot = clean_code_part(row[2])

        if index is None or not mz or not lot:
            continue

        if not isinstance(index, (int, float)):
            continue

        codigo = f"{mz}{lot}"

        item = {
            "index": int(index),
            "codigo": codigo,
            "mz": mz,
            "lote": lot,
            "etapa": "2",
            "area": number_or_none(row[3]),
            "ubicacion": clean_text(row[4]),
            "precioLista": number_or_none(row[5]),
        }

        if mode == "financed":
            item.update(
                {
                    "descuentoPreventa": number_or_none(row[6]),
                    "precioFinal": number_or_none(row[7]),
                    "inicial": number_or_none(row[8]),
                    "cuota84": number_or_none(row[9]),
                }
            )
        else:
            item.update(
                {
                    "descuentoContado": number_or_none(row[6]),
                    "precioFinalContado": number_or_none(row[7]),
                    "promoBanderaBlanca": number_or_none(row[8]),
                }
            )

        rows.append(item)

    return rows


def write_stage2_financed_csv(rows):
    header = [
        "",
        "N°",
        "CODIGO",
        "MZ",
        "LOTE",
        "ETAPA",
        "AREA",
        "UBICACIÓN",
        "PRECIO LISTA",
        "DSCTO POR PRE-VENTA",
        "PRECIO FINAL",
        "INICIAL",
        "84 CUOTAS",
    ]

    with STAGE2_FINANCED_CSV.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file, delimiter=";")
        writer.writerow(header)
        for item in rows:
            writer.writerow(
                [
                    "",
                    item["index"],
                    item["codigo"],
                    item["mz"],
                    item["lote"],
                    item["etapa"],
                    area_text(item["area"]),
                    item["ubicacion"],
                    money(item["precioLista"]),
                    money(item["descuentoPreventa"]),
                    money(item["precioFinal"]),
                    money(item["inicial"]),
                    money(item["cuota84"]),
                ]
            )


def write_stage2_cash_csv(rows):
    header = [
        "",
        "N°",
        "CODIGO",
        "MZ",
        "LOTE",
        "ETAPA",
        "AREA",
        "UBICACIÓN",
        "PRECIO LISTA",
        "DSCTO AL CONTADO",
        "PRECIO FINAL",
        "PROMOCIÓN BANDERA BLANCA",
    ]

    with STAGE2_CASH_CSV.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file, delimiter=";")
        writer.writerow(header)
        for item in rows:
            writer.writerow(
                [
                    "",
                    item["index"],
                    item["codigo"],
                    item["mz"],
                    item["lote"],
                    item["etapa"],
                    area_text(item["area"]),
                    item["ubicacion"],
                    money(item["precioLista"]),
                    money(item["descuentoContado"]),
                    money(item["precioFinalContado"]),
                    money(item["promoBanderaBlanca"]),
                ]
            )


def merge_stage2(financed_rows, cash_rows):
    cash_by_code = {item["codigo"]: item for item in cash_rows}
    merged = []

    for item in financed_rows:
        combined = dict(item)
        cash = cash_by_code.get(item["codigo"], {})
        combined["descuentoContado"] = cash.get("descuentoContado")
        combined["precioFinalContado"] = cash.get("precioFinalContado")
        combined["promoBanderaBlanca"] = cash.get("promoBanderaBlanca")
        merged.append(combined)

    return merged


def update_json(stage2_rows):
    for index, item in enumerate(stage2_rows, start=1):
        item["index"] = str(index)

    with CURRENT_JSON.open("w", encoding="utf-8") as file:
        json.dump(stage2_rows, file, indent=2, ensure_ascii=False)

    return stage2_rows


def main():
    financed_rows = read_rows(FINANCED_XLSX, "financed")
    cash_rows = read_rows(CASH_XLSX, "cash")
    stage2_rows = merge_stage2(financed_rows, cash_rows)

    write_stage2_financed_csv(financed_rows)
    write_stage2_cash_csv(cash_rows)
    updated_rows = update_json(stage2_rows)

    print(f"Financed stage 2 rows: {len(financed_rows)}")
    print(f"Cash stage 2 rows: {len(cash_rows)}")
    print(f"Updated total rows: {len(updated_rows)}")
    print(f"Wrote {STAGE2_FINANCED_CSV}")
    print(f"Wrote {STAGE2_CASH_CSV}")
    print(f"Updated {CURRENT_JSON}")


if __name__ == "__main__":
    main()
