from django.urls import path
from . import views

app_name= "mailview"
urlpatterns= [
    path('', views.index, name='index'),
    path('inbox', views.index, name='index'),
    path('compose', views.index, name='index'),
    path('sent', views.index, name='index'),
    path('archived', views.index, name='index'),
    path('inbox/<int:mail_id>', views.detail, name='detail'),
    path('compose/<int:mail_id>', views.detail, name='detail'),
    path('sent/<int:mail_id>', views.detail, name='detail'),
    path('archived/<int:mail_id>', views.detail, name='detail'),


    #API Routes
    path('emails', views.compose, name='compose'),
    path('emails/<int:mail_id>', views.mail_detail, name='emailDetail'),
    path('emails/<str:mail_box>', views.mailbox, name='mailbox')
]