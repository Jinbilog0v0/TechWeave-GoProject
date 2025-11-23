from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q  # <--- Added this important import
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import viewsets, generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from .permissions import IsProjectOwnerOrReadOnly, IsTeamMemberOrOwner
from rest_framework.exceptions import PermissionDenied

# Import Models
from .models import (
    Project, Task, TeamMember, Comment, Attachment, 
    ActivityLog, Notification, Expense, Profile
)

# Import Serializers
from .serializers import (
    UserSerializer, ProjectSerializer, TaskSerializer,
    TeamMemberSerializer, CommentSerializer, AttachmentSerializer,
    NotificationSerializer, ExpenseSerializer, ActivityLogSerializer
)

# ---------------------------------------------------------
# USER MANAGEMENT (Auth, Registration, Profile)
# ---------------------------------------------------------

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
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user = request.user
        data = request.data
        files = request.FILES

        username = data.get("username")
        email = data.get("email")
        role = data.get("role")
        course = data.get("course")
        bio = data.get("bio")
        profile_picture = files.get("profile_picture")

        errors = {}

        # Validation
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

        # Update User
        if username: user.username = username
        if email: user.email = email
        user.save()

        # Update Profile
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user)
        
        profile = user.profile
        if role is not None: profile.role = role
        if course is not None: profile.course = course
        if bio is not None: profile.bio = bio
        
        # Handle Image Upload
        if profile_picture: 
            profile.profile_picture = profile_picture
        
        profile.save()

        # --- GENERATE ABSOLUTE URL HERE ---
        profile_pic_url = None
        if profile.profile_picture:
            # This converts '/media/xyz.jpg' -> 'http://127.0.0.1:8000/media/xyz.jpg'
            profile_pic_url = request.build_absolute_uri(profile.profile_picture.url)

        return Response({
            "message": "Profile updated successfully",
            "username": user.username,
            "email": user.email,
            "profile": {
                "role": profile.role,
                "course": profile.course,
                "bio": profile.bio,
                "profile_picture": profile_pic_url 
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
            CLIENT_ID = "60255886290-9ujod65phbm7mrhb435gu4kj3qssb9ra.apps.googleusercontent.com"
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
            
            google_email = idinfo["email"]
            given_name = idinfo.get("given_name", "")
        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            username=google_email,
            defaults={"email": google_email, "first_name": given_name},
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email,
            "given_name": user.first_name,
        })

# ---------------------------------------------------------
# MAIN API VIEWSETS
# ---------------------------------------------------------

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerOrReadOnly] 

    def get_queryset(self):
        user = self.request.user
        # Use Q objects for robust OR logic
        queryset = Project.objects.filter(
            Q(owner=user) | Q(team_members__user=user)
        ).distinct()

        project_type = self.request.query_params.get('type')
        if project_type:
            queryset = queryset.filter(project_type=project_type)
            
        return queryset

    def perform_create(self, serializer):
        project_type = self.request.data.get('project_type', 'Collaborative')
        members_data = self.request.data.get('members', [])
        
        project = serializer.save(owner=self.request.user, project_type=project_type)

        if members_data:
            users_to_add = User.objects.filter(id__in=members_data).exclude(id=self.request.user.id)
            team_members = [
                TeamMember(project=project, user=user, role='Member')
                for user in users_to_add
            ]
            TeamMember.objects.bulk_create(team_members)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrOwner]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            project__in=Project.objects.filter(
                Q(owner=user) | Q(team_members__user=user)
            )
        ).distinct()

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if project:
            is_owner = project.owner == self.request.user
            is_member = project.team_members.filter(user=self.request.user).exists()
            
            if not (is_owner or is_member):
                raise PermissionDenied("You do not have permission to add tasks to this project.")
        
        serializer.save()

class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return TeamMember.objects.filter(
            project__in=Project.objects.filter(
                Q(owner=user) | Q(team_members__user=user)
            )
        ).distinct()

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(
            project__in=Project.objects.filter(
                Q(owner=user) | Q(team_members__user=user)
            )
        ).distinct()

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

# --- FIXED ACTIVITY LOG VIEWSET ---
class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return ActivityLog.objects.filter(
            Q(project__owner=user) | 
            Q(project__team_members__user=user)
        ).distinct().order_by('-timestamp')

# ---------------------------------------------------------
# EXTRA VIEWS
# ---------------------------------------------------------

class AttachmentListView(generics.ListCreateAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Use Q for projects query
        projects = Project.objects.filter(
            Q(owner=user) | Q(team_members__user=user)
        ).distinct()
        
        tasks = Task.objects.filter(assigned_to=user)
        
        total_projects = projects.count()
        active_projects = projects.filter(status='In Progress').count()
        total_tasks = tasks.count()
        pending_tasks = tasks.filter(status__in=['To Do', 'In Progress']).count()
        completed_tasks = tasks.filter(status='Done').count()
        
        recent_projects = projects.order_by('-start_date')[:5]
        
        recent_projects_data = [
            {
                "id": p.id,
                "title": p.title,
                "status": p.status,
                "priority": p.priority,
                "end_date": p.end_date
            } for p in recent_projects
        ]

        return Response({
            "total_projects": total_projects,
            "active_projects": active_projects,
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "completed_tasks": completed_tasks,
            "recent_projects": recent_projects_data
        })