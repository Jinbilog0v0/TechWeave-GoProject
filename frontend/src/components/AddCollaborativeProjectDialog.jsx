import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
    member_ids: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

const filteredUsers = users.filter((u) =>
  u.username.toLowerCase().includes(search.toLowerCase())
);

  useEffect(() => {
    if (open && !initialData) { 
      async function fetchUsers() {
        try {
          const res = await api.get("/api/users/");
          setUsers(res.data);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      }
      fetchUsers();
    } else if (!open) {
        setUsers([]);
    }
  }, [open, initialData]); 

useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
        priority: initialData.priority || "Medium",
        member_ids: [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        end_date: "",
        priority: "Medium",
        member_ids: [],
      });
    }
  }, [initialData, open]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMember = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.member_ids.includes(userId);
      if (isSelected) {
        return { ...prev, member_ids: prev.member_ids.filter((id) => id !== userId) };
      } else {
        return { ...prev, member_ids: [...prev.member_ids, userId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!initialData && formData.member_ids.length === 0) {
      alert("Please select at least one team member.");
      return;
    }
    
    setLoading(true);
    const dataToSend = initialData ? formData : { ...formData, project_type: "Collaborative" };
    onSubmit(dataToSend).finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <div className="flex items-center">
                <img
                  src="/Images/TemporaryLogo-removebg.png"
                  className="w-8 h-8 inline-block mb-2"
                  alt="Logo"
                />
              </div>
            {initialData ? "Edit Project" : "Create Team Project"}
            </DialogTitle>
          
          <DialogDescription>
            {initialData 
              ? "Update the project details below." 
              : "Collaborate with others by creating a shared project."}
          </DialogDescription>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Website Redesign"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief overview..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="grid gap-2">
                <Label htmlFor="end_date">Due Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {!initialData && (
              <div className="grid gap-2">
                <Label>Add Team Members</Label>
                <div className="border rounded-md p-3 h-40 overflow-y-auto space-y-2 bg-gray-50">
                      <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                  {users.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center mt-4">No other users found.</p>
                  ) : (
                    filteredUsers.map((user) => ( 
                      <div key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.member_ids.includes(user.id)}
                          onChange={() => toggleMember(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                          {user.username}{" "}
                          <span className="text-gray-400 font-normal">
                            ({user.email})
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-500 text-right">
                  Selected: {formData.member_ids.length}
                </p>
              </div>
            )}
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
            <Button
              type="submit"
              className="bg-green-700 text-white hover:bg-green-800"
              disabled={loading}
            >
              {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCollaborativeProjectDialog;