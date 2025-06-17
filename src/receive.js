import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const conf = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const Receiver=()=>{
    const[status,setstatus]=useState(`📞 Incoming call from ${localStorage.getItem("from")}`);
    const socket=io('http://localhost:8080')
    const [inoffer,setinoffer]=useState(localStorage.getItem("off"));
    const[callerId,setcallerId]=useState(localStorage.getItem("from"));
    const localVideoRef=useRef(null);
    const remoteVideoRef=useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add ICE:", err);
        }
      }
    });
     const acceptCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection(conf);
    peerConnectionRef.current = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = event => {
      if (event.candidate && callerId) {
        socket.emit("ice-candidate", { to: callerId, candidate: event.candidate });
      }
    };

    peer.ontrack = event => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    await peer.setRemoteDescription(inoffer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer-call", { to: callerId, answer });
    setinoffer(null);
    setstatus("✅ Call Connected");
  };

  const rejectCall = () => {
    setinoffer(null);
    setcallerId("");
    setstatus("❌ Call Rejected");
  };



    return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-yellow-400">Receiver UI</h1>

      {inoffer && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center space-y-4">
          <p className="text-lg">{status}</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={acceptCall}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded font-bold"
            >
              ✅ Accept
            </button>
            <button
              onClick={rejectCall}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded font-bold"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      )}

      {!inoffer && <p className="text-gray-400">{status}</p>}

      <div className="flex gap-4 mt-6">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black rounded" />
      </div>
    </div>
  );









}












