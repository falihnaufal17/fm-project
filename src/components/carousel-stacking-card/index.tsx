import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomToTopCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const items = [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
    { id: 3, title: 'Item 3', description: 'Description 3' },
    { id: 4, title: 'Item 4', description: 'Description 4' },
    { id: 5, title: 'Item 5', description: 'Description 5' },
  ];

  const nextItem = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevItem = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleButtonClick = (action: () => void) => {
    setIsPaused(true);
    action();
    setTimeout(() => setIsPaused(false), 1000);
  };

  const visibleItems = [];
  for (let i = 0; i < Math.min(3, items.length); i++) {
    const index = (activeIndex + i) % items.length;
    visibleItems.push({ ...items[index], stackPosition: i });
  }

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextItem();
    }, 1500); // Change item every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="grid grid-cols-2 items-center p-8">
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Testimony</h2>

        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-all"
            onClick={() => handleButtonClick(prevItem)}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-all"
            onClick={() => handleButtonClick(nextItem)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="relative w-full h-48 mb-4">
          <AnimatePresence>
            {visibleItems.map((item) => {
              const { stackPosition } = item;
              const isActive = stackPosition === 0;
              const isLastInactive = stackPosition === 2;
              const yOffset = -stackPosition * 16;
              const xOffset = stackPosition * 16;
              const scale = 1;
              const opacity = 1;

              let bgColor;
              if (isActive) {
                bgColor = 'bg-red-500';
              } else if (isLastInactive) {
                bgColor = 'bg-gray-300';
              } else {
                bgColor = 'bg-gray-200';
              }

              return (
                <motion.div
                  key={item.id}
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-32 rounded-lg p-6 cursor-pointer ${bgColor} ${isActive ? '' : 'text-gray-700'
                    }`}
                  initial={{
                    y: yOffset + 100,
                    x: xOffset + 100,
                    opacity: 0,
                    scale: 0.8,
                    zIndex: 3 - stackPosition,
                  }}
                  animate={{
                    y: yOffset,
                    x: xOffset,
                    opacity,
                    scale,
                    zIndex: 3 - stackPosition,
                    boxShadow: `0 ${4 + stackPosition * 2}px ${8 + stackPosition * 4}px rgba(0,0,0,0.2)`,
                  }}
                  exit={{
                    y: 100,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(items.findIndex(i => i.id === item.id));
                    }
                  }}
                >
                  <h3 className='font-bold text-xl text-white'>{item.title}</h3>
                  <p className='text-sm text-gray-100 mt-2'>{item.description}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BottomToTopCarousel;