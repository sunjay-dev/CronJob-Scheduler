import { Bell, Clock, Code, Monitor, Settings, Shield } from "lucide-react";

export default function Features() {

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Easily create complex cron expressions or simple schedules. Run jobs at any time, interval, or pattern you need."
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Watch job executions live, inspect logs, and get instant updates when tasks succeed, fail, or require attention."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Get instant email alerts when jobs succeed, fail, or require your attention. Stay informed without constantly checking the dashboard."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliable Execution",
      description: "Built-in retries, error handling, and failover support ensure your critical jobs always run on time."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Easy Management",
      description: "Pause, resume, edit, or delete jobs instantly. Group jobs into projects for a cleaner, organized workflow."
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "API Integration",
      description: "Full-featured REST API for programmatic job control. Seamlessly integrate CronJob Scheduler into your existing tools and pipelines."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to automate tasks
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple cron jobs to complex automation workflows, CronJob Scheduler provides all the tools developers need in one reliable platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 hover:bg-purple-50/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
