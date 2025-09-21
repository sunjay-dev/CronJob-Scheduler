import { Calendar, CheckCircle, Github } from "lucide-react";

export default function GettingStart() {
  return (
    <section id="getting-started" className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How to Get Started
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Deploy your own instance or contribute to the open source project
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
              <Calendar className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Quick Deploy
              </h3>
              <p className="text-gray-600 mb-6">
                Get up and running with our simple deployment guide
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Docker support included
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Environment variables setup
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Database configuration
                </div>
              </div>
              <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
                View Documentation
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
              <Github className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Contribute
              </h3>
              <p className="text-gray-600 mb-6">
                Join our community and help improve the project
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Open issues & discussions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Pull requests welcome
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Active community support
                </div>
              </div>
              <a 
                href="https://github.com/sunjay-dev/CronJob-Scheduler"
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
  )
}
