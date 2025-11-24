import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Camera, 
    Save, 
    Loader2, 
    User as UserIcon, 
    Mail, 
    BookOpen, 
    Briefcase, 
    Eye, 
    ArrowRight 
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const context = useOutletContext();
    const contextUser = context?.user;
    const setContextUser = context?.setUser;

    const navigate = useNavigate();
    const [localUser, setLocalUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'Student',
        course: '',
        bio: '',
    });

    const populateForm = (userData) => {
        setFormData({
            username: userData.username || '',
            email: userData.email || '',
            role: userData.profile?.role || 'Student',
            course: userData.profile?.course || '',
            bio: userData.profile?.bio || '',
        });

        if (userData.profile?.profile_picture) {
            setPreviewImage(userData.profile.profile_picture);
        } else {
            setPreviewImage(null);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (contextUser) {
                setLocalUser(contextUser);
                populateForm(contextUser);
                setInitialLoading(false);
            } else {
                try {
                    const res = await api.get("/api/user/"); 
                    setLocalUser(res.data);
                    populateForm(res.data);
                    if (setContextUser) setContextUser(res.data);
                } catch (error) {
                    console.error("Failed to load profile:", error);
                    if (error.response && error.response.status === 401) {
                         navigate('/'); 
                    }
                } finally {
                    setInitialLoading(false);
                }
            }
        };

        loadData();
    }, [contextUser, setContextUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('role', formData.role);
            data.append('course', formData.course);
            data.append('bio', formData.bio);

            if (fileInputRef.current.files[0]) {
                data.append('profile_picture', fileInputRef.current.files[0]);
            } 
            const res = await api.put('/api/user/update/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = res.data;
            
            setLocalUser(updatedUser); 
            populateForm(updatedUser); 

            if (setContextUser) {
                setContextUser(updatedUser); 
            }
            
            alert("Profile updated successfully!");
            navigate('/home');

        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.substring(0, 2).toUpperCase();
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                Loading profile...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-1">Update your personal details and public profile.</p>
                </div>
                
                {/* Optional: Redirect to Public Profile View if you implement it later */}
                {/* <Button 
                    variant="outline" 
                    onClick={() => navigate('/profile/view')} 
                    className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50"
                >
                    <Eye className="w-4 h-4" />
                    View Public Profile
                    <ArrowRight className="w-4 h-4 ml-1" />
                </Button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Avatar */}
                <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer" onClick={handleImageClick}>
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold text-gray-400">
                                        {getInitials(formData.username)}
                                    </span>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white w-10 h-10" />
                            </div>
                        </div>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        
                        <div className="mt-4 space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">{formData.username || "User"}</h2>
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                                {formData.role}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">{formData.email}</p>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-green-700" /> 
                                Basic Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            id="username" 
                                            name="username" 
                                            value={formData.username} 
                                            onChange={handleChange} 
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            id="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className="pl-10"
                                            // Removed 'readOnly' if it was there to make it editable
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-green-700" /> 
                                Academic Profile
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <select 
                                            id="role" 
                                            name="role" 
                                            value={formData.role} 
                                            onChange={handleChange}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="course">Course / Department</Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input 
                                            id="course" 
                                            name="course" 
                                            placeholder="e.g. BSIT" 
                                            value={formData.course} 
                                            onChange={handleChange} 
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea 
                                    id="bio" 
                                    name="bio" 
                                    placeholder="Tell us about yourself..." 
                                    className="min-h-[120px] resize-none" 
                                    value={formData.bio} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white min-w-[140px]" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;