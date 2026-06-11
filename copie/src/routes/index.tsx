import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, Search, CalendarCheck, Video, Heart, ArrowRight } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { feedPosts } from "@/lib/mock";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge — Teach what you know. Learn what you love." },
      {
        name: "description",
        content:
          "SkillBridge is a peer-to-peer skill exchange platform where you teach what you know and learn what you love using credits.",
      },
      { property: "og:title", content: "SkillBridge — Peer-to-peer skill exchange" },
      {
        property: "og:description",
        content: "Teach what you know. Learn what you love. Exchange skills with credits.",
      },
    ],
  }),
  component: Home,
});

const heroImages = [hero1, hero2, hero3];

const steps = [
  {
    icon: UserPlus,
    title: "Crée ton profil",
    text: "Ajoute les compétences que tu enseignes et celles que tu veux apprendre.",
  },
  {
    icon: CalendarCheck,
    title: "Trouve & réserve",
    text: "Trouve un membre compatible et réserve un créneau qui vous convient.",
  },
  {
    icon: Video,
    title: "Vis la session",
    text: "Fais la session en visio, les crédits sont calculés automatiquement.",
  },
];

function Home() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroImages.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-4 py-1.5 text-sm font-semibold text-orange">
              Échange de compétences entre pairs
            </span>
            <h1 className="mt-6 text-balance text-5xl font-black leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-7xl">
              Teach what you know.{" "}
              <span className="text-orange">Learn what you love.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-foreground/70">
              Partage ton savoir, apprends ce qui te passionne. Pas d'argent — juste des crédits et
              une communauté qui s'entraide.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/connections">
                  <Search className="h-5 w-5" /> Find someone to learn from
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/profile">Offer my skills</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-foreground/60">
              <div className="flex -space-x-2">
                {["CL", "YB", "SM", "MT"].map((i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-light-cream">
                    <AvatarFallback className="bg-navy text-[10px] font-bold text-cream">
                      {i}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span>+1 200 membres échangent déjà</span>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-cream shadow-[var(--shadow-soft)]">
              {heroImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Illustration d'échange de compétences"
                  width={1024}
                  height={1024}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === idx ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-7 bg-navy" : "w-2 bg-navy/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy py-20 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange">
              Comment ça marche
            </span>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Trois étapes, et c'est parti.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-transform hover:-translate-y-1"
                >
                  <span className="absolute right-6 top-6 text-5xl font-black text-white/10">
                    {i + 1}
                  </span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange text-cream">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-cream/70">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feed preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-orange">
                La communauté
              </span>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-navy">
                Ce qui se passe maintenant
              </h2>
            </div>
            <Button asChild variant="heroOutline">
              <Link to="/connections">
                Découvrir <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {feedPosts.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback
                      className="text-sm font-bold text-cream"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-navy">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.handle}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-foreground/80">{p.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-sage/12 px-3 py-1 text-xs font-semibold text-sage"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-muted-foreground transition-colors hover:text-orange">
                  <Heart className="h-4 w-4" /> {p.likes}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
