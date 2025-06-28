
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ResourceFinderCard } from "@/components/dashboard/resource-finder-card";
import { SearchCode } from "lucide-react";

export default function ResourceFinderPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <SearchCode className="mr-3 h-8 w-8 text-primary" />
            AI Resource Finder
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover articles, tutorials, and documentation for any topic.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <ResourceFinderCard />
        </div>
      </div>
    </AppLayout>
  );
}
