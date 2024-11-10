import os
import glob

from PIL import Image


def compress_image(input_image_path, output_image_path, quality=60):
    with Image.open(input_image_path) as img:
        img.save(output_image_path, 'WEBP', quality=quality)


def compress_images_in_directory(input_directory, output_directory,
                                 quality=60):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif', '*.webp']
    for extension in image_extensions:
        for image_path in glob.glob(os.path.join(input_directory, extension)):
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            output_image_path = os.path.join(output_directory, base_name + '.webp')
            compress_image(image_path, output_image_path, quality)


def main():
    input_directory = 'user_images'
    output_directory = 'compressed_images'
    compress_images_in_directory(os.path.abspath(input_directory),
                                 output_directory, quality=75)


if __name__ == "__main__":
    main()
