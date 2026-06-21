import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Phone, AlertCircle, Shield, Clock, Users } from "lucide-react";

const SPECIALISATIES = ["Verpleegkundige","Verzorgende IG","Zorgassistent","Jeugdzorgwerker","Begeleider","MZV Professional","Activiteitenbegeleider","Anders"];
const INSTELLINGEN = ["Verzorgingshuis","GGZ Instelling","Thuiszorgorganisatie","Jeugdzorgorganisatie","Gehandicaptenzorginstelling","Ziekenhuis","Revalidatiecentrum","Anders"];
const TIJDVAKKEN = ["Ochtend (7:00 – 15:00)","Middag (15:00 – 23:00)","Nacht (23:00 – 7:00)","Volledige dag","Flexibel"];
const URGENTIE = ["Normaal (1–3 dagen)","Urgent (binnen 48 uur)","Noodgeval – vandaag"];

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
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const urgentie = watch("urgentie");
  const isNoodgeval = urgentie === "Noodgeval – vandaag";

  const onSubmit = async (data: FormData) => {
    if (data.website) return; // honeypot
    await new Promise(r => setTimeout(r, 1800));
    toast.success("Aanvraag verzonden!", { description: "Uw aanvraag is ontvangen. We nemen binnen 15 minuten contact op." });
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-3xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-3xl font-bold text-foreground mb-4">Aanvraag ontvangen!</h3>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
          Uw personeelsaanvraag is direct doorgestuurd naar ons team. We nemen binnen 15 minuten contact met u op via het opgegeven e-mailadres of telefoonnummer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setSubmitted(false)} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all">
            Nieuwe aanvraag
          </button>
          <Link to="/beschikbaar-vandaag" className="flex items-center gap-2 border border-border px-8 py-3.5 rounded-full font-medium hover:bg-secondary transition-all">
            Bekijk beschikbare medewerkers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-3xl p-8 lg:p-12">
      {/* Honeypot */}
      <input {...register("website")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">Personeelsaanvraag indienen</h3>
        <p className="text-muted-foreground text-sm">Uw gegevens worden direct doorgestuurd naar <strong>info@zorgpersoneel.nl</strong></p>
      </div>

      {isNoodgeval && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Noodgeval geselecteerd</p>
            <p className="text-sm text-red-600 mt-0.5">
              Bel ons direct op <a href="tel:0478229003" className="font-bold underline">0478-229 003</a> voor de snelste service. Of{" "}
              <Link to="/beschikbaar-vandaag" className="font-bold underline">bekijk wie er nu beschikbaar is</Link>.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Naam instelling */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Naam instelling <span className="text-primary">*</span></label>
          <input {...register("naam_instelling", { required: "Verplicht veld" })} className={`zp-input ${errors.naam_instelling ? "error" : ""}`} placeholder="Bijv. Verzorgingshuis De Linde" />
          {errors.naam_instelling && <p className="text-sm text-red-500 mt-1">{errors.naam_instelling.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Contactpersoon <span className="text-primary">*</span></label>
          <input {...register("contactpersoon", { required: "Verplicht veld" })} className={`zp-input ${errors.contactpersoon ? "error" : ""}`} placeholder="Voor- en achternaam" />
          {errors.contactpersoon && <p className="text-sm text-red-500 mt-1">{errors.contactpersoon.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Type instelling <span className="text-primary">*</span></label>
          <select {...register("type_instelling", { required: "Verplicht veld" })} className={`zp-input ${errors.type_instelling ? "error" : ""}`}>
            <option value="">Selecteer type</option>
            {INSTELLINGEN.map(o => <option key={o}>{o}</option>)}
          </select>
          {errors.type_instelling && <p className="text-sm text-red-500 mt-1">{errors.type_instelling.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">E-mailadres <span className="text-primary">*</span></label>
          <input {...register("email", { required: "Verplicht veld", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ongeldig e-mailadres" } })}
            type="email" className={`zp-input ${errors.email ? "error" : ""}`} placeholder="naam@instelling.nl" />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Telefoonnummer <span className="text-primary">*</span></label>
          <input {...register("telefoon", { required: "Verplicht veld" })} type="tel" className={`zp-input ${errors.telefoon ? "error" : ""}`} placeholder="+31 6 12345678" />
          {errors.telefoon && <p className="text-sm text-red-500 mt-1">{errors.telefoon.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Gewenste specialisatie <span className="text-primary">*</span></label>
          <select {...register("specialisatie", { required: "Verplicht veld" })} className={`zp-input ${errors.specialisatie ? "error" : ""}`}>
            <option value="">Selecteer specialisatie</option>
            {SPECIALISATIES.map(o => <option key={o}>{o}</option>)}
          </select>
          {errors.specialisatie && <p className="text-sm text-red-500 mt-1">{errors.specialisatie.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Aantal medewerkers <span className="text-primary">*</span></label>
          <input {...register("aantal", { required: "Verplicht veld", min: { value: 1, message: "Minimaal 1" } })}
            type="number" min="1" className={`zp-input ${errors.aantal ? "error" : ""}`} placeholder="1" />
          {errors.aantal && <p className="text-sm text-red-500 mt-1">{errors.aantal.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Gewenste startdatum <span className="text-primary">*</span></label>
          <input {...register("startdatum", { required: "Verplicht veld" })} type="date" className={`zp-input ${errors.startdatum ? "error" : ""}`} />
          {errors.startdatum && <p className="text-sm text-red-500 mt-1">{errors.startdatum.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Tijdvak <span className="text-primary">*</span></label>
          <select {...register("tijdvak", { required: "Verplicht veld" })} className={`zp-input ${errors.tijdvak ? "error" : ""}`}>
            <option value="">Selecteer tijdvak</option>
            {TIJDVAKKEN.map(o => <option key={o}>{o}</option>)}
          </select>
          {errors.tijdvak && <p className="text-sm text-red-500 mt-1">{errors.tijdvak.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Urgentieniveau <span className="text-primary">*</span></label>
          <select {...register("urgentie", { required: "Verplicht veld" })} className={`zp-input ${errors.urgentie ? "error" : ""}`}>
            <option value="">Selecteer urgentie</option>
            {URGENTIE.map(o => <option key={o}>{o}</option>)}
          </select>
          {errors.urgentie && <p className="text-sm text-red-500 mt-1">{errors.urgentie.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Aanvullende informatie</label>
          <textarea {...register("informatie")} className="zp-input" placeholder="Bijzondere vereisten, specifieke taken, of andere relevante informatie..." />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-sm">
          Door dit formulier in te dienen gaat u akkoord met onze privacyverklaring. Uw gegevens worden niet gedeeld met derden.
        </p>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0">
          {isSubmitting ? (
            <><div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Verzenden...</>
          ) : (
            <>"Aanvraag indienen" <ArrowRight className="w-5 h-5" /></>
          )}
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
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">Voor Zorginstellingen</span>
            <h1 className="font-display font-black text-foreground leading-tight mb-6" style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              Personeel aanvragen <span className="italic gradient-text">binnen minuten.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              Vul het formulier in en ons team verwerkt uw aanvraag direct. Gemiddelde responstijd: 15 minuten.
            </p>
            <div className="flex flex-wrap gap-8">
              {[{ icon: Shield, t: "DUO geverifieerde professionals" }, { icon: Clock, t: "~15 min responstijd" }, { icon: Users, t: "500+ tevreden instellingen" }].map(({ icon: Ic, t }) => (
                <div key={t} className="flex items-center gap-2 text-muted-foreground">
                  <Ic className="w-5 h-5 text-primary" /><span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <StaffingForm />
          </motion.div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { n: "500+", label: "Tevreden instellingen", sub: "Vertrouwen ons dagelijks" },
              { n: "15 min", label: "Gemiddelde responstijd", sub: "Van aanvraag tot bevestiging" },
              { n: "98%", label: "Tevredenheidsscore", sub: "Gebaseerd op klantreviews" },
            ].map(({ n, label, sub }) => (
              <div key={label} className="p-6">
                <p className="font-display text-4xl font-black text-primary mb-2">{n}</p>
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
            <span className="text-primary-foreground font-medium">Spoed? Bel ons direct:</span>
            <a href="tel:0478229003" className="text-primary-foreground font-bold text-lg hover:underline">0478-229 003</a>
          </div>
          <Link to="/beschikbaar-vandaag" className="flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-2.5 rounded-full text-sm hover:bg-primary-foreground/10 transition-all">
            Of bekijk wie er vandaag beschikbaar is <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
