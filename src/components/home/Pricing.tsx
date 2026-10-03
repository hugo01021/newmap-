"use client";

import { cn } from "@/lib/cn";
import { formatEuro, plans, type Plan } from "@/lib/data/pricing";
import type { PlanId } from "@/lib/types";
import { Check } from "@/components/ui/Icons";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

interface PlanCardProps {
  plan: Plan;
  selected?: boolean;
  onSelect?: (id: PlanId) => void;
  href?: string;
  compact?: boolean;
}

export function PlanCard({ plan, selected, onSelect, href, compact }: PlanCardProps) {
  const emphasized = selected ?? plan.highlighted;
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-card border p-7 transition-all duration-300 sm:p-8",
        emphasized ? "border-white bg-ink-2" : "border-line bg-ink-2/40",
        onSelect && "cursor-pointer hover:border-white/50",
      )}
      onClick={onSelect ? () => onSelect(plan.id) : undefined}
      role={onSelect ? "button" : undefined}
      aria-pressed={onSelect ? selected : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => (e.key === "Enter" || e.key === " ") && onSelect(plan.id) : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
        {plan.highlighted && !onSelect && <Tag>Populaire</Tag>}
        {onSelect && selected && <Tag>Sélectionné</Tag>}
      </div>
      <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-8 border-t border-line pt-6">
        <div className="flex items-baseline gap-2">
          {plan.setupPrefix && <span className="text-sm text-muted">{plan.setupPrefix}</span>}
          <span className="display text-4xl sm:text-5xl">{formatEuro(plan.setup)}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">de mise en place</p>
        <p className="mt-4 text-lg font-semibold">
          + {formatEuro(plan.monthly)}
          <span className="text-sm font-normal text-muted"> / mois</span>
        </p>
      </div>

      {!compact && (
        <ul className="mt-8 space-y-3 text-[15px]">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-white/90">
              <Check width={15} height={15} className="mt-1 shrink-0 text-muted" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {href && (
        <div className="mt-auto pt-8">
          <PillButton href={href} variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
            {plan.cta}
          </PillButton>
        </div>
      )}
    </div>
  );
}

export function Pricing({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="border-t border-line bg-ink" id="tarifs">
      <div className="container-x py-24 sm:py-32">
        {withHeading && (
          <Reveal>
            <SectionHeading tag="Tarifs" title="Un prix clair. Un serveur complet." text="Des frais de mise en place pour créer ton serveur, puis un abonnement mensuel pour l'héberger, le surveiller et le faire évoluer." />
          </Reveal>
        )}
        <div className={cn("grid gap-4 lg:grid-cols-3", withHeading && "mt-16")}>
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <PlanCard plan={p} href={`/creer?offre=${p.id}`} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">Prix TTC. Résiliation de l&apos;abonnement en un clic, à tout moment.</p>
      </div>
    </section>
  );
}
