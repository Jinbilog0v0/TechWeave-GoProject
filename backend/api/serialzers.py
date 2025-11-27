from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault
from .models import Project, Task, TeamMember, Comment, Attachment, Profile, Expense, Notification, ActivityLog

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture']

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model with proper profile picture URL"""
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['role', 'course', 'bio', 'profile_picture']
    
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.ReadOnlyField(source='uploaded_by.username')
    file_url = serializers.FileField(source='file', read_only=True)

    class Meta:
        model = Attachment
        fields = '__all__' 
        read_only_fields = ['uploaded_by', 'uploaded_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_details = CustomUserSerializer(source='assigned_to', many=True, read_only=True)
    project_owner_id = serializers.ReadOnlyField(source='project.owner.id')
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'description', 'status', 'priority', 
            'due_date', 'assigned_to', 'assigned_to_details', 
            'created_at', 'updated_at', 'project_owner_id', 'attachments'
        ]
        read_only_fields = ['created_at', 'updated_at', 'project_owner_id', 'attachments']

class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    progress = serializers.SerializerMethodField()
    
    member_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True,               
        required=False                 
    )

    status = serializers.ChoiceField(
        choices=Project.PROJECT_STATUS_CHOICES, 
        default='To Do',                         
        required=False,                       
        allow_blank=False
    )
    
    start_date = serializers.DateField(required=False, allow_null=True)
    owner = serializers.HiddenField(default=CurrentUserDefault())

    team_members = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__' 
        read_only_fields = ['owner_username', 'created_at', 'progress'] 

    def get_progress(self, obj):
        total_tasks = obj.tasks.count()
        if total_tasks == 0:
            return 0
        completed_tasks = obj.tasks.filter(status='Done').count()
        return round((completed_tasks / total_tasks) * 100)

    def get_team_members(self, obj):
        members = obj.team_members.all()
        return TeamMemberSerializer(members, many=True, context=self.context).data

    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', []) 
        
        project = super().create(validated_data) 

        if project.project_type == 'Collaborative' and project.owner:
            TeamMember.objects.get_or_create(project=project, user=project.owner, defaults={'role': 'Owner'})

        for user_id in member_ids:
            try:
                user = User.objects.get(id=user_id)
                if user != project.owner:
                    TeamMember.objects.create(project=project, user=user, role='Member')
            except User.DoesNotExist:
                print(f"Warning: User with ID {user_id} not found when creating project {project.id}")
        return project

    def update(self, instance, validated_data):
        member_ids = validated_data.pop('member_ids', None)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.project_type = validated_data.get('project_type', instance.project_type)
        instance.status = validated_data.get('status', instance.status)
        instance.start_date = validated_data.get('start_date', instance.start_date)

        instance.save()

        if member_ids is not None:
             pass
        return instance

class TeamMemberSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True, required=True
    )
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True, required=True
    )

    class Meta:
        model = TeamMember
        fields = ['id', 'project', 'project_id', 'user', 'user_id', 'role', 'joined_at']
        read_only_fields = ['joined_at', 'role']

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author', 'created_at']

    def get_author_profile_picture(self, obj):
        try:
            if hasattr(obj.author, 'profile') and obj.author.profile.profile_picture:
                return obj.author.profile.profile_picture.url
        except Exception:
            pass
        return None

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['date']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    project_title = serializers.ReadOnlyField(source='project.title')
    task_title = serializers.ReadOnlyField(source='task.title')

    class Meta:
        model = ActivityLog
        fields = '__all__'
        read_only_fields = ['timestamp', 'user', 'project', 'task']