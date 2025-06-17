import React, { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { Receiver } from "./receive";
import { Initiate } from "./inititatecall";
import { useNavigate } from 'react-router-dom';

export const Call=()=>{
const socket = io("https://vidback-2.onrender.com");
const[userid,setuserid]=useState("");
const[receiverid,setreceiverid]=useState("");
const[registered,setregistered]=useState(false);
//imp
const[caller,setcaller]=useState(false);
const[receiver,setreceive]=useState(false);
const[connect,setconnect]=useState(false);
const[callerrec,setcallerrec]=useState(false);
const[fr,setfr]=useState("");
const[off,setoff]=useState(null);
const[candi,setcandi]=useState(null);  
//imp
const localVideoRef=useRef();
const remoteVideoRef=useRef();
const peerRef=useRef(null);


//initiate call
const initiate=async ()=>{
setcaller(true);
const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
localVideoRef.current.srcObject=stream;
//imp
const peer=new RTCPeerConnection();
const tr=(track)=>{
  peer.addTrack(track,stream);
};
stream.getTracks().forEach(tr);
peer.ontrack=(event)=>{
 remoteVideoRef.current.srcObject=event.streams[0];

};
const offer=await peer.createOffer();
await peer.setLocalDescription(offer);
socket.emit("calluser",{to:receiverid, offer,from:userid});
peer.onicecandidate=(event)=>{
if(event.candidate){
socket.emit("ice-candidate",{to:receiverid,candidate:event.candidate});
  
} 
peerRef.current=peer;
  



}}
//accept call

const accept=async ()=>{
setcallerrec(true);
setreceive(false);
const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
  localVideoRef.current.srcObject=stream;
  const peer=new RTCPeerConnection();
  const tr=(track)=>{
    peer.addTrack(track,stream);

  };
  stream.getTracks().forEach(tr);
  peer.ontrack=(event)=>{
    remoteVideoRef.current.srcObject=event.streams[0];


  };
  
  await peer.setRemoteDescription(new RTCSessionDescription(off));
  const answer=await peer.createAnswer();
  await peer.setLocalDescription(answer);
  socket.emit("answer-call",{answer,to:fr});
  peer.onicecandidate=(event)=>{
   if(event.candidate){
     socket.emit("ice-candidate",{to:fr ,candidate:event.candidate});
   }

  };
  peerRef.current=peer;
  if(candi){
    peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  }



};
//receive call
const receive=async ({from ,offer})=>{
  setfr(from) ; 
setoff(offer);
 setreceive(true); 
 

};
//answercall
const ans=async ({answer})=>{
     await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  if(candi){
    peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
 
  }

};
const cand=async({candidate}) => {
    if(peerRef.current){
     peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
 
      
    }
  else{
    setcandi(candidate);
  }

};
socket.on("receivecall",receive);
socket.on("answercall",ans);  
socket.on("ice-candidate",cand);  



const userregister=()=>{
if(registered){
    socket.emit("register",{userid});
    const confirm=({code,message})=>{
            if(code==='0'){
                alert(message);
                setregistered(false);
                return;
            }
            alert(message);
            


    }
    socket.on("confirm",confirm);
}


};


useEffect(userregister,[registered]);
const handleuserchange=(e)=>{
    setuserid(e.target.value);
};
const handleregister=()=>{
  if(userid.trim()){
    setregistered(true);
    return;
  }
  alert("please enter the user id");

};




const handlereceiver=()=>{
  
    if(receiverid.trim()){
        socket.emit("targetcheck",{targetid:receiverid});
        socket.on("targetconf",({code,message})=>{
             if(code==='0'){
                alert(message);
                return;
             }
             alert(message);
             //initiate call
            initiate();
             
             return;

        });
        return;
    } 
    alert("please enter the receiver id"); 


}
const handlereceiverchange=(e)=>{
    setreceiverid(e.target.value);
    console.log(receiverid);
}
return (
<div>

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-[#1f1f1f] p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 drop-shadow-md">
          Video Call Launcher
        </h1>

        {!registered && (
          <>
            <input
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 outline-none mb-4"
              type="text"
              placeholder="Enter your User ID"
              value={userid}
              onChange={handleuserchange}
            />
            <button
              onClick={handleregister}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 px-4 rounded transition"
            >
              Register
            </button>

            <div className="mt-6 flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-gray-400 animate-pulse">
                please enter registered id.
              </p>
            </div>
          </>
        ) }
       {registered && !caller && !receiver && !connect&& (
          <div>
            <p className="text-cyan-300 mb-4 text-sm">
              Logged in as: <span className="font-medium">{userid}</span>
            </p>

            <input
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 outline-none mb-4"
              type="text"
              placeholder="Enter Receiver ID"
              value={receiverid}
              onChange={handlereceiverchange}
            />
            <button
              onClick={handlereceiver}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 px-4 rounded transition"
            >
              Call Now
            </button>
          </div>
        )}
        { caller && (<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 space-y-8">
  <h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow-md">🎥 Caller Panel</h1>

  {/* <div className="flex flex-col items-center space-y-2">
    <p className="text-sm text-gray-400 italic tracking-wide">{status}</p>
  </div> */}

  <div className="flex flex-col md:flex-row gap-6 items-center mt-8">
    <div className="flex flex-col items-center space-y-2">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="w-72 h-52 rounded-lg shadow-lg border-2 border-emerald-500 bg-gray-900"
      />
      <span className="text-xs text-gray-300">You</span>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-72 h-52 rounded-lg shadow-lg border-2 border-purple-500 bg-gray-900"
      />
      <span className="text-xs text-gray-300">Receiver</span>
    </div>
  </div>
</div>
)
 }
 {receiver && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl text-white max-w-sm w-full flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold text-emerald-400">Incoming Call 📞</h2>
      <p className="text-sm text-gray-300">
        <span className="font-medium">{fr}</span> is calling you...
      </p>
      <div className="flex gap-4">
        <button
          onClick={accept}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow"
        >
          Accept
        </button>
        <button
         // onClick={handleRejectCall}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}
{ callerrec && (<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 space-y-8">
  <h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow-md">🎥 Caller Panel</h1>

  {/* <div className="flex flex-col items-center space-y-2">
    <p className="text-sm text-gray-400 italic tracking-wide">{status}</p>
  </div> */}

  <div className="flex flex-col md:flex-row gap-6 items-center mt-8">
    <div className="flex flex-col items-center space-y-2">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="w-72 h-52 rounded-lg shadow-lg border-2 border-emerald-500 bg-gray-900"
      />
      <span className="text-xs text-gray-300">You</span>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-72 h-52 rounded-lg shadow-lg border-2 border-purple-500 bg-gray-900"
      />
      <span className="text-xs text-gray-300">Receiver</span>
    </div>
  </div>
</div>
)
 }








 

      </div>
    </div>
  
    
    
</div>








);




  
 






};
