import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "hermes-button",
        `hermes-button-${variant}`,
        `hermes-button-${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <span className="button-loading">
          <span />
          <span />
          <span />
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;