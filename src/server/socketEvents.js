import socket from "./server.js";

// 로그인 할 때
export const login = (nickname)=>{
  socket.emit("login", nickname, (res) => {
      if (res?.ok) {
        console.log(nickname);
      }
  });  
}

//
export const handleSongChange = (socket, setSelectedSong) => {
  socket.on("change", song => {
    console.log("change res", song);
    setSelectedSong([song]);
  });

  return () => {
    socket.off("change");
  };
};


