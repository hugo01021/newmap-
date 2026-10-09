"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatEuro, planForPlayers } from "@/lib/data/pricing";
import { formatGameMoney } from "@/lib/format";
import { fmt } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/client";
import type { ServerSpec } from "@/lib/types";
import { defaultPanelData, type Backup, type HistoryItem, type JobConfig, type PropertyConfig, type VehicleConfig } from "@/lib/services/panel";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Field";
import { PillButton } from "@/components/ui/PillButton";
import { Tag } from "@/components/ui/Tag";
import { Check, Discord } from "@/components/ui/Icons";

export const tabs = ["overview", "gameplay", "jobs", "vehicles", "housing", "economy", "discord", "players", "backups", "settings"] as const;
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
  const { t, locale } = useLocale();
  const p = t.panel;
  const areas = p.data.areas;
  const me = p.data.you;
  const money = locale === "fr" ? "€" : "$";
  const [defaults] = useState(() => defaultPanelData(t));
  const [jobs, setJobs] = useState<JobConfig[]>(defaults.jobs);
  const [vehicles, setVehicles] = useState<VehicleConfig[]>(defaults.vehicles);
  const [properties, setProperties] = useState<PropertyConfig[]>(defaults.properties);
  const [backups, setBackups] = useState<Backup[]>(defaults.backups);
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
    onLog({ title: fmt(p.jobs.toggled, { name: job?.name ?? "", state: enabled ? p.gameplay.enabled : p.gameplay.disabled }), author: me, area: areas.jobs });
  };

  const saveSalaries = () => {
    onLog({ title: p.jobs.updated, author: me, area: areas.jobs });
    flash(p.jobs.published);
  };

  const makeBackup = () => {
    setBackups((b) => [{ id: `b-${Date.now()}`, date: p.backups.justNow, size: `${410 + b.length * 3} ${p.backups.unit}`, type: "manual" }, ...b]);
    onLog({ title: p.backups.created, author: me, area: areas.backups });
  };

  switch (tab) {
    case "overview":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label={p.overview.connected} value={`${online} / ${spec.players}`} hint={p.overview.peak} />
            <Stat label={p.overview.members} value={String(discordMembers)} hint={p.overview.membersHint} />
            <Stat label={p.overview.uptime} value="100 %" hint={p.overview.uptimeHint} />
            <Stat label={p.overview.lastBackup} value="14:03" hint={p.overview.lastBackupHint} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title={p.overview.city}>
              <h3 className="display text-3xl">{spec.name}</h3>
              <p className="mt-2 text-sm text-muted">{spec.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Tag tone="ghost">{t.labels.seriousness[spec.style]}</Tag>
                <Tag tone="ghost">
                  {p.overview.economyPrefix} {t.labels.economyLower[spec.economy]}
                </Tag>
                <Tag tone="ghost">{t.recap.languages[spec.language]}</Tag>
              </div>
            </Card>
            <Card title={p.overview.recent}>
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

    case "gameplay":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={p.gameplay.activities}>
            <div className="divide-y divide-line">
              {(
                [
                  ["heists", p.gameplay.heists, p.gameplay.heistsHint],
                  ["gangs", p.gameplay.gangs, spec.gangs.join(", ")],
                  ["housing", p.gameplay.housing, p.gameplay.housingHint],
                  ["races", p.gameplay.races, p.gameplay.racesHint],
                ] as const
              ).map(([key, label, hint]) => (
                <Row key={key}>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-muted">{hint}</p>
                  </div>
                  <Switch
                    checked={gameplay[key]}
                    onChange={(v) => (setGameplay({ ...gameplay, [key]: v }), onLog({ title: `${label} ${v ? p.gameplay.enabled : p.gameplay.disabled}`, author: me, area: areas.gameplay }))}
                    label={label}
                  />
                </Row>
              ))}
            </div>
          </Card>
          <Card title={p.gameplay.rules}>
            <div className="divide-y divide-line">
              <Row>
                <div>
                  <p className="font-semibold">{p.gameplay.permadeath}</p>
                  <p className="text-xs text-muted">{p.gameplay.permadeathHint}</p>
                </div>
                <Switch checked={gameplay.permadeath} onChange={(v) => setGameplay({ ...gameplay, permadeath: v })} label={p.gameplay.permadeath} />
              </Row>
              <Row>
                <div>
                  <p className="font-semibold">{p.gameplay.whitelist}</p>
                  <p className="text-xs text-muted">{p.gameplay.whitelistHint}</p>
                </div>
                <Switch checked={gameplay.whitelist} onChange={(v) => setGameplay({ ...gameplay, whitelist: v })} label={p.gameplay.whitelist} />
              </Row>
            </div>
          </Card>
        </div>
      );

    case "jobs":
      return (
        <Card
          title={p.jobs.title}
          action={
            <PillButton size="sm" onClick={saveSalaries} icon={savedFlash ? <Check width={13} height={13} /> : undefined}>
              {savedFlash ?? p.jobs.publish}
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
                    <p className="text-xs text-muted">{fmt(p.jobs.members, { n: job.members })}</p>
                  </div>
                </div>
                <NumberField value={job.salary} onChange={(n) => setJobs((j) => j.map((x) => (x.id === job.id ? { ...x, salary: n } : x)))} suffix={p.jobs.perHour} />
              </Row>
            ))}
          </div>
        </Card>
      );

    case "vehicles":
      return (
        <Card title={p.vehicles.title}>
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
                <NumberField value={v.price} onChange={(n) => setVehicles((all) => all.map((x) => (x.id === v.id ? { ...x, price: n } : x)))} suffix={money} />
              </Row>
            ))}
          </div>
        </Card>
      );

    case "housing":
      return (
        <Card title={p.housing.title}>
          <div className="hidden grid-cols-12 gap-4 pb-2 text-xs text-muted sm:grid">
            <span className="col-span-6">{p.housing.home}</span>
            <span className="col-span-3 text-right">{p.housing.price}</span>
            <span className="col-span-3 text-right">{p.housing.rent}</span>
          </div>
          <div className="divide-y divide-line">
            {properties.map((prop) => (
              <div key={prop.id} className="grid items-center gap-3 py-3.5 sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-6">
                  <p className="font-semibold">{prop.name}</p>
                  <p className="text-xs text-muted">{prop.zone}</p>
                </div>
                <div className="flex justify-between sm:col-span-3 sm:justify-end">
                  <span className="text-xs text-muted sm:hidden">{p.housing.buy}</span>
                  <NumberField value={prop.price} onChange={(n) => setProperties((all) => all.map((x) => (x.id === prop.id ? { ...x, price: n } : x)))} suffix={money} />
                </div>
                <div className="flex justify-between sm:col-span-3 sm:justify-end">
                  <span className="text-xs text-muted sm:hidden">{p.housing.rentShort}</span>
                  <NumberField value={prop.rent} onChange={(n) => setProperties((all) => all.map((x) => (x.id === prop.id ? { ...x, rent: n } : x)))} suffix={p.housing.perWeek} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      );

    case "economy":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={p.economy.settings}>
            <div className="divide-y divide-line">
              <Row>
                <p className="font-semibold">{p.economy.startCash}</p>
                <NumberField value={economy.startCash} onChange={(n) => setEconomy({ ...economy, startCash: n })} suffix={money} />
              </Row>
              <Row>
                <p className="font-semibold">{p.economy.tax}</p>
                <NumberField value={economy.tax} onChange={(n) => setEconomy({ ...economy, tax: n })} suffix="%" />
              </Row>
              <Row>
                <p className="font-semibold">{p.economy.paycheck}</p>
                <NumberField value={economy.paycheck} onChange={(n) => setEconomy({ ...economy, paycheck: n })} suffix={p.economy.min} />
              </Row>
              <Row>
                <p className="font-semibold">{p.economy.fuel}</p>
                <NumberField value={economy.fuel} onChange={(n) => setEconomy({ ...economy, fuel: n })} suffix={p.economy.perLiter} />
              </Row>
            </div>
          </Card>
          <Card title={p.economy.health}>
            <p className="display text-3xl">{p.economy.stable}</p>
            <p className="mt-2 text-sm text-muted">{fmt(p.economy.healthText, { amount: formatGameMoney(2_450_000, locale) })}</p>
            <div className="mt-5 flex h-24 items-end gap-1">
              {[40, 42, 45, 44, 48, 52, 51, 55, 58, 57, 60, 62, 61, 64].map((v, i) => (
                <span key={i} className="flex-1 rounded-sm bg-white/70" style={{ height: `${v}%` }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-2">{p.economy.chart}</p>
          </Card>
        </div>
      );

    case "discord":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={p.discordTab.server}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink">
                <Discord width={18} height={18} />
              </span>
              <div>
                <p className="font-semibold">{spec.name}</p>
                <p className="text-xs text-muted">{fmt(p.discordTab.stats, { members: discordMembers })}</p>
              </div>
            </div>
            <div className="mt-5 divide-y divide-line">
              {p.discordTab.features.map((f) => (
                <Row key={f}>
                  <p className="text-sm font-medium">{f}</p>
                  <Switch checked onChange={() => undefined} label={f} />
                </Row>
              ))}
            </div>
          </Card>
          <Card title={p.discordTab.channels}>
            <ul className="columns-2 space-y-1.5 text-sm text-white/80">
              {p.discordTab.channelList.map((c) => (
                <li key={c}>#{c}</li>
              ))}
            </ul>
          </Card>
        </div>
      );

    case "players":
      return (
        <Card title={fmt(p.playersTab.title, { n: defaults.players.filter((pl) => pl.status === "online").length })}>
          <div className="divide-y divide-line">
            {defaults.players.map((pl) => (
              <Row key={pl.id}>
                <div className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", pl.status === "online" ? "bg-white" : "bg-white/20")} />
                  <div>
                    <p className="font-semibold">{pl.name}</p>
                    <p className="text-xs text-muted">
                      {pl.job} · {fmt(p.playersTab.playtime, { h: pl.playtime })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <PillButton size="sm" variant="ghost">
                    {p.playersTab.profile}
                  </PillButton>
                  <PillButton size="sm" variant="secondary">
                    {p.playersTab.warn}
                  </PillButton>
                </div>
              </Row>
            ))}
          </div>
        </Card>
      );

    case "backups":
      return (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card
            title={p.backups.title}
            className="lg:col-span-2"
            action={
              <PillButton size="sm" onClick={makeBackup}>
                {p.backups.now}
              </PillButton>
            }
          >
            <div className="divide-y divide-line">
              {backups.map((b) => (
                <Row key={b.id}>
                  <div>
                    <p className="font-semibold">{b.date}</p>
                    <p className="text-xs text-muted">
                      {b.size} · {b.type === "automatic" ? p.backups.automatic : p.backups.manual}
                    </p>
                  </div>
                  <PillButton size="sm" variant="secondary">
                    {p.backups.restore}
                  </PillButton>
                </Row>
              ))}
            </div>
          </Card>
          <Card title={p.backups.history}>
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

    case "settings":
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={p.settings.identity}>
            <div className="space-y-4">
              <label className="block">
                <span className="label mb-2 block text-muted">{p.settings.name}</span>
                <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="label mb-2 block text-muted">{p.settings.tagline}</span>
                <Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
              </label>
              <label className="block">
                <span className="label mb-2 block text-muted">{p.settings.maxPlayers}</span>
                <Input type="number" value={settings.maxPlayers} onChange={(e) => setSettings({ ...settings, maxPlayers: Number(e.target.value) as ServerSpec["players"] })} />
              </label>
              <PillButton size="sm" onClick={() => (onLog({ title: p.settings.updated, author: me, area: areas.settings }), flash(p.settings.saved))}>
                {savedFlash ?? p.settings.save}
              </PillButton>
            </div>
          </Card>
          <div className="space-y-4">
            <Card title={p.settings.maintenance}>
              <Row className="py-0">
                <div>
                  <p className="font-semibold">{p.settings.maintenanceMode}</p>
                  <p className="text-xs text-muted">{p.settings.maintenanceHint}</p>
                </div>
                <Switch checked={settings.maintenance} onChange={(v) => setSettings({ ...settings, maintenance: v })} label={p.settings.maintenanceMode} />
              </Row>
            </Card>
            <Card title={p.settings.subscription}>
              <p className="font-semibold">{fmt(p.settings.offer, { name: t.pricing.plans[planForPlayers(spec.players).id].name })}</p>
              <p className="text-xs text-muted">{fmt(p.settings.nextCharge, { price: formatEuro(planForPlayers(spec.players).monthly, locale) })}</p>
              <div className="mt-4 flex gap-2">
                <PillButton size="sm" variant="secondary" href="/tarifs">
                  {p.settings.changeOffer}
                </PillButton>
                <PillButton size="sm" variant="ghost">
                  {p.settings.cancel}
                </PillButton>
              </div>
            </Card>
          </div>
        </div>
      );
  }
}
