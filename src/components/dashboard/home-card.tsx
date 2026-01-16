"use client";

import { HomeCardProps } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const HomeCard = ({
  title,
  description,
  ctaText,
  bgColor,
  imageSrc,
  imageAlt,
  ctaLink,
}: HomeCardProps) => {
  return (
    <Card className={`${bgColor} border-none shadow-none`}>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-[400px]">{description}</p>
            <Button
              asChild
              className={cn(
                !bgColor.includes("blue") && "bg-[#8965E5] hover:bg-[#8965E5]/90"
              )}
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
          <div className="w-40 h-40 relative">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={160}
              height={160}
              className="object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
