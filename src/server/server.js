import { io } from "socket.io-client"

const socket = io(process.env.REACT_APP_API_URL)
// const socket = io("http://192.168.0.146:5001")

export default socket;