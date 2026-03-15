# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *

class UserSerializer(serializers.ModelSerializer):
    # Добавляем поля из вашей таблицы
    full_name = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    class_field = serializers.CharField(source='class_field', read_only=True)
    allergies = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'class_field', 'allergies', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name']
        extra_kwargs = {
            'full_name': {'required': False}
        }
    
    def create(self, validated_data):
        # Получаем полное имя, если оно передано
        full_name = validated_data.get('full_name', '')
        
        # Разделяем полное имя на first_name и last_name для совместимости
        first_name = ''
        last_name = ''
        if full_name:
            name_parts = full_name.split(' ', 1)
            first_name = name_parts[0] if len(name_parts) > 0 else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            role='student'  # По умолчанию студент
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Неверные учетные данные")

class AllergenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergen
        fields = ['name']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name']

class NutritionInfoSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    allergens = AllergenSerializer(many=True, read_only=True)
    
    class Meta:
        model = NutritionInfo
        fields = ['protein', 'fats', 'carbs', 'calories', 'ingredients', 'allergens']

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='user.username', read_only=True)
    date = serializers.DateTimeField(format="%d.%m.%Y", read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'author', 'rating', 'comment', 'date']
        read_only_fields = ['user']

class MenuItemSerializer(serializers.ModelSerializer):
    nutrition = NutritionInfoSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    price = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'price', 'category', 'spicy', 
            'description', 'nutrition', 'reviews', 'average_rating',
            'is_available'
        ]
    
    def get_price(self, obj):
        return f"{obj.price}р"

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price_at_time']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_price', 'items', 'created_at']
class UserSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'student_id', 'phone', 'balance']