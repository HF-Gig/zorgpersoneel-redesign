import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Upload, X, Shield, Clock, Heart } from "lucide-react";
import BlurText from "../components/ui/BlurText";
import { Turnstile } from "@marsidev/react-turnstile";

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
  
  // Multiple files state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  
  const [cvError, setCvError] = useState("");
  const [diplomaError, setDiplomaError] = useState("");
  const [certificateError, setCertificateError] = useState("");

  const cvInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  function validateAndGetFile(file: File | undefined, allowedTypes: string[], maxMb = 10): { error: string; file: File | null } {
    if (!file) return { error: "", file: null };
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      return { error: "Alleen PDF of DOCX toegestaan", file: null };
    }
    if (file.size > maxMb * 1024 * 1024) {
      return { error: `Bestand mag maximaal ${maxMb}MB zijn`, file: null };
    }
    return { error: "", file };
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const result = validateAndGetFile(file, allowed);
    setCvError(result.error);
    setCvFile(result.file);
  }

  function handleDiplomaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const result = validateAndGetFile(file, allowed);
    setDiplomaError(result.error);
    setDiplomaFile(result.file);
  }

  function handleCertificatesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const newFiles: File[] = [];
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const result = validateAndGetFile(files[i], allowed);
      if (result.error) {
        setCertificateError(result.error);
        hasError = true;
        break;
      }
      if (result.file) {
        newFiles.push(result.file);
      }
    }

    if (!hasError) {
      setCertificateError("");
      setCertificateFiles((prev) => [...prev, ...newFiles]);
    }
  }

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = (reader.result as string).split(",")[1];
        resolve(base64Str);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: FormData) => {
    if (data.website) return;
    if (!cvFile) {
      setCvError("CV uploaden is verplicht");
      return;
    }
    if (!diplomaFile) {
      setDiplomaError("Diploma uploaden is verplicht");
      return;
    }
    if (!turnstileToken) {
      toast.error("Spam protection required", {
        description: "Please complete the Turnstile challenge.",
      });
      return;
    }

    try {
      const base64Cv = await getBase64(cvFile);
      const base64Diploma = await getBase64(diplomaFile);
      const certificatesPayload = await Promise.all(
        certificateFiles.map(async (file) => ({
          content: await getBase64(file),
          name: file.name,
        }))
      );

      const payload = {
        ...data,
        token: turnstileToken,
        cv: {
          content: base64Cv,
          name: cvFile.name,
        },
        diploma: {
          content: base64Diploma,
          name: diplomaFile.name,
        },
        certificaten: certificatesPayload,
      };

      const apiUrl =
        (import.meta as any).env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/register-zorgverlener`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Er is iets misgegaan bij het verzenden van uw aanmelding."
        );
      }

      toast.success("Aanmelding verzonden!", {
        description:
          "Uw aanmelding inclusief documenten is ontvangen. We nemen snel contact met u op.",
      });
      setSubmitted(true);
      reset();
      setCvFile(null);
      setDiplomaFile(null);
      setCertificateFiles([]);
      setTurnstileToken(null);
    } catch (err: any) {
      toast.error("Fout bij aanmelden", {
        description:
          err.message || "Kon de aanmelding niet verzenden. Probeer het later opnieuw.",
      });
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-3xl p-12 text-center shadow-xl">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-3xl font-bold text-foreground mb-4">Aanmelding ontvangen!</h3>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
          Uw aanmelding en documenten zijn veilig ontvangen door ons team. We nemen binnen 1-2 werkdagen contact met u op om uw profiel te bespreken.
        </p>
        <div className="bg-secondary rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="font-semibold text-foreground text-sm mb-3">Volgende stappen:</p>
          {["Beoordeling van uw documenten","Persoonlijk kennismakingsgesprek","Welkom bij ons netwerk en starten met diensten"].map((s, i) => (
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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl">
      <input {...register("website")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mb-8 border-b border-border pb-6">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">Aanmelden als Zorgprofessional</h3>
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
          <label className="block text-sm font-semibold text-foreground mb-2">Over uzelf <span className="text-primary">*</span></label>
          <textarea {...register("over_uzelf", { required: "Verplicht veld" })} className={`zp-input ${errors.over_uzelf ? "error" : ""}`} rows={4}
            placeholder="Vertel kort iets over uw ervaring, motivatie, of voorkeur voor type zorginstelling..." />
          {errors.over_uzelf && <p className="text-sm text-red-500 mt-1">{errors.over_uzelf.message}</p>}
        </div>

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">CV uploaden <span className="text-primary">*</span></label>
          <div
            onClick={() => cvInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${cvError ? "border-red-400 bg-red-50" : cvFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/3"}`}
          >
            <input ref={cvInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleCvChange} />
            {cvFile ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-left overflow-hidden">
                  <p className="font-semibold text-foreground text-xs truncate">{cvFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(cvFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setCvFile(null); }} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-foreground text-xs">Klik om CV te uploaden</p>
                <p className="text-[10px] text-muted-foreground">PDF of DOCX</p>
              </div>
            )}
          </div>
          {cvError && <p className="text-xs text-red-500 mt-1">{cvError}</p>}
        </div>

        {/* Diploma Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Diploma uploaden <span className="text-primary">*</span></label>
          <div
            onClick={() => diplomaInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${diplomaError ? "border-red-400 bg-red-50" : diplomaFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/3"}`}
          >
            <input ref={diplomaInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleDiplomaChange} />
            {diplomaFile ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-left overflow-hidden">
                  <p className="font-semibold text-foreground text-xs truncate">{diplomaFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(diplomaFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setDiplomaFile(null); }} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-foreground text-xs">Klik om Diploma te uploaden</p>
                <p className="text-[10px] text-muted-foreground">PDF of DOCX</p>
              </div>
            )}
          </div>
          {diplomaError && <p className="text-xs text-red-500 mt-1">{diplomaError}</p>}
        </div>

        {/* Certificates Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">Certificaten uploaden <span className="text-muted-foreground">(optioneel)</span></label>
          <div
            onClick={() => certInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${certificateError ? "border-red-400 bg-red-50" : "border-border hover:border-primary/40 hover:bg-primary/3"}`}
          >
            <input ref={certInputRef} type="file" accept=".pdf,.docx" multiple className="hidden" onChange={handleCertificatesChange} />
            <div>
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-foreground text-sm">Klik om een of meerdere certificaten te uploaden</p>
              <p className="text-xs text-muted-foreground">PDF of DOCX</p>
            </div>
          </div>
          {certificateError && <p className="text-xs text-red-500 mt-1">{certificateError}</p>}

          {/* List of uploaded certificates */}
          {certificateFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certificateFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground font-semibold truncate">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => setCertificateFiles(prev => prev.filter((_, i) => i !== idx))} className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Akkoord */}
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register("akkoord", { required: "U dient akkoord te gaan" })}
              type="checkbox" className="mt-1 w-4 h-4 accent-[#ab5c9d] cursor-pointer" />
            <span className="text-sm text-foreground/80">
              Ik ga akkoord met de{" "}
              <a href="#" className="text-primary underline hover:text-primary/80">privacyverklaring</a>{" "}
              en geef toestemming voor het verwerken van mijn gegevens ten behoeve van arbeidsbemiddeling. <span className="text-primary">*</span>
            </span>
          </label>
          {errors.akkoord && <p className="text-sm text-red-500 mt-1">{errors.akkoord.message}</p>}
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
          Uw documenten en gegevens worden uitsluitend gebruikt voor arbeidsbemiddeling. Nooit gedeeld met derden.
        </p>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0">
          {isSubmitting ? (
            <><div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Aanmelding verzenden...</>
          ) : (
            <>Aanmelden als zorgprofessional <ArrowRight className="w-5 h-5" /></>
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
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">Voor Zorgprofessionals</span>
            <h1
              className="font-display font-black text-foreground leading-tight mb-6 flex flex-wrap"
              style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
            >
              <BlurText
                text="Werk op uw"
                delay={150}
                animateBy="words"
                direction="top"
                className="mr-[0.3em]"
              />
              <BlurText
                text="eigen voorwaarden."
                delay={150}
                animateBy="words"
                direction="top"
                childClassName="italic gradient-text"
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Meld u aan, upload uw CV, diploma en certificaten en begin direct met het kiezen van diensten die bij u passen.
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
