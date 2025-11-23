from rest_framework import permissions

class IsProjectOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit/delete it.
    Works for Projects (checks .owner) and Tasks/Expenses (checks .project.owner).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'project'): 
            return obj.project.owner == request.user
            
        return False

class IsTeamMemberOrOwner(permissions.BasePermission):
    """
    Ensures the user is the owner OR a team member of the project.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        if hasattr(obj, 'owner') and obj.owner == user:
            return True
        if hasattr(obj, 'project') and obj.project.owner == user:
            return True
        

        project = obj if hasattr(obj, 'owner') else obj.project
        
        return project.team_members.filter(user=user).exists()