import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Optional: if you have avatars
  
  export function ProjectMembersDialog({ open, onOpenChange, members = [], loading }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              Team Members
            </DialogTitle>
            <DialogDescription>
              People working on this project.
            </DialogDescription>
          </DialogHeader>
  
          <div className="py-4">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No members assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                        {/* Initials Avatar */}
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                            {member.user?.username?.substring(0, 2).toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{member.user?.username || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{member.role || "Member"}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default ProjectMembersDialog;