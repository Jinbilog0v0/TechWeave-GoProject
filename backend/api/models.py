from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings

# -----------------------
# USER PROFILE
# -----------------------
class Profile(models.Model):
    ROLE_CHOICES = [
        ('Student', 'Student'),
        ('Teacher', 'Teacher'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Student')
    course = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username + " Profile"

# -----------------------
# CORE MODELS
# -----------------------
class Project(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('Personal', 'Personal'),
        ('Collaborative', 'Collaborative'),
    ]
    PROJECT_STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
        ('Archived', 'Archived'),
    ]
    PROJECT_PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=PROJECT_STATUS_CHOICES, 
        default='To Do'
    )
    priority = models.CharField(
        max_length=20, 
        choices=PROJECT_PRIORITY_CHOICES, 
        default='Medium'
    )
    project_type = models.CharField( 
        max_length=20, 
        choices=PROJECT_TYPE_CHOICES, 
        default='Personal'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='team_members')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, default='Member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        return f"{self.user.username} in {self.project.title}"

class Task(models.Model):
    STATUS_CHOICES = [
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
        ('Pending', 'Pending'),
        ('Missed', 'Missed'),
    ]

    PRIORITIES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    priority = models.CharField(max_length=20, choices=PRIORITIES, default='Medium')
    assigned_to = models.ManyToManyField(User, related_name='assigned_tasks', blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Expense(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='expenses')
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default='Other')
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - ${self.amount}"

# -----------------------
# EXTRAS (Comments, Attachments, Notifications, Logs)
# -----------------------
class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Attachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Attachment for {self.task.title} by {self.uploaded_by.username}"    

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivityLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, related_name='activities')
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] User {self.user.username if self.user else 'Unknown'} {self.action} in project {self.project.title if self.project else 'N/A'}"
# -----------------------
# SIGNALS (AUTOMATION)
# -----------------------

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=Task)
def log_task_activity(sender, instance, created, **kwargs):
    if created:
        action = f"added task '{instance.title}'"
        user_to_log = instance.project.owner 
        if user_to_log:
            ActivityLog.objects.create(project=instance.project, user=user_to_log, action=action, task=instance) 
            print(f"Warning: No project owner found for project {instance.project.id} when logging task creation.")

    elif instance.status == 'Done' and ActivityLog.objects.filter(task=instance, action__icontains='completed').count() == 0:
        action = f"completed task '{instance.title}'"
        user_to_log = instance.project.owner 
        if instance.assigned_to.exists():
            user_to_log = instance.assigned_to.first() 
        if user_to_log:
            ActivityLog.objects.create(project=instance.project, user=user_to_log, action=action, task=instance) 
        else:
            print(f"Warning: No user to log completion for task {instance.id}.")
    
    elif instance.status == 'Missed' and ActivityLog.objects.filter(task=instance, action__icontains='missed').count() == 0:
        action = f"missed due date for task '{instance.title}'"
        user_to_log = instance.project.owner
        if user_to_log:
            ActivityLog.objects.create(project=instance.project, user=user_to_log, action=action, task=instance) 
        else:
            print(f"Warning: No user to log missed status for task {instance.id}.")


@receiver(m2m_changed, sender=Task.assigned_to.through)
def create_assignment_notification_and_log(sender, instance, action, reverse, model, pk_set, **kwargs):
    if action == 'post_add':
        for user_pk in pk_set:
            user = User.objects.get(pk=user_pk)
            Notification.objects.create(
                user=user,
                message=f"You have been assigned to task: '{instance.title}' in project '{instance.project.title}'."
            )
          
            if instance.project.owner:
                ActivityLog.objects.create(
                    project=instance.project,
                    user=instance.project.owner,
                    action=f"assigned {user.username} to task '{instance.title}'"
                )
            else:
                print(f"Warning: No project owner to log assignment for task {instance.id}.")
    elif action == 'post_remove':
        for user_pk in pk_set:
            user = User.objects.get(pk=user_pk)
            Notification.objects.create(
                user=user,
                message=f"You have been unassigned from task: '{instance.title}' in project '{instance.project.title}'."
            )
            if instance.project.owner:
                ActivityLog.objects.create(
                    project=instance.project,
                    user=instance.project.owner,
                    action=f"unassigned {user.username} from task '{instance.title}'"
                )
            else:
                print(f"Warning: No project owner to log unassignment for task {instance.id}.")


@receiver(post_save, sender=Expense)
def log_expense_activity(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            project=instance.project,
            user=instance.project.owner, 
            action=f"added an expense: ${instance.amount} ({instance.description})"
        )

@receiver(post_save, sender=TeamMember)
def log_team_activity(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            project=instance.project,
            user=instance.project.owner, 
            action=f"added {instance.user.username} to the team"
        )