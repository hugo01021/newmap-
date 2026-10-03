import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stepsList = [
  {
    n: "01",
    title: "Décris",
    text: "Explique ton serveur comme à un ami : l'ambiance, les jobs, le niveau de sérieux. L'IA te pose trois ou quatre questions pour affiner.",
  },
  {
    n: "02",
    title: "L'IA construit",
    text: "Elle assemble la ville, les métiers, l'économie, les véhicules, le Discord et le site. Tu suis la construction en direct.",
  },
  {
    n: "03",
    title: "Lance ton serveur",
    text: "Tu reçois l'adresse de connexion et l'invitation Discord. Tes joueurs arrivent. Tu gères tout depuis ton panel.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line bg-ink" id="comment">
      <div className="container-x py-24 sm:py-32">
        <Reveal>
          <SectionHeading tag="Comment ça marche" title={<>Trois étapes. Zéro technique.</>} />
        </Reveal>
        <ol className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:mt-20 md:grid-cols-3">
          {stepsList.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="bg-ink p-7 sm:p-9">
              <li className="flex h-full flex-col">
                <span className="label text-muted">Étape {s.n}</span>
                <h3 className="display mt-10 text-3xl text-white sm:text-4xl">{s.title}</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
