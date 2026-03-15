# api/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from api.models import *
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Создание начальных данных для приложения'
    
    def handle(self, *args, **kwargs):
        # Создаем меню
        menu_data = [
            {
                "name": "Омлет с сыром",
                "price": 150,
                "category": "Завтрак",
                "spicy": False,
                "nutrition": {
                    "protein": "12.7г",
                    "fats": "15.3г",
                    "carbs": "2.4г",
                    "ingredients": ["яйца", "молоко", "сыр", "масло сливочное", "соль"],
                    "allergens": ["яйцо", "молочная продукция"]
                }
            },
            # Добавьте остальные блюда из вашего React приложения
        ]
        
        for item_data in menu_data:
            menu_item = MenuItem.objects.create(
                name=item_data['name'],
                price=item_data['price'],
                category=item_data['category'],
                spicy=item_data['spicy']
            )
            
            nutrition = NutritionInfo.objects.create(
                menu_item=menu_item,
                protein=item_data['nutrition']['protein'],
                fats=item_data['nutrition']['fats'],
                carbs=item_data['nutrition']['carbs']
            )
            
            for ingredient in item_data['nutrition']['ingredients']:
                Ingredient.objects.create(nutrition=nutrition, name=ingredient)
            
            for allergen in item_data['nutrition']['allergens']:
                Allergen.objects.create(nutrition=nutrition, name=allergen)
        
        self.stdout.write(self.style.SUCCESS('Начальные данные созданы успешно!'))