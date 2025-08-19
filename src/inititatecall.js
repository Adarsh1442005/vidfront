import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const Initiate=()=>{
    
   const socket =io("https://vidback-wxq9.onrender.com");
   const receiverid=localStorage.getItem("receiver");
const [status,setstatus]=useState("Ready to call");
const[calling,setcalling]=useState(false);

const localVideoRef=useRef(null);
const remoteVideoRef=useRef(null);
const peerconn=useRef(null);
const localstreamref=useRef(null);
const ans=async ({answer})=>{
   




}
const createoffer= async ()=>{
   const stream= await navigator.mediaDevices.getUserMedia({video:true,audio:true});
   localstreamref.current=stream;
   if(localVideoRef.current){
    localVideoRef.current.srcObject=stream;
   }

const peer=new RTCPeerConnection(config);
peerconn.current=peer;
stream.getTracks().forEach(track => peer.addTrack(track,stream));
peer.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: receiverid, candidate: event.candidate });
      }
    };

peer.ontrack=(event)=>{
if(remoteVideoRef.current){
    remoteVideoRef.current.srcObject=event.streams[0];
}};
const offer=await peer.createOffer();
await peer.setLocalDescription(offer);
socket.emit("calluser",{receiverid,offer});
setcalling(true);
setstatus("Ringing...");

};


const answer=async ({answer})=>{
await peerconn.current.setRemoteDescription(answer);
setstatus("call connected...");

};

socket.on("answercall",answer);

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-emerald-400">Caller Side</h1>

      <div className="flex flex-col items-center space-y-3">
        {/* <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={e => setReceiverId(e.target.value)}
          className="px-4 py-2 text-black rounded"
        /> */}
        <button
          onClick={createoffer}
          disabled={calling}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition"
        >
          📞 Call
        </button>
        <p className="text-gray-400">{status}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 rounded bg-gray-800" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 rounded bg-gray-800" />
      </div>
    </div>
  );
}



  




