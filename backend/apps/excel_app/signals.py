import os
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .utils.db.csv_to_db import import_defects, import_recommendations

# Добавление из csv после миграции

@receiver(post_migrate)
def import_csv_data_defects(sender, **kwargs):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file_path = os.path.join(base_dir, 'utils', 'db', 'defects.csv')
    import_defects(csv_file_path)


@receiver(post_migrate)
def import_csv_data_recommendations(sender, **kwargs):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file_path = os.path.join(base_dir, 'utils', 'db',
                                 'recommendations.csv')
    import_recommendations(csv_file_path)
