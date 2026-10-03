"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatEuro } from "@/lib/data/pricing";
import type { ServerSpec } from "@/lib/types";
import { labels } from "@/lib/wizard-store";
import {
  defaultBackups,
  defaultJobs,
  defaultPlayers,
  defaultProperties,
  defaultVehicles,
  type Backup,
  type HistoryItem,
  type JobConfig,
  type PropertyConfig,
  type VehicleConfig,
} from "@/lib/services/panel";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Field";
import { PillButton } from "@/components/ui/PillButton";
import { Tag } from "@/components/ui/Tag";
import { Check, Discord } from "@/components/ui/Icons";

export const tabs = [
  "Vue d'ensemble",
  "Gameplay",
  "Jobs",
  "Véhicules",
  "Immobilier",
  "Économie",
  "Discord",
  "Joueurs",
  "Sauvegardes",
  "Paramètres",
] as const;
export type Tab = (typeof tabs)[number];

function Card({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn("rounded-card border border-line bg-ink-2/40 p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <p className="label text-muted">{title}</p>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-card border border-line bg-ink-2/40 p-5">
      <p className="label text-muted">{label}</p>
      <p className="display mt-3 text-3xl sm:text-4xl">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between gap-4 py-3.5", className)}>{children}</div>;
}

function NumberField({ value, onChange, suffix }: { value: number; onChange: (n: number) => void; suffix: string }) {
  return (
    <div className="flex items-center gap-2">
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="h-9 w-28 text-right tabular-nums" aria-label={suffix} />
      <span className="w-14 text-xs text-muted">{suffix}</span>
    </div>
  );
}

interface PanelTabsProps {
  tab: Tab;
  spec: ServerSpec;
  history: HistoryItem[];
  online: number;
  discordMembers: number;
  onLog: (item: Omit<HistoryItem, "id" | "date">) => void;
}

export function PanelTabContent({ tab, spec, history, online, discordMembers, onLog }: PanelTabsProps) {
  const [jobs, setJobs] = useState<JobConfig[]>(defaultJobs);
  const [vehicles, setVehicles] = useState<VehicleConfig[]>(defaultVehicles);
  const [properties, setProperties] = useState<PropertyConfig[]>(defaultProperties);
  const [backups, setBackups] = useState<Backup[]>(defaultBackups);
  const [gameplay, setGameplay] = useState({ heists: true, gangs: true, housing: true, races: false, permadeath: spec.style === "hardcore", whitelist: spec.options.some((o) => /whitelist/i.test(o)) });
  const [economy, setEconomy] = useState({ startCash: 5000, tax: 8, paycheck: 15, fuel: 1.9 });
  const [settings, setSettings] = useState({ name: spec.name, tagline: spec.tagline, maxPlayers: spec.players, maintenance: false });
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  const flash = (msg: string) => {
    setSavedFlash(msg);
    setTimeout(() => setSavedFlash(null), 1800);
  };

  const toggleJob = (id: string, enabled: boolean) => {
    setJobs((j) => j.map((x) => (x.id === id ? { ...x, enabled } : x)));
    const job = jobs.find((x) => x.id === id);
    onLog({ title: `Job ${job?.name} ${enabled ? "activé" : "désactivé"}`, author: "Toi", area: "Jobs" });
  };

  const saveSalaries = () => {
    onLog({ title: "Salaires mis à jour", author: "Toi", area: "Jobs" });
    flash("Salaires publiés");
  };

  const makeBackup = () => {
    setBackups((b) => [{ id: `b-${Date.now()}`, date: "À l'instant", size: `${410 + b.length * 3} Mo`, type: "manuelle" }, ...b]);
    onLog({ title: "Sauvegarde manuelle créée", author: "Toi", area: "Sauvegardes" });
  };

  switch (tab) {
    case "Vue d'ensemble":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Joueurs connectés" value={`${online} / ${spec.players}`} hint="Pic aujourd'hui : 41" />
            <Stat label="Membres Discord" value={String(discordMembers)} hint="+38 cette semaine" />
            <Stat label="Disponibilité" value="100 %" hint="30 derniers jours" />
            <Stat label="Dernière sauvegarde" value="14:03" hint="Automatique, toutes les heures" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Ta ville">
              <h3 className="display text-3xl">{spec.name}</h3>
              <p className="mt-2 text-sm text-muted">{spec.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Tag tone="ghost">{labels.seriousness[spec.style]}</Tag>
                <Tag tone="ghost">Économie {labels.economy[spec.economy]}</Tag>
                <Tag tone="ghost">{spec.language}</Tag>
              </div>
            </Card>
            <Card title="Dernières modifications">
              <ul className="divide-y divide-line">
                {history.slice(0, 4).map((h) => (
                  <li key={h.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{h.title}</p>
                      <p className="text-xs text-muted">
                        {h.area} · {h.author}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-2">{h.date}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      );

    case "Gameplay":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Activités">
            <div className="divide-y divide-line">
              {(
                [
                  ["heists", "Braquages", "Épicerie, bijouterie, banque"],
                  ["gangs", "Gangs et territoires", `${spec.gangs.join(", ")}`],
                  ["housing", "Immobilier", "Achat et location de logements"],
                  ["races", "Courses illégales", "Points de rendez-vous nocturnes"],
                ] as const
              ).map(([key, label, hint]) => (
                <Row key={key}>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-muted">{hint}</p>
                  </div>
                  <Switch checked={gameplay[key]} onChange={(v) => (setGameplay({ ...gameplay, [key]: v }), onLog({ title: `${label} ${v ? "activé" : "désactivé"}`, author: "Toi", area: "Gameplay" }))} label={label} />
                </Row>
              ))}
            </div>
          </Card>
          <Card title="Règles">
            <div className="divide-y divide-line">
              <Row>
                <div>
                  <p className="font-semibold">Mort permanente</p>
                  <p className="text-xs text-muted">Un personnage tué définitivement est perdu</p>
                </div>
                <Switch checked={gameplay.permadeath} onChange={(v) => setGameplay({ ...gameplay, permadeath: v })} label="Mort permanente" />
              </Row>
              <Row>
                <div>
                  <p className="font-semibold">Whitelist</p>
                  <p className="text-xs text-muted">Candidature obligatoire via Discord</p>
                </div>
                <Switch checked={gameplay.whitelist} onChange={(v) => setGameplay({ ...gameplay, whitelist: v })} label="Whitelist" />
              </Row>
            </div>
          </Card>
        </div>
      );

    case "Jobs":
      return (
        <Card
          title="Jobs et salaires"
          action={
            <PillButton size="sm" onClick={saveSalaries} icon={savedFlash ? <Check width={13} height={13} /> : undefined}>
              {savedFlash ?? "Publier les salaires"}
            </PillButton>
          }
        >
          <div className="divide-y divide-line">
            {jobs.map((job) => (
              <Row key={job.id}>
                <div className="flex items-center gap-4">
                  <Switch checked={job.enabled} onChange={(v) => toggleJob(job.id, v)} label={job.name} />
                  <div>
                    <p className={cn("font-semibold", !job.enabled && "text-muted")}>{job.name}</p>
                    <p className="text-xs text-muted">{job.members} membres</p>
                  </div>
                </div>
                <NumberField value={job.salary} onChange={(n) => setJobs((j) => j.map((x) => (x.id === job.id ? { ...x, salary: n } : x)))} suffix="€ / h" />
              </Row>
            ))}
          </div>
        </Card>
      );

    case "Véhicules":
      return (
        <Card title="Concessionnaire">
          <div className="divide-y divide-line">
            {vehicles.map((v) => (
              <Row key={v.id}>
                <div className="flex items-center gap-4">
                  <Switch checked={v.enabled} onChange={(on) => setVehicles((all) => all.map((x) => (x.id === v.id ? { ...x, enabled: on } : x)))} label={v.name} />
                  <div>
                    <p className={cn("font-semibold", !v.enabled && "text-muted")}>{v.name}</p>
                    <p className="text-xs text-muted">{v.category}</p>
                  </div>
                </div>
                <NumberField value={v.price} onChange={(n) => setVehicles((all) => all.map((x) => (x.id === v.id ? { ...x, price: n } : x)))} suffix="€" />
              </Row>
            ))}
          </div>
        </Card>
      );

    case "Immobilier":
      return (
        <Card title="Logements">
          <div className="hidden grid-cols-12 gap-4 pb-2 text-xs text-muted sm:grid">
            <span className="col-span-6">Logement</span>
            <span className="col-span-3 text-right">Prix d&apos;achat</span>
            <span className="col-span-3 text-right">Loyer / semaine</span>
          </div>
          <div className="divide-y divide-line">
            {properties.map((p) => (
              <div key={p.id} className="grid items-center gap-3 py-3.5 sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-6">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted">{p.zone}</p>
                </div>
                <div className="flex justify-between sm:col-span-3 sm:justify-end">
                  <span className="text-xs text-muted sm:hidden">Achat</span>
                  <NumberField value={p.price} onChange={(n) => setProperties((all) => all.map((x) => (x.id === p.id ? { ...x, price: n } : x)))} suffix="€" />
                </div>
                <div className="flex justify-between sm:col-span-3 sm:justify-end">
                  <span className="text-xs text-muted sm:hidden">Loyer</span>
                  <NumberField value={p.rent} onChange={(n) => setProperties((all) => all.map((x) => (x.id === p.id ? { ...x, rent: n } : x)))} suffix="€ / sem" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      );

    case "Économie":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Réglages">
            <div className="divide-y divide-line">
              <Row>
                <p className="font-semibold">Argent de départ</p>
                <NumberField value={economy.startCash} onChange={(n) => setEconomy({ ...economy, startCash: n })} suffix="€" />
              </Row>
              <Row>
                <p className="font-semibold">Taxe sur les achats</p>
                <NumberField value={economy.tax} onChange={(n) => setEconomy({ ...economy, tax: n })} suffix="%" />
              </Row>
              <Row>
                <p className="font-semibold">Fréquence des paies</p>
                <NumberField value={economy.paycheck} onChange={(n) => setEconomy({ ...economy, paycheck: n })} suffix="min" />
              </Row>
              <Row>
                <p className="font-semibold">Prix du carburant</p>
                <NumberField value={economy.fuel} onChange={(n) => setEconomy({ ...economy, fuel: n })} suffix="€ / L" />
              </Row>
            </div>
          </Card>
          <Card title="Santé de l'économie">
            <p className="display text-3xl">Stable</p>
            <p className="mt-2 text-sm text-muted">
              Masse monétaire : {formatEuro(2_450_000)} · +3 % cette semaine. L&apos;IA ne recommande aucun ajustement.
            </p>
            <div className="mt-5 flex h-24 items-end gap-1">
              {[40, 42, 45, 44, 48, 52, 51, 55, 58, 57, 60, 62, 61, 64].map((v, i) => (
                <span key={i} className="flex-1 rounded-sm bg-white/70" style={{ height: `${v}%` }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-2">Masse monétaire sur 14 jours</p>
          </Card>
        </div>
      );

    case "Discord":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Serveur Discord">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink">
                <Discord width={18} height={18} />
              </span>
              <div>
                <p className="font-semibold">{spec.name}</p>
                <p className="text-xs text-muted">{discordMembers} membres · 24 salons · 11 rôles</p>
              </div>
            </div>
            <div className="mt-5 divide-y divide-line">
              {["Statut du serveur en direct", "Candidatures whitelist", "Annonces automatiques", "Synchronisation des rôles jobs"].map((f) => (
                <Row key={f}>
                  <p className="text-sm font-medium">{f}</p>
                  <Switch checked onChange={() => undefined} label={f} />
                </Row>
              ))}
            </div>
          </Card>
          <Card title="Salons générés">
            <ul className="columns-2 space-y-1.5 text-sm text-white/80">
              {["accueil", "règlement", "annonces", "candidatures", "support", "suggestions", "police", "ems", "mécano", "gangs", "immobilier", "clips", "général", "hors-sujet", "staff", "logs"].map((c) => (
                <li key={c}>#{c}</li>
              ))}
            </ul>
          </Card>
        </div>
      );

    case "Joueurs":
      return (
        <Card title={`Joueurs · ${defaultPlayers.filter((p) => p.status === "en ligne").length} en ligne`}>
          <div className="divide-y divide-line">
            {defaultPlayers.map((p) => (
              <Row key={p.id}>
                <div className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", p.status === "en ligne" ? "bg-white" : "bg-white/20")} />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.job} · {p.playtime} de jeu
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <PillButton size="sm" variant="ghost">
                    Profil
                  </PillButton>
                  <PillButton size="sm" variant="secondary">
                    Avertir
                  </PillButton>
                </div>
              </Row>
            ))}
          </div>
        </Card>
      );

    case "Sauvegardes":
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title="Sauvegardes"
            className="lg:col-span-2"
            action={
              <PillButton size="sm" onClick={makeBackup}>
                Sauvegarder maintenant
              </PillButton>
            }
          >
            <div className="divide-y divide-line">
              {backups.map((b) => (
                <Row key={b.id}>
                  <div>
                    <p className="font-semibold">{b.date}</p>
                    <p className="text-xs text-muted">
                      {b.size} · {b.type}
                    </p>
                  </div>
                  <PillButton size="sm" variant="secondary">
                    Restaurer
                  </PillButton>
                </Row>
              ))}
            </div>
          </Card>
          <Card title="Historique des modifications">
            <ul className="divide-y divide-line">
              {history.map((h) => (
                <li key={h.id} className="py-3 text-sm">
                  <p className="font-medium">{h.title}</p>
                  <p className="text-xs text-muted">
                    {h.date} · {h.author}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      );

    case "Paramètres":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Identité">
            <div className="space-y-4">
              <label className="block">
                <span className="label mb-2 block text-muted">Nom du serveur</span>
                <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="label mb-2 block text-muted">Accroche</span>
                <Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
              </label>
              <label className="block">
                <span className="label mb-2 block text-muted">Joueurs maximum</span>
                <Input type="number" value={settings.maxPlayers} onChange={(e) => setSettings({ ...settings, maxPlayers: Number(e.target.value) as ServerSpec["players"] })} />
              </label>
              <PillButton size="sm" onClick={() => (onLog({ title: "Paramètres mis à jour", author: "Toi", area: "Paramètres" }), flash("Enregistré"))}>
                {savedFlash ?? "Enregistrer"}
              </PillButton>
            </div>
          </Card>
          <div className="space-y-4">
            <Card title="Maintenance">
              <Row className="py-0">
                <div>
                  <p className="font-semibold">Mode maintenance</p>
                  <p className="text-xs text-muted">Seul le staff peut se connecter</p>
                </div>
                <Switch checked={settings.maintenance} onChange={(v) => setSettings({ ...settings, maintenance: v })} label="Mode maintenance" />
              </Row>
            </Card>
            <Card title="Abonnement">
              <p className="font-semibold">Offre Pro RP</p>
              <p className="text-xs text-muted">Prochain prélèvement le 3 du mois · {formatEuro(149)}</p>
              <div className="mt-4 flex gap-2">
                <PillButton size="sm" variant="secondary" href="/tarifs">
                  Changer d&apos;offre
                </PillButton>
                <PillButton size="sm" variant="ghost">
                  Résilier
                </PillButton>
              </div>
            </Card>
          </div>
        </div>
      );
  }
}
