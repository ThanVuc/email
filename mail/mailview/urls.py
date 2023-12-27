from django.urls import path
from . import views

app_name= "mailview"
urlpatterns= [
    path('', views.index, name='index'),

    #API Routes
    path('emails', views.compose, name='compose'),
    path('emails/<int:mail_id>', views.mail_detail, name='emailDetail'),
    path('emails/<str:mail_box>', views.mailbox, name='mailbox')
]