import csv
from django.db import transaction

def import_defects(csv_file_path):
    from apps.excel_app.models import ConstructionTypes, Materials, Defects, Recommendations

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with transaction.atomic():
            for row in reader:
                construction_type_name = row['Тип конструкции']
                material_name = row['Материал']
                defect_name = row['Дефекты']
                recommendation_name = row['Рекомендации']

                # Get or create construction type
                construction_type, _ = ConstructionTypes.objects.get_or_create(
                    name=construction_type_name)

                # Get or create material
                material, _ = Materials.objects.get_or_create(
                    name=material_name)

                # Get or create defect
                defect, _ = Defects.objects.get_or_create(name=defect_name)

                # Get or create recommendation
                recommendation, _ = Recommendations.objects.get_or_create(
                    name=recommendation_name)

                # Establish relationships
                construction_type.material.add(material)
                material.defects.add(defect)
                defect.recommendations = recommendation
                defect.save()

                print(
                    f'Created {construction_type_name} - {material_name} - {defect_name} - {recommendation_name}')