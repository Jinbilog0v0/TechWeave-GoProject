import React, { useState, useEffect } from "react";
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

export function AddTaskDialog({ open, onOpenChange, projectId, onTaskSaved, taskToEdit = null }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                setTitle(taskToEdit.title);
                setPriority(taskToEdit.priority || "Medium");
                setDueDate(taskToEdit.due_date || "");
            } else {
                setTitle("");
                setPriority("Medium");
                setDueDate(new Date().toISOString().split("T")[0]);
            }
            setError(null);
        }
    }, [open, taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!title.trim()) {
            setError("Task title cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            let res;
            if (taskToEdit) {
                res = await api.patch(`/api/tasks/${taskToEdit.id}/`, {
                    title,
                    priority,
                    due_date: dueDate || null,
                });
            } else {
                res = await api.post("/api/tasks/", {
                    title,
                    project: projectId,
                    status: "Pending", 
                    priority,
                    due_date: dueDate || null,
                });
            }

            onTaskSaved(res.data, !!taskToEdit); 
            onOpenChange(false);

        } catch (error) {
            console.error("Operation failed:", error);
            if (error.response && error.response.data) {
                let errorMessage = "Operation failed.";
                if (typeof error.response.data === 'object') {
                    errorMessage = Object.values(error.response.data).flat().join(' ');
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
                setError(errorMessage);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isEditMode = !!taskToEdit;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode 
                            ? "Make changes to the task details below." 
                            : "Create a new task for this project."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
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
                        />
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

                    <div className="grid gap-2">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input
                            id="due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className={`${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'} text-white`}>
                            {loading ? "Saving..." : isEditMode ? "Update Task" : "Add Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}