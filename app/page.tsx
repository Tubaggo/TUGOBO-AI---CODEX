import Link from "next/link";
import { ArrowRight, Building2, MessageCircleMore, Settings2, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { landingStats } from "@/lib/demo-data";

const featureCards = [
  {
    title: "WhatsApp-style reservation demo",
    description: "Show hotels a familiar guest conversation flow with direct-booking questions, replies, and follow-up prompts.",
    icon: MessageCircleMore,
  },
  {
    title: "Lead capture the team can use",
    description: "Convert a chat into a simple reservation lead summary with guest name, dates, guest count, channel, and follow-up notes.",
    icon: Building2,
  },
  {
    title: "Lightweight business settings",
    description: "Demonstrate how property details, tone, and policies can shape assistant responses without a heavy setup.",
    icon: Settings2,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="surface-grid relative overflow-hidden border-b">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-primary">Tugobo AI</p>
              <p className="text-sm text-muted-foreground">AI reservation assistant for hotels and accommodation businesses</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ghost">
                <Link href="/leads">Leads</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/settings">Business settings</Link>
              </Button>
              <Button asChild>
                <Link href="/demo">Open live demo</Link>
              </Button>
            </div>
          </header>

          <div className="grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-7">
              <Badge variant="outline" className="rounded-full px-4 py-2 text-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Simple, sales-ready MVP
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                  Help hotels see Tugobo AI working in five minutes.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-700">
                  Tugobo AI is an AI reservation assistant for hotels and accommodation businesses.
                  This MVP shows how it handles guest inquiries, collects stay details, and turns a
                  chat into a reservation lead your team can follow up on.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/demo">
                    Launch demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/settings">View settings page</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {landingStats.map((stat) => (
                  <Card key={stat.label} className="bg-card/80 backdrop-blur">
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-2 font-display text-3xl font-semibold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-none bg-slate-950 text-slate-50 shadow-2xl">
              <CardHeader>
                <CardDescription className="text-slate-300">What buyers will see</CardDescription>
                <CardTitle className="text-3xl">A focused product story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <MessageCircleMore className="mt-1 h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="font-medium">Reservation chat simulation</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        A WhatsApp-style conversation shows how Tugobo AI responds to dates, room
                        requests, breakfast, transfer, and refundable-rate questions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="font-medium">Practical hotel handoff</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        The lead panel turns the conversation into a simple, credible handoff a hotel
                        team could act on immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">MVP scope</p>
          <h2 className="font-display text-4xl font-semibold">Only the pieces needed to sell the service</h2>
          <p className="text-muted-foreground">
            No heavy platform surface, no billing complexity, and no advanced analytics. Just a clean
            demo that helps accommodation businesses understand the value quickly.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="bg-card/80">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>1. Guest starts on WhatsApp</CardTitle>
              <CardDescription>
                The guest asks about availability, dates, guest count, and room options in natural language.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Tugobo AI qualifies the request</CardTitle>
              <CardDescription>
                The assistant replies instantly, collects name, dates, and guest details, then answers basic policy questions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Hotel receives the lead</CardTitle>
              <CardDescription>
                The reservation team sees a simple lead with dates, channel, status, and notes ready for follow-up.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
}
