from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
        return f"{self.user.username}'s Profile"

# -----------------------
# CORE MODELS
# -----------------------
class Project(models.Model):
    STATUS_CHOICE = [
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
        ('Pending', 'Pending'),
    ]

    PROJECT_TYPES = [
        ('Personal', 'Personal'),
        ('Collaborative', 'Collaborative'),
    ]
    PRIORITIES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES, default='Personal')
    status = models.CharField(max_length=20, default='To Do') # To Do, In Progress, Done
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITIES, default='Medium')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    created_at = models.DateTimeField(auto_now_add=True)

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
    ]

    PRIORITIES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    priority = models.CharField(max_length=20, choices=PRIORITIES, default='Medium')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

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
    uploaded_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='uploaded_attachments' 
    )

    def __str__(self):
        return f"Attachment for {self.task.title}"      

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivityLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

# -----------------------
# SIGNALS (AUTOMATION)
# -----------------------

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if not hasattr(instance, 'profile'):
        Profile.objects.create(user=instance)
    instance.profile.save()

@receiver(post_save, sender=Task)
def log_task_activity(sender, instance, created, **kwargs):
    user = instance.assigned_to if instance.assigned_to else instance.project.owner
    if created:
        action = f"added task '{instance.title}'"
    elif instance.status == 'Done':
        action = f"completed task '{instance.title}'"
    else:
        return 
    
    ActivityLog.objects.create(project=instance.project, user=user, action=action)

@receiver(post_save, sender=Task)
def create_task_notification(sender, instance, created, **kwargs):
    if instance.assigned_to:
        msg = f"You have been assigned to task: {instance.title}"
        # Prevent duplicate notifications if possible, or just create:
        Notification.objects.create(user=instance.assigned_to, message=msg)

# --- NEW SIGNALS FOR EXPENSES AND MEMBERS ---

@receiver(post_save, sender=Expense)
def log_expense_activity(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            project=instance.project,
            user=instance.project.owner, 
            action=f"added an expense: ${instance.amount}"
        )

@receiver(post_save, sender=TeamMember)
def log_team_activity(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            project=instance.project,
            user=instance.user,
            action=f"joined the team"
        )