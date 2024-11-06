import os
import pandas as pd
from fpdf import FPDF

def convert_excel_to_pdf(input_file, output_file):
    # Чтение xlsx файла
    df = pd.read_excel(input_file)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Проход по всем листам в xlsx файле
    for sheet_name in df.keys():
        sheet_data = df[sheet_name]

        # Добавление заголовка
        pdf.cell(200, 10, "Sheet Name: " + sheet_name, ln=True)
        pdf.ln(10)

        # Преобразование Series в DataFrame
        if isinstance(sheet_data, pd.Series):
            sheet_data = pd.DataFrame(sheet_data)

        # Добавление таблицы
        for index, row in sheet_data.iterrows():
            encoded_row = [str(cell).encode('utf-8') for cell in row]
            pdf.multi_cell(0, 10, b" ".join(encoded_row).decode('utf-8'))
        pdf.ln(10)

    # Сохранение PDF файла
    pdf.output(output_file)

if __name__ == "__main__":
    input_file = os.path.abspath("report.xlsx")
    output_file = os.path.abspath("report.pdf")

    convert_excel_to_pdf(input_file, output_file)
