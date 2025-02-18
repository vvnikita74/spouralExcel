from io import BytesIO
from PIL import Image as PILImage, ImageDraw, ImageFont
from openpyxl.drawing.image import Image


def insert_image(ws, image_params):
    """
    Вставляет изображение в указанный диапазон ячеек с выравниванием по центру.

    :param ws: Рабочий лист Excel
    :param image_params: Параметры изображения
    """
    # Загружаем изображение
    img = PILImage.open(image_params.file)
    # Задаем размеры изображения
    img = img.resize((image_params.image_width, image_params.image_height),
                     PILImage.LANCZOS)
    draw = ImageDraw.Draw(img)

    # Коэффициент масштабирования
    scale_factor = image_params.print_scale
    try:
        # Шрифты с учетом коэффициента масштабирования
        font_1 = ImageFont.truetype(image_params.text_font,
                                int(image_params.text_font_size1 *
                                    scale_factor))
        font_2 = ImageFont.truetype(image_params.text_font,
                                int(image_params.text_font_size2 * scale_factor))
    except OSError:
        print(f"Шрифт {image_params.text_font} не найден")
    # Текст для печати
    text1 = image_params.textLine1
    text2 = image_params.textLine2
    text3 = image_params.textLine3
    text_color = image_params.text_color
    frame_color = image_params.frame_color

    # Размеры изображения и текста
    img_width, img_height = img.size
    text1_bbox = draw.textbbox((0, 0), text1, font=font_1)
    text2_bbox = draw.textbbox((0, 0), text2, font=font_2)
    text3_bbox = draw.textbbox((0, 0), text3, font=font_2)
    text1_width = text1_bbox[2] - text1_bbox[0]
    text1_height = text1_bbox[3] - text1_bbox[1]
    text2_width = text2_bbox[2] - text2_bbox[0]
    text2_height = text2_bbox[3] - text2_bbox[1]
    text3_width = text3_bbox[2] - text3_bbox[0]
    text3_height = text3_bbox[3] - text3_bbox[1]

    # Общая высота и ширина текста с учетом коэффициента масштабирования
    total_text_height = text1_height + text2_height + text3_height + int(
        image_params.line_spacing * 2 * scale_factor)  # line_spacing -
    # промежутки между строками

    # Позиция текста
    text_x = img_width * int(image_params.print_x) / 100
    text_y = img_height * int(image_params.print_y) / 100
    # Ширина рамки
    frame_margin = image_params.frame_margin
    max_text_width = max(text1_width, text2_width, text3_width)
    frame_x_len = max_text_width + 2 * frame_margin  # 2 * frame_margin -
    # отступы по бокам
    frame_width = image_params.frame_width

    # Центрирование текста относительно рамки
    text1_x = text_x + (frame_x_len - text1_width) / 2
    text2_x = text_x + (frame_x_len - text2_width) / 2
    text3_x = text_x + (frame_x_len - text3_width) / 2

    # Рисуем текст
    draw.text((text1_x, text_y), text1, fill=text_color, font=font_1)
    draw.text((text2_x, text_y + text1_height + int(
        image_params.line_spacing * scale_factor)), text2,
              fill=text_color, font=font_2)
    draw.text((text3_x,
               text_y + text1_height + text2_height + int(
                   image_params.line_spacing * 2 * scale_factor)),
              text3, fill=text_color, font=font_2)

    # Рисуем рамку
    draw.rectangle([(text_x - frame_margin, text_y - frame_margin),
                    (text_x + frame_x_len,
                     text_y + total_text_height + 2 * frame_margin)],
                   outline=frame_color, width=frame_width)

    # Сохраняем измененное изображение в BytesIO
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    # Вставляем изображение в начальную ячейку диапазона
    img = Image(img_byte_arr)
    ws.add_image(img, image_params.start_cell)
    ws.merge_cells(f"{image_params.start_cell}:{image_params.merge_cell}")


class MediaParams:
    def __init__(self, cell_data, data, sheet):
        self.file = sheet.files
        self.start_cell = cell_data.index
        self.merge_cell = cell_data.cells["mergeCell"]
        self.textLine3 = data.get(cell_data.cells["textLine3Key"])
        self.print_x = cell_data.cells["printX"]
        self.print_y = cell_data.cells["printY"]
        self.image_width = int(cell_data.cells["imageWidth"])
        self.image_height = int(cell_data.cells["imageHeight"])
        self.print_scale = int(cell_data.cells["printScale"])
        self.frame_margin = int(cell_data.cells["frameMargin"])
        self.frame_width = int(cell_data.cells["frameWidth"])
        self.line_spacing = int(cell_data.cells["lineSpacing"])
        self.text_color = eval(cell_data.cells["textColor"])
        self.frame_color = eval(cell_data.cells["frameColor"])
        self.textLine1 = cell_data.cells["textLine1"]
        self.textLine2 = cell_data.cells["textLine2"]
        self.text_font = cell_data.cells["textFont"]
        self.text_font_size1 = int(cell_data.cells["textFontSize1"])
        self.text_font_size2 = int(cell_data.cells["textFontSize2"])

    def __str__(self):
        return (f"MediaParams(file={self.file}, start_cell={self.start_cell}, "
                f"merge_cell={self.merge_cell}, textLine3={self.textLine3}, "
                f"print_x={self.print_x}, print_y={self.print_y}, "
                f"image_width={self.image_width}, image_height={self.image_height}, "
                f"print_scale={self.print_scale}, frame_margin={self.frame_margin}, "
                f"frame_width={self.frame_width}, line_spacing={self.line_spacing}, "
                f"text_color={self.text_color}, frame_color={self.frame_color}, "
                f"textLine1={self.textLine1}, textLine2={self.textLine2}, "
                f"text_font={self.text_font}, text_font_size1={self.text_font_size1}, "
                f"text_font_size2={self.text_font_size2})")
