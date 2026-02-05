import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, CircularProgress } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12">
            {/* Header Section */}
            <header className="max-w-7xl mx-auto flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <IconButton 
                        onClick={() => routeTo("/home")}
                        className="bg-white/10 hover:bg-white/20 text-white transition-all"
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <h1 className="text-3xl font-bold tracking-tight">Meeting History</h1>
                </div>
                <div className="text-gray-400 text-sm">
                    {meetings.length} total sessions
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <CircularProgress sx={{ color: '#3b82f6' }} />
                    </div>
                ) : meetings.length !== 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meetings.map((e, i) => (
                            <div 
                                key={i} 
                                className="group relative bg-[#0a0d3d]/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 shadow-xl"
                            >
                                {/* Decorative Glow */}
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <span className="material-symbols-outlined text-blue-400">
                                                videocam
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                                            Completed
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter mb-1">Meeting Code</p>
                                        <p className="text-xl font-mono text-blue-100">{e.meetingCode}</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            <span className="text-sm">{formatDate(e.date)}</span>
                                        </div>
                                        <button 
                                            onClick={() => routeTo(`/${e.meetingCode}`)}
                                            className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase"
                                        >
                                            Rejoin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-gray-500 italic">No meeting history found.</p>
                        <button 
                            onClick={() => routeTo("/home")}
                            className="mt-4 text-blue-500 hover:underline"
                        >
                            Start your first meeting
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}