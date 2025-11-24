import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "../api";

export function AddTaskDialog({ open, onOpenChange, projectId, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending task data:", { title, project: projectId, status: "To Do", priority });

      const res = await api.post("/api/tasks/", {
        title: title,
        project: projectId,
        status: "Pending", // Check this against backend accepted values
        priority: priority
      });

      onTaskAdded(res.data);
      setTitle("");
      setPriority("Medium");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add task:", error);
      // *** IMPORTANT DEBUGGING STEP ***
      if (error.response && error.response.data) {
        console.error("Backend Error Details:", error.response.data);
        // Attempt to parse and display a user-friendly error
        let errorMessage = "Failed to add task. Please check your inputs.";
        if (typeof error.response.data === 'object') {
            const messages = Object.values(error.response.data).flat();
            errorMessage = messages.join(' ');
        } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        }
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">

          {error && ( // Display error message if present
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm" role="alert">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Name</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Draft Documentation"
              required
              aria-invalid={!!error} // Indicate invalid state for accessibility
              aria-describedby={error ? "task-title-error" : undefined}
            />
            {error && ( // Optional: specific error message for title field
              <p id="task-title-error" className="text-red-600 text-sm mt-1">{error.title?.[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-700 text-white">
              {loading ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}