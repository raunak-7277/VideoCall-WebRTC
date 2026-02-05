import React, { useContext, useState } from 'react'
import withAuth from '../utils/WithAuth' 
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { IconButton, TextField, Button } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'

const Home = () => {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    // Destructure logic from context as per original code
    const { addToUserHistory } = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        if (meetingCode.trim() !== "") {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } else {
            alert("Please enter a meeting code");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* HEADER / NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-white/10 [var(--primary)]/10 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    
                    {/* LEFT - Brand */}
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <span className="material-symbols-outlined text-3xl text-[var(--primary)]">
                            video_camera_front
                        </span>
                        <span>Video Call</span>
                    </div>

                    {/* RIGHT - Navigation & Actions */}
                    <nav className="flex items-center gap-4 md:gap-8 text-sm">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors" 
                             onClick={() => navigate("/history")}>
                            <RestoreIcon fontSize="small" />
                            <p className="hidden md:block">History</p>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            {/* MAIN CONTENT / HERO SECTION */}
            <main className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pt-20">
                
                {/* LEFT PANEL */}
                <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        Providing Quality Video Call Just Like <span className="text-[var(--primary)]">Quality Education</span>
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <TextField 
                            onChange={e => setMeetingCode(e.target.value)} 
                            id="outlined-basic" 
                            label="Meeting Code" 
                            variant="outlined" 
                             
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    color: "white",
                                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                                },
                                "& .MuiInputLabel-root": { color: "gray" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
                                maxWidth: "300px"
                            }}
                        />
                        <Button 
                            onClick={handleJoinVideoCall} 
                            variant='contained'
                            size="large"
                            sx={{ height: '56px', borderRadius: '8px', px: 4, bgcolor: '#3b82f6', "&:hover": { bgcolor: '#2563eb' } }}
                        >
                            Join Now
                        </Button>
                    </div>
                </div>

                {/* RIGHT PANEL - Illustration */}
                <div className="flex justify-center items-center">
                    <img 
                        src='/logo3.png' 
                        alt="Hero" 
                        className="w-full max-w-lg object-contain animate-pulse-slow" 
                        style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
                    />
                </div>
            </main>
        </div>
    )
}

export default withAuth(Home);