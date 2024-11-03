from PIL import Image
import os
import glob


def compress_image(input_image_path, output_image_path, quality=85):
    with Image.open(input_image_path) as img:
        img.save(output_image_path, 'JPEG', quality=quality)


def compress_images_in_directory(input_directory, output_directory,
                                 quality=85):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif', '*.webp']
    for extension in image_extensions:
        for image_path in glob.glob(os.path.join(input_directory, extension)):
            output_image_path = os.path.join(output_directory,
                                             os.path.basename(image_path))
            compress_image(image_path, output_image_path, quality)


def main():
    input_directory = 'user_files'
    output_directory = 'compressed_images'
    compress_images_in_directory(os.path.abspath(input_directory),
                                 output_directory, quality=75)


if __name__ == "__main__":
    main()
