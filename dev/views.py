from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CustomAuthenticationForm



import random
from django.contrib.auth import get_user_model

User = get_user_model()


from .models import LeaderboardEntry




def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('Login')  # Redirect to login after successful registration
    else:
        form = CustomUserCreationForm()
    return render(request, 'html/Register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)  # Log the user in
                return redirect('Profile')  # Redirect to a home page or dashboard after login
            else:
                form.add_error(None, 'Invalid username or password')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'html/Login.html', {'form': form})

@login_required
def user_logout(request):
    logout(request)
    return redirect('Login')  


def Profile(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    
    try:
        leaderboard_entry = LeaderboardEntry.objects.get(user=request.user)
    except LeaderboardEntry.DoesNotExist:
        leaderboard_entry = None
    
    return render(request, 'html/Profile.html', {'leaderboard_entry': leaderboard_entry})




def home(request):
    return render(request, 'html/index.html')



def leaderboard(request):
    leaderboard_entries = LeaderboardEntry.objects.all().order_by('-level')
    return render(request, 'html/Leaderboard.html', {'leaderboard': leaderboard_entries})
from django.http import JsonResponse
from .models import LeaderboardEntry
import json

def update_level(request):
    if request.method == 'POST':
        print("Update level request received")  # Debug statement
        try:
            user = request.user  # Ensure the user is authenticated
            data = json.loads(request.body)
            level = data.get('level')

            # Update or create a leaderboard entry
            entry, created = LeaderboardEntry.objects.update_or_create(
                user=user,
                defaults={'level': level},
            )

            print(f"Level updated for user {user.username}: {entry.level}")  # Debug statement
            return JsonResponse({'success': True, 'level': entry.level})
        except Exception as e:
            print(f"Error: {e}")  # Debugging error
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

@login_required
def game1(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/1/index.html')

@login_required
def game2(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/2/index.html')

@login_required
def game3(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/3/index.html')

@login_required
def game4(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/4/index.html')

@login_required
def game5(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/5/index.html')

@login_required
def game6(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/6/index.html')

@login_required
def game7(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/7/index.html')

@login_required
def game8(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/8/index.html')

@login_required
def game9(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/9/index.html')

@login_required
def game10(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/10/index.html')

@login_required
def game11(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/11/index.html')

@login_required
def game12(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/12/index.html')

@login_required
def game13(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/13/index.html')

@login_required
def game14(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/14/index.html')

@login_required
def game15(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/15/index.html')

@login_required
def game16(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/16/index.html')

@login_required
def game17(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/17/index.html')

@login_required
def game18(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/18/index.html')

@login_required
def game19(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/19/index.html')

@login_required
def game20(request):
    if not request.user.is_authenticated:
        return redirect('Login')
    return render(request, 'games/20/index.html')