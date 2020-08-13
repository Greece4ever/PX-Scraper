from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Keyword(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f'{self.name.upper()}'



class url(models.Model):
    """url that refers to a favorite website of a user,
        the frontend will fetch some data from the website,
        and have a nice visual representation of what it is
        (Some data will be stored in the database for better performance in the frontend)
    """
    #Notice we do not actually store the image but the url (We do not have the best servers)
    title = models.CharField(max_length=200,blank=True)
    url = models.CharField(max_length=200)
    image = models.CharField(max_length=200,blank=True)
    description = models.CharField(max_length=200,blank=True)
    duration = models.CharField(max_length=20,blank=True) # if the url is a video it will give it in hh:mm:ss format
    date_created = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(User,related_name="creator",null=True,on_delete=models.SET_NULL)
    tags = models.ManyToManyField(Keyword,related_name='tags',blank=True)


    def __str__(self):
        return f'{self.url}'



class folder(models.Model):
    """The main class 'folder' which consists of 2 foreign referances 
        (Tags and urls), it is the root of all external data stored in it 
     """
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500,blank=True)
    urls = models.ManyToManyField(url,related_name='urls',blank=True)
    date_created = models.DateTimeField(default=timezone.now)
    creator = models.ForeignKey(User,related_name="user",on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} - {self.creator.username}'

#Google
class googleToken(models.Model):
    """GOOGLE"""
    restore_key = models.CharField(max_length=110) #Key given by google github or set for account recovery
    owner = models.ForeignKey(User,on_delete=models.CASCADE)


    def __str__(self):
        return f'{self.owner.username}'

#Github
class gitToken(models.Model):
    """GITHUB"""
    restore_key = models.CharField(max_length=110) 
    owner = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.owner.username}'



#Communication with the scraper API
class key(models.Model):
    token = models.CharField(max_length=100,unique=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)


    def __str__(self):
        return f'{self.user.username} - {int(len(self.token) / 2)} bit'


class UserProfile(models.Model):
    # 1 - 100 multiplier => range(1,10)
    # 100 - 1000 multiplier => range(10,100)
    # 1000 - 10000 multiplier => range(100,1000)
    # Multiplier => if level 1 : 10;level 2 : 100; =>>>> RANDINT(1,10) * MULTIPLIER
    level = models.IntegerField() 
    EXP = models.IntegerField()
    FINAL_XP = models.IntegerField() 
    MULTIPLIER = models.IntegerField()
    user = models.OneToOneField(User,related_name='user_creator',on_delete=models.CASCADE,default=None)



    def __str__(self):
        return f'{self.user.username} : LEVEL ( {self.level}  ) => {self.EXP} of {self.FINAL_XP} | Multiplier of {self.MULTIPLIER}'