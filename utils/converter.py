import os
import win32com.client as win32

def convert_excel_to_pdf(input_excel_path, output_pdf_path):
    input_excel_path = os.path.abspath(input_excel_path)
    output_pdf_path = os.path.abspath(output_pdf_path)

    # Initialize Excel application
    excel = win32.Dispatch('Excel.Application')
    excel.Visible = False

    # Open the Excel workbook
    workbook = excel.Workbooks.Open(input_excel_path)

    # Export as PDF
    workbook.ExportAsFixedFormat(0, output_pdf_path)

    # Close the workbook and quit Excel
    workbook.Close(False)
    excel.Quit()

# Example usage
convert_excel_to_pdf("report.xlsx", "report.pdf")