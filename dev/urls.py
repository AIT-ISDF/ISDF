from django.urls import path 
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('Leaderboard/', views.leaderboard, name='Leaderboard'),
    path('Register/', views.register, name='Register'),
    path('Login/', views.user_login, name='Login'),
    path('Profile/', views.Profile, name='Profile'),
    path('Logout/', views.user_logout, name='Logout'),
    path('update_level/', views.update_level, name='update_level'),
    path('accounts/login/', views.user_login, name='Login'), 
    path('game1/', views.game1, name='game1'),
    path('game2/', views.game2, name='game2'),
    path('game3/', views.game3, name='game3'),
    path('game4/', views.game4, name='game4'),
    path('game5/', views.game5, name='game5'),
    path('game6/', views.game6, name='game6'),
    path('game7/', views.game7, name='game7'),
    path('game8/', views.game8, name='game8'),
    path('game9/', views.game9, name='game9'),
    path('game10/', views.game10, name='game10'),
    path('game11/', views.game11, name='game11'),
    path('game12/', views.game12, name='game12'),
    path('game13/', views.game13, name='game13'),
    path('game14/', views.game14, name='game14'),
    path('game15/', views.game15, name='game15'),
    path('game16/', views.game16, name='game16'),
    path('game17/', views.game17, name='game17'),
    path('game18/', views.game18, name='game18'),
    path('game19/', views.game19, name='game19'),
    path('game20/', views.game20, name='game20'),


    
]