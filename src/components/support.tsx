import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const Support = () => {
  return (
    <Card className="w-full lg:w-max h-max flex justify-center items-center">
      <CardContent className="flex flex-col justify-center items-center gap-4">
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
  );
};

export default Support;
