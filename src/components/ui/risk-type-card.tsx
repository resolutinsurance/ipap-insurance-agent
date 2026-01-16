import { RiskType } from "@/lib/interfaces";
import {
  AlertTriangle,
  Anchor,
  Briefcase,
  Building,
  Car,
  Droplet,
  FileCheck,
  Flame,
  HardHat,
  Heart,
  HelpCircle,
  Home,
  Plane,
  Shield,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "./card";

// Map risk categories to icons and colors
const getRiskTypeDetails = (risk: RiskType) => {
  // Default values
  let icon = Shield;
  let bgColor = "bg-blue-100";
  let iconColor = "text-blue-600";

  // First check by risk name (more specific)
  const riskName = risk.name?.toUpperCase();

  switch (riskName) {
    case "WORKMENS COMPENSATION":
      icon = HardHat;
      bgColor = "bg-orange-100";
      iconColor = "text-orange-600";
      break;
    case "ACCIDENT":
      icon = Heart;
      bgColor = "bg-pink-100";
      iconColor = "text-pink-600";
      break;
    case "BOND":
      icon = FileCheck;
      bgColor = "bg-teal-100";
      iconColor = "text-teal-600";
      break;
    case "ENGINEERING":
      icon = Wrench;
      bgColor = "bg-cyan-100";
      iconColor = "text-cyan-600";
      break;
    case "FIRE":
      icon = Flame;
      bgColor = "bg-red-100";
      iconColor = "text-red-600";
      break;
    case "LIABILITY":
      icon = AlertTriangle;
      bgColor = "bg-yellow-100";
      iconColor = "text-yellow-600";
      break;
    case "MARINE":
      icon = Anchor;
      bgColor = "bg-indigo-100";
      iconColor = "text-indigo-600";
      break;
    case "MOTORS":
      icon = Car;
      bgColor = "bg-blue-100";
      iconColor = "text-blue-600";
      break;
    case "OIL AND GAS":
      icon = Droplet;
      bgColor = "bg-amber-100";
      iconColor = "text-amber-600";
      break;
    case "OTHERS":
      icon = HelpCircle;
      bgColor = "bg-gray-100";
      iconColor = "text-muted-foreground";
      break;
    case "TRAVEL":
      icon = Plane;
      bgColor = "bg-violet-100";
      iconColor = "text-violet-600";
      break;
    default:
      // Fallback to risk category if name doesn't match
      switch (risk.risk_category?.toUpperCase()) {
        case "MOTOR":
          icon = Car;
          bgColor = "bg-red-100";
          iconColor = "text-red-600";
          break;
        case "NON_MOTOR":
          icon = Shield;
          bgColor = "bg-green-100";
          iconColor = "text-green-600";
          break;
        case "PROPERTY":
          icon = Home;
          bgColor = "bg-purple-100";
          iconColor = "text-purple-600";
          break;
        case "LIABILITY":
          icon = AlertTriangle;
          bgColor = "bg-yellow-100";
          iconColor = "text-yellow-600";
          break;
        case "MARINE":
          icon = Building;
          bgColor = "bg-indigo-100";
          iconColor = "text-indigo-600";
          break;
        case "MISC":
          icon = Briefcase;
          bgColor = "bg-gray-100";
          iconColor = "text-muted-foreground";
          break;
      }
  }

  return { icon, bgColor, iconColor };
};

export const RiskTypeCard = ({
  risk,
  isSelected,
  onClick,
}: {
  risk: RiskType;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const { icon: Icon, bgColor, iconColor } = getRiskTypeDetails(risk);

  return (
    <Card
      className={`group transition-all cursor-pointer ${
        isSelected
          ? "border-primary scale-100 opacity-100"
          : "hover:shadow-lg scale-95 opacity-50 hover:opacity-75 hover:scale-[0.98]"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div
          className={`w-22 h-14 rounded-full ${bgColor} ${iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-medium mb-2">{risk.name}</h3>
        <p className="text-sm text-muted-foreground">Code: {risk.code}</p>
        <p className="text-sm text-muted-foreground">Category: {risk.risk_category}</p>
      </CardContent>
    </Card>
  );
};
