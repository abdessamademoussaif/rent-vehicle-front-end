import React from "react";
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserCog,
} from "lucide-react";
import { Button } from "./ui/button";

const ActionButton = ({
  type,
  onClick,
  label,
  showLabel = false,
  size = "sm",
}) => {
  const getButtonConfig = () => {
    switch (type) {
      case "edit":
        return {
          icon: <Edit className="size-6" />,
          variant: "ghost",
          text: label || "Edit",
          className: "text-blue-600 hover:bg-blue-50",
        };
      case "delete":
        return {
          icon: <Trash2 className="size-6" />,
          variant: "ghost",
          text: label || "Delete",
          className: "text-red-600 hover:bg-red-50",
        };
      case "activate":
        return {
          icon: <CheckCircle className="size-6" />,
          variant: "ghost",
          text: label || "Activate",
          className: "text-green-600 hover:bg-green-50",
        };
      case "deactivate":
        return {
          icon: <XCircle className="size-6" />,
          variant: "ghost",
          text: label || "Deactivate",
          className: "text-amber-600 hover:bg-amber-50",
        };
      case "role":
        return {
          icon: <UserCog className="size-6" />,
          variant: "ghost",
          text: label || "Change Role",
          className: "text-blue-600 hover:bg-blue-50",
        };
      case "more":
        return {
          icon: <MoreVertical className="size-6" />,
          variant: "ghost",
          text: label || "More",
        };
      default:
        return {
          icon: <Edit className="size-6" />,
          variant: "ghost",
          text: label || "Action",
        };
    }
  };

  const config = getButtonConfig();

  return (
    <Button
      className={`bg-white bg-opacity-50 text-white hover:border-gray-300 hover:bg-opacity-100 ${config.className || ''}`}
      size={size}
      onClick={onClick}
    >
      {config.icon}
      {showLabel && <span className="ml-2">{config.text}</span>}
    </Button>
  );
};

export default ActionButton;
