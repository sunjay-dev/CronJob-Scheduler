import { Github, Play, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-100">
            <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>Scale Your Tasks</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Automate Your
              <span className="text-purple-600 block mt-1">Cron Jobs</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              The simplest way to schedule, monitor, and manage recurring tasks. Built for developers who value reliability and simplicity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 active:scale-95 active:shadow-inner text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Scheduling</span>
            </Link>

            <a
              href="https://github.com/sunjay-dev/CronJob-Scheduler"
              className="w-full sm:w-auto border border-gray-200 hover:border-gray-300 active:scale-95 active:bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 bg-white hover:bg-gray-50"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
