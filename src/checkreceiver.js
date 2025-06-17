
import React, { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
export function CheckReceiver(){
const socket = io("http://localhost:8080");
const[userid,setuserid]=useState('');
const[receiverid,setreceiverid]=useState('');
}


// useEffect()


















// const [userId, setUserId] = useState('adarsh123');
// const [receiverId, setReceiverId] = useState('');
// const [isOnline, setIsOnline] = useState(false);

// useEffect(() => {
//   socket.emit('register', userId);
// }, [userId]);

// const checkIfReceiverOnline = () => {
//   socket.emit('check-user-online', receiverId, ({ isOnline }) => {
//     setIsOnline(isOnline);
//     if (isOnline) {
//       initiateCall(); // your offer + peer connection logic
//     } else {
//       alert('User is offline');
//     }
//   });
//};