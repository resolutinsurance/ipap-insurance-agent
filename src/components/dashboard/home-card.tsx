'use client'

import { HomeCardProps } from '@/lib/interfaces'
import { cn } from '@/lib/utils'
import {
  Button,
  Card,
  CardContent,
} from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'
import Link from 'next/link'

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
        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground max-w-[400px] text-sm">
              {description}
            </p>
            <Button
              asChild
              className={cn(
                !bgColor.includes('blue') &&
                  'bg-[#8965E5] hover:bg-[#8965E5]/90',
              )}
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
          <div className="relative h-40 w-40">
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
  )
}
