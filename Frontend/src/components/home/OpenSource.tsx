import { CheckCircle, Github } from "lucide-react";

export default function OpenSource() {
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  Open source,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 block">
                    community driven
                  </span>
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed">
                  CronJob is completely free and open source. Deploy it anywhere, customize it to your needs, and contribute to making it better for everyone.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Free</h4>
                    <p className="text-gray-600 text-sm">No hidden costs or premium features</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Self-hosted</h4>
                    <p className="text-gray-600 text-sm">Deploy on your own infrastructure</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">MIT Licensed</h4>
                    <p className="text-gray-600 text-sm">Use without any restrictions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Active Community</h4>
                    <p className="text-gray-600 text-sm">Get support and contribute features</p>
                  </div>
                </div>
              </div>

              <a
                href="https://github.com/sunjay-dev/CronJob-Scheduler"
                className="inline-flex items-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>Star on GitHub</span>
              </a>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-8 overflow-hidden">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                <div className="space-y-3 text-sm font-mono">
                  <div className="text-green-400">$ git clone https://github.com/sunjay-dev/CronJob-Scheduler</div>
                  <div className="text-blue-400">$ npm install</div>
                  <div className="text-purple-400">$ npm start</div>
                  <div className="text-gray-300">✓ Server running on http://localhost:3000</div>
                  <div className="text-gray-300">✓ Database connected</div>
                  <div className="text-green-400">✓ CronJob is ready!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
