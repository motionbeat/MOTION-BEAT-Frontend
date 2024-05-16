// src/components/ingame/Note.js
import React, { useEffect, useRef } from 'react';
import { Note as StyledNote } from "styles/ingame/NoteStyles";

const Note = ({ onRemove, id, onHit, timestamp }) => {
  const noteRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const delay = now - timestamp;

    const handleAnimationEnd = () => {
      onRemove(id);
    };

    const handleHitCheck = (event) => {
      if (event.key === ' ') {
        const noteElement = noteRef.current;
        const noteRect = noteElement.getBoundingClientRect();
        const containerRect = noteElement.parentNode.getBoundingClientRect();

        if (
          noteRect.left > containerRect.left + containerRect.width * 0.2 &&
          noteRect.right < containerRect.right - containerRect.width * 0.2
        ) {
          onHit(id);
        }
      }
    };

    const noteElement = noteRef.current;
    noteElement.addEventListener('animationend', handleAnimationEnd);
    window.addEventListener('keydown', handleHitCheck);

    // 애니메이션 시작 지연 보정
    noteElement.style.animationDelay = `-${delay}ms`;

    return () => {
      noteElement.removeEventListener('animationend', handleAnimationEnd);
      window.removeEventListener('keydown', handleHitCheck);
    };
  }, [onRemove, id, onHit, timestamp]);

  return <StyledNote ref={noteRef} />;
};

export default Note;
