import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Upload, X, Shield, Clock, Heart } from "lucide-react";

const BEROEPEN = ["Verpleegkundige","Verzorgende IG","Zorgassistent","Jeugdzorgwerker","Begeleider","MZV Professional","Activiteitenbegeleider","Huishoudelijke hulp","Anders"];
const PROVINCIES = ["Groningen","Friesland","Drenthe","Overijssel","Flevoland","Gelderland","Utrecht","Noord-Holland","Zuid-Holland","Zeeland","Noord-Brabant","Limburg"];

interface FormData {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  woonplaats: string;
  regio: string;
  beroep: string;
  ervaring: number;
  over_uzelf: string;
  akkoord: boolean;
  website: string; // honeypot
}

function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setCvError("Alleen PDF of DOCX toegestaan");
      setCvFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvError("Bestand mag maximaal 10MB zijn");
      setCvFile(null);
      return;
    }
    setCvError("");
    setCvFile(file);
  }

  const onSubmit = async (data: FormData) => {
    if (data.website) return;
    if (!cvFile) { setCvError("CV uploaden is verplicht"); return; }
    await new Promise(r => setTimeout(r, 2000));
    toast.success("Aanmelding verzonden!", { description: "Uw aanmelding inclusief CV is ontvangen. We nemen snel contact met u op." });
    setSubmitted(true);
    reset();
    setCvFile(null);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-3xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-3xl font-bold text-foreground mb-4">Aanmelding ontvangen!</h3>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
          Uw aanmelding en CV zijn veilig ontvangen door ons team. We nemen binnen 1-2 werkdagen contact met u op om uw profiel te bespreken.
        </p>
        <div className="bg-secondary rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="font-semibold text-foreground text-sm mb-3">Volgende stappen:</p>
          {["Uw CV wordt beoordeeld door ons team","We plannen een kort intakegesprek in","Na goedkeuring kunt u direct diensten aannemen"].map((s, i) => (
            <div key={i} className="flex items-start gap-2 mt-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
              <span className="text-sm text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setSubmitted(false)} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all mx-auto">
          Nieuwe aanmelding
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-3xl p-8 lg:p-12">
      <input {...register("website")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">Aanmelden als Zorgverlener</h3>
        <p className="text-muted-foreground text-sm">Uw aanmelding wordt direct doorgestuurd naar <strong>info@zorgpersoneel.nl</strong></p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Voornaam <span className="text-primary">*</span></label>
          <input {...register("voornaam", { required: "Verplicht veld" })} className={`zp-input ${errors.voornaam ? "error" : ""}`} placeholder="Uw voornaam" />
          {errors.voornaam && <p className="text-sm text-red-500 mt-1">{errors.voornaam.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Achternaam <span className="text-primary">*</span></label>
          <input {...register("achternaam", { required: "Verplicht veld" })} className={`zp-input ${errors.achternaam ? "error" : ""}`} placeholder="Uw achternaam" />
          {errors.achternaam && <p className="text-sm text-red-500 mt-1">{errors.achternaam.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">E-mailadres <span className="text-primary">*</span></label>
          <input {...register("email", { required: "Verplicht veld", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ongeldig e-mailadres" } })}
            type="email" className={`zp-input ${errors.email ? "error" : ""}`} placeholder="uw@email.nl" />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Telefoonnummer <span className="text-primary">*</span></label>
          <input {...register("telefoon", { required: "Verplicht veld" })} type="tel" className={`zp-input ${errors.telefoon ? "error" : ""}`} placeholder="+31 6 12345678" />
          {errors.telefoon && <p className="text-sm text-red-500 mt-1">{errors.telefoon.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Woonplaats <span className="text-primary">*</span></label>
          <input {...register("woonplaats", { required: "Verplicht veld" })} className={`zp-input ${errors.woonplaats ? "error" : ""}`} placeholder="Uw stad of gemeente" />
          {errors.woonplaats && <p className="text-sm text-red-500 mt-1">{errors.woonplaats.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Regio (provincie) <span className="text-primary">*</span></label>
          <select {...register("regio", { required: "Verplicht veld" })} className={`zp-input ${errors.regio ? "error" : ""}`}>
            <option value="">Selecteer provincie</option>
            {PROVINCIES.map(p => <option key={p}>{p}</option>)}
          </select>
          {errors.regio && <p className="text-sm text-red-500 mt-1">{errors.regio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Beroep / Specialisatie <span className="text-primary">*</span></label>
          <select {...register("beroep", { required: "Verplicht veld" })} className={`zp-input ${errors.beroep ? "error" : ""}`}>
            <option value="">Selecteer beroep</option>
            {BEROEPEN.map(b => <option key={b}>{b}</option>)}
          </select>
          {errors.beroep && <p className="text-sm text-red-500 mt-1">{errors.beroep.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Jaren ervaring <span className="text-primary">*</span></label>
          <input {...register("ervaring", { required: "Verplicht veld", min: { value: 0, message: "Minimaal 0" } })}
            type="number" min="0" className={`zp-input ${errors.ervaring ? "error" : ""}`} placeholder="Bijv. 5" />
          {errors.ervaring && <p className="text-sm text-red-500 mt-1">{errors.ervaring.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Over uzelf <span className="text-muted-foreground font-normal">(optioneel)</span></label>
          <textarea {...register("over_uzelf")} className="zp-input" rows={4}
            placeholder="Vertel kort iets over uw ervaring, motivatie, of voorkeur voor type zorginstelling..." />
        </div>

        {/* CV Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">CV uploaden <span className="text-primary">*</span></label>
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${cvError ? "border-red-400 bg-red-50" : cvFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/3"}`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleFile} />
            {cvFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">{cvFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(cvFile.size / 1024).toFixed(0)} KB · Klik om te wijzigen</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setCvFile(null); }} className="ml-2 p-1 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">Klik om uw CV te uploaden</p>
                <p className="text-sm text-muted-foreground">PDF of DOCX · Maximaal 10MB</p>
              </div>
            )}
          </div>
          {cvError && <p className="text-sm text-red-500 mt-2">{cvError}</p>}
        </div>

        {/* Akkoord */}
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register("akkoord", { required: "U dient akkoord te gaan" })}
              type="checkbox" className="mt-1 w-4 h-4 accent-[#C4643A] cursor-pointer" />
            <span className="text-sm text-foreground/80">
              Ik ga akkoord met de{" "}
              <a href="#" className="text-primary underline hover:text-primary/80">privacyverklaring</a>{" "}
              en geef toestemming voor het verwerken van mijn gegevens ten behoeve van arbeidsbemiddeling. <span className="text-primary">*</span>
            </span>
          </label>
          {errors.akkoord && <p className="text-sm text-red-500 mt-1">{errors.akkoord.message}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-sm">
          Uw CV en gegevens worden uitsluitend gebruikt voor arbeidsbemiddeling. Nooit gedeeld met derden.
        </p>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0">
          {isSubmitting ? (
            <><div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Aanmelding verzenden...</>
          ) : (
            <>Aanmelden als zorgverlener <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </form>
  );
}

export default function Registreren() {
  return (
    <>
      <section className="pt-36 pb-20 bg-secondary overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">Voor Zorgverleners</span>
            <h1 className="font-display font-black text-foreground leading-tight mb-6" style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}>
              Werk op uw <span className="italic gradient-text">eigen voorwaarden.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Meld u aan, upload uw CV en begin direct met het kiezen van diensten die bij u passen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Flexibel rooster", body: "Kies zelf wanneer en hoeveel u werkt. Geen verplichtingen." },
              { icon: Shield, title: "DUO verificatie", body: "Uw diploma's worden officieel geverifieerd via DUO voor maximale geloofwaardigheid." },
              { icon: Heart, title: "Persoonlijke begeleiding", body: "Ons team staat voor u klaar met advies en ondersteuning bij vragen." },
            ].map(({ icon: Ic, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Ic className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
            <RegistrationForm />
          </motion.div>
        </div>
      </section>
    </>
  );
}
