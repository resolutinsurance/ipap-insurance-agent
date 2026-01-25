import Image from "next/image";

const GlobafinLogo = ({ size = 100 }: { size?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/assets/globafin-logo.svg"
        alt="Globafin Logo"
        width={size}
        height={size}
      />
    </div>
  );
};

export default GlobafinLogo;
