from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .ai_logic import ai_instance
import json
import os
from django.core.files.storage import default_storage

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.get(login=data.get('login'), password=data.get('password'))
            return JsonResponse({
                'id': user.id,
                'login': user.login,
                'admin': user.admin,
                'status': 'success'
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Неверные данные'}, status=401)

@csrf_exempt
def process_audio_api(request):
    if request.method == 'POST':
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return JsonResponse({'error': 'Файл не получен'}, status=400)

        # Сохраняем файл временно
        file_name = default_storage.save('temp_audio.mp3', audio_file)
        file_path = default_storage.path(file_name)

        try:
            # Отправляем в нейронку
            result = ai_instance.process_audio(file_path)

            # если есть тепловая карта, кодируем в base64, чтобы фронт мог сразу показать
            heatmap_path = result.get('heatmap_path')
            if heatmap_path and os.path.exists(heatmap_path):
                import base64
                with open(heatmap_path, 'rb') as f:
                    b64 = base64.b64encode(f.read()).decode('utf-8')
                result['heatmap_base64'] = f"data:image/png;base64,{b64}"

            return JsonResponse(result)
        finally:
            # Удаляем файл после обработки
            if os.path.exists(file_path):
                os.remove(file_path)

    return JsonResponse({'error': 'Метод не поддерживается'}, status=405)