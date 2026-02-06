import { VERIFICATION_STEPS } from "@/hooks/use-verification-flow";

interface VerifyIdHeaderProps {
  currentStep: number;
}

export const VerifyIdHeader = ({ currentStep }: VerifyIdHeaderProps) => {
  return (
    <header className="border-b">
      <div className="px-4 py-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {VERIFICATION_STEPS[currentStep - 1].title}
          </h1>
          <p className="text-gray-600 text-sm">
            {VERIFICATION_STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>
    </header>
  );
};
