export default function Work() {

    const steps = [
    {
      number: "01",
      title: "Create Your Job",
      description: "Define your cron schedule using our visual editor or write custom expressions"
    },
    {
      number: "02",
      title: "Configure Actions",
      description: "Set up HTTP requests, webhooks, or custom scripts to execute on schedule"
    },
    {
      number: "03",
      title: "Monitor & Manage",
      description: "Track execution history, manage multiple jobs, and receive real-time alerts"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Setting up automated cron jobs has never been easier. Follow these simple steps to get your first job running.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-purple-500 to-purple-300 transform -translate-x-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}
