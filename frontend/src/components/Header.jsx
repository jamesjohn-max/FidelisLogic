import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { analytics } from "../lib/analytics";
import { services } from "../data/services";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  // Nav items rendered as simple links. "Services" is a separate dropdown item.
  const linkNav = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" }
  ];
  const linkNavAfter = [
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Close the desktop dropdown when the route changes
  useEffect(() => {
    setServicesOpen(false);
  }, [location.pathname]);

  // Click-outside handler for desktop dropdown
  useEffect(() => {
    if (!servicesOpen) return;
    const onDocClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [servicesOpen]);

  const navLinkClass = (active) =>
    `px-7 py-2 text-sm font-medium rounded-lg transition-colors ${
      active
        ? "text-blue-700 bg-blue-50"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/Logo_Color_Large.png"
              alt="Fidelis Logic"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {linkNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={navLinkClass(isActive(item.href))}
              >
                {item.name}
              </Link>
            ))}

            {/* Services dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                className={`inline-flex items-center gap-1 ${navLinkClass(isActive("/services"))}`}
                data-testid="nav-services-trigger"
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[560px] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-gray-100 overflow-hidden"
                  role="menu"
                  data-testid="nav-services-dropdown"
                >
                  <div className="grid grid-cols-2 gap-1 p-3">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="group block px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                        data-testid={`nav-services-item-${s.slug}`}
                        role="menuitem"
                      >
                        <div className="text-sm font-semibold text-brand-dark group-hover:text-blue-700 leading-tight">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                          {s.oneLiner}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Not sure which one fits? Book a 30-minute call.
                    </p>
                    <Link
                      to="/services"
                      onClick={() => setServicesOpen(false)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      All services →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {linkNavAfter.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={navLinkClass(isActive(item.href))}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/contact"
              onClick={() =>
                analytics.consultationCtaClick({
                  location: "header_desktop",
                  source_path: location.pathname,
                })
              }
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Book Free Consultation
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {linkNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Services expandable group */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  aria-expanded={mobileServicesOpen}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive("/services")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  data-testid="nav-mobile-services-trigger"
                >
                  Services
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileServicesOpen && (
                  <div className="mt-1 ml-2 border-l-2 border-gray-100 pl-3 space-y-1">
                    <Link
                      to="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      All services overview
                    </Link>
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {linkNavAfter.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => {
                  setMobileMenuOpen(false);
                  analytics.consultationCtaClick({
                    location: "header_mobile",
                    source_path: location.pathname,
                  });
                }}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  Book Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
