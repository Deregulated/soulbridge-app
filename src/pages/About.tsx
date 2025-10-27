import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindBridge</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Bridging the gap between mental health professionals and those seeking support
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                At MindBridge, we believe that quality mental health care should be accessible, 
                convenient, and tailored to individual needs. Our platform connects clients with 
                licensed psychiatrists, making professional mental health support available at your fingertips.
              </p>
              <p className="text-muted-foreground">
                We're committed to breaking down barriers to mental health care through technology, 
                ensuring that everyone has access to the support they deserve in a safe, confidential environment.
              </p>
            </div>
            
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-strong">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                alt="Team collaboration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compassion First</h3>
              <p className="text-muted-foreground">
                We approach every interaction with empathy and understanding
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-halved text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and protected with industry-leading security
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                Only the most qualified and experienced professionals on our platform
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Why Mental Health Matters</h2>
                <p className="text-muted-foreground mb-4">
                  Mental health is just as important as physical health. It affects how we think, 
                  feel, and act in our daily lives. Good mental health helps us cope with stress, 
                  relate to others, and make healthy choices.
                </p>
                <p className="text-muted-foreground">
                  At MindBridge, we're dedicated to normalizing mental health care and making it 
                  an integral part of overall wellness. Whether you're facing challenges or simply 
                  want to maintain good mental health, we're here to support you.
                </p>
              </div>
              
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&q=80" 
                  alt="Mental wellness" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
export { About };
