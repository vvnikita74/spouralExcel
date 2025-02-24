# backend/apps/excel_app/management/commands/import_defects.py

from django.core.management.base import BaseCommand
from apps.excel_app.utils.db.csv_to_db import import_defects

class Command(BaseCommand):
    help = 'Import defects from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file_path', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file_path']
        import_defects(csv_file_path)
        self.stdout.write(self.style.SUCCESS('Successfully imported defects from CSV'))