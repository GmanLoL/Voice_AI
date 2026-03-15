from django.contrib import admin
from django.urls import path
from api.views import login_api, process_audio_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_api),
    path('api/process-audio/', process_audio_api),
]   