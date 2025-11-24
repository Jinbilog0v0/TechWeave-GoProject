from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CreateUserView, UserListView, GetUserView, UpdateUserView, GoogleAuth,
    ProjectViewSet, TaskViewSet, TeamMemberViewSet, ExpenseViewSet,
    CommentViewSet, NotificationViewSet, ActivityLogViewSet,
    AttachmentListView, DashboardStatsView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'team-members', TeamMemberViewSet, basename='team-member')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('google-auth/', GoogleAuth.as_view(), name='google_auth'),
    

    path('users/', UserListView.as_view(), name='user-list'),
    path('user/', GetUserView.as_view(), name='get-user'), 
    path('user/update/', UpdateUserView.as_view(), name='update-user'), 

    path('attachments/', AttachmentListView.as_view(), name='attachment-list-create'),

    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]