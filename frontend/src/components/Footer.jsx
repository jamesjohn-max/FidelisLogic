import { Link } from "react-router-dom";
import { Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "../data/siteContent";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center">
              <img
                src="/Logo_White_Large.png"
                alt="Fidelis Logic"
                className="h-7 w-55" />
            </div>
            <p className="!font-extralight !text-xs !text-left !mt-[10px] !mb-[24px] text-gray-400">
              Simplifying Modern Workplace Technology decisions for organizations.
            </p>
            <div className="flex space-x-4">
              <a href={'https://www.linkedin.com/company/fidelis-logic/'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={'https://www.youtube.com/@fidelislogic'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube size={20} />
              </a>
              <a href={'https://www.instagram.com/fidelislogic/'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/meeting-rooms" className="text-sm hover:text-blue-400 transition-colors">
                  Meeting Rooms & AV
                </Link>
              </li>
              <li>
                <Link to="/solutions/headsets" className="text-sm hover:text-blue-400 transition-colors">
                  Enterprise Headsets
                </Link>
              </li>
              <li>
                <Link to="/solutions/workspace-experience" className="text-sm hover:text-blue-400 transition-colors">
                  Workspace Experience
                </Link>
              </li>
              <li>
                <Link to="/solutions/business-apps" className="text-sm hover:text-blue-400 transition-colors">
                  Business Applications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Download Capability Deck
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-blue-400" />
                <span>{contactInfo.email}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-blue-400" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <Link to="/contact" className="hover:text-blue-400 transition-colors">
                Get in Touch
              </Link>
              <Link to="/about" className="hover:text-blue-400 transition-colors">
                About Fidelis Logic
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Fidelis Logic LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
