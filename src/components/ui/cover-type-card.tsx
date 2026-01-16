import { CoverType } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent } from "./card";

export const CoverTypeCard = ({
  cover,
  isSelected,
  onClick,
}: {
  cover: CoverType;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 scale-100 opacity-100"
          : "hover:border-primary/50 scale-95 opacity-50 hover:opacity-75 hover:scale-[0.98]"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
        <div className="w-12 h-12 relative mb-2">
          <Image
            src={cover!.icon!}
            alt={cover!.name}
            fill
            className={cn(isSelected ? "grayscale-0" : "grayscale", "object-contain")}
          />
        </div>
        <h3 className="font-medium">{cover.name}</h3>
        <p className="text-sm text-muted-foreground">{cover.description}</p>
      </CardContent>
    </Card>
  );
};
