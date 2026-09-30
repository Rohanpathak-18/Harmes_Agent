import React from "react";

const Loading = ({
  text = "Loading Hermes...",
  fullPage = false,
}) => {
  return (
    <div
      className={
        fullPage
          ? "loading-page"
          : "loading-state"
      }
    >
      <div className="loading-spinner">
        <span />
      </div>

      <span>{text}</span>
    </div>
  );
};

export default Loading;