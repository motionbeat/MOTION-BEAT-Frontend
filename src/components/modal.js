import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/modal.css'; // 모달에 대한 스타일을 정의한 CSS 파일

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div>
          <button className="modal-button" onClick={onClose}>X</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default Modal