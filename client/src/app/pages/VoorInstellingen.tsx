import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BlurText from "../components/ui/BlurText";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  Shield,
  Clock,
  Users,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";

interface AppointmentFormData {
  naam_instelling: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
  onderwerp: string;
  bericht: string;
  website: string; // honeypot
}

function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormData>();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const onSubmit = async (data: AppointmentFormData) => {
    if (data.website) return; // honeypot
    if (!turnstileToken) {
      toast.error("Spam protection required", {
        description: "Please complete the Turnstile challenge.",
      });
      return;
    }
    try {
      const apiUrl =
        (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          urgentie: "Informatie/Afspraak aanvraag",
          specialisatie: data.onderwerp,
          informatie: data.bericht,
          startdatum: new Date().toISOString().split("T")[0],
          tijdvak: "N.v.t.",
          aantal: 1,
          type_instelling: "Algemeen",
          token: turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Er is iets misgegaan bij het verzenden van de aanvraag.");
      }

      toast.success("Verzoek verzonden!", {
        description: "We nemen zo snel mogelijk contact met u op.",
      });
      setSubmitted(true);
      reset();
      setTurnstileToken(null);
    } catch (err: any) {
      toast.error("Fout bij verzenden", {
        description: err.message || "Kon het verzoek niet verzenden.",
      });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-3xl p-12 text-center shadow-xl"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-4">
          Bedankt voor uw aanvraag!
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
          We hebben uw verzoek ontvangen. Een van onze adviseurs neemt binnen één werkdag contact met u op om een afspraak in te plannen.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all mx-auto"
        >
          Nieuw bericht sturen
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl"
    >
      <input {...register("website")} type="text" className="hidden" tabIndex={-1} />
      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Neem contact op of boek een afspraak
        </h3>
        <p className="text-muted-foreground text-sm">
          Laat uw gegevens achter en wij bellen of mailen u zo snel mogelijk terug.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Naam instelling / organisatie <span className="text-primary">*</span>
          </label>
          <input
            {...register("naam_instelling", { required: "Verplicht veld" })}
            className={`zp-input ${errors.naam_instelling ? "error" : ""}`}
            placeholder="Bijv. GGZ Noord-Nederland"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Contactpersoon <span className="text-primary">*</span>
          </label>
          <input
            {...register("contactpersoon", { required: "Verplicht veld" })}
            className={`zp-input ${errors.contactpersoon ? "error" : ""}`}
            placeholder="Uw naam"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Onderwerp / Reden <span className="text-primary">*</span>
          </label>
          <select
            {...register("onderwerp", { required: "Verplicht veld" })}
            className={`zp-input ${errors.onderwerp ? "error" : ""}`}
          >
            <option value="">Selecteer optie</option>
            <option value="Terugbelverzoek">Bel mij terug</option>
            <option value="Informatiepakket">Informatiepakket aanvragen</option>
            <option value="Vrijblijvend kennismakingsgesprek">Vrijblijvend gesprek boeken</option>
            <option value="Samenwerkingsmogelijkheden">Samenwerking bespreken</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            E-mailadres <span className="text-primary">*</span>
          </label>
          <input
            {...register("email", { required: "Verplicht veld" })}
            type="email"
            className={`zp-input ${errors.email ? "error" : ""}`}
            placeholder="naam@instelling.nl"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Telefoonnummer <span className="text-primary">*</span>
          </label>
          <input
            {...register("telefoon", { required: "Verplicht veld" })}
            type="tel"
            className={`zp-input ${errors.telefoon ? "error" : ""}`}
            placeholder="Uw telefoonnummer"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Vraag of toelichting <span className="text-primary">*</span>
          </label>
          <textarea
            {...register("bericht", { required: "Verplicht veld" })}
            className={`zp-input ${errors.bericht ? "error" : ""}`}
            placeholder="Laat ons weten hoe we u kunnen helpen..."
            rows={4}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Turnstile
          siteKey={(import.meta as any).env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-sm">
          We reageren doorgaans binnen één werkdag op uw verzoek.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          Verzoek indienen <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </form>
  );
}

export default function VoorInstellingen() {
  return (
    <>
      {/* Page hero */}
      <section className="pt-36 pb-20 bg-background overflow-hidden relative border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/8 blur-[60px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Voor Zorginstellingen
            </span>
            <h1
              className="font-display font-black text-foreground leading-tight mb-6 flex flex-wrap"
              style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
            >
              <BlurText
                text="Kwalitatief zorgpersoneel"
                delay={150}
                animateBy="words"
                direction="top"
                className="mr-[0.3em]"
              />
              <BlurText
                text="wanneer u het nodig heeft."
                delay={150}
                animateBy="words"
                direction="top"
                childClassName="italic gradient-text"
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              Wij leveren gescreende en gekwalificeerde zorgprofessionals voor ad-hoc diensten, tijdelijke projecten en langdurige contracten.
            </p>
            <div className="flex flex-wrap gap-8">
              {[
                { icon: Shield, t: "DUO geverifieerde professionals" },
                { icon: Clock, t: "Snelle bemiddeling" },
                { icon: Users, t: "500+ aangesloten instellingen" },
              ].map(({ icon: Ic, t }) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Ic className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* General Information Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl lg:text-4xl font-black text-foreground mb-6">
                Onze kwaliteitsgarantie &amp; screening
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Kwaliteit en veiligheid in de zorg staan bij ons voorop. Elke zorgprofessional die via ons platform aan de slag gaat, doorloopt een strenge toelatingsprocedure:
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Award,
                    title: "Diploma & BIG-registratie",
                    desc: "Handmatige en automatische verificatie van diploma's via het DUO-register en geldige BIG-registraties.",
                  },
                  {
                    icon: BookOpen,
                    title: "VOG & Referenties",
                    desc: "Verplichte actuele Verklaring Omtrent het Gedrag (VOG) en positieve referentiechecks bij eerdere werkgevers.",
                  },
                  {
                    icon: Calendar,
                    title: "Continue Kwaliteitsmonitoring",
                    desc: "Evaluatie na elke gewerkte dienst om de hoge cliënttevredenheid en professionele standaarden te borgen.",
                  },
                ].map(({ icon: Ic, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Ic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-secondary rounded-3xl p-8 lg:p-12 border border-border"
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Onze Werkgebieden
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Wij voorzien zorginstellingen van gekwalificeerd personeel in diverse specialismen:
              </p>
              <ul className="space-y-3.5">
                {[
                  "Ouderenzorg (VVT) — Verzorgenden IG, Verpleegkundigen en helpenden.",
                  "Geestelijke Gezondheidszorg (GGZ) — Begeleiders en gespecialiseerde verpleging.",
                  "Gehandicaptenzorg (GZ) — Begeleiders met ervaring in intensieve begeleidingsvragen.",
                  "Jeugdzorg — Gekwalificeerde jeugdzorgwerkers en pedagogisch medewerkers.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-foreground/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground mb-6">
                Benieuwd naar de mogelijkheden?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Wilt u meer informatie over tarieven, contractvormen of zoekt u een structurele partner voor uw flexpool? Vul het formulier in voor een vrijblijvend kennismakingsgesprek of informatiepakket.
              </p>
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <p className="font-semibold text-primary text-sm uppercase tracking-wider mb-2">Direct hulp nodig?</p>
                <p className="text-sm text-muted-foreground mb-4">Heeft u een acuut tekort voor vandaag of morgen? Maak dan gebruik van onze spoeddienst.</p>
                <Link
                  to="/spoeddienst-aanvraag"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-sm"
                >
                  Direct spoedaanvraag indienen <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div>
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust statistics */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                n: "500+",
                label: "Tevreden instellingen",
                sub: "Dagelijks partners in zorgcontinuïteit",
              },
              {
                n: "15 min",
                label: "Gemiddelde responstijd",
                sub: "Voor onze spoedhulp aanvragen",
              },
              {
                n: "98%",
                label: "Klanttevredenheid",
                sub: "Gebaseerd op feedback na voltooide diensten",
              },
            ].map(({ n, label, sub }) => (
              <div key={label} className="p-6">
                <p className="font-display text-4xl font-black text-primary mb-2">
                  {n}
                </p>
                <p className="font-semibold text-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency bar */}
      <section className="py-8 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary-foreground" />
            <span className="text-primary-foreground font-medium">
              Spoed? Bel ons direct:
            </span>
            <a
              href="tel:0478229003"
              className="text-primary-foreground font-bold text-lg hover:underline"
            >
              0478-229 003
            </a>
          </div>
          <Link
            to="/spoeddienst-aanvraag"
            className="flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-2.5 rounded-full text-sm hover:bg-primary-foreground/10 transition-all"
          >
            Direct Spoedaanvraag Indienen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
