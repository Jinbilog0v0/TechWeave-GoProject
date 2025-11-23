import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Save, Loader2, User as UserIcon, Mail, BookOpen, Briefcase } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom'

const ProfilePage = () => {
	const API_URL = import.meta.env.VITE_API_URL
	const context = useOutletContext();
	const contextUser = context?.user;
	const setContextUser = context?.setUser;

	const navigate = useNavigate();
	const [localUser, setLocalUser] = useState(null); // Local user state for ProfilePage form
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [previewImage, setPreviewImage] = useState(null); // URL for local image preview
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		role: 'Student',
		course: '',
		bio: '',
	});

	// Helper to populate form data and set preview from a user object
	// Helper to populate form data and set preview from a user object
	const populateForm = (userData) => {
		setFormData({
			username: userData.username || '',
			email: userData.email || '',
			role: userData.profile?.role || 'Student',
			course: userData.profile?.course || '',
			bio: userData.profile?.bio || '',
		});

		// Check inside the nested 'profile' object
		if (userData.profile?.profile_picture) {
			setPreviewImage(userData.profile.profile_picture);
			console.log(userData.profile.profile_picture)
		} else {
			setPreviewImage(null);
		}
	};

	// Effect to load user data on component mount or contextUser change
	useEffect(() => {
		const loadData = async () => {
			if (contextUser) {
				setLocalUser(contextUser);
				populateForm(contextUser);
				setInitialLoading(false);
			} else {
				try {
					const res = await api.get("/api/users/me/");
					setLocalUser(res.data);
					populateForm(res.data);
					if (setContextUser) setContextUser(res.data); // Sync back to layout if fetched here
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
	}, [contextUser, setContextUser, navigate]); // Depend on contextUser, setContextUser, and navigate

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
			setPreviewImage(URL.createObjectURL(file)); // Local URL for immediate preview
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
			// Add logic to explicitly clear picture if desired
			// else if (previewImage === null && localUser?.profile?.profile_picture) {
			//   data.append('clear_profile_picture', 'true'); // Requires backend support
			// }


			const res = await api.put('/api/users/update/', data, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});

			const updatedUser = res.data;
			console.log(updatedUser)
			
			// Force a new object to ensure React detects state change
			const newUserForLayout = { ...updatedUser };

			setLocalUser(newUserForLayout); // Update local state for ProfilePage
			populateForm(newUserForLayout); // Update form fields and preview image

			// *** CRITICAL FIX: Update Layout's user state with the new object ***
			if (setContextUser) {
				setContextUser(newUserForLayout); 
			}
			// *** END CRITICAL FIX ***
			
			alert("Profile updated successfully!");

		} catch (error) {
			console.error("Update failed", error.response?.data || error.message);
			const msg = error.response?.data?.errors 
				? Object.values(error.response.data.errors).flat().join(", ")
				: "Failed to update profile.";
			alert(msg);
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

	if (!localUser && !contextUser) {
			return <div className="p-8 text-center text-red-500">Could not load user profile. Please log in again.</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
				<p className="text-gray-500">Manage your account settings.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Left Column: Avatar */}
				<div className="md:col-span-1 space-y-6 border bg-green-700 rounded-t-2xl">
					<div className="bg-white p-6 rounded-xl shadow-sm border-black flex flex-col items-center text-center">
						<div className="relative group cursor-pointer" onClick={handleImageClick}>
							<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 bg-gray-200 flex items-center justify-center">
								{previewImage ? (
									<img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
								) : (
									<span className="text-4xl font-bold text-gray-400">
										{getInitials(formData.username)}
									</span>
								)}
							</div>
							<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Camera className="text-white w-8 h-8" />
							</div>
						</div>
						
						<input 
							type="file" 
							ref={fileInputRef} 
							className="hidden" 
							accept="image/*"
							onChange={handleFileChange}
						/>
						
						<div className="mt-4">
							<h2 className="text-xl font-semibold text-gray-900">{formData.username || "User"}</h2>
							<p className="text-sm text-green-700 font-medium">{formData.role}</p>
						</div>
					</div>
				</div>

				{/* Right Column: Form */}
				<div className="md:col-span-2">
					<form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
						
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Info</h3>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
										<Input 
											id="email" 
											name="email" 
											value={formData.email} 
											onChange={handleChange} 
											className="pl-10"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-2">Academic Details</h3>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<div className="relative">
										<Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
										<select 
											id="role" 
											name="role" 
											value={formData.role} 
											onChange={handleChange}
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background"
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
									className="min-h-[100px]" 
									value={formData.bio} 
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="flex justify-end pt-4">
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