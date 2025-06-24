import React from 'react';

interface BoardCoordinatesProps {
  theme: string;
}

export const BoardCoordinates: React.FC<BoardCoordinatesProps> = ({ theme }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <>
      {/* Top file labels */}
      <div className="grid grid-cols-8 gap-0 mb-1">
        {files.map((file) => (
          <div
            key={`top-${file}`}
            className="w-[calc(11vw-1rem)] sm:w-[calc(8vw-1rem)] md:w-16 flex items-center justify-center"
          >
            <span className="text-gray-400 text-xs sm:text-sm font-medium">
              {file}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {/* Left rank labels */}
        <div className="flex flex-col gap-0">
          {ranks.map((rank) => (
            <div
              key={`left-${rank}`}
              className="h-[calc(11vw-1rem)] sm:h-[calc(8vw-1rem)] md:h-16 flex items-center justify-center"
            >
              <span className="text-gray-400 text-xs sm:text-sm font-medium w-4">
                {rank}
              </span>
            </div>
          ))}
        </div>

        {/* Chess board will be inserted here */}
        <div className="chess-board-container">
          {/* This is where the board grid will be rendered */}
        </div>

        {/* Right rank labels */}
        <div className="flex flex-col gap-0">
          {ranks.map((rank) => (
            <div
              key={`right-${rank}`}
              className="h-[calc(11vw-1rem)] sm:h-[calc(8vw-1rem)] md:h-16 flex items-center justify-center"
            >
              <span className="text-gray-400 text-xs sm:text-sm font-medium w-4">
                {rank}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom file labels */}
      <div className="grid grid-cols-8 gap-0 mt-1">
        {files.map((file) => (
          <div
            key={`bottom-${file}`}
            className="w-[calc(11vw-1rem)] sm:w-[calc(8vw-1rem)] md:w-16 flex items-center justify-center"
          >
            <span className="text-gray-400 text-xs sm:text-sm font-medium">
              {file}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};