import {io} from "socket.io-client"


const socket = io("http://192.168.0.146:5001")

export default socket;