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

export function AddProjectDialog({
  title = "Add Personal Project",
  triggerText,
  onSubmit,
  initialData = null,
  projectType = "Personal",
  open,
  onOpenChange,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    end_date: "",
    status: "In Progress",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
        status: initialData.status || "In Progress",
        priority: initialData.priority || "Medium",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        end_date: "",
        status: "In Progress",
        priority: "Medium",
      });
    }
  }, [initialData, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Project title is required");

    if (onSubmit) {
      try {
        setLoading(true);

        // Fix: Convert empty date string to null to prevent backend errors
        const payload = { ...formData };
        if (!payload.end_date) payload.end_date = null;

        await onSubmit({ ...payload, project_type: projectType });
        
        // Optional: Clear form if not editing (Logic depends on your parent component behavior)
        if (!initialData) {
             setFormData({ 
                title: "", 
                description: "", 
                end_date: "", 
                status: "In Progress", 
                priority: "Medium" 
             });
        }

      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to save project.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Define standard shadcn/ui input styling for the select dropdown
  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerText && <DialogTrigger asChild>{triggerText}</DialogTrigger>}

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleFormSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle className={`text-green-700 flex items-center gap-2`}>
              <div className="flex items-center">
                <img
                  src="/Images/TemporaryLogo-removebg.png"
                  className="w-8 h-8 inline-block mb-2"
                  alt="Logo"
                />
              </div>
              <div>{initialData ? "Edit Project" : title}</div>
            </DialogTitle>
            <DialogDescription className="mt-1 mb-6 text-gray-600">
              Manage project details. Status will be set to <b>In Progress</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Project title"
                maxLength={100}
                ref={titleRef}
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Project description"
                maxLength={500}
              />
            </div>

            <div className="flex justify-center items-center gap-2">
              {/* Priority */}
              <div className="grid gap-3 w-full">
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

              {/* Due Date */}
              <div className="grid gap-3 w-full">
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
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
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
              className={`bg-green-700 text-white`}
              disabled={loading}
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProjectDialog;