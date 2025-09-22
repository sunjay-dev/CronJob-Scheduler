import { Calendar, CheckCircle, GitFork, Github, Play, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative sm:mt-0 mt-6  overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Github className="w-4 h-4" />
                <span>Open Source & Free</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Automate Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 block">
                    Cron Jobs
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Schedule, monitor, and manage recurring tasks. Perfect for developers, it’s reliable, open-source, and simple to use for automating any workflow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/25">
                  <Play className="w-5 h-5" />
                  <span>Start Scheduling</span>
                </Link>

                <a
                  href="https://github.com/sunjay-dev/CronJob-Scheduler"
                  className="border-2 border-gray-200 hover:border-purple-500 text-gray-700 hover:text-purple-500 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Github className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>MIT Licensed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GitFork className="w-4 h-4" />
                  <span>Community Driven</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Database Backup</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">Active</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="font-mono sm:text-sm text-xs text-gray-700">0 2 * * *</span>
                      <span className="text-gray-500 sm:text-sm text-xs">Every day at 2 AM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last run:</span>
                      <span className="text-green-600 font-medium">Success</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next run:</span>
                      <span className="text-gray-900">In 4 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Job completed</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
