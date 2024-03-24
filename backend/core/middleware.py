from django.utils.deprecation import MiddlewareMixin

class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/auth/users/reset_password/': 
            print("Password reset requested")
        
        response = self.get_response(request)
        
        return response
    
class PermissionPolicyMiddleware(MiddlewareMixin):

  def process_response(self, request, response):
    response['Permission-Policy'] = 'encrypted-media=\'self\' open.spotify.com'
    return response