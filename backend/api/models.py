from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# -----------------------
# USER PROFILE (New Extension)
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
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # This check fixes issues if an existing user is saved but has no profile yet
    if not hasattr(instance, 'profile'):
        Profile.objects.create(user=instance)
    instance.profile.save()

# -----------------------
# PROJECT
# -----------------------
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    PROJECT_TYPES = [
        ('Personal', 'Personal'),
        ('Collaborative', 'Collaborative'),
    ]
    STATUS_CHOICES = [
        ('In Progress', 'In Progress'),
        ('Complete', 'Complete'),
    ]
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    project_type = models.CharField(max_length=20, choices=PROJECT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='In Progress')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')

    def __str__(self):
        return self.title


# -----------------------
# TASK
# -----------------------
class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    due_date = models.DateTimeField(null=True, blank=True)

    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')

    def __str__(self):
        return self.title


# -----------------------
# TEAM MEMBER
# -----------------------
class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Project Admin'),
        ('Member', 'Project Member'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='team_members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_projects')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Member')

    def __str__(self):
        return f"{self.user.username} - {self.role} ({self.project.title})"


# -----------------------
# EXPENSE
# -----------------------
class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Transportation', 'Transportation'),
        ('Materials', 'Materials'),
        ('Equipment', 'Equipment'),
        ('Other', 'Other'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.amount}"


# -----------------------
# PROGRESS
# -----------------------
class Progress(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='progress_updates')
    update_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Progress Update for {self.project.title} at {self.created_at}'


# -----------------------
# PROJECT INVITATION
# -----------------------
class ProjectInvitation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='invitations')
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_invitations')
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f'Invitation to {self.invited_user.username} for {self.project.title}'


# -----------------------
# NOTIFICATION
# -----------------------
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.user.username}'


# -----------------------
# ACTIVITY LOG
# -----------------------
class ActivityLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activity_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.action}'


class Milestone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.title} - {self.project.title}'

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=255)
    remind_at = models.DateTimeField()

    def __str__(self):
        return f'Reminder for {self.user.username}: {self.message}'


# -----------------------
# ATTACHMENTS
# -----------------------
class Attachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Attachment for {self.task.title}'


# -----------------------
# COMMENT
# -----------------------
class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.task.title}'
