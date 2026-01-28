import { FileText, Github, Eye } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
        <Icon className="text-white" size={26} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-white py-20 px-6 md:px-24 scroll-mt-32"
    >
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-black">
          Features that Make README Easy
        </h2>
        <p className="mt-4 text-purple-600 text-lg md:text-xl">
          Powerful tools designed to help you create, edit, and manage README files effortlessly.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-8xl mx-auto">
        <div className="grid gap-10 md:grid-cols-3">
          <FeatureCard
            icon={FileText}
            title="AI README Generator"
            description="Generate clean, structured README files instantly using AI."
          />
          <FeatureCard
            icon={Github}
            title="GitHub Integration"
            description="Connect your GitHub account and push your README directly to any repository."
          />
          <FeatureCard
            icon={Eye}
            title="Live Editing & Preview"
            description="Edit your README and preview changes in real-time with ease."
          />
        </div>
      </div>
    </section>
  );
}
