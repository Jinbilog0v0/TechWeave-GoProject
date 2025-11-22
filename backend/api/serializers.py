from django.contrib.auth.models import User
from rest_framework import serializers  
from .models import Project, Task, TeamMember, Comment, Attachment, ActivityLog, Notification, Expense, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role', 'course', 'bio', 'profile_picture']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False) # Nested serializer

    class Meta: 
        model = User
        fields = ['id', 'username', "email", "password", "profile"] 
        extra_kwargs = {'password': {'write_only': True}, 'email': {'required': True}}

    def create(self, validated_data):
        # Separate profile data from user data
        profile_data = validated_data.pop('profile', {})
        
        # Create the user (Standard Django way)
        user = User.objects.create_user(**validated_data)
        
        # Update the automatically created profile with the extra data
        if profile_data:
            # We access user.profile safely thanks to the Signal
            for attr, value in profile_data.items():
                setattr(user.profile, attr, value)
            user.profile.save()
            
        return user


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')  

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'owner', 'start_date',
            'end_date', 'project_type', 'status', 'priority'
        ]
 

class ProjectSummarySerializer(serializers.ModelSerializer):
    """
    Lightweight summary used on dashboard lists.
    """
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "project_type",
            "status",
            "priority",
            "start_date",
            "end_date",
        ]

class ActivityLogHomeSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(source="project.title", read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "action", "timestamp", "project_title", "user_name"]


class ExpenseSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(source="project.title", read_only=True)

    class Meta:
        model = Expense
        fields = ["id", "category", "amount", "description", "date", "project_title"]

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

# --- DELETED THE DUPLICATE ExpenseSerializers CLASS HERE ---

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'  

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'  

class ActivityLogSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ActivityLog
        fields = '__all__'  

class NotificationSerializer(serializers.ModelSerializer):        
    class Meta:
        model = Notification
        fields = '__all__'