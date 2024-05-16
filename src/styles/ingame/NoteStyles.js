// src/styles/NoteStyles.js
import styled from "styled-components";

export const NoteContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100px; // 노트의 높이를 조정할 수 있습니다.
  overflow: hidden;
  background-color: #f0f0f0;
`;

export const Note = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px; // 노트의 너비를 조정할 수 있습니다.
  height: 50px; // 노트의 높이를 조정할 수 있습니다.
  background-color: #ff0000; // 노트의 색상을 조정할 수 있습니다.
  animation: moveNote 2s linear infinite;

  @keyframes moveNote {
    from {
      right: -50px;
    }
    to {
      right: 100%;
    }
  }
`;
