from django.db.models.signals import post_save
from .models import UserProfile,User
from django.dispatch import receiver


@receiver(post_save,sender=User)
def level_create(sender,instance,created,**kwargs):
    if created:
        UserProfile.objects.create(user=instance,level=1,EXP=1,FINAL_XP=100,MULTIPLIER=1)

@receiver(post_save,sender=User)
def level_save(sender,instance,**kwargs):
    instance.user_creator.save()