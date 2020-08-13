from rest_framework import serializers
from django.contrib.auth.models import User
from .models import folder,url,key

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email']


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = folder
        fields = ['name','description']


class UrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = url
        fields = '__all__'


class KeySerializer(serializers.ModelSerializer):
    class Meta:
        model = key
        fields = '__all__'