import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import EmptyProjects from "../components/EmptyProjects";
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react";
import AddCollaborativeProjectDialog from "../components/AddCollaborativeProjectDialog";
import ProjectMembersDialog from "../components/ProjectMemberDialog";
import api from "../api";

const CollaborativeWorkspace = () => {
  const [projects, setProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}/`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };

  const handleProjectSubmit = async (formData) => {
    try {
      await api.post("/api/projects/", formData);
      setShowDialog(false);
      fetchData();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }
  };

  return (
    <div className="p-8">
      {showAlert && (
        <Alert
          className="fixed w-200 top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto"
        >
          <CheckCircle2Icon className="text-green-700 w-6 h-6 shrink-0" />
          <AlertTitle className="text-green-800 font-medium">
            New project successfully added!
          </AlertTitle>
        </Alert>
      )}

      {/* The Members Dialog */}
       <ProjectMembersDialog 
          open={showMembersDialog} 
          onOpenChange={setShowMembersDialog}
          members={selectedMembers}
          loading={membersLoading}
       />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Collaborative Workspace</h2>
        {/* Add Collaborative Project Dialog with Trigger Button */}
        <AddCollaborativeProjectDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onSubmit={handleProjectSubmit}
          triggerText="New Team Project"
        />
      </div>

      {/* Projects List */}
      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <EmptyProjects
          title="No Team Projects Yet"
          description="Create your first collaborative project to get started"
          onCreate={() => setShowDialog(true)}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              collaborative
              onViewMembers={() => handleViewMembers(project.id)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborativeWorkspace;