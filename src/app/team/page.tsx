import { LandingHeader } from "@/components/landing/header";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";

const teamMembers = [
  { name: "Dr. Evelyn Reed", role: "Founder & CEO", avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg", avatarAiHint: "profile woman" },
  { name: "Alex Chen", role: "Lead AI Engineer", avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg", avatarAiHint: "profile man" },
  { name: "Maria Garcia", role: "Head of UX/UI Design", avatarUrl: "https://randomuser.me/api/portraits/women/76.jpg", avatarAiHint: "profile woman" },
  { name: "David Kim", role: "Senior Full-Stack Developer", avatarUrl: "https://randomuser.me/api/portraits/men/78.jpg", avatarAiHint: "profile man" },
  { name: "Priya Patel", role: "Educational Content Strategist", avatarUrl: "https://randomuser.me/api/portraits/women/79.jpg", avatarAiHint: "profile woman" },
  { name: "Ben Carter", role: "DevOps & Infrastructure Lead", avatarUrl: "https://randomuser.me/api/portraits/men/80.jpg", avatarAiHint: "profile man" },
];

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingHeader />
      <main className="flex-1 container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Meet the Innovators</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A passionate team of educators, engineers, and designers dedicated to building the future of learning.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.name} 
              className="text-center pt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'backwards' }}
            >
              <CardContent className="flex flex-col items-center">
                <UserAvatar src={member.avatarUrl} fallbackInitials={member.name.charAt(0)} size="lg" className="h-24 w-24 mb-4" aiHint={member.avatarAiHint} />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
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
