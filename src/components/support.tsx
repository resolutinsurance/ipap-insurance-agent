import {
  Button,
  Card,
  CardContent,
} from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'

const Support = () => {
  return (
    <Card className="flex h-max w-full items-center justify-center lg:w-max">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <h3>Do you have any concerns</h3>
        <Image
          src="/assets/illustrations/support.svg"
          alt="support-bg"
          width={300}
          height={300}
        />
        <h3>Reach out to customer care now</h3>
        <Button>Contact us</Button>
      </CardContent>
    </Card>
  )
}

export default Support
