import { useEffect, useState } from 'react';

const Input = ({ onKeyPressed }) => {
  const inputKeyList = ["D", "F", "J", "K"]
  const [inputEffect, setInputEffect] = useState("");


  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();

      if (inputKeyList.includes(key)) {
        console.log(`Pressed key: ${key}`);
        onKeyPressed(`Pressed key: ${key}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPressed]);

  return <div className="keyBox" />;
};

export default Input;
