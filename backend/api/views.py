from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import (
    UserSerializer,
    ProjectSerializer, 
    TaskSerializer,
    TeamMemberSerializer,
    CommentSerializer,
    AttachmentSerializer,
    ActivityLogSerializer,
    NotificationSerializer, 
    ExpenseSerializer          
)
from rest_framework.permissions import IsAuthenticated, AllowAny
# ADDED 'Profile' to imports below
from .models import Project, Task, TeamMember, Comment, Attachment, ActivityLog, Notification, Expense, Profile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from google.oauth2 import id_token
from google.auth.transport import requests
from django.core.exceptions import ValidationError  
from django.core.validators import validate_email
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings # Imported to use settings

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class GetUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) # Allow file uploads

    def put(self, request):
        user = request.user
        data = request.data # Text data
        files = request.FILES # Image data

        username = data.get("username")
        email = data.get("email")
        
        role = data.get("role")
        course = data.get("course")
        bio = data.get("bio")
        profile_picture = files.get("profile_picture")

        errors = {}

        if username and username != user.username:
            if User.objects.exclude(pk=user.pk).filter(username=username).exists():
                errors["username"] = "This username is already taken."
            elif len(username) < 3:
                errors["username"] = "Username must be at least 3 characters long."

        if email and email != user.email:
            try:
                validate_email(email)
                if User.objects.exclude(pk=user.pk).filter(email=email).exists():
                    errors["email"] = "This email is already in use."
            except ValidationError:
                errors["email"] = "Invalid email format."

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        if username: user.username = username
        if email: user.email = email
        user.save()

        # Ensure profile exists
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user)

        profile = user.profile
        
        # Update fields if they are provided (not None)
        if role is not None: profile.role = role
        if course is not None: profile.course = course
        if bio is not None: profile.bio = bio
        
        if profile_picture: 
            profile.profile_picture = profile_picture
        
        profile.save()

        return Response({
            "message": "Profile updated successfully",
            "username": user.username,
            "email": user.email,
            "profile": {
                "role": profile.role,
                "course": profile.course,
                "bio": profile.bio,
                "profile_picture": profile.profile_picture.url if profile.profile_picture else None
            }
        }, status=status.HTTP_200_OK)

class GoogleAuth(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # It is safer to use the ID from settings, but hardcoded works for now
            CLIENT_ID = "60255886290-9ujod65phbm7mrhb435gu4kj3qssb9ra.apps.googleusercontent.com"
            # Verify Google Token
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

            google_email = idinfo["email"]
            given_name = idinfo.get("given_name", "")
            google_id = idinfo["sub"]  # unique google id

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        # Create or Get User
        user, created = User.objects.get_or_create(
            username=google_email,
            defaults={"email": google_email, "first_name": given_name},
        )

        # Generate Django Tokens (JWT)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
            "given_name": user.first_name,
        })

# api/views.py

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # 1. Start with all projects related to the user
        queryset = (
            Project.objects.filter(owner=user) |
            Project.objects.filter(team_members__user=user)
        ).distinct()

        # 2. ADD THIS BLOCK: Filter by type if provided in the URL
        # Example: /api/projects/?type=Personal
        project_type = self.request.query_params.get('type')
        if project_type:
            queryset = queryset.filter(project_type=project_type)
            
        return queryset

    def perform_create(self, serializer):
        # ... (Keep your existing perform_create logic here) ...
        project_type = self.request.data.get('project_type', 'Collaborative')
        members_data = self.request.data.get('members', [])
        
        project = serializer.save(owner=self.request.user, project_type=project_type)

        if members_data:
            for user_id in members_data:
                try:
                    user_instance = User.objects.get(id=user_id)
                    if user_instance != self.request.user:
                        TeamMember.objects.create(
                            project=project, 
                            user=user_instance, 
                            role='Member'
                        )
                except User.DoesNotExist:
                    continue

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]       

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    # SECURITY FIX: Filter tasks by user's projects
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            project__in=Project.objects.filter(owner=user) | 
            Project.objects.filter(team_members__user=user)
        ).distinct()

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticated]
    queryset = TeamMember.objects.all()

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(
            project__in=Project.objects.filter(owner=user) | 
            Project.objects.filter(team_members__user=user)
        ).distinct()

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()

class AttachmentListView(generics.ListCreateAPIView):
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]  

    # SECURITY FIX: Only show attachments for user's tasks
    def get_queryset(self):
        user = self.request.user
        return Attachment.objects.filter(
            task__project__owner=user
        ) | Attachment.objects.filter(
             task__project__team_members__user=user
        )

class ActivityLogViewSet(viewsets.ModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
    
    # SECURITY FIX: Only show logs for user's projects
    def get_queryset(self):
        user = self.request.user
        return ActivityLog.objects.filter(
            project__owner=user
        ) | ActivityLog.objects.filter(
            project__team_members__user=user
        ).distinct()


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    # SECURITY FIX: Only show user's own notifications
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)