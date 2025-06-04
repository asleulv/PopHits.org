from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from songs.models import UserSongRating
from .serializers import UserSongRatingSerializer
from .utils import send_registration_email
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import HttpResponse


class CSRFTokenView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return HttpResponse("CSRF cookie set")


class UserRegistrationView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not (username and email and password):
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'Email is already registered.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)

        # Create a token for the new user
        token, created = Token.objects.get_or_create(user=user)

        # Send registration email
        send_registration_email(username, email)

        response = Response({'token': token.key, 'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        # Ensure CSRF cookie is set
        response.set_cookie('csrftoken', request.META.get('CSRF_COOKIE', ''), httponly=False, samesite='Lax')
        return response

class UserLoginView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            response = Response({'token': token.key}, status=200)
            # Ensure CSRF cookie is set
            response.set_cookie('csrftoken', request.META.get('CSRF_COOKIE', ''), httponly=False, samesite='Lax')
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=400)
    
class UserLogoutView(APIView):
    def post(self, request):
        # Ensure CSRF token is included in the response
        # if the view is being rendered by a template
        response = Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)
        response.delete_cookie('csrftoken')
        
        logout(request)
        return response
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Retrieve basic user information
            user_data = {
                'username': request.user.username,
                'email': request.user.email,
                'id': request.user.id,
            }

            # Retrieve user's rating history
            ratings = UserSongRating.objects.filter(user=request.user)
            rating_history = UserSongRatingSerializer(ratings, many=True).data

            # Return user data along with rating history in the response
            return Response({'user_data': user_data, 'rating_history': rating_history, 'message': 'User profile retrieved successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
      try:
          # Retrieve the authenticated user
          user = request.user

          # Update the email if provided in the request data
          new_email = request.data.get('email')
          if new_email:
              user.email = new_email

          # Update the password if provided in the request data
          new_password = request.data.get('password')
          if new_password:
              # Hash the new password before saving
              user.set_password(new_password)

          # Update the username if provided in the request data
          new_username = request.data.get('username')
          if new_username:
              # Check if the new username is unique
              if User.objects.filter(username=new_username).exclude(id=user.id).exists():
                  return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
              user.username = new_username

          # Save the user object
          user.save()

          return Response({'message': 'User profile updated successfully.'}, status=status.HTTP_200_OK)
      except Exception as e:
          return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordRequest(APIView):

  def post(self, request):
    email = request.data['email']
    
    # Validate email 
    if User.objects.filter(email=email).exists():
      user = User.objects.get(email=email)  
      uid = urlsafe_base64_encode(force_bytes(user.pk))
      token = default_token_generator.make_token(user)

      reset_url = f'http://localhost:3000/confirm-reset-password/{uid}/{token}'
      
      send_mail(
        'Password Reset',
        f'Click to reset password: {reset_url}',
        'from@example.com',
        [user.email]
      )

      return Response({'success': 'We have sent you a link to reset your password'})
    
    else:
      return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordConfirm(APIView):

  @staticmethod
  def get_user_for_token(uid, token):
    try:
      uid = force_str(urlsafe_base64_decode(uid))  
      user = User.objects.get(pk=uid)
    except:
      user = None

    if user and default_token_generator.check_token(user, token):
      return user
      
    return None

  def post(self, request, uid, token):
    
    user = self.get_user_for_token(uid, token)

    if user:
      # Set new password
      user.set_password(request.data['new_password'])
      user.save()

      send_mail(
        'Password Reset Confirmation',
        'Your password has been reset successfully.',
        'from@example.com',
        [user.email],
      )
      
      return Response({'success':'Password reset successful'}, status=status.HTTP_200_OK)
      
    else:
      return Response({'error':'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
