import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "fa-calendar-check",
    title: "Easy Appointment Booking",
    description: "Schedule sessions with your psychiatrist at your convenience with our intuitive booking system.",
    color: "text-primary"
  },
  {
    icon: "fa-video",
    title: "Virtual Sessions",
    description: "Attend therapy sessions from the comfort of your home with secure video consultations.",
    color: "text-secondary"
  },
  {
    icon: "fa-user-doctor",
    title: "Licensed Professionals",
    description: "All our psychiatrists are licensed, experienced, and dedicated to your mental wellness.",
    color: "text-accent"
  },
  {
    icon: "fa-bell",
    title: "Real-time Notifications",
    description: "Stay updated with session reminders, psychiatrist updates, and important announcements.",
    color: "text-primary"
  },
  {
    icon: "fa-clipboard-check",
    title: "Progress Assessments",
    description: "Track your mental health journey with regular assessments and personalized insights.",
    color: "text-secondary"
  },
  {
    icon: "fa-lock",
    title: "Secure & Private",
    description: "Your data is encrypted and protected. We prioritize your privacy and confidentiality.",
    color: "text-accent"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindBridge</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience comprehensive mental health care with our modern platform designed for your wellbeing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`fas ${feature.icon} text-2xl ${feature.color}`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };
export default Features;
