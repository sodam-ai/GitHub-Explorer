import { useState, useRef, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleEnter() {
    timeoutRef.current = setTimeout(() => setShow(true), 400);
  }

  function handleLeave() {
    clearTimeout(timeoutRef.current);
    setShow(false);
  }

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      {show && (
        <div
          className={`absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg whitespace-nowrap pointer-events-none shadow-lg ${
            position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
