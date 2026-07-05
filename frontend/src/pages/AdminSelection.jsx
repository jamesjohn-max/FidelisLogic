import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { FileText, Tag, HelpCircle, ArrowRight } from "lucide-react";

export const AdminSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const sections = [
    {
      title: "Blog Management",
      description: "Create, edit, and manage blog posts with rich content, images, and SEO optimization.",
      icon: FileText,
      color: "blue",
      path: "/admin/blog"
    },
    {
      title: "Smart Deals Management",
      description: "Manage promotional deals with start/end dates, brand information, and deal links.",
      icon: Tag,
      color: "orange",
      path: "/admin/deals"
    },
    {
      title: "Brand FAQs",
      description: "Add, edit, and reorder per-brand FAQs. Published entries appear on the brand page and are indexed by search engines as FAQPage structured data.",
      icon: HelpCircle,
      color: "emerald",
      path: "/admin/faqs"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src="/Logo_Color_Large.png" 
            alt="Fidelis Logic" 
            className="h-12 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Select which section you'd like to manage</p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const palettes = {
              blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", hover: "hover:border-blue-300", btn: "bg-blue-600 hover:bg-blue-700" },
              orange: { bg: "bg-orange-50", iconBg: "bg-orange-100", icon: "text-orange-600", hover: "hover:border-orange-300", btn: "bg-orange-600 hover:bg-orange-700" },
              emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", hover: "hover:border-emerald-300", btn: "bg-emerald-600 hover:bg-emerald-700" }
            };
            const p = palettes[section.color] || palettes.blue;

            return (
              <Card
                key={section.title}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${p.hover} border-2 border-transparent`}
                onClick={() => navigate(section.path)}
              >
                <CardContent className="p-6">
                  <div className={`${p.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={p.icon} size={28} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                  <div className={`inline-flex items-center text-sm font-medium ${p.icon}`}>
                    Go to {section.title.split(" ")[0]}
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              localStorage.removeItem("admin_token");
              navigate("/admin/login");
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Logout
          </button>
          <span className="mx-3 text-gray-300">|</span>
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            View Website
          </a>
        </div>
      </div>
    </div>
  );
};
