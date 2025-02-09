import openpyxl
from openpyxl.drawing.image import Image
from openpyxl.utils import range_boundaries
from openpyxl.utils import get_column_letter


def insert_image(ws, image_params):
    """
    Вставляет изображение в указанный диапазон ячеек с выравниванием по центру.

    :param ws: Рабочий лист Excel
    :param image_params: Параметры изображения
    """
    # Загружаем изображение
    img = Image(image_params.file)
    img.width = 600
    img.height = 900
    # Вставляем изображение в начальную ячейку диапазона
    ws.add_image(img, image_params.start_cell)
    # Мержим ячейки в диапазоне
    ws.merge_cells(f"{image_params.start_cell}:{image_params.merge_cell}")
    print("Изображение добавлено и масштабировано")


class MediaParams:
    def __init__(self, cell_data, data, sheet):
        self.file = sheet.files
        self.start_cell = cell_data.index
        self.merge_cell = cell_data.cells["mergeCell"]
        self.printKey = data.get(cell_data.cells["printKey"])
        self.print_x = cell_data.cells["printX"]
        self.print_y = cell_data.cells["printY"]

    def __str__(self):
        return (f"MediaParams(file={self.file},start_cell={self.start_cell}, "
                f"merge_cell={self.merge_cell}, printKey={self.printKey}, print_x={self.print_x}, print_y={self.print_y})")
