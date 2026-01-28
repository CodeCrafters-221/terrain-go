import React from "react";

const Pagination = () => {
  return (
    <>
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-background-dark font-bold">
            1
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-dark hover:text-white transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-dark hover:text-white transition-colors">
            3
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
