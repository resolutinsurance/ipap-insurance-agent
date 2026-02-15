import { CoverType } from '@/lib/interfaces'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'

export const CoverTypeCard = ({
  cover,
  isSelected,
  onClick,
}: {
  cover: CoverType
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 scale-100 opacity-100'
          : 'hover:border-primary/50 scale-95 opacity-50 hover:scale-[0.98] hover:opacity-75'
      }`}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center space-y-2 p-6 text-center">
        <div className="relative mb-2 h-12 w-12">
          <Image
            src={cover!.icon!}
            alt={cover!.name}
            fill
            className={cn(
              isSelected ? 'grayscale-0' : 'grayscale',
              'object-contain',
            )}
          />
        </div>
        <h3 className="font-medium">{cover.name}</h3>
        <p className="text-muted-foreground text-sm">{cover.description}</p>
      </CardContent>
    </Card>
  )
}
