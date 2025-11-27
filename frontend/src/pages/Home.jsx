import React, { useState, useEffect } from "react";
import { 
    Bell, PhilippinePeso, Users, Briefcase, CalendarDays, 
    Eye, ArrowRight 
} from "lucide-react";
import api from "../api";
import ActivityFeed from "../components/ActivityFeed"; 
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import { useNavigate, useOutletContext } from "react-router-dom"; 

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 


const Home = () => {
    const { user, setUser } = useOutletContext(); 
    const navigate = useNavigate();

    const [personalProjects, setPersonalProjects] = useState([]);
    const [collabProjects, setCollabProjects] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    const [profileData, setProfileData] = useState({
        displayName: "",
        email: "",
        role: "Student", 
        course: "",
        bio: "",
        profilePictureUrl: null, 
    });

    useEffect(() => {
        if (user) { 
            setProfileData(prev => ({
                ...prev,
                displayName: user.username,
                email: user.email,
                role: user.profile?.role || "Student",
                course: user.profile?.course || "",
                bio: user.profile?.bio || "",
                profilePictureUrl: user.profile?.profile_picture || null,
            }));
        } else { 
            const fetchUser = async () => {
                try {
                    const res = await api.get("/api/user/");
                    setProfileData(prev => ({
                        ...prev,
                        displayName: res.data.username,
                        email: res.data.email,
                        role: res.data.profile?.role || "Student",
                        course: res.data.profile?.course || "",
                        bio: res.data.profile?.bio || "",
                        profilePictureUrl: res.data.profile?.profile_picture || null,
                    }));
                    if (setUser) setUser(res.data); 
                } catch (err) {
                    console.error("Failed to load user in Home:", err);
                }
            };
            fetchUser();
        }
    }, [user, setUser]); 


    const fetchData = async () => {
        try {
            const personalRes = await api.get("/api/projects/?type=Personal");
            setPersonalProjects(personalRes.data);

            const collabRes = await api.get("/api/projects/?type=Collaborative");
            setCollabProjects(collabRes.data);

            const activityRes = await api.get("/api/activity-logs/");
            setRecentActivity(activityRes.data);

            const expRes = await api.get("/api/expenses/");
            setExpenses(expRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const upcomingTasks = [...personalProjects, ...collabProjects].filter(p => {
        if (!p.end_date) return false;
        const due = new Date(p.end_date);
        const now = new Date();
        const diff = (due - now) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
    });

    const allDeadlines = [...personalProjects, ...collabProjects]
        .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));

    const totalPersonal = personalProjects.length;
    const totalCollaborative = collabProjects.length;
    const totalExpenses = Array.isArray(expenses) 
        ? expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0) 
        : 0;

    return (
        <div className="w-full space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-5 fade-in duration-700">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h2>
                    <p className="text-gray-600 mt-1">Welcome back, {profileData.displayName || "User"}</p>
                </div>
                
                <div className="hidden sm:block text-right text-sm text-gray-500">
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6 animate-in fade-in duration-700 delay-200 fill-mode-backwards">
                <Avatar className="w-28 h-28 border-4 border-green-100 shadow-sm">
                    <AvatarImage src={profileData.profilePictureUrl || "https://github.com/shadcn.png"} alt={`${profileData.displayName}'s profile`} />
                    <AvatarFallback className="text-3xl bg-green-200 text-green-800 font-semibold">
                        {profileData.displayName ? profileData.displayName.substring(0,2).toUpperCase() : "UN"}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900">{profileData.displayName}</h3>
                    <p className="text-gray-600 text-lg">{profileData.email}</p>
                    <p className="text-green-700 font-medium">{profileData.role}{profileData.course ? ` - ${profileData.course}` : ''}</p>
                    <p className="text-gray-700 mt-2 text-sm max-w-prose">{profileData.bio || "No bio provided."}</p>
                    
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/profile')} 
                        className="mt-4 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Go to Profile Page 
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[ 
                    { icon: Briefcase, label: "Personal Projects", value: totalPersonal, color: "bg-green-600", delay: "delay-100" },
                    { icon: Users, label: "Collaborative Projects", value: totalCollaborative, color: "bg-blue-600", delay: "delay-200" },
                    { icon: PhilippinePeso, label: "Total Expenses", value: `₱${totalExpenses}`, color: "bg-purple-600", delay: "delay-300" },
                    { icon: CalendarDays, label: "Upcoming Tasks", value: upcomingTasks.length, color: "bg-orange-600", delay: "delay-500" },
                ].map((stat, idx) => (
                    <div 
                        key={idx} 
                        className={`${stat.color} ${stat.delay} text-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in fill-mode-backwards`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                            </div>
                            <stat.icon size={40} className="opacity-80" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-700 fill-mode-backwards">
                
                <div className="lg:col-span-1 h-full">
                    <UpcomingDeadlines items={allDeadlines} />
                </div>

                <div className="lg:col-span-2 h-full">
                    <ActivityFeed logs={recentActivity} />
                </div>

            </div>
        </div>
    );
};

export default Home;