from django.contrib import admin
from .models import (
    Project, Task, TeamMember, Comment, 
    Attachment, ActivityLog, Notification, 
    Expense, Profile
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'project_type', 'status', 'priority', 'end_date')
    list_filter = ('status', 'priority', 'project_type')
    search_fields = ('title', 'owner__username')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'status', 'priority', 'due_date')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'project__title', 'assigned_to__username')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'role', 'joined_at')
    list_filter = ('role',)
    search_fields = ('user__username', 'project__title')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'category', 'project', 'date')
    list_filter = ('category',)
    search_fields = ('description', 'project__title')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'project', 'timestamp')
    list_filter = ('timestamp',)
    readonly_fields = ('timestamp',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'course')

admin.site.register(Comment)
admin.site.register(Attachment)
admin.site.register(Notification)