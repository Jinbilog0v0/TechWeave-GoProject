import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../api";

export function AddCollaborativeProjectDialog({
  triggerText = "New Team Project",
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    end_date: "",
    priority: "Medium",
    members: [], // Array of IDs
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  // Fetch users for the selection list
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/api/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, []);

  // Handle Edit vs Create Mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "Medium",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
        // Map existing team members to IDs if editing
        members: initialData.members?.map((m) => m.id) || [],
      });
    } else {
      setFormData({ 
        title: "", 
        description: "", 
        end_date: "", 
        priority: "Medium", 
        members: [] 
      });
    }
  }, [initialData, open]);

  // Focus title on open
  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle user selection (Checkbox logic)
  const toggleMember = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.members.includes(userId);
      if (isSelected) {
        return { ...prev, members: prev.members.filter((id) => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Project title is required");

    if (onSubmit) {
      try {
        setLoading(true);
        // We explicitly set project_type to Collaborative
        await onSubmit({ ...formData, project_type: "Collaborative" });
        
        if(!initialData) {
            setFormData({ title: "", description: "", end_date: "", priority: "Medium", members: [] });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to save project");
      } finally {
        setLoading(false);
      }
    }
  };

  // Reusable Input Style
  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerText && <DialogTrigger asChild><Button className="bg-green-700 text-white">{triggerText}</Button></DialogTrigger>}

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleFormSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
               {initialData ? "Edit Team Project" : "New Collaborative Project"}
            </DialogTitle>
            <DialogDescription className="mt-1 mb-4 text-gray-600">
              Create a shared workspace and invite members.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Capstone Final"
                value={formData.title}
                onChange={handleChange}
                ref={titleRef}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief goal of the project"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Priority & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="end_date">Deadline</Label>
                    <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Team Member Selection (Checkbox List) */}
            <div className="grid gap-2">
              <Label className="mb-1">Invite Team Members</Label>
              <div className="border rounded-md p-3 h-40 overflow-y-auto bg-gray-50 grid gap-2">
                {users.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No other users found.</p>
                ) : (
                    users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 bg-white p-2 rounded border">
                        <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={formData.members.includes(user.id)}
                            onChange={() => toggleMember(user.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label 
                            htmlFor={`user-${user.id}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                            {user.username} <span className="text-gray-400 font-normal">({user.email})</span>
                        </label>
                    </div>
                    ))
                )}
              </div>
              <p className="text-xs text-gray-500 text-right">Selected: {formData.members.length}</p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCollaborativeProjectDialog;