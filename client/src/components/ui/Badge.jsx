import React from "react";

const Badge = ({
  status = "default",
  children,
}) => {
  const normalizedStatus = String(status)
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");

  return (
    <span
      className={`status-badge status-${normalizedStatus}`}
    >
      <span className="status-dot" />

      <span>
        {children ||
          String(status)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )}
      </span>
    </span>
  );
};

export default Badge;