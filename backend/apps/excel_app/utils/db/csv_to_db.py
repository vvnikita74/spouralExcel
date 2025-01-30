import csv
from django.db import transaction


def import_defects(csv_file_path):
    from apps.excel_app.models import ConstructionTypes, Materials, Defects

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with transaction.atomic():
            for row in reader:
                construction_type_name = row['Тип конструкции']
                material_name = row['Материал']
                defect_name = row['Дефекты']

                # Получаем или создаем тип конструкции
                construction_type, _ = ConstructionTypes.objects.get_or_create(
                    name=construction_type_name)

                # Получаем или создаем материал
                material, _ = Materials.objects.get_or_create(
                    name=material_name)

                # Получаем или создаем дефект
                defect, _ = Defects.objects.get_or_create(name=defect_name)

                # Устанавливаем связи
                construction_type.material.add(material)
                material.defects.add(defect)

                print(
                    f'Created {construction_type_name} - {material_name} - {defect_name}')


def import_recommendations(csv_file_path):
    from apps.excel_app.models import Recommendations, Defects, Materials
    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with transaction.atomic():
            for row in reader:
                recommendation_name = row['name']

                # Get or create recommendation
                recommendation, _ = Recommendations.objects.get_or_create(
                    name=recommendation_name)

                # Assign recommendation to a defect if not already assigned
                for defect in Defects.objects.filter(
                        recommendations__isnull=True):
                    defect.recommendations = recommendation
                    defect.save()
                    break

                # Add recommendation to all materials
                for material in Materials.objects.all():
                    material.recommendations.add(recommendation)
                    material.save()

                print(
                    f'Added recommendation {recommendation_name} to defects and materials')
