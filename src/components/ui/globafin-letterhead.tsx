import GlobafinLogo from "./globafin-logo";

const GlobafinLetterHead = () => {
  return (
    <header className="flex justify-between p-5 items-center max-w-5xl mx-auto">
      <GlobafinLogo size={200} />
      <div className="text-sm text-[#384fa0] space-y-1 font-medium max-w-[300px]">
        <p>Agona Swedru Within Crockers Building On the Oda Road</p>
        <p>Tel: 0332020509 | 0577699963</p>
        <p>info@globafinmicrofinance.com</p>
        <p>https://www.globafinmicrofinance.com</p>
      </div>
    </header>
  );
};

export default GlobafinLetterHead;
