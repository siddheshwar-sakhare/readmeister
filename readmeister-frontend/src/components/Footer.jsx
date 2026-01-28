import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-6">

        {/* Top Grid: Project Info + Links + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-lg">

          {/* Project Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-2xl">ReadMeister</h3>
            <p className="text-gray-700">
              AI-powered README generator to simplify documentation for developers.
            </p>
          </div>

 

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-xl">Contact</h4>
            <div className="flex flex-col md:flex-row md:items-center md:justify-start md:space-x-6 space-y-2 md:space-y-0">
              <p className="text-gray-600">
                Email: <a href="mailto:siddheshwars2005@gmail.com" className="hover:text-gray-900">siddheshwars2005@gmail.com</a>
              </p>
              <p className="text-gray-600">
                Phone: <a href="tel:+911234567890" className="hover:text-gray-900">+91 12345 67890</a>
              </p>
            </div>
            </div>
            <div className="space-y-4">
            <h4 className="font-semibold text-xl">Connect</h4>
            <div className="flex space-x-4 mt-2">
              <a href="https://github.com/SurajSakhare100" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://x.com/surajsakhare100" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/surajsakhare100" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ReadMeister. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
