import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useOutletContext, useNavigate } from "react-router-dom"; // Import useNavigate
import { Save, User, Bell, Shield, Palette, Globe, Eye, ArrowRight, AlertCircle} from "lucide-react"; // Add Eye and ArrowRight for the link

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Still useful for read-only display
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; 
import { Switch } from "@/components/ui/switch"; 
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; 
import { Separator } from "@/components/ui/separator"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog"; 

const Settings = () => {
    const { user, setUser } = useOutletContext(); 
    const navigate = useNavigate(); // Initialize navigate

    const [settings, setSettings] = useState({
        displayName: "",
        email: "",
        role: "Student", 
        course: "",
        bio: "",
        profilePictureUrl: null, 
        notifications: {
            email: true,
            push: true,
            projectUpdates: true,
            deadlines: true,
        },
        theme: "light",
        language: "en",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    // Effect to load user data into settings state on component mount
    useEffect(() => {
        if (user) { // Use context user if available
            setSettings(prev => ({
                ...prev,
                displayName: user.username,
                email: user.email,
                role: user.profile?.role || "Student",
                course: user.profile?.course || "",
                bio: user.profile?.bio || "",
                profilePictureUrl: user.profile?.profile_picture || null,
            }));
        } else { // Fallback to fetching if context user is not yet set (e.g., direct navigation)
            const fetchUser = async () => {
                try {
                    const res = await api.get("/api/users/me/");
                    setSettings(prev => ({
                        ...prev,
                        displayName: res.data.username,
                        email: res.data.email,
                        role: res.data.profile?.role || "Student",
                        course: res.data.profile?.course || "",
                        bio: res.data.profile?.bio || "",
                        profilePictureUrl: res.data.profile?.profile_picture || null,
                    }));
                    if (setUser) setUser(res.data); // Update context if fetched here
                } catch (err) {
                    console.error("Failed to load user", err);
                    setError("Failed to load user profile.");
                }
            };
            fetchUser();
        }
    }, [user, setUser]); // Depend on user and setUser

    // Handle saving general settings (notifications, theme, language)
    const handleSaveGeneralSettings = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // In a real app, you'd send these settings to a dedicated endpoint.
            // For now, we'll simulate a save or log them.
            console.log("Saving general settings:", {
                notifications: settings.notifications,
                theme: settings.theme,
                language: settings.language,
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            setSuccessMessage("Settings updated successfully!");
            setTimeout(() => setSuccessMessage(null), 5000); 

        } catch (err) {
            console.error("Failed to update settings:", err);
            setError("Failed to update settings. Please try again.");
            setTimeout(() => setError(null), 8000); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">
            {/* Alerts */}
            {successMessage && (
                <Alert className="fixed w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
                    <CheckCircle2 className="text-green-700 w-6 h-6 shrink-0" />
                    <AlertTitle className="text-green-800 font-medium">{successMessage}</AlertTitle>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive" className="fixed w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-red-100 border border-red-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
                    <AlertCircle className="text-red-700 w-6 h-6 shrink-0" />
                    <AlertTitle className="text-red-800 font-medium">Error!</AlertTitle>
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-600 mt-1">Manage your account and preferences</p>
                </div>
            </div>

            {/* Profile Overview and Link to ProfilePage */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-28 h-28 border-4 border-green-100 shadow-sm">
                    <AvatarImage src={settings.profilePictureUrl || "https://github.com/shadcn.png"} alt={`${settings.displayName}'s profile`} />
                    <AvatarFallback className="text-3xl bg-green-200 text-green-800 font-semibold">
                        {settings.displayName ? settings.displayName.substring(0,2).toUpperCase() : "UN"}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">{settings.displayName}</h3>
                    <p className="text-gray-600 text-lg">{settings.email}</p>
                    <p className="text-green-700 font-medium">{settings.role}{settings.course ? ` - ${settings.course}` : ''}</p>
                    <p className="text-gray-700 mt-2 text-sm max-w-prose">{settings.bio || "No bio provided."}</p>
                    
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/profile')} // Navigate to the ProfilePage
                        className="mt-4 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Go to Profile Page 
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>


            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Bell className="text-green-700" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Notification Preferences</h3>
                </div>
                <Separator className="mb-6" />
                <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b last:border-b-0">
                            <Label htmlFor={`notification-${key}`} className="text-gray-700 font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                            </Label>
                            <Switch
                                id={`notification-${key}`}
                                checked={value}
                                onCheckedChange={(checked) =>
                                    setSettings({
                                        ...settings,
                                        notifications: {
                                            ...settings.notifications,
                                            [key]: checked,
                                        },
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Appearance */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Palette className="text-green-700" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Appearance</h3>
                    </div>
                    <Separator className="mb-6" />
                    <div>
                        <Label htmlFor="theme" className="block text-sm font-semibold text-gray-700 mb-2">
                            Theme
                        </Label>
                        <Select 
                            value={settings.theme} 
                            onValueChange={(value) => setSettings({ ...settings, theme: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="auto">Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Language */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Globe className="text-green-700" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Language</h3>
                    </div>
                    <Separator className="mb-6" />
                    <div>
                        <Label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                            Preferred Language
                        </Label>
                        <Select 
                            value={settings.language} 
                            onValueChange={(value) => setSettings({ ...settings, language: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="tl">Tagalog</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Shield className="text-green-700" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Security</h3>
                </div>
                <Separator className="mb-6" />
                <div>
                    <p className="text-sm text-gray-600 mb-4">
                        Update your password to keep your account secure.
                    </p>
                    <Button 
                        onClick={() => setShowChangePasswordDialog(true)}
                        className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                        Change Password
                    </Button>
                </div>
            </div>

            {/* Save Button for General Settings */}
            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSaveGeneralSettings}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg font-semibold ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Save General Settings</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Change Password Dialog */}
            {showChangePasswordDialog && (
                <ChangePasswordDialog 
                    open={showChangePasswordDialog} 
                    onOpenChange={setShowChangePasswordDialog} 
                />
            )}
        </div>
    );
};

export default Settings;