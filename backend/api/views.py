from django.shortcuts import render
from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from .permissions import IsTeamMemberOrOwner, IsOwnerOrReadOnly
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from django.core.validators import validate_email

from .models import (
    Project, Task, TeamMember, Comment, Attachment, 
    ActivityLog, Notification, Expense, Profile
)

from .serializers import (
    ProjectSerializer, TaskSerializer,
    TeamMemberSerializer, CommentSerializer, AttachmentSerializer,
    NotificationSerializer, ExpenseSerializer, ActivityLogSerializer,
    CustomUserSerializer 
)

# ---------------------------------------------------------
# USER MANAGEMENT
# ---------------------------------------------------------

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer 
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer 
    permission_classes = [IsAuthenticated]

class GetUserView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer 
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# ✅ FIXED: UpdateUserView now returns data in the same format as GetUserView
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

        # Update User model
        if username: 
            user.username = username
        if email: 
            user.email = email
        user.save()

        # Update Profile model
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user)
        
        profile = user.profile
        if role is not None: 
            profile.role = role
        if course is not None: 
            profile.course = course
        if bio is not None: 
            profile.bio = bio
        
        if profile_picture: 
            profile.profile_picture = profile_picture
        
        profile.save()

        # ✅ CRITICAL FIX: Return data in the SAME format as CustomUserSerializer
        # This ensures consistency between GET and PUT responses
        profile_pic_url = None
        if profile.profile_picture:
            profile_pic_url = request.build_absolute_uri(profile.profile_picture.url)

        return Response({
            "id": user.id,
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
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly] 

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(
            Q(owner=user) | Q(team_members__user=user)
        ).distinct()

        project_type = self.request.query_params.get('type') 
        if project_type:
            queryset = queryset.filter(project_type=project_type) 
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsTeamMemberOrOwner]

    def get_queryset(self):
        Task.objects.filter(
            due_date__lt=timezone.now().date(),
            status__in=['To Do', 'In Progress', 'Pending'] 
        ).exclude(
            status__in=['Done', 'Missed']
        ).update(status='Missed')

        queryset = Task.objects.all()
        project_id = self.request.query_params.get('project')

        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                raise PermissionDenied("Project not found.")

            if self.request.user == project.owner or project.team_members.filter(user=self.request.user).exists():
                return queryset.filter(project=project).distinct()
            else:
                raise PermissionDenied("You do not have permission to view tasks for this project.")
        else:
            user_projects = Project.objects.filter(
                models.Q(owner=self.request.user) |
                models.Q(team_members__user=self.request.user)
            ).distinct()
            return queryset.filter(project__in=user_projects).distinct()

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        if not project.team_members.filter(user=self.request.user).exists() and self.request.user != project.owner:
             raise PermissionDenied("You must be the project owner or a member of the project to create tasks.")
        serializer.save()

    def _check_assignment_permission(self, request, task_instance):
        """Helper method to check if the user is allowed to change assignments."""
        if 'assigned_to' in request.data:
            if request.user != task_instance.project.owner:
                request.data.pop('assigned_to')  
        return request

    def update(self, request, *args, **kwargs):
        instance = self.get_object() 
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
        
        request = self._check_assignment_permission(request, instance) 
        
        if hasattr(request.data, '_mutable'):
            request.data._mutable = False
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object() 
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
        
        request = self._check_assignment_permission(request, instance)

        if hasattr(request.data, '_mutable'):
            request.data._mutable = False     
        return super().partial_update(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        if instance.project.owner:
            ActivityLog.objects.create(
                project=instance.project,
                user=self.request.user,
                action=f"deleted task '{instance.title}'",
                task=instance
            )
        instance.delete()


class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = TeamMember.objects.filter(
            project__in=Project.objects.filter(
                Q(owner=user) | Q(team_members__user=user)
            )
        ).distinct()

        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
            
        return queryset
    
    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if project.owner != self.request.user:
            raise permissions.PermissionDenied("Only the project owner can add team members.")
        serializer.save()

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
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        task_id = self.request.query_params.get('task')
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        return queryset

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
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