import React, { useState, useEffect, useCallback } from "react";
import ProjectCard from "../components/ProjectCard";
import AddProjectDialog from "../components/AddProjectDialog";
import EmptyProjects from "../components/EmptyProjects";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2Icon } from "lucide-react";
import api from "../api";
import { useOutletContext } from "react-router-dom";

const PersonalWorkspace = () => {
  const { user } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [alertMessage, setAlertMessage] = useState(""); 
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      if (!user) {
        console.log("User not loaded yet, skipping project fetch.");
        return;
      }
      const personalRes = await api.get("/api/projects/?type=Personal");
      setProjects(personalRes.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load personal projects. Please try again.");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDialog = (project = null) => {
    setEditingProject(project);
    setShowDialog(true);
  };

  // 1. Triggered when clicking the delete icon on the card
  const initiateDelete = (id) => {
    setProjectToDelete(id); // This opens the confirmation dialog
  };

  // 2. Triggered when clicking "Continue" on the dialog
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setError(null);
    try {
      await api.delete(`/api/projects/${projectToDelete}/`);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      
      // Set specific success message
      setAlertMessage("Deleted a project"); 
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (err) {
      console.error("Failed to delete project", err);
      setError("Failed to delete project. Please try again.");
    } finally {
      setProjectToDelete(null); // Close the dialog
    }
  };

  const handleProjectSubmit = async (formData) => {
    setError(null);
    try {
      if (editingProject) {
        await api.put(`/api/projects/${editingProject.id}/`, formData);
        setAlertMessage("Project updated successfully!");
      } else {
        await api.post("/api/projects/", { ...formData, project_type: "Personal" });
        setAlertMessage("New project successfully added!");
      }
      setShowDialog(false);
      setEditingProject(null);
      fetchData();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (err) {
      console.error("Failed to save project:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Failed to save project.";
      setError(errorMessage);
    }
  };

  return (
    <div className="p-8">
      {/* Success Alert */}
      {showAlert && (
        <Alert className="fixed w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
          <CheckCircle2Icon className="text-green-700 w-6 h-6 shrink-0" />
          <AlertTitle className="text-green-800 font-medium">
            {alertMessage}
          </AlertTitle>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="fixed w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-red-100 border border-red-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
          <AlertTitle className="text-red-800 font-medium">{error}</AlertTitle>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Personal Workspace</h2>
        <Button
          onClick={() => openDialog(null)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
        >
          New Project
        </Button>
      </div>

      <AddProjectDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleProjectSubmit}
        initialData={editingProject}
        projectType="Personal"
      />

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {projects.length === 0 && !error ? (
        <EmptyProjects onCreate={() => openDialog(null)} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => openDialog(project)}
              // Pass the initiation function, not the direct delete
              onDelete={() => initiateDelete(project.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalWorkspace;