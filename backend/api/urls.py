from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    TaskViewSet,
    TeamMemberViewSet,
    CommentViewSet,
    ActivityLogViewSet,
    NotificationViewSet,
    ExpenseViewSet,
    AttachmentListView, 
    CreateUserView, GetUserView, GoogleAuth, UpdateUserView, UserListView
)

router = DefaultRouter()

# Added 'basename' to ALL of them to fix the error
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'team-members', TeamMemberViewSet, basename='teammember')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'activity-logs', ActivityLogViewSet, basename='activitylog')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/me/', GetUserView.as_view(), name='get_user'),
    path('users/update/', UpdateUserView.as_view(), name='user_update'),
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('google-auth/', GoogleAuth.as_view(), name='google_auth'),
    
    path('attachments/', AttachmentListView.as_view(), name='attachment_list'),

    path('', include(router.urls)),
]