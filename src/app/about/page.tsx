import { LandingHeader } from "@/components/landing/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, Users } from "lucide-react";

export default function AboutPage() {
  const cards = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Our Mission",
      description: "To empower students and educators with intelligent tools that make learning more engaging, accessible, and impactful.",
      delay: "200ms"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Our Vision",
      description: "A world where every learner can achieve their full potential through a tailored educational journey, supported by AI.",
      delay: "400ms"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Our Values",
      description: "Innovation, accessibility, integrity, and a lifelong passion for learning are at the core of everything we do.",
      delay: "600ms"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingHeader />
      <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About MindShift</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are revolutionizing education by integrating cutting-edge AI to create personalized and effective learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
             <Card 
              key={index} 
              className="text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl animate-in fade-in zoom-in-95"
              style={{ animationDelay: card.delay, animationFillMode: 'backwards' }}
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                  {card.icon}
                </div>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MindShift. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
