// // src/components/NoteContainer.js
// import React, { useEffect, useState, useCallback } from "react";
// import { NoteContainer as StyledNoteContainer } from "styles/ingame/NoteStyles.js";
// import Note from "./Note";

// const NoteContainer = ({ socket }) => {
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     const createNote = () => {
//       const note = { id: Date.now(), key: Date.now(), timestamp: Date.now() };
//       setNotes((prevNotes) => [...prevNotes, note]);
//       if (socket) {
//         socket.send(JSON.stringify({ type: "note", note }));
//       }
//     };

//     const interval = setInterval(createNote, 1000); // 1초마다 새로운 노트 생성

//     return () => clearInterval(interval);
//   }, [socket]);

//   useEffect(() => {
//     if (socket) {
//       socket.onmessage = (message) => {
//         const data = JSON.parse(message.data);
//         if (data.type === "note") {
//           const now = Date.now();
//           const delay = now - data.note.timestamp;
//           setNotes((prevNotes) => [
//             ...prevNotes,
//             { ...data.note, timestamp: Date.now() - delay },
//           ]);
//         }
//       };
//     }
//   }, [socket]);

//   const handleRemoveNote = useCallback((id) => {
//     setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
//   }, []);

//   const handleHitNote = useCallback((id) => {
//     console.log(`Note hit: ${id}`);
//     setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
//   }, []);

//   return (
//     <StyledNoteContainer data-testid="note-container">
//       {notes.map((note) => (
//         <Note
//           key={note.id}
//           id={note.id}
//           onRemove={handleRemoveNote}
//           onHit={handleHitNote}
//           timestamp={note.timestamp}
//         />
//       ))}
//     </StyledNoteContainer>
//   );
// };

// export default React.memo(NoteContainer);
