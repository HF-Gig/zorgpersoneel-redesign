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
  AlertCircle,
  Shield,
  Clock,
  Users,
} from "lucide-react";

const SPECIALISATIES = [
  "Verpleegkundige",
  "Verzorgende IG",
  "Zorgassistent",
  "Jeugdzorgwerker",
  "Begeleider",
  "MZV Professional",
  "Activiteitenbegeleider",
  "Anders",
];
const INSTELLINGEN = [
  "Verzorgingshuis",
  "GGZ Instelling",
  "Thuiszorgorganisatie",
  "Jeugdzorgorganisatie",
  "Gehandicaptenzorginstelling",
  "Revalidatiecentrum",
  "Anders",
];
const TIJDVAKKEN = [
  "Ochtend (7:00 – 15:00)",
  "Middag (15:00 – 23:00)",
  "Nacht (23:00 – 7:00)",
  "Volledige dag",
  "Flexibel",
];
const URGENTIE = [
  "Normaal (1–3 dagen)",
  "Urgent (binnen 48 uur)",
  "Noodgeval – vandaag",
];

interface FormData {
  naam_instelling: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
  type_instelling: string;
  specialisatie: string;
  aantal: number;
  startdatum: string;
  tijdvak: string;
  urgentie: string;
  informatie: string;
  website: string; // honeypot
}

function StaffingForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const urgentie = watch("urgentie");
  const isNoodgeval = urgentie === "Noodgeval – vandaag" || !urgentie; // Default to warn since this is the emergency page

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
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
        body: JSON.stringify({ ...data, token: turnstileToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Er is iets misgegaan bij het verzenden van de aanvraag.",
        );
      }

      toast.success("Aanvraag verzonden!", {
        description:
          "Uw aanvraag is ontvangen. We nemen binnen 15 minuten contact op.",
      });
      setSubmitted(true);
      reset();
      setTurnstileToken(null);
    } catch (err: any) {
      toast.error("Fout bij verzenden", {
        description:
          err.message ||
          "Kon de aanvraag niet verzenden. Probeer het later opnieuw.",
      });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-3xl p-12 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-3xl font-bold text-foreground mb-4">
          Spoedaanvraag ontvangen!
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
          Uw spoedaanvraag is met de hoogste prioriteit doorgestuurd. Een coördinator neemt binnen 15 minuten telefonisch contact met u op.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setSubmitted(false)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all"
          >
            Nieuwe spoedaanvraag
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-full font-medium hover:bg-secondary transition-all"
          >
            Terug naar home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-2xl"
    >
      {/* Honeypot */}
      <input
        {...register("website")}
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="mb-8 border-b border-border pb-6">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Directe Spoedaanvraag
        </h3>
        <p className="text-muted-foreground text-sm">
          Uw spoedaanvraag wordt direct met hoge prioriteit verzonden naar{" "}
          <strong>info@zorgpersoneel.nl</strong>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8"
      >
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">
            Dringend personeel nodig?
          </p>
          <p className="text-sm text-red-700 mt-0.5">
            Bel ons direct op{" "}
            <a href="tel:0478229003" className="font-bold underline hover:text-red-900">
              0478-229 003
            </a>{" "}
            voor de allersnelste afhandeling van uw aanvraag.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Naam instelling */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Naam instelling <span className="text-primary">*</span>
          </label>
          <input
            {...register("naam_instelling", { required: "Verplicht veld" })}
            className={`zp-input ${errors.naam_instelling ? "error" : ""}`}
            placeholder="Bijv. Verzorgingshuis De Linde"
          />
          {errors.naam_instelling && (
            <p className="text-sm text-red-500 mt-1">
              {errors.naam_instelling.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Contactpersoon <span className="text-primary">*</span>
          </label>
          <input
            {...register("contactpersoon", { required: "Verplicht veld" })}
            className={`zp-input ${errors.contactpersoon ? "error" : ""}`}
            placeholder="Voor- en achternaam"
          />
          {errors.contactpersoon && (
            <p className="text-sm text-red-500 mt-1">
              {errors.contactpersoon.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Type instelling <span className="text-primary">*</span>
          </label>
          <select
            {...register("type_instelling", { required: "Verplicht veld" })}
            className={`zp-input ${errors.type_instelling ? "error" : ""}`}
          >
            <option value="">Selecteer type</option>
            {INSTELLINGEN.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {errors.type_instelling && (
            <p className="text-sm text-red-500 mt-1">
              {errors.type_instelling.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            E-mailadres <span className="text-primary">*</span>
          </label>
          <input
            {...register("email", {
              required: "Verplicht veld",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ongeldig e-mailadres",
              },
            })}
            type="email"
            className={`zp-input ${errors.email ? "error" : ""}`}
            placeholder="naam@instelling.nl"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Telefoonnummer <span className="text-primary">*</span>
          </label>
          <input
            {...register("telefoon", { required: "Verplicht veld" })}
            type="tel"
            className={`zp-input ${errors.telefoon ? "error" : ""}`}
            placeholder="+31 6 12345678"
          />
          {errors.telefoon && (
            <p className="text-sm text-red-500 mt-1">
              {errors.telefoon.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Gewenste specialisatie <span className="text-primary">*</span>
          </label>
          <select
            {...register("specialisatie", { required: "Verplicht veld" })}
            className={`zp-input ${errors.specialisatie ? "error" : ""}`}
          >
            <option value="">Selecteer specialisatie</option>
            {SPECIALISATIES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {errors.specialisatie && (
            <p className="text-sm text-red-500 mt-1">
              {errors.specialisatie.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Aantal medewerkers <span className="text-primary">*</span>
          </label>
          <input
            {...register("aantal", {
              required: "Verplicht veld",
              min: { value: 1, message: "Minimaal 1" },
            })}
            type="number"
            min="1"
            className={`zp-input ${errors.aantal ? "error" : ""}`}
            placeholder="1"
          />
          {errors.aantal && (
            <p className="text-sm text-red-500 mt-1">{errors.aantal.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Gewenste startdatum <span className="text-primary">*</span>
          </label>
          <input
            {...register("startdatum", { required: "Verplicht veld" })}
            type="date"
            className={`zp-input ${errors.startdatum ? "error" : ""}`}
          />
          {errors.startdatum && (
            <p className="text-sm text-red-500 mt-1">
              {errors.startdatum.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Tijdvak <span className="text-primary">*</span>
          </label>
          <select
            {...register("tijdvak", { required: "Verplicht veld" })}
            className={`zp-input ${errors.tijdvak ? "error" : ""}`}
          >
            <option value="">Selecteer tijdvak</option>
            {TIJDVAKKEN.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {errors.tijdvak && (
            <p className="text-sm text-red-500 mt-1">
              {errors.tijdvak.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Urgentieniveau <span className="text-primary">*</span>
          </label>
          <select
            {...register("urgentie", { required: "Verplicht veld" })}
            className={`zp-input ${errors.urgentie ? "error" : ""}`}
          >
            <option value="">Selecteer urgentie</option>
            {URGENTIE.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {errors.urgentie && (
            <p className="text-sm text-red-500 mt-1">
              {errors.urgentie.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Aanvullende informatie <span className="text-primary">*</span>
          </label>
          <textarea
            {...register("informatie", { required: "Verplicht veld" })}
            className={`zp-input ${errors.informatie ? "error" : ""}`}
            placeholder="Beschrijf hier uw noodsituatie, specifieke afdeling, of andere vereisten..."
          />
          {errors.informatie && (
            <p className="text-sm text-red-500 mt-1">
              {errors.informatie.message}
            </p>
          )}
        </div>
      </div>

      {/* Spam protection */}
      <div className="mt-6 flex justify-end">
        <Turnstile
          siteKey={(import.meta as any).env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-sm">
          Door dit formulier in te dienen gaat u akkoord met onze
          privacyverklaring. Uw spoedaanvraag wordt direct in behandeling genomen.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />{" "}
              Verzenden...
            </>
          ) : (
            <>
              Spoedaanvraag indienen <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function SpoeddienstAanvraag() {
  return (
    <>
      <section className="pt-36 pb-20 bg-background overflow-hidden relative border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-[60px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-red-500 uppercase mb-4 block font-bold">
              Directe Spoedhulp
            </span>
            <h1
              className="font-display font-black text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
            >
              <BlurText
                text="Spoeddienst"
                delay={100}
                animateBy="words"
                direction="top"
                className="mr-[0.3em]"
              />
              <BlurText
                text="aanvragen."
                delay={100}
                animateBy="words"
                direction="top"
                childClassName="italic text-red-500"
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Heeft u dringend personeel nodig door ziekte of tekorten? Dien direct een spoedaanvraag in. We nemen binnen 15 minuten contact met u op.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StaffingForm />
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Shield,
                title: "100% Geverifieerd",
                body: "Al onze zorgprofessionals zijn geaccrediteerd en DUO-geverifieerd.",
              },
              {
                icon: Clock,
                title: "Binnen 15 Minuten",
                body: "Gemiddeld binnen 15 minuten een passende match voor uw dienst.",
              },
              {
                icon: Users,
                title: "24/7 Bereikbaar",
                body: "Onze spoeddienst is dag en nacht bereikbaar voor noodgevallen.",
              },
            ].map(({ icon: Ic, title, body }) => (
              <div key={title} className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Ic className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-2">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
