from django.contrib.auth.models import User
from rest_framework import serializers  
from .models import Project, Task, TeamMember, Comment, Attachment, ActivityLog, Notification, Expense, Profile

# --- USER & PROFILE ---

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture', 'role', 'course', 'bio']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta: 
        model = User
        fields = ['id', 'username', "email", "password", "profile"] 
        extra_kwargs = {'password': {'write_only': True}, 'email': {'required': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        for attr, value in profile_data.items():
            setattr(user.profile, attr, value)
        user.profile.save()
        return user


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    progress = serializers.SerializerMethodField() 

    class Meta:
        model = Project
        fields = '__all__'

    def get_progress(self, obj):
        total_tasks = obj.tasks.count()
        if total_tasks == 0:
            return 0
        completed_tasks = obj.tasks.filter(status='Done').count()
        return round((completed_tasks / total_tasks) * 100)

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'project', 'user', 'role', 'joined_at']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

# --- EXTRAS ---

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    project_title = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = ['id', 'action', 'timestamp', 'user_name', 'project_title', 'project']

    def get_user_name(self, obj):
        return obj.user.username if obj.user else "Unknown User"

    def get_project_title(self, obj):
        return obj.project.title if obj.project else "Deleted Project"