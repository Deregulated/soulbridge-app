const steps = [
  {
    number: "01",
    icon: "fa-user-plus",
    title: "Create Account",
    description: "Sign up as a client or psychiatrist in minutes with our simple registration process"
  },
  {
    number: "02",
    icon: "fa-search",
    title: "Find Your Match",
    description: "Browse profiles of licensed psychiatrists and find the perfect fit for your needs"
  },
  {
    number: "03",
    icon: "fa-calendar-days",
    title: "Book Session",
    description: "Choose a convenient time slot and book your appointment securely"
  },
  {
    number: "04",
    icon: "fa-comments",
    title: "Start Your Journey",
    description: "Attend sessions, track progress, and work towards better mental health"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started on your mental wellness journey in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-medium">
                    <i className={`fas ${step.icon} text-2xl text-white`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
export default HowItWorks;
