from django.urls import path
from . import views

app_name= "mailview"
urlpatterns= [
    path('', views.index, name='index'),
    path('<str:mail_box>', views.locateMailBox, name='locateMailBox'),
    path('<str:mail_box>', views.locateMailBox, name='locateMailBox'),
    path('<str:mail_box>', views.locateMailBox, name='locateMailBox'),
    path('<str:mail_box>', views.locateMailBox, name='locateMailBox'),
    path('inbox/<int:mail_id>', views.detail, name='detail'),
    path('compose/<int:mail_id>', views.detail, name='detail'),
    path('sent/<int:mail_id>', views.detail, name='detail'),
    path('archived/<int:mail_id>', views.detail, name='detail'),


    #API Routes
    path('emails', views.compose, name='compose'),
    path('emails/<int:mail_id>', views.mail_detail, name='emailDetail'),
    path('emails/<str:mail_box>', views.mailbox, name='mailbox')
]