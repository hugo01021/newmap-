"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/client";
import { proposeChange } from "@/lib/services/ai";
import type { AiProposal, ServerSpec } from "@/lib/types";
import { AiResponseCard } from "@/components/ui/AiResponseCard";
import { Send, Spark } from "@/components/ui/Icons";

type CardState = "idle" | "publishing" | "published" | "cancelled";

interface Message {
  id: string;
  role: "user" | "ai";
  text?: string;
  proposal?: AiProposal;
  state?: CardState;
}

interface PanelChatProps {
  /** La fiche du serveur, donnée à l'IA pour des propositions cohérentes. */
  spec: ServerSpec;
  onPublished: (proposal: AiProposal) => void;
}

/** Zone centrale : discussion avec l'IA de gestion. */
export function PanelChat({ spec, onPublished }: PanelChatProps) {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scroll = () => requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: trimmed }]);
    setThinking(true);
    scroll();
    const proposal = await proposeChange(trimmed, locale, t, spec);
    setMessages((m) => [...m, { id: proposal.id, role: "ai", proposal, state: "idle" }]);
    setThinking(false);
    scroll();
  };

  const setState = (id: string, state: CardState) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, state } : x)));

  const publish = (msg: Message) => {
    if (!msg.proposal) return;
    setState(msg.id, "publishing");
    setTimeout(() => {
      setState(msg.id, "published");
      onPublished(msg.proposal!);
    }, 1400);
  };

  const empty = messages.length === 0;

  return (
    <section className="flex min-h-[560px] flex-col overflow-hidden rounded-card border border-line bg-ink-2/40 lg:h-[calc(100svh-15rem)] lg:min-h-[600px]">
      <header className="flex items-center gap-2.5 border-b border-line px-5 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink">
          <Spark width={14} height={14} />
        </span>
        <span className="label text-muted">{t.panel.chat.label}</span>
      </header>

      <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6 scrollbar-none">
        {empty && (
          <div className="flex h-full flex-col items-start justify-end">
            <h2 className="display text-4xl sm:text-5xl">{t.panel.chat.title}</h2>
            <p className="mt-4 max-w-md text-muted">{t.panel.chat.text}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.panel.chat.suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:border-white/40">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) =>
            m.role === "user" ? (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-[15px] font-medium text-ink">{m.text}</div>
              </motion.div>
            ) : (
              m.proposal && (
                <div key={m.id} className="max-w-[95%]">
                  <AiResponseCard proposal={m.proposal} state={m.state} onPublish={() => publish(m)} onCancel={() => setState(m.id, "cancelled")} />
                </div>
              )
            ),
          )}
        </AnimatePresence>
        {thinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" style={{ animation: `pulse-dot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
              ))}
            </span>
            {t.panel.chat.thinking}
          </motion.div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-line p-3"
      >
        <div className={cn("flex items-end gap-2 rounded-xl border border-line bg-ink-2 p-1.5 transition-colors focus-within:border-white/40")}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder={t.panel.chat.placeholder}
            aria-label={t.panel.chat.aria}
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-muted-2 focus:outline-none"
          />
          <button type="submit" disabled={!input.trim() || thinking} aria-label={t.panel.chat.send} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ink transition-opacity disabled:opacity-30">
            <Send width={16} height={16} />
          </button>
        </div>
      </form>
    </section>
  );
}
