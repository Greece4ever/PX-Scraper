from rest_framework import routers
from django.urls import include,path
from .views import userCreation,fetchGithub,Folder,Folder_Action,UrlView,URL_DEMO,SingleFolderIdentifyer,UserLevelView

router = routers.DefaultRouter()
router.register('create',userCreation,basename='newuser')
router.register('github',fetchGithub,basename='githubfetch')
router.register('folder/view',Folder,basename='folder_view')
router.register('folder/exists',Folder_Action,basename="search_exists")
router.register('urls/create',UrlView,basename='create_url')
router.register('url_demo',URL_DEMO,basename='try_url')
router.register("folder_detail",SingleFolderIdentifyer,basename='folder_detail')
router.register("level",UserLevelView,basename='user_level')

urlpatterns = [
    path('',include(router.urls)),
]
