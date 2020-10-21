"""Server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from . import views

urlpatterns = [
    path('', include('frontend.urls')),
    path('api/', include('golfplatz.urls')),
    path('admin/', admin.site.urls),
    path('fonts/roboto-latin-400.woff', RedirectView.as_view(url='/static/frontend/fonts/roboto-latin-400.woff')),
    path('fonts/roboto-latin-500.woff', RedirectView.as_view(url='/static/frontend/fonts/roboto-latin-500.woff')),
    path('fonts/roboto-latin-400.woff2', RedirectView.as_view(url='/static/frontend/fonts/roboto-latin-400.woff2')),
    path('fonts/roboto-latin-500.woff2', RedirectView.as_view(url='/static/frontend/fonts/roboto-latin-500.woff2')),
]
