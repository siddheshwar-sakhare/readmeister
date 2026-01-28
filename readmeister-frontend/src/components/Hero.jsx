import { ArrowRight } from "lucide-react";

export default function Hero({ onNavigate }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white pt-20 px-6 md:px-12">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />
      <div className="absolute -top-40 -right-40 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, currentColor 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          color: "#000",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center text-center">

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl">
          Turn Your Projects into{" "}
          <span className="text-purple-600">Clear, Powerful Docs</span>
        </h1>

        {/* Supporting paragraph */}
        <p className="mt-5 mb-7 text-lg md:text-xl text-gray-700 max-w-2xl">
          With ReadSpark, create README files that actually help your team and
          impress contributors — fast, simple, and hassle-free.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate("create")}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-base font-medium text-white hover:bg-purple-800 transition"
        >
          Build Your First README
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
