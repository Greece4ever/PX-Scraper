from django.contrib import admin
from .models import gitToken,googleToken,key,folder,url,UserProfile

# Register your models here.

admin.site.register(gitToken)
admin.site.register(googleToken)
admin.site.register(key)
admin.site.register(folder)
admin.site.register(url)
admin.site.register(UserProfile)    