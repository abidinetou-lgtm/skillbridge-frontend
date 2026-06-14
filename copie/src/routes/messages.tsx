import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingDecor from "@/components/FloatingDecor";
import { CONVERSATIONS, type Conversation } from "@/lib/mock-data";
import { Search, Send, Smile, Paperclip } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — SkillBridge" },
      { name: "description", content: "Discute avec tes camarades de SkillBridge." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<Record<string, { from: "me"; text: string; time: string; date: string }[]>>({});

  const list = useMemo(
    () => CONVERSATIONS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const active: Conversation = CONVERSATIONS.find((c) => c.id === activeId)!;
  const messages = [...active.messages, ...(extra[active.id] ?? [])];

  // group by date
  const grouped = messages.reduce<Record<string, typeof messages>>((acc, m) => {
    (acc[m.date] ??= []).push(m);
    return acc;
  }, {});

  const send = () => {
    if (!draft.trim()) return;
    const t = new Date();
    const time = `${t.getHours()}:${t.getMinutes().toString().padStart(2, "0")}`;
    setExtra((e) => ({
      ...e,
      [active.id]: [...(e[active.id] ?? []), { from: "me", text: draft.trim(), time, date: "Aujourd'hui" }],
    }));
    setDraft("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="relative flex-1 overflow-hidden">
        <FloatingDecor variant="ambient" />
        <div className="relative mx-auto h-[calc(100vh-4rem)] max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[var(--border)] md:grid-cols-[320px_1fr]">
            {/* Sidebar conversations */}
            <aside className="flex flex-col border-r border-[var(--border)]">
              <div className="border-b border-[var(--border)] p-4">
                <h2 className="font-display text-xl font-bold">Messages</h2>
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full rounded-full border border-[var(--border)] bg-[var(--cream)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--orange-warm)]"
                  />
                </div>
              </div>
              <ul className="thin-scroll flex-1 overflow-auto">
                {list.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`flex w-full items-center gap-3 border-b border-[var(--border)] p-3 text-left transition ${
                        c.id === activeId ? "bg-[var(--cream)]" : "hover:bg-[var(--cream)]/60"
                      }`}
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-[var(--ink)]"
                        style={{ background: c.color }}
                      >
                        {c.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold">{c.name}</p>
                          <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{c.time}</span>
                        </div>
                        <p className="truncate text-xs text-[var(--muted-foreground)]">{c.preview}</p>
                      </div>
                      {c.unread && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--orange-warm)] px-1.5 text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Conversation */}
            <div className="flex min-h-0 flex-col">
              <header className="flex items-center gap-3 border-b border-[var(--border)] p-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-[var(--ink)]"
                  style={{ background: active.color }}
                >
                  {active.initials}
                </div>
                <div>
                  <p className="font-display text-lg font-bold">{active.name}</p>
                  <p className="text-xs text-[var(--learn)]">En ligne</p>
                </div>
              </header>
              <div className="thin-scroll flex-1 overflow-auto p-5">
                {Object.entries(grouped).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="my-3 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <span className="h-px flex-1 bg-[var(--border)]" />
                      <span>{date}</span>
                      <span className="h-px flex-1 bg-[var(--border)]" />
                    </div>
                    <div className="space-y-2">
                      {msgs.map((m, i) => (
                        <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                              m.from === "me"
                                ? "rounded-br-md bg-[var(--orange-warm)] text-white"
                                : "rounded-bl-md bg-[var(--cream)] text-[var(--ink)]"
                            }`}
                          >
                            <p>{m.text}</p>
                            <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/75" : "text-[var(--muted-foreground)]"}`}>
                              {m.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2 border-t border-[var(--border)] bg-white p-3"
              >
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--orange-warm)]">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Écris ton message..."
                  className="flex-1 rounded-full border border-[var(--border)] bg-[var(--cream)] px-4 py-2.5 text-sm outline-none focus:border-[var(--orange-warm)]"
                />
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--orange-warm)]">
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--orange-warm)] text-white transition hover:bg-[var(--orange-warm-dark)]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
