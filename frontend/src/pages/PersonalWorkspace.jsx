import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import AddProjectDialog from "../components/AddProjectDialog";
import EmptyProjects from "../components/EmptyProjects";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react";
import api from "../api"; 

const PersonalWorkspace = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchData = async () => {
    try {
      const personalRes = await api.get("/api/projects/?type=Personal");
      setProjects(personalRes.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialog = (project = null) => {
    setEditingProject(project);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}/`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };

  const handleProjectSubmit = async (formData) => {
    try {
      if (editingProject) {

        await api.put(`/api/projects/${editingProject.id}/`, formData);
      } else {

        await api.post("/api/projects/", formData);
      }
      
      setShowDialog(false);
      

      fetchData(); 
      
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  return (
    <div className="p-8">
      {showAlert && (
        <Alert className="fixed w-200 top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
          <CheckCircle2Icon className="text-green-700 w-6 h-6 shrink-0" />
          <AlertTitle className="text-green-800 font-medium">
            {editingProject ? "Project updated successfully!" : "New project successfully added!"}
          </AlertTitle>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Personal Workspace</h2>
        <Button 
          onClick={() => openDialog()}
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

      {projects.length === 0 ? (
        <EmptyProjects onCreate={() => openDialog()} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project} 
              onEdit={() => openDialog(project)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalWorkspace;