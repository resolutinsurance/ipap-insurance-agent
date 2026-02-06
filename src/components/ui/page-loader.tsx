import Logo from "./logo";

const PageLoader = () => {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="animate-pulse">
        <Logo />
      </div>
    </main>
  );
};

export default PageLoader;
