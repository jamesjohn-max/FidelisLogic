import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SEO } from "../components/SEO";
import { StructuredData, breadcrumbSchema, organizationSchema } from "../components/StructuredData";
import { seoConfig } from "../data/seoConfig";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Linkedin, Youtube, Instagram } from "lucide-react";
import { contactInfo, formTopics } from "../data/mock";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WEB3FORMS_KEY = process.env.REACT_APP_WEB3FORMS_KEY;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    topic: "",
    preferred_date: "",
    message: ""
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const breadcrumbs = [
    { name: "Home", url: typeof window !== "undefined" ? `${window.location.origin}/` : "" },
    { name: "Contact", url: typeof window !== "undefined" ? window.location.href : "" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (value) => {
    setFormData((prev) => ({ ...prev, topic: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database first
      await axios.post(`${BACKEND_URL}/api/contact`, {
        name: formData.name,
        company: formData.company || null,
        email: formData.email,
        phone: formData.phone || null,
        topic: formData.topic,
        preferred_date: formData.preferred_date || null,
        message: formData.message
      });

      // Send email via Web3Forms (client-side using JSON)
      const emailMessage = `
New Consultation Request Received

Contact Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${formData.name}
${formData.company ? `Company: ${formData.company}` : ''}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Topic: ${formData.topic}
${formData.preferred_date ? `Preferred Date/Time: ${formData.preferred_date}` : ''}

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email was sent from the Fidelis Logic website contact form.
      `.trim();

      // Web3Forms API call using JSON
      const web3Data = {
        access_key: WEB3FORMS_KEY,
        subject: `New Consultation Request from ${formData.name}`,
        from_name: formData.name,
        name: formData.name,
        email: formData.email,
        message: emailMessage
      };

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(web3Data)
      });

      const responseData = await web3Response.json();
      
      if (responseData.success) {
        toast.success("Thank you for your inquiry. We'll contact you within 24 hours.");
      } else {
        console.error("Web3Forms error:", responseData);
        // Still show success since data was saved to database
        toast.success("Your request has been received. We'll contact you within 24 hours.");
      }
      
      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        topic: "",
        preferred_date: "",
        message: ""
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send request. Please try again or email us directly at info@fidelislogic.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      // Save to database
      const response = await axios.post(`${BACKEND_URL}/api/newsletter`, {
        email: newsletterEmail
      });

      // Send email notification via Web3Forms using FormData
      const web3FormData = new FormData();
      web3FormData.append('access_key', WEB3FORMS_KEY);
      web3FormData.append('subject', `New Newsletter Subscription: ${newsletterEmail}`);
      web3FormData.append('email', newsletterEmail);
      web3FormData.append('message', `New Newsletter Subscription\n\nEmail: ${newsletterEmail}\n\nAdd this email to your newsletter distribution list.`);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData
      });

      if (response.data.status === "info") {
        toast.info(response.data.message);
      } else {
        toast.success(response.data.message || "Successfully subscribed!");
      }
      
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.contact.title}
        description={seoConfig.contact.description}
        keywords={seoConfig.contact.keywords}
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Let's Talk About Your Technology Needs
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Schedule a free consultation to discuss how we can help simplify your modern workplace technology decisions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Book a Free Consultation
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="mt-2"
                        placeholder="Your Company Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-2"
                        placeholder="+971 X XXXX XXXX"
                      />
                    </div>

                    <div>
                      <Label htmlFor="topic">Topic of Interest *</Label>
                      <Select onValueChange={handleTopicChange} required>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {formTopics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="preferred_date">Preferred Date/Time</Label>
                      <Input
                        id="preferred_date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleInputChange}
                        className="mt-2"
                        placeholder="e.g., Next week, afternoon"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-2"
                        rows={4}
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Submit Consultation Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              {/* MS Bookings Alternative */}
              {/* <Card className="border-0 shadow-lg mt-8">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Or Schedule Directly
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Use Microsoft Bookings to schedule a time that works for you.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                     <p className="text-gray-500 mb-4">Microsoft Bookings Widget</p> 
                    <p className="text-sm text-gray-400">
                      <iframe src='https://outlook.office.com/book/WebBooking@fidelislogic.com/?ismsaljsauthenabled' width='100%' height='100%' scrolling='yes'> </iframe>
                    </p>
                  </div>
                </CardContent>
              </Card> */}
            {/*
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Other Options
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                      Request Site Survey
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                      Get Budgetary Quote
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                      Download Capability Deck
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

            {/* Contact Information */}
            
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={'https://www.linkedin.com/company/fidelis-logic/'} target="_blank"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href={'https://www.youtube.com/@fidelislogic'} target ="_blank"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Youtube size={24} />
                  </a>
                  <a
                    href={'https://www.instagram.com/fidelislogic/'} target ="_blank"
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>

             {/* <Card className="border-0 shadow-lg bg-blue-50">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Sunday - Thursday:</span> 9:00 AM - 6:00 PM</p>
                    <p><span className="font-medium">Friday - Saturday:</span> Closed</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    UAE Standard Time (GMT+4)
                  </p>
                </CardContent>
              </Card> */}

              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
