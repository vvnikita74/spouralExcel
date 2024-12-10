import json
import os
import inspect
import re
import pymorphy2
import openpyxl

from datetime import datetime
from openpyxl.styles import Border, Side, Font, Alignment

from django.conf import settings
from apps.excel_app.models import Sheet

case_tags = {
    'gent': 'gent',  # Родительный
    "nomn": "nomn",  # Именительный
    'datv': 'datv',  # Дательный
    'accs': 'accs',  # Винительный
    'ablt': 'ablt',  # Творительный
    'loct': 'loct',  # Предложный
    'voct': 'voct',  # Звательный
}

gender_tags = {
    'masc': 'masc',
    'femn': 'femn',
    'neut': 'neut'
}


# Исправление ошибки Python 3.13
def patched_getargspec(func):
    fullargspec = inspect.getfullargspec(func)
    return fullargspec.args, fullargspec.varargs, fullargspec.varkw, fullargspec.defaults


inspect.getargspec = patched_getargspec
morph = pymorphy2.MorphAnalyzer()


def get_gender(word):
    """
    Определяет род слова.

    :param word: Слово для анализа
    :return: Род слова
    """
    parse = morph.parse(word)[0]

    for gender, tag in gender_tags.items():
        if gender in parse.tag:
            return tag

    return None


def change_case(phrase, target_case):
    """
    Изменяет род слова и падеж слова на заданные.

    :param phrase: Фраза для изменения
    :param target_case: Целевой падеж
    :return: Фраза с измененным падежом
    """
    words = phrase.split(' ')
    inflected_words = []
    for word in words:
        parsed_word = morph.parse(word)[0]
        inflected_word = parsed_word.inflect({target_case})
        if inflected_word:
            inflected_words.append(inflected_word.word)

    if len(inflected_words) > 1:
        gender = get_gender(inflected_words[-1])
        parsed_word = morph.parse(inflected_words[0])[0]
        inflected_words[0] = parsed_word.inflect({gender}).word
    return ' '.join(inflected_words)


def generate_report(data, filename):
    """
    Генерирует отчет на основе данных и сохраняет его в файл.

    :param data: Входные данные
    :return: Имя файла отчета
    """
    template_path = os.path.join(os.path.dirname(__file__), '..', '..', '..',
                                 '..', 'static', 'report.xlsx')
    template_path = os.path.abspath(template_path)
    wb = openpyxl.load_workbook(template_path)

    count = 0
    sections = []
    sheets = sorted(Sheet.objects.all(), key=lambda sheet: sheet.index)

    for sheet in sheets:
        ws = wb.worksheets[sheet.index]
        count += 1

        for cell_data in sheet.get_data():
            cell = ws[cell_data.index]
            template = cell_data.template
            cell_type = cell_data.type
            input_value = get_nested_value(data, cell_data.inputKey,
                                           cell_data.defaultValue)
            if cell_type == 'documentation' and input_value:
                process_documentation(ws, cell_data, input_value)
            else:
                if not template:
                    cell.value = cell_data.defaultValue if not input_value else input_value
                else:
                    template = substitute_placeholders(template, data)
                    cell.value = template

        if sheet.countCell:
            ws[sheet.countCell] = count

        if sheet.contentSection:
            section = Section(section_id=sheet.section, \
                              section_name=sheet.name,
                              sheet_id=count)
            sections.append(section)
            if sheet.subsections:
                subsections = json.loads(sheet.subsections)
                for subsection in subsections:
                    section = Section(
                        section_id=subsection.get('sectionId'),
                        section_name=subsection.get('sectionName'),
                        sheet_id=count
                    )
                    sections.append(section)

        sheet.save()

    if wb.worksheets:
        wb.remove(wb.worksheets[-1])

    fill_content(wb, sections)
    report_dir = os.path.join(settings.MEDIA_ROOT, 'reports')
    os.makedirs(report_dir, exist_ok=True)
    os_filename = os.path.join(report_dir, filename + '.xlsx')

    wb.save(os_filename)

    os.system(f'libreoffice --headless --convert-to pdf --outdir'
              f' {report_dir} {os_filename}')

    os.remove(os_filename)


def process_documentation(ws, cell_data, input_value):
    """
    Обрабатывает данные типа 'documentation' и вставляет их в соответствующие ячейки.

    :param ws: Рабочий лист Excel
    :param cell_data: Объект данных ячейки
    :param input_value: JSON строка с данными документации
    """
    # Парсим JSON строку в массив объектов
    documentation_objects = [Documentation.from_dict(doc) for doc in
                             json.loads(input_value)]

    # Начальная ячейка
    start_cell = cell_data.index
    start_col = ws[start_cell].column
    start_row = ws[start_cell].row + cell_data.verticalGap

    # Итерация по объектам документации и вставка их в рабочий лист
    for idx, doc in enumerate(documentation_objects):
        # Вычисляем строку для текущего объекта
        current_row = start_row + idx * cell_data.verticalGap

        # Вставляем ID объекта (индекс + 1) в начальную ячейку
        ws.cell(row=current_row, column=start_col, value=idx + 1)

        # Вставляем имя, год и разработчика в соответствующие ячейки
        ws[cell_data.nameIndex.replace('11', str(current_row))] = doc.name
        ws[cell_data.yearIndex.replace('11', str(current_row))] = doc.year
        ws[cell_data.developerIndex.replace('11',
                                            str(current_row))] = doc.developer

        # Устанавливаем границы для ячеек
        set_border(ws, f'C{current_row}', f'D{current_row + 2}')
        set_border(ws, f'E{current_row}', f'V{current_row + 2}')
        set_border(ws, f'W{current_row}', f'AA{current_row + 2}')
        set_border(ws, f'AB{current_row}', f'AM{current_row + 2}')

    # Устанавливаем границы для указанных ячеек
    set_border(ws, 'C11', 'D13')
    set_border(ws, 'E11', 'V13')
    set_border(ws, 'W11', 'AA13')
    set_border(ws, 'AB11', 'AM13')


class Documentation:
    def __init__(self, name, year, developer):
        self.name = name
        self.year = year
        self.developer = developer

    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data.get('name'),
            year=data.get('year'),
            developer=data.get('developer')
        )


def set_border(ws, top_left, bottom_right):
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

    # Применяем стиль границы ко всем ячейкам в диапазоне
    for row in range(min_row, max_row + 1):
        for col in range(min_col, max_col + 1):
            cell = ws.cell(row=row, column=col)
            cell.border = thin_border


def get_nested_value(data, key, default_value=None):
    """
    Получает вложенное значение из словаря по ключу.

    :param data: Словарь данных
    :param key: Ключ для поиска
    :param default_value: Значение по умолчанию
    :return: Значение по ключу
    """
    keys = key.split('.')
    value = data
    for k in keys:
        value = value.get(k, None)
        if value is None:
            return default_value
    return value


def substitute_placeholders(template, data):
    """
    Заменяет плейсхолдеры в шаблоне на значения из данных.

    :param template: Шаблон с плейсхолдерами
    :param data: Словарь данных
    :return: Шаблон с замененными плейсхолдерами
    """

    def replace_match(match):
        key = match.group(1)
        keyArr = key.split('.')
        length = len(keyArr)
        initial = ''
        match length:
            case 2:
                word, key = keyArr
                if key in case_tags:
                    initial = data.get(word, '')
                    inflected_word = change_case(initial, key)
                elif key in data:
                    initial = data[key]
                    inflected_word = change_case(word, get_gender(
                        initial.split(' ')[-1]))
                if inflected_word:
                    return inflected_word
            case 3:
                # Обработка случая с тремя частями в ключе
                pass
            case _:
                return data.get(key, f'${key}$')

    return re.sub(r'\$(\w+(\.\w+)*)\$', replace_match, template)


class Section:
    def __init__(self, section_id, section_name, sheet_id):
        self.section_id = section_id
        self.section_name = section_name
        self.sheet_id = sheet_id

    @classmethod
    def from_dict(cls, data):
        return cls(
            section_id=data.get('section_id'),
            section_name=data.get('section_name'),
            sheet_id=data.get('sheet_id')
        )

    def __str__(self):
        return f'Section ID: {self.section_id}, Section Name: {self.section_name}, Sheet ID: {self.sheet_id}'


def fill_content(wb, sections):
    """
    Заполняет таблицу содержания.

    :param wb: Рабочая книга Excel
    :param sections: Список объектов разделов
    """
    content_ws = wb['Содержание']
    start_row = 8

    # Определение стилей
    font = Font(size=12, bold=False)
    center_alignment = Alignment(horizontal='center', vertical='center')
    left_alignment = Alignment(horizontal='left', vertical='center')

    for section in sections:
        # Вставка значений в ячейки
        cell_c = content_ws[f'C{start_row}']
        cell_h = content_ws[f'H{start_row}']
        cell_ai = content_ws[f'AI{start_row}']

        cell_c.value = section.section_id
        cell_h.value = section.section_name
        cell_ai.value = section.sheet_id

        # Применение стилей
        cell_c.font = font
        cell_h.font = font
        cell_ai.font = font

        cell_c.alignment = center_alignment
        cell_h.alignment = left_alignment
        cell_ai.alignment = center_alignment

        # Установка границ
        set_border(content_ws, f'C{start_row}', f'G{start_row + 1}')
        set_border(content_ws, f'H{start_row}', f'AH{start_row + 1}')
        set_border(content_ws, f'AI{start_row}', f'AM{start_row + 1}')

        # Объединение ячеек
        content_ws.merge_cells(f'C{start_row}:G{start_row + 1}')
        content_ws.merge_cells(f'H{start_row}:AH{start_row + 1}')
        content_ws.merge_cells(f'AI{start_row}:AM{start_row + 1}')

        # Переход на следующую строку
        start_row += 2
