from django.apps import AppConfig

class ExcelAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.excel_app'

    #Добавление из csv после миграции
    # def ready(self):
    #     import apps.excel_app.signals