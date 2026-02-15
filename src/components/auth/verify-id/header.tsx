import { VERIFICATION_STEPS } from '@/hooks/use-verification-flow'

interface VerifyIdHeaderProps {
  currentStep: number
}

export const VerifyIdHeader = ({ currentStep }: VerifyIdHeaderProps) => {
  return (
    <header className="border-b">
      <div className="px-4 py-6">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`mx-2 h-0.5 w-12 ${
                      step < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            {VERIFICATION_STEPS[currentStep - 1].title}
          </h1>
          <p className="text-sm text-gray-600">
            {VERIFICATION_STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>
    </header>
  )
}
