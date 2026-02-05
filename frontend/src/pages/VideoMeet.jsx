import React, { useRef, useState, useEffect } from 'react';
import io from "socket.io-client";
import { TextField, Button, IconButton, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import servers from '../enviroment';
const server_url = servers.prod;

const theme = createTheme({
    palette: { mode: "light" },
});

// Using a global object for connections to prevent React re-render wipes
let connections = {};

const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const VideoMeet = () => {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef();
    const videoRef = useRef([]);

    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [screen, setScreen] = useState(false);
    
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);

    const [showChat, setShowChat] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState(0);

    /**
     * EFFECT: Re-attaches the local media stream to the video element whenever 
     * the user moves from the lobby to the meeting or toggles screen sharing.
     */
    useEffect(() => {
        if (!askForUsername && localVideoRef.current && window.localStream) {
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername, screen]);

    /**
     * EFFECT: Ensures that remote video streams are attached to their respective 
     * video elements in the DOM whenever the list of participants (videos state) changes.
     */
    useEffect(() => {
        videos.forEach(v => {
            const el = document.getElementById(v.socketId);
            if (el && v.stream && el.srcObject !== v.stream) {
                el.srcObject = v.stream;
            }
        });
    }, [videos]);

    /**
     * FUNCTION: Requests camera and microphone access from the user.
     * Stores the resulting stream globally and assigns it to the local video preview.
     */
    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            window.localStream = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (e) {
            console.error("Camera/Mic access denied:", e);
        }
    };

    /**
     * EFFECT: Automatically triggers the hardware permission request when the component loads.
     */
    useEffect(() => { getPermissions(); }, []);

    /**
     * FUNCTION: Handles incoming chat messages. 
     * Adds the message to the state and increments the unread notification badge 
     * if the message was sent by someone else.
     */
    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prev) => [...prev, { sender, data }]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prev) => prev + 1);
        }
    };

    /**
     * FUNCTION: Sends the current text message to the server via Socket.io 
     * and clears the input field.
     */
    const sendMessage = () => {
        if (message.trim()) {
            socketRef.current.emit('chat-message', message, username);
            setMessage("");
        }
    };

    /**
     * FUNCTION: Initializes the socket connection, handles WebRTC signaling 
     * (SDP/ICE), and manages the lifecycle of peer connections (join/leave).
     */
    const connectToSocketServer = () => {
        socketRef.current = io(server_url);

        socketRef.current.on('chat-message', addMessage);

        /**
         * WebRTC Signaling: Handles 'offers', 'answers', and 'ice candidates' 
         * received from other users to establish a peer-to-peer connection.
         */
        socketRef.current.on("signal", (fromId, message) => {
            const signal = JSON.parse(message);
            if (fromId === socketIdRef.current) return;

            const pc = connections[fromId];
            if (signal.sdp) {
                pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        pc.createAnswer().then(desc => {
                            pc.setLocalDescription(desc).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: pc.localDescription }));
                            });
                        });
                    }
                });
            }
            if (signal.ice) pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.error(e));
        });

        socketRef.current.on("connect", () => {
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit("join-call", window.location.href);

            /**
             * User Joined: Triggered when a new user enters the call.
             * Creates a new RTCPeerConnection for each existing client in the room.
             */
            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach(socketListId => {
                    if (connections[socketListId]) return;

                    const pc = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId] = pc;

                    pc.onicecandidate = e => {
                        if (e.candidate) socketRef.current.emit("signal", socketListId, JSON.stringify({ ice: e.candidate }));
                    };

                    // Handles receiving a remote video/audio track and adding it to the UI
                    pc.ontrack = (event) => {
                        setVideos(v => {
                            const exists = v.find(vid => vid.socketId === socketListId);
                            if (exists) return v;
                            const updated = [...v, { socketId: socketListId, stream: event.streams[0] }];
                            videoRef.current = updated;
                            return updated;
                        });
                    };

                    if (window.localStream) {
                        window.localStream.getTracks().forEach(track => pc.addTrack(track, window.localStream));
                    }
                });

                /**
                 * If I am the user who just joined, I initiate an 'offer' 
                 * to everyone else in the room.
                 */
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        connections[id2].createOffer().then(desc => {
                            connections[id2].setLocalDescription(desc).then(() => {
                                socketRef.current.emit("signal", id2, JSON.stringify({ sdp: connections[id2].localDescription }));
                            });
                        });
                    }
                }
            });

            /**
             * User Left: Triggered when a participant disconnects.
             * Cleans up their video stream and closes the RTCPeerConnection.
             */
            socketRef.current.on("user-left", id => {
                setVideos(v => v.filter(vid => vid.socketId !== id));
                if (connections[id]) { connections[id].close(); delete connections[id]; }
            });
        });
    };

    /**
     * FUNCTION: Transitions the user from the username lobby to the actual meeting 
     * by triggering the socket connection.
     */
    const connect = () => {
        if (!username) return alert("Please enter a username");
        setAskForUsername(false);
        connectToSocketServer();
    };

    /**
     * FUNCTION: Requests access to the user's screen for screen sharing.
     * Replaces existing camera tracks with the screen track in all peer connections.
     */
    const handleScreen = async () => {
        try {
            if (!screen) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                replaceTracks(screenStream);
                screenStream.getVideoTracks()[0].onended = () => recoverCamera();
                setScreen(true);
            } else {
                recoverCamera();
            }
        } catch (e) { console.error(e); }
    };

    /**
     * FUNCTION: Re-acquires camera and microphone access after screen sharing is stopped.
     */
    const recoverCamera = async () => {
        try {
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            replaceTracks(camStream);
            setScreen(false);
        } catch (e) { console.error(e); }
    };

    /**
     * FUNCTION: Logic to swap media tracks (Video) across all active peer connections.
     * Ensures remote participants see the new source (camera or screen).
     */
    const replaceTracks = (newStream) => {
        window.localStream = newStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
        
        Object.values(connections).forEach(pc => {
            const videoTrack = newStream.getVideoTracks()[0];
            const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) sender.replaceTrack(videoTrack);
        });
    };

    /**
     * FUNCTION: Toggles the local video track (camera) on or off.
     */
    const toggleVideo = () => {
        const newState = !videoEnabled;
        setVideoEnabled(newState);
        window.localStream.getVideoTracks()[0].enabled = newState;
    };

    /**
     * FUNCTION: Toggles the local audio track (microphone) on or off.
     */
    const toggleAudio = () => {
        const newState = !audioEnabled;
        setAudioEnabled(newState);
        window.localStream.getAudioTracks()[0].enabled = newState;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="relative h-screen bg-[#010430] overflow-hidden flex flex-col font-sans">
                {askForUsername ? (
                    <div className="flex flex-col items-center justify-center h-full gap-6 text-white">
                        <div className="bg-[#0a0d3d] p-8 rounded-2xl shadow-2xl flex flex-col gap-4 border border-blue-900">
                            <h2 className="text-3xl font-bold text-center">Video Lobby</h2>
                            <TextField 
                                label="Username" 
                                variant="filled"
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                sx={{ background: "white", borderRadius: "8px", width: "320px" }} 
                            />
                            <Button variant="contained" size="large" onClick={connect} className="h-12">Join Meeting</Button>
                        </div>
                        <video ref={localVideoRef} autoPlay muted className="w-96 rounded-2xl shadow-lg border-2 border-blue-500" />
                    </div>
                ) : (
                    <div className="flex flex-1 relative overflow-hidden h-full">
                        {/* MAIN VIDEO GRID */}
                        <div className={`flex-1 flex flex-wrap justify-center items-center gap-6 p-10 transition-all ${showChat ? 'mr-[30vw]' : ''}`}>
                            {videos.length === 0 && <p className="text-gray-400">Waiting for others to join...</p>}
                            {videos.map(v => (
                                <div key={v.socketId} className="relative group shadow-2xl rounded-2xl overflow-hidden border border-gray-800 bg-black">
                                    <video id={v.socketId} autoPlay playsInline className="w-[40vw] max-w-[600px] aspect-video object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* SIDEBAR CHAT */}
                        <div className={`fixed right-0 top-0 h-full w-[30vw] bg-white transition-transform duration-300 shadow-2xl z-20 flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-blue-900">Meeting Chat</h3>
                                <Button onClick={() => setShowChat(false)}>Close</Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.sender === username ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] text-gray-500 mb-1">{m.sender}</span>
                                        <div className={`p-3 rounded-2xl max-w-[90%] text-sm shadow-sm ${m.sender === username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                                            {m.data}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t bg-white flex gap-2">
                                <TextField fullWidth size="small" placeholder="Message..." value={message} onChange={e => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                                <Button variant="contained" onClick={sendMessage}>Send</Button>
                            </div>
                        </div>

                        {/* PIP LOCAL PREVIEW */}
                        <video ref={localVideoRef} autoPlay muted className="absolute bottom-28 left-8 h-36 w-56 rounded-xl border-2 border-blue-400 z-10 bg-black shadow-2xl object-cover" />

                        {/* FLOATING CONTROLS */}
                        <div className="absolute bottom-8 w-full flex justify-center gap-6 items-center pointer-events-none">
                           <div className="flex gap-4 pointer-events-auto bg-[#0a0d3d]/80 backdrop-blur-md p-4 rounded-3xl border border-blue-900 shadow-2xl">
                                <IconButton onClick={toggleAudio} className={`p-4 ${audioEnabled ? 'text-white hover:bg-white/10' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                                    {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                <IconButton onClick={toggleVideo} className={`p-4 ${videoEnabled ? 'text-white hover:bg-white/10' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                                    {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton className="bg-red-600 text-white p-5 hover:bg-red-700 shadow-lg scale-110" onClick={() => {
                                    if (window.localStream) {
                                         window.localStream.getTracks().forEach(track => track.stop());
                                      }
                                    window.location.href = "/home"}}>
                                    <CallEndIcon fontSize="large" />
                                </IconButton>
                                <IconButton onClick={handleScreen} className={`p-4 ${screen ? 'bg-blue-500 text-white' : 'text-white hover:bg-white/10'}`}>
                                    {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                </IconButton>
                                <Badge badgeContent={newMessages} color="primary">
                                    <IconButton className="text-white p-4 hover:bg-white/10" onClick={() => {setShowChat(true); setNewMessages(0)}}>
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
};

export default VideoMeet;