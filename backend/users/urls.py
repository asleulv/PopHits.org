from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserLogoutView, UserProfileView, UserProfileView, ResetPasswordRequest, ResetPasswordConfirm, CSRFTokenView

urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='csrf-token'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileView.as_view(), name='user-update'),
    path('reset-password/', ResetPasswordRequest.as_view(), name='reset-password'),
    path('confirm-reset-password/<uid>/<token>/', ResetPasswordConfirm.as_view(), name='confirm-reset-password'),
    
]
