import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 100, start: boolean = false) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!start) return;

    setDisplayedText(''); // Reseta o texto no início

    let currentIndex = 0;
    const timeoutIds: NodeJS.Timeout[] = [];

    const typeCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
        const timeoutId = setTimeout(typeCharacter, speed);
        timeoutIds.push(timeoutId);
      }
    };

    const startTimeout = setTimeout(typeCharacter, speed);
    timeoutIds.push(startTimeout);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [text, speed, start]);

  return displayedText;
};