"use client";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const logo = "/assets/logo-dark.svg";
  return (
    <Link href="/">
      <Image src={logo} alt="IPAP" width={100} height={100} />
    </Link>
  );
};

export default Logo;
