import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
              <img src='/logo.webp' className="w-12 h-12" />
                
                <h3 className="text-2xl font-bold">CronJob</h3>
              </div>
              <p className="text-gray-400 max-w-sm">
                Open-source cron job scheduler built for developers who need reliability and simplicity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#features" className="block hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block hover:text-white transition-colors">How it Works</a>
                <a href="https://github.com/sunjay-dev/CronJob-Scheduler#readme" className="block hover:text-white transition-colors">Documentation</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-gray-400">
                <a target="_blank" href="https://github.com/sunjay-dev/CronJob-Scheduler" className="block hover:text-white transition-colors">GitHub</a>
                <a target="_blank" href="https://github.com/sunjay-dev/CronJob-Scheduler/issues" className="block hover:text-white transition-colors">Issues</a>
                <a target="_blank" href="https://github.com/sunjay-dev/CronJob-Scheduler/discussions" className="block hover:text-white transition-colors">Discussions</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/privacy-policy" className="block hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="block hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>

           <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 CronJob Scheduler. Open source and free.</p>
          </div>
        </div>
      </footer>
  )
}
