import os
import inspect
import re
import pymorphy2
import openpyxl
from django.conf import settings
from datetime import datetime
from apps.excel_app.models import Sheet

gent_tags = {
    "Родительный": "gent",
    "Именительный": "nomn",
    'Дательный': 'datv',
    'Винительный': 'accs',
    'Творительный': 'ablt',
    'Предложный': 'loct',
    'Звательный': 'voct',
}

gender_tags = {
    'masc': 'masc',
    'femn': 'femn',
    'neut': 'neut'
}


# Python 3.13 bug fix
def patched_getargspec(func):
    fullargspec = inspect.getfullargspec(func)
    return fullargspec.args, fullargspec.varargs, fullargspec.varkw, fullargspec.defaults


inspect.getargspec = patched_getargspec

morph = pymorphy2.MorphAnalyzer()


def get_gender(word):
    parse = morph.parse(word)[0]

    for gender, tag in gender_tags.items():
        if gender in parse.tag:
            return tag

    return None


def change_gender(word, target_gender):
    if not target_gender:
        return ''

    parse = morph.parse(word)[0]
    inflected = parse.inflect({target_gender})
    return inflected.word if inflected else None


def generate_report(data, username):
    template_path = os.path.join(os.path.dirname(__file__), 'report.xlsx')
    wb = openpyxl.load_workbook(template_path)

    count = 0

    for sheet in Sheet.objects.all():
        ws = wb.worksheets[sheet.index]
        count += 1

        for cell_data in sheet.get_data():
            cell = ws[cell_data.index]
            template = cell_data.template
            input_value = data.get(cell_data.inputKey)

            if not template:
                cell.value = cell_data.defaultValue if not input_value else input_value
            else:
                template = substitute_placeholders(template, data)
                cell.value = template

        if sheet.countCell:
            ws[sheet.countCell] = count

        sheet.save()

    if wb.worksheets:
        wb.remove(wb.worksheets[-1])

    filename = f'{username}-{datetime.now().strftime("%H-%M_%d.%m.%Y")}'
    report_dir = os.path.join(settings.MEDIA_ROOT, 'reports')
    os.makedirs(report_dir, exist_ok=True)
    os_filename = os.path.join(report_dir, filename + '.xlsx')

    wb.save(os_filename)

    os.system(f'libreoffice --headless --convert-to pdf --outdir'
              f' {report_dir} {os_filename}')

    os.remove(os_filename)
    return filename


def substitute_placeholders(template, data):
    def replace_match(match):
        key = match.group(1)
        keyArr = key.split('.')
        length = len(keyArr)
        initial = ''
        match length:
            case 2:
                word, key = keyArr
                # TODO: Оптимизировать. Сделать чтобы понятно было
                if key in gent_tags:
                    initial = data.get(word, '')
                elif key in data:
                    initial = data[key]

                inflected_word = change_gender(word, get_gender(
                    initial.split(' ')[-1]))
                if inflected_word:
                    return inflected_word
            case 3:
                # Обработка случая с тремя частями в ключе
                pass
            case _:
                return data.get(key, f'${key}$')

    return re.sub(r'\$(\w+(\.\w+)*)\$', replace_match, template)
