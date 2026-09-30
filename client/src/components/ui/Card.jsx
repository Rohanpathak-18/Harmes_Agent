import React from "react";

const Card = ({
  children,
  className = "",
  padding = true,
  ...props
}) => {
  return (
    <div
      className={[
        "hermes-card",
        padding ? "hermes-card-padding" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;