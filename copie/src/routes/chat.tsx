import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Send,
  Plus,
  FileText,
  Image as ImageIcon,
  Video,
  Download,
  ArrowLeft,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { conversations } from "@/lib/mock";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Messages — SkillBridge" },
      { name: "description", content: "Discute avec tes partenaires d'échange de compétences." },
    ],
  }),
  component: Chat,
});

type Msg =
  | { id: string; me: boolean; type: "text"; text: string }
  | { id: string; me: boolean; type: "image"; src: string }
  | { id: string; me: boolean; type: "file"; name: string; size: string };

const initialThread: Msg[] = [
  { id: "1", me: false, type: "text", text: "Salut Jimel ! Prêt pour la session de jeudi ?" },
  { id: "2", me: true, type: "text", text: "Yes carrément 🙌 Je prépare quelques exercices." },
  { id: "3", me: false, type: "image", src: hero3 },
  { id: "4", me: false, type: "text", text: "Voici le support qu'on utilisera 👆" },
  { id: "5", me: true, type: "file", name: "exercices-react.pdf", size: "1.2 Mo" },
  { id: "6", me: false, type: "text", text: "Parfait, on se cale jeudi alors !" },
];

function Chat() {
  const [active, setActive] = useState(conversations[0]);
  const [thread, setThread] = useState<Msg[]>(initialThread);
  const [draft, setDraft] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [mobileThread, setMobileThread] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    setThread((t) => [...t, { id: String(Date.now()), me: true, type: "text", text: draft }]);
    setDraft("");
  };

  return (
    <AppShell footer={false}>
      <div className="mx-auto max-w-7xl px-0 sm:px-6 sm:py-6">
        <div className="flex h-[calc(100vh-9rem)] overflow-hidden border-border bg-card sm:rounded-3xl sm:border sm:shadow-[var(--shadow-card)]">
          {/* Conversations list */}
          <aside
            className={`w-full shrink-0 border-r border-border bg-card sm:w-80 ${
              mobileThread ? "hidden sm:block" : "block"
            }`}
          >
            <div className="border-b border-border p-4">
              <h1 className="text-2xl font-black tracking-tight text-navy">Messages</h1>
            </div>
            <div className="divide-y divide-border overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActive(c);
                    setMobileThread(true);
                  }}
                  className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-cream ${
                    active.id === c.id ? "bg-cream" : ""
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback
                      className="text-sm font-bold text-cream"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-bold text-navy">{c.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange text-[10px] font-bold text-cream">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Thread */}
          <section className={`flex flex-1 flex-col ${mobileThread ? "flex" : "hidden sm:flex"}`}>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <button
                onClick={() => setMobileThread(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream sm:hidden"
              >
                <ArrowLeft className="h-5 w-5 text-navy" />
              </button>
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className="text-sm font-bold text-cream"
                  style={{ backgroundColor: active.color }}
                >
                  {active.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-navy">{active.name}</p>
                <p className="text-xs text-sage">● En ligne</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-light-cream p-4">
              {thread.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.me ? "justify-end" : "justify-start"}`}>
                  {!m.me && (
                    <Avatar className="h-8 w-8 self-end">
                      <AvatarFallback
                        className="text-[10px] font-bold text-cream"
                        style={{ backgroundColor: active.color }}
                      >
                        {active.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] ${m.me ? "items-end" : "items-start"}`}>
                    {m.type === "text" && (
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          m.me
                            ? "rounded-br-sm bg-navy text-cream"
                            : "rounded-bl-sm bg-card text-foreground shadow-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    )}
                    {m.type === "image" && (
                      <img
                        src={m.src}
                        alt="Pièce jointe"
                        width={400}
                        height={400}
                        loading="lazy"
                        className="max-w-[220px] rounded-2xl border border-border object-cover"
                      />
                    )}
                    {m.type === "file" && (
                      <a
                        href="#"
                        className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-orange"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange/12 text-orange">
                          <FileText className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-navy">
                            {m.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{m.size}</span>
                        </span>
                        <Download className="ml-2 h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="border-t border-border bg-card p-3">
              {attachOpen && (
                <div className="mb-2 flex gap-2">
                  {[
                    { icon: FileText, label: "Fichier" },
                    { icon: ImageIcon, label: "Image" },
                    { icon: Video, label: "Vidéo" },
                  ].map((o) => (
                    <button
                      key={o.label}
                      className="inline-flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-orange hover:text-cream"
                    >
                      <o.icon className="h-4 w-4" /> {o.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAttachOpen((o) => !o)}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-transform ${
                    attachOpen ? "rotate-45 bg-navy text-cream" : "bg-cream text-navy"
                  }`}
                  aria-label="Ajouter une pièce jointe"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Écris un message…"
                  className="h-11 flex-1 rounded-full border border-border bg-light-cream px-4 text-sm outline-none focus:border-orange"
                />
                <button
                  onClick={send}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange text-cream transition-colors hover:bg-orange/90"
                  aria-label="Envoyer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
