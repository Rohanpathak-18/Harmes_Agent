import { ArrowUpRight } from "lucide-react";

const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      className="stat-card"
      onClick={onClick}
      disabled={!onClick}
    >
      <div className="stat-card-header">
        <span className="stat-card-label">
          {label}
        </span>

        {Icon && (
          <div className="stat-card-icon">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      <div className="stat-card-footer">
        <span>{description}</span>

        {onClick && (
          <ArrowUpRight size={14} />
        )}
      </div>
    </button>
  );
};

export default StatCard;