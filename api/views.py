# <------ Django Essential imports ------>
from django.db.models import Q
#Make use of POSTGRES mutliple-collumn search
from django.contrib.postgres.search import SearchVector
from django.db.models import Count
from rest_framework import mixins, viewsets
from rest_framework.response import Response
# Sets the time the call was made
from django.utils import timezone
# for user authoriaztion inside the API
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, auth
from rest_framework import throttling
# <------  ------>

#Throttling
from .throttling import APIDEMOThrottle,LOGINThrottle,UIURLThrottle

#Tables-Models and serializers
from .models import key, gitToken, googleToken, folder, url,Keyword,UserProfile
from .serializers import UserSerializer, FolderSerializer, UrlSerializer, KeySerializer

# Imports for API (Regex for url...,IP logging,scraper functions,..)
from .scraper import REGEX_PROTOCOL, get_client_ip, scrape, INTS, getSitename,isNumber,convertLength  # scraper
from secrets import token_hex, choice  # api key generator
from random import randint  # random integer
import re  # regex

# For github application
from .github import getGithub


#Same limitation as login
class fetchGithub(mixins.ListModelMixin, viewsets.GenericViewSet):
    throttle_scope = 'LOGINThrottle'

    def list(self, request, *args, **kwargs):
        code = request.GET.get('code')
        INFO = getGithub(code)
        return Response(INFO)

#Limit : 5 per day
class userCreation(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    login = 'LOGINThrottle'

    #Infinite
    def list(self, request, *args, **kwargs):
        """Used to fetch Userdata or to see if a username exists"""
        user = request.user
        if (not user.is_authenticated):
            username = request.GET.get('username')
            if (username is None):
                return Response({"error": "No username specified"})
            if (User.objects.filter(username=username).exists() or len(username) == 0):
                return Response({"error": "Cats are fat"})
            return Response({"success": "lions are dog body builders"})
        else:
            user = User.objects.filter(username=user.username).first()
            return Response({"success": {
                "username": user.username,
                "email": None if user.email == '' else user.email
            }})

    #6 day
    def create(self, request, *args, **kwargs):
        """User creation view,
            makes use of Django built in token authentication,
            accepts 3 types of authentication : {
                from google.com Fetches (USERNAME,EMAIL,ID)
                from github.com Fetches (ID) (USERNAME IS MANUALLY INSERTED)
                from normal requests
            }
        """

        # Handles Login and Register
        METHOD = request.POST.get('method')
        if (METHOD is None):
            return Response({"error": "No authentication method was specified"})
        METHOD = METHOD.strip().lower()

        id = request.POST.get('id')
        if (id is None and METHOD != "normal"):
            return Response({"error": "id non existant"})

        # Google Handler
        if (METHOD == 'google'):
            id = request.POST.get('id')
            print("\n\n {} \n\n".format(id))
            # Login
            if (googleToken.objects.filter(restore_key=id).exists()):
                # Get called if the user logging in already has an account
                user = googleToken.objects.filter(restore_key=id).first().owner
                token = Token.objects.filter(user=user).first()
                response = Response(
                    {"success": {"token": str(token.key), "username": user.username}})
                response.set_cookie("auth_key", str(token.key))
                return response

            # Handles Registeration
            username = request.POST.get('username')

            # if the username exists
            # frontend will urge user to choose another username
            if (User.objects.filter(username=username).exists()):
                return Response({"error": "Username already exists"})

            email = request.POST.get('email')
            user = User(
                username=username,
                email=email
            )

            user.save()

            # Token to be stored in the db to handle user login
            google_token = googleToken(
                restore_key=id,
                owner=user
            )
            google_token.save()

            # Token to be used for user authentication (MUST BE STORED IN LOCAL-STORAGE/COOKIES)

            token = Token.objects.create(user=user)
            token.save()

            response = Response({'success': {
                "username": user.username,
                "token": token.key
            }})

            response.set_cookie("auth_key", str(token.key))
            return response

        # Handles github registeration
        elif (METHOD == "github"):
            id = request.POST.get('id')

            print("\n\n\n \n {} \n\n ".format(id))

            # Gets called if the user already has an account
            if (gitToken.objects.filter(restore_key=id).exists()):
                user = gitToken.objects.filter(restore_key=id).first().owner
                token = Token.objects.filter(user=user).first()
                response = Response(
                    {"success": {"token": str(token.key), "username": user.username}})
                response.set_cookie("auth_key", str(token.key))
                return response

            # Handles registeration using github
            username = request.POST.get('username')

            print(username)

            if username == '':
                return Response({"no": "did not get data"})

            if (username is None):
                return Response({"error": "No username specified"})

            if (User.objects.filter(username=username).exists()):
                return Response({"error": "Username {} already exists".format(username)})

            user = User(username=username)
            user.save()

            git_token = gitToken(
                restore_key=id,
                owner=user
            )
            git_token.save()

            token = Token(
                user=user
            )
            token.save()

            response = Response({'success': {
                "username": user.username,
                "token": token.key
            }})
            response.set_cookie("auth_key", str(token.key))
            return response

        else:
            username = request.POST.get('username')
            password = request.POST.get('password')



            # if the username does not exist
            if (not User.objects.filter(username=username).exists()):
                user = User(username=username)
                user.set_password(password)
                user.save()

                # set the Token
                token = Token(
                    user=user
                )
                token.save()
                response = Response({'success': {
                    "username": user.username,
                    "token": str(token.key)
                }})
                response.set_cookie("auth_key", str(token.key))
                return response
            else:
                user = auth.authenticate(username=username, password=password)
                if (user is not None):
                    Token.objects.filter(user=user).first().delete()
                    token = Token(user=user)
                    token.save()
                    return Response({"success": {
                        "username": user.username,
                        "token": str(token.key)
                    }})
                else:
                    return Response({"error": "Invalid Credidentials"})

    def get_throttles(self,*args,**kwargs):
        if (self.request.method.upper() == "GET"):
            return []
        else:
            return [LOGINThrottle(),]

#30 per minute
class Folder(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = FolderSerializer
    queryset = folder.objects.all()

    def list(self, request, *args, **kwargs):
        """Handles folder listing and pagination"""
        user = request.user
        # int(request.GET.get("start_index")) #ex 0

        if (user.is_authenticated):

            search_filter = request.GET.get("search")

            # Identify user and get related objects from table
            user = User.objects.filter(username=user.username).first()
            QUERY = folder.objects.filter(creator=user).order_by(
                '-date_created')  # 40  QUERY[0:20]  QUERY[INDEX:INDEX+20]
            if (search_filter is not None):
                QUERY = QUERY.filter(
                    Q(name__icontains=search_filter)).order_by('-date_created')

            view_pages = request.GET.get('view_pages')

            print(request.GET.get('index'))

            # Get the starting index
            index = int(request.GET.get('index')) if request.GET.get(
                'index') is not None else ''
            query_length = len(QUERY)  # 40

            if (view_pages is not None):
                return Response([query_length])

            if (len(QUERY) < index):
                if (len(QUERY) == 0):
                    QUERY = folder.objects.filter(
                        creator=user).order_by('-date_created')

            # Configure stopping point
            target = (index+20)  # 20
            END = target if (query_length > target) else (query_length-index)

            DATA = []

            # Starting at index position
            position = index
            for repository in QUERY[index:target]:  # FROM INDEX => TARGET
                DATA.append(
                    {
                        "name": repository.name,
                        "description": repository.description,
                        "date_created": repository.date_created.date(),
                        "url_num": len(repository.urls.all()),
                        "folder_id": repository.pk,
                        "local_id": position
                    }
                )
                position += 1
            return Response(DATA)
        return Response({"error": "Not Authenticated"})

    def create(self, request, *args, **kwargs):
        """Handles Folder creation"""
        user = request.user
        if (user.is_authenticated):
            user = User.objects.filter(username=user.username).first()
            name = request.POST.get('name')
            description = request.POST.get('description')
            if (len(name) > 50):
                return Response({"error": "Name Cannot be greater than 50 Characters"})
            if (len(description) > 500):
                return Response({"error": "Description must contain fewer than 500 CHARS"})
            if (folder.objects.filter(creator=user).filter(name=name).exists()):
                return Response({"error": "An object with that name already exists"})
            new_folder = folder(
                name=name,
                description=description,
                creator=user
            )
            new_folder.save()
            return Response({
                "name": new_folder.name,
                "description": new_folder.description,
                "date_created": new_folder.date_created.date(),
                "url_num": len(new_folder.urls.all()),
                "folder_id": new_folder.pk,
            })

        return Response({"error": "Not authenticated"})

#No limit
class Folder_Action(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = folder.objects.all()
    serializer_class = FolderSerializer

    def list(self, request, *args, **kwargs):
        user = request.user
        if (user.is_authenticated):
            args = request.GET.get("args")
            user = User.objects.filter(username=user.username).first()
            folds = folder.objects.filter(creator=user)
            result = folds.filter(name=args).exists()
            return Response(["error" if result else "success"])
        else:
            return Response({"error": "Not authenticated"})

    def post(self, request, *args, **kwargs):
        """Delete multiple folders given a request"""
        user = request.user
        if (not user.is_authenticated):
            return Response({"error": "Not authenticated"})
        user = User.objects.filter(username=user.username).first()
        QUERY = folder.objects.filter(creator=user)
        id_s = request.POST.getlist('ids[]')
        print(f'This is the ID {id_s} \n\n\n')
        NAMES = []
        for id in id_s:
            if (QUERY.filter(pk=id).exists()):
                fakelos = QUERY.filter(pk=id).first()
                NAMES.append(fakelos.name)
                fakelos.delete()
            else:
                print("DOES \n\n not EXIST")
        return Response(NAMES)

#45 per POST - minute
class UrlView(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UrlSerializer
    queryset = url.objects.all()
    ui_direct = 'ui_direct'

    def create(self, request, *args, **kwargs):
        user = request.user

        # Authentication check
        if (not user.is_authenticated):
            return Response({"error": "Not authenticated"})

        # Fetch Credidentials
        user = User.objects.filter(username=user.username).first()  # user
        id = request.POST.get('id')  # folder id
        url_obj = request.POST.get('url')  # url
        # Identify folder

        if (len(url_obj) > 400):
            return Response({"big" : "Url 2 big"})

        # Check if folder exists
        if (not folder.objects.filter(pk=id).exists()):
            return Response({"error": "Folder does not exist"})

        fakelos = folder.objects.filter(pk=id).first()

        # Called if url already in folder
        if (fakelos.urls.filter(url=url_obj).exists()):
            return Response({"error": "URL already exists in the current folder"})

        if (not fakelos.creator == user):
            return Response({"error" : "Not the owner of this folder"})

        # Called if the URL is already in DB
        if (url.objects.filter(url=url_obj).exists()):
            print(f'\n\n URL EXISTS \n\n')
            url_obj = url.objects.filter(url=url_obj).first()
            # Add the url to the folder
            fakelos.urls.add(url_obj)
            INFO = {
                "url": url_obj.url,
                "title": url_obj.title,
            }
            if (len(url_obj.description) > 0):
                INFO['description'] = url_obj.description
            if (len(url_obj.image) > 0):
                INFO['image'] = url_obj.image
            if (len(url_obj.duration) > 0):
                INFO['duration'] = url_obj.duration
            if (len(url_obj.tags.all()) > 0):
                TAGS = []
                for item in url_obj.tags.all():
                    TAGS.append(item.name)
                INFO['tags'] = TAGS
            INFO['domain'] = getSitename(url_obj.url)[0]
            INFO['id'] = url_obj.pk
            INFO['fold_id'] = fakelos.pk
            return Response(INFO)
        else:
            print("\n\n URL DOES NOT EXIST \n\n")
            # if it is not perform the scraping
            result = scrape(url_obj)
            if 'error' in result:
                return Response({"error" : "Could not fetch domain"})
            print(f'{result} \n\n\n')
            link = url(
                url=url_obj,
                title= convertLength(result['title'],400) if 'title' in result else '',
                creator=user,
                description= convertLength(result['description'],400) if 'description' in result else '',
                image=result['image'] if 'image' in result else '',
                duration=result['duration'] if 'duration' in result else '',
            )
            link.save()

            if ('keywords' in result):
                TAGS = []
                for item in result['keywords']:
                    if (len(TAGS) >= 5):
                        break
                    if (len(item) > 15):
                        continue
                    if (Keyword.objects.filter(name=item).exists()):
                        link.tags.add(Keyword.objects.filter(name=item).first())
                        TAGS.append(Keyword.objects.filter(name=item).first().name)
                        continue
                    key = Keyword(
                        name = item
                    )
                    key.save()
                    link.tags.add(key)
                    TAGS.append(item)
                print(TAGS)
                result['tags'] = TAGS

            fakelos.urls.add(link)
            result['id'] = link.pk
            result['fold_id'] = fakelos.pk
            return Response(result)

    def list(self, request, *args, **kwargs):
        """Handles URL View and Pagination,
            Basically a duplicate of the above
        """
        user = request.user
        if (not user.is_authenticated):
            return Response({"error": "Not Authenticated"})

        # Folder id and authentication
        user = User.objects.filter(username=user.username)
        id = request.GET.get('id')  # Folder id

        #Index and search
        index = request.GET.get('index')  # index to start searching
        search_filter = request.GET.get("search")  # search filter


        if (id is None or id ==''):
            return Response({"error" : "Id is none"})
        
        if (index is None or index ==''):
            index = 0
        

        index = int(index) if index is not None else ''

        # request to see number of pages
        view_pages = request.GET.get('view_pages')

        initial_query = folder.objects.filter(pk=id).first()  # the folder
        FULL_QUERY = initial_query.urls  # the list of urls

        if (search_filter is not None and search_filter != ''):
            FULL_QUERY = FULL_QUERY.annotate(search=SearchVector('title','tags__name','url')).filter(search__icontains=search_filter.strip()).distinct('url')


        FULL_QUERY = FULL_QUERY.order_by('url','-date_created')

        # Request to see length of pages
        if (view_pages is not None):
            return Response([len(FULL_QUERY)])

        target = (index+20)

        END = target if len(FULL_QUERY) > target else (len(FULL_QUERY)-index)

        DATA = []

        # Starting at index position
        position = index
        for domain in FULL_QUERY[index:target]:  # FROM INDEX => TARGET
            LOCAL_STORAGE = {"url": domain.url, "title": domain.title, "id": domain.pk, 'domain': getSitename(domain.url)[0]}
            if (domain.description is not None and len(domain.description) > 0):
                LOCAL_STORAGE['description'] = domain.description
            if (domain.image is not None and len(domain.image) > 0):
                LOCAL_STORAGE['image'] = domain.image
            if (domain.duration is not None and len(domain.duration) > 0):
                LOCAL_STORAGE['duration'] = domain.duration
            if (len(domain.tags.all()) > 0):
                TAGS = []
                for item in domain.tags.all():
                    TAGS.append(item.name)
                LOCAL_STORAGE['tags'] = TAGS

            
            LOCAL_STORAGE['fold_id'] = initial_query.pk

            DATA.append(LOCAL_STORAGE)

            position += 1
        return Response(DATA)

    def get_throttles(self,*args,**kwargs):
        if (self.request.method.upper() == 'POST'):
            return [UIURLThrottle(),]
        else:
            return []

#30 GET per day 
class URL_DEMO(mixins.ListModelMixin, viewsets.GenericViewSet):
    service_test = 'service_test'
    serializer_class = KeySerializer

    def list(self, request, *args, **kwargs):
        url = request.GET.get('url')
        if (url is None):
            return Response({"error": "No URI specified"})
        resp = scrape(url)
        if resp is None:
            return Response({"error" : "test"})
        return Response(resp)


    def create(self, request, *args, **kwargs):
        user = request.user
        folder_id = request.POST.get('folder_id')
        url_id = request.POST.get('url_id')
        if (folder_id is None or url_id is None or not user.is_authenticated):
            return Response({"error" : "Failed to authenticate"})
        
        print(f'User {user.username} is trying to delete {url_id} from {folder_id} ')
        print(isNumber(url_id))

        if (not isNumber(folder_id) and not isNumber(url_id)):
            print("DEFENETELY NUMBERS")
            return Response({"error" : "not valid numbers"})



        url_id = int(url_id)
        folder_id = int(folder_id)  
        

        current_cwf = folder.objects.filter(pk=folder_id).first()

        if (not current_cwf.creator == user):
            return Response({"error" : "Not the owner of the Folder"})

        current_cwu = url.objects.filter(pk=url_id).first()
        if (current_cwf is None or current_cwu is None):
            return Response({"error" : "url of folder does not exist"})
        url_match = current_cwf.urls.filter(url=current_cwu).first()
        if (url_match is None):
            return Response({"error" : "Url not in folder"})
        current_cwf.urls.remove(url_match)
        return Response({"success" : "Successfuly removed {} from {}".format(current_cwu,current_cwf)})

    def get_throttles(self,*args,**kwargs):
        if (self.request.method.upper() == 'GET'):
            return [APIDEMOThrottle(),]
        else:
            return []

#Infinite
class SingleFolderIdentifyer(mixins.ListModelMixin,viewsets.GenericViewSet):

    def list(self,request,*args,**kwargs):

        try:
            int(request.GET.get("id"))
        except:
            return Response({"error" : "not integer"})


        primary_key = request.GET.get("id")

        user = request.user
        quer = folder.objects.filter(pk=primary_key)



        if (not user.is_authenticated or not quer.exists()):
            return Response({"error" : "Not authenticated or invalid id"})
        quer = quer.first()

        if (not quer.creator == user):
            return Response({"error" : "Invalid ID"})
        
        OBJECT = {
            "name": quer.name,
            "description": quer.description,
            "date_created": quer.date_created.date(),
            "url_num": len(quer.urls.all()),
            "id": quer.pk,
        }

        print(OBJECT)

        return Response(OBJECT)

#None
class UserLevelView(mixins.ListModelMixin,viewsets.GenericViewSet):

    def list(self,request,*args,**kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({"error" : "Not authenticated"})
        profile = UserProfile.objects.filter(user=user)
        if not profile.exists():
            return Response({"error" : "Profile does not exist"})
        profile = profile.first()
        Folders__ = folder.objects.filter(creator=user)
        QUER = Folders__.annotate(URI=Count('urls'))
        return Response({
            "level" : profile.level,
            "exp" : profile.EXP,
            "final_xp" : profile.FINAL_XP,
            "MULTIPLIER" : profile.MULTIPLIER,
            "folders" : len(Folders__),
            "urls" :  sum(item.URI for item in QUER) #for each row of Folders__ sum the length
        })

    