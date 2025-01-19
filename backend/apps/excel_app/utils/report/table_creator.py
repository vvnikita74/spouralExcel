import json
from enum import Enum
from openpyxl.styles import Border, Side
from typing import List, Any
from .data_models import Documentation, UniversalObject


class TableType(Enum):
    DOCUMENTATION = 'documentation'
    CONTENT = 'content'
    DEFAULT = 'default'


class Table:
    def __init__(self, table_type: TableType):
        """
        Инициализирует объект Table с заданным типом таблицы.

        :param table_type: Тип таблицы (TableType)
        """
        self.table_type = table_type

    @staticmethod
    def set_border(ws, top_left: str, bottom_right: str):
        """
        Устанавливает границы для диапазона ячеек.

        :param ws: Рабочий лист Excel
        :param top_left: Левая верхняя ячейка диапазона
        :param bottom_right: Правая нижняя ячейка диапазона
        """
        thin_border = Border(
            left=Side(border_style='thin', color='000000'),
            right=Side(border_style='thin', color='000000'),
            top=Side(border_style='thin', color='000000'),
            bottom=Side(border_style='thin', color='000000')
        )

        min_col, min_row = ws[top_left].column, ws[top_left].row
        max_col, max_row = ws[bottom_right].column, ws[bottom_right].row

        for row in range(min_row, max_row + 1):
            for col in range(min_col, max_col + 1):
                cell = ws.cell(row=row, column=col)
                cell.border = thin_border

    @staticmethod
    def create_table(ws, cell_data) -> (int, int, int):
        """
        Создает таблицу на рабочем листе Excel.

        :param ws: Рабочий лист Excel
        :param cell_data: Объект данных ячейки
        :return: Начальные столбец и строка, вертикальный зазор
        """
        start_cell = cell_data.index
        start_col = ws[start_cell].column
        start_row = ws[start_cell].row
        vertical_gap = cell_data.verticalGap

        for cell_info in cell_data.cells:
            width = cell_info.get('width')
            end_col = start_col + width - 1
            end_row = start_row + vertical_gap - 1
            Table.apply_cell_styles(ws, start_row, start_col, end_row, end_col)
            try:
                value = cell_info.get('title')
            except KeyError:
                value = ''
            ws.cell(row=start_row, column=start_col, value=value)
            start_col = end_col + 1

        start_row += vertical_gap
        start_col = ws[start_cell].column
        return start_col, start_row, vertical_gap

    @staticmethod
    def apply_cell_styles(ws, start_row: int, start_col: int, end_row: int,
                          end_col: int):
        """
        Вычисляет границы, устанавливает границы, объединяет ячейки и применяет стили.

        :param ws: Рабочий лист Excel
        :param start_row: Начальная строка
        :param start_col: Начальный столбец
        :param end_row: Конечная строка
        :param end_col: Конечный столбец
        """
        Table.set_border(ws,
                         f'{ws.cell(row=start_row, column=start_col).coordinate}',
                         f'{ws.cell(row=end_row, column=end_col).coordinate}')
        ws.merge_cells(start_row=start_row, start_column=start_col,
                       end_row=end_row, end_column=end_col)

    def fill_table(self, ws, cell_data, input_value: str):
        """
        Обрабатывает данные и вставляет их в соответствующие ячейки.

        :param ws: Рабочий лист Excel
        :param cell_data: Объект данных ячейки
        :param input_value: JSON строка с данными/список объектов
        """
        data_objects = self._get_data_objects(input_value)
        if data_objects:
            start_col, start_row, vertical_gap = Table.create_table(ws,
                                                                    cell_data)
            for idx, obj in enumerate(data_objects):
                for cell_info in cell_data.cells:
                    key = cell_info.get('key')
                    width = cell_info.get('width')
                    end_col = start_col + width - 1
                    end_row = start_row + vertical_gap - 1
                    try:
                        value = idx + 1 if self.table_type == TableType.DOCUMENTATION and key == 'index' else getattr(
                            obj, key, '')
                    except AttributeError:
                        value = ''
                    ws.cell(row=start_row, column=start_col, value=value)
                    Table.apply_cell_styles(ws, start_row, start_col, end_row,
                                            end_col)
                    start_col = end_col + 1

                start_row += vertical_gap
                start_col = ws[cell_data.index].column

    def _get_data_objects(self, input_value: Any) -> List[Any] | None:
        """
        Возвращает список объектов данных в зависимости от типа таблицы.

        :param input_value: JSON строка с данными/список объектов
        :return: Список объектов данных
        """
        if self.table_type == TableType.DOCUMENTATION:
            if input_value:
                return [Documentation.from_dict(doc) for doc in
                        json.loads(input_value)]
            else:
                return None
        elif self.table_type == TableType.CONTENT:
            return input_value
        else:
            return [UniversalObject.from_dict(obj) for obj in
                    json.loads(input_value)]
