import { Link } from "react-router-dom";
import { Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "../data/mock";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Newsletter subscription coming soon!");
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center">
              <img 
                src="/logo-white.png" 
                alt="Fidelis Logic" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Simplifying modern workplace technology decisions for UAE organizations.
            </p>
            <div className="flex space-x-4">
              <a href={contactInfo.linkedin} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={contactInfo.youtube} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube size={20} />
              </a>
              <a href={contactInfo.instagram} className="text-gray-400 hover:text-blue-400 transition-colors">
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
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get insights on modern workplace technology.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{contactInfo.location}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Fidelis Logic LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
