import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import EmptyProjects from "../components/EmptyProjects";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"
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
import { CheckCircle2Icon, AlertCircle } from "lucide-react";
import AddCollaborativeProjectDialog from "../components/AddCollaborativeProjectDialog";
import ProjectMemberDialog from "../components/ProjectMemberDialog";
import api from "../api";
import { Button } from "@/components/ui/button"; 

const CollaborativeWorkspace = () => {
  const [projects, setProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleViewMembers = async (projectId) => {
    setShowMembersDialog(true);
    setMembersLoading(true);
    setSelectedMembers([]);

    try {
      const res = await api.get(`/api/team-members/?project=${projectId}`);
      setSelectedMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setSelectedMembers([]); 
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects/?type=Collaborative");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialog = (project = null) => {
    setEditingProject(project);
    setShowDialog(true);
  };

  const initiateDelete = (id) => {
    setProjectToDelete(id);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await api.delete(`/api/projects/${projectToDelete}/`);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      
      setSuccessMessage("Deleted a project"); 
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 4000);
    } catch (err) {
      console.error("Failed to delete project", err);
      let msg = "Failed to delete project.";
      if (err.response && err.response.data && err.response.data.detail) {
          msg = err.response.data.detail;
      } else if (err.response && err.response.statusText) {
          msg = `Failed to delete project: ${err.response.statusText}`;
      }
      setErrorMessage(msg);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    } finally {
        setProjectToDelete(null); 
    }
  };

  const handleProjectSubmit = async (formData) => {
    try {
      let msg = "";
      if (editingProject) {
        await api.put(`/api/projects/${editingProject.id}/`, formData);
        msg = "Project updated successfully!";
      } else {
        await api.post("/api/projects/", { ...formData, project_type: "Collaborative" });
        msg = "New project successfully added!";
      }
      
      setShowDialog(false);
      setEditingProject(null); 
      fetchData();
      
      setSuccessMessage(msg); 
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 4000);
      setShowErrorAlert(false);
    } catch (err) {
      console.error("Failed to save project:", err);
      let msg = "Failed to save project: An unexpected error occurred.";

      if (err.response) {
        if (err.response.status === 403) {
            msg = "You are not authorized to perform this action. Please log in again.";
        } else if (err.response.data && typeof err.response.data === 'object') {
             const details = Object.entries(err.response.data)
                .map(([key, val]) => {
                    const errorDetail = Array.isArray(val) ? val.join(", ") : val;
                    return `${key}: ${errorDetail}`;
                })
                .join("; ");
             msg = `Validation failed: ${details || "Please check your input."}`;
        } else if (err.response.data) {
            msg = `Failed to save project: ${err.response.data}`;
        } else if (err.response.statusText) {
            msg = `Failed to save project: ${err.response.statusText}`;
        }
      } else if (err.request) {
          msg = "Failed to save project: No response from server. Please check your internet connection or server status.";
      }
      
      setErrorMessage(msg);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 8000);
      setShowSuccessAlert(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert
          className="fixed w-[90%] md:w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto"
        >
          <CheckCircle2Icon className="text-green-700 w-6 h-6 shrink-0" />
          <AlertTitle className="text-green-800 font-medium text-sm md:text-base">
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <Alert
          className="fixed w-[90%] md:w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-red-100 border border-red-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto"
        >
          <AlertCircle className="text-red-700 w-6 h-6 shrink-0" />
          <div className="flex flex-col">
            <AlertTitle className="text-red-800 font-medium text-sm md:text-base">
              Error!
            </AlertTitle>
            <AlertDescription className="text-red-700 text-xs md:text-sm">
              {errorMessage}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Confirm Delete Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent className="w-[90%] rounded-lg md:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
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

       <ProjectMemberDialog 
          open={showMembersDialog} 
          onOpenChange={setShowMembersDialog}
          members={selectedMembers}
          loading={membersLoading}
       />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Collaborative Workspace</h2>
        
        <AddCollaborativeProjectDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onSubmit={handleProjectSubmit}
          initialData={editingProject} 
        />
        
        <Button 
            onClick={() => openDialog(null)}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
            New Team Project
        </Button>
      </div>

      {loading ? (
          <div>
            <p className="text-center text-gray-500">Loading projects...</p>
          </div>
      ) : projects.length === 0 ? (
        <EmptyProjects
          title="No Team Projects Yet"
          description="Create your first collaborative project to get started"
          onCreate={() => openDialog(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              collaborative
              onViewMembers={() => handleViewMembers(project.id)}
              onEdit={() => openDialog(project)} 
              onDelete={() => initiateDelete(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborativeWorkspace;