import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is ReadMeister?",
    answer:
      "ReadMeister is an AI-powered tool that helps you generate clear, structured, and professional README files for your projects in seconds.",
  },
  {
    question: "How does the README generation work?",
    answer:
      "ReadMeister analyzes your repository structure, configuration files, and optional existing README to generate accurate documentation automatically.",
  },
  {
    question: "Do I need an existing README?",
    answer:
      "No. If a README exists, ReadMeister improves it. If not, it generates one using your project structure and metadata.",
  },
  {
    question: "Which repositories are supported?",
    answer:
      "ReadMeister works best with GitHub repositories and supports popular tech stacks like Java, JavaScript, React, and Spring Boot.",
  },
  {
    question: "Is my repository data safe?",
    answer:
      "Yes. ReadMeister only uses your repository data temporarily to generate documentation and does not store or share it.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative w-full bg-gradient-to-b from-slate-50 to-white py-24 scroll-m-32">
      
      {/* Soft background accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-100/60 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4">

        {/* Title */}
        <h2 className="text-center text-4xl md:text-5xl font-extrabold text-gray-900">
          Frequently Asked <span className="text-purple-600">Questions</span>
        </h2>

        <p className="mt-4 mb-12 text-center text-lg md:text-xl text-gray-600">
          Everything you need to know about ReadMeister and how it works.
        </p>

        {/* FAQ Items */}
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-purple-600 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
