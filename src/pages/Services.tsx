import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Video, MessageCircle, Calendar, FileText, Brain, Heart } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "Connect with licensed psychiatrists through secure video calls from the comfort of your home.",
      features: ["HD video quality", "End-to-end encryption", "Flexible scheduling"]
    },
    {
      icon: MessageCircle,
      title: "Chat Therapy",
      description: "Send messages to your psychiatrist and receive responses at their earliest convenience.",
      features: ["Asynchronous communication", "Written record of conversations", "Thoughtful responses"]
    },
    {
      icon: Calendar,
      title: "Session Management",
      description: "Easy booking and rescheduling of appointments with automated reminders.",
      features: ["Calendar integration", "Email reminders", "Easy rescheduling"]
    },
    {
      icon: FileText,
      title: "Mental Health Assessments",
      description: "Complete standardized assessments to help your psychiatrist understand your needs better.",
      features: ["PHQ-9 depression screening", "GAD-7 anxiety assessment", "Custom questionnaires"]
    },
    {
      icon: Brain,
      title: "Treatment Planning",
      description: "Collaborate with your psychiatrist to develop personalized treatment plans.",
      features: ["Goal setting", "Progress tracking", "Regular plan reviews"]
    },
    {
      icon: Heart,
      title: "Crisis Support",
      description: "Access resources and emergency contacts when you need immediate support.",
      features: ["24/7 crisis hotlines", "Emergency protocols", "Safety planning"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive mental health support tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-border hover:shadow-strong transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-muted-foreground">
                          <span className="text-primary mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health. Book a session with one of our licensed psychiatrists today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/signup")}>
                Create Account
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
export { Services };
