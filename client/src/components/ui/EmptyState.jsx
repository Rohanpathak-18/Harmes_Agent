import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "",
  action = null,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={22} />
      </div>

      <h3>{title}</h3>

      {description && (
        <p>{description}</p>
      )}

      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;