import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LogIn, LogOut, CheckCircle, Clock, ArrowRight, User, AlertCircle } from "lucide-react";
import { getSession, setSession, clearSession } from "../lib/session";
import { getAvailable, addAvailable, removeAvailable, getByEmail, timeRemaining, type AvailableProfessional } from "../lib/availability";

const BEROEPEN = ["Verpleegkundige","Verzorgende IG","Zorgassistent","Jeugdzorgwerker","Begeleider","MZV Professional","Activiteitenbegeleider","Huishoudelijke hulp","Anders"];

interface LoginForm { email: string; password: string; }
interface AvailForm { profession: string; region: string; experience: number; website: string; }

function LoginPanel({ onLogin }: { onLogin: (email: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    await new Promise(r => setTimeout(r, 1000));
    setSession(data.email);
    onLogin(data.email);
    toast.success("Ingelogd!", { description: `Welkom, ${data.email}` });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
        className="w-full max-w-md">
        <div className="bg-card border border-border rounded-3xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-black text-foreground mb-2">Professioneel Portaal</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Log in om uw beschikbaarheid te beheren en uzelf beschikbaar te stellen voor inzet vandaag.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="text" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">E-mailadres <span className="text-primary">*</span></label>
              <input {...register("email", { required: "Verplicht", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ongeldig e-mailadres" } })}
                type="email" className={`zp-input ${errors.email ? "error" : ""}`} placeholder="uw@email.nl" />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Wachtwoord <span className="text-primary">*</span></label>
              <input {...register("password", { required: "Verplicht", minLength: { value: 6, message: "Minimaal 6 tekens" } })}
                type="password" className={`zp-input ${errors.password ? "error" : ""}`} placeholder="Minimaal 6 tekens" />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60">
              {isSubmitting
                ? <><div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Inloggen...</>
                : <><LogIn className="w-5 h-5" /> Inloggen</>
              }
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary rounded-xl">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Gebruik elk geldig e-mailadres en een wachtwoord van minimaal 6 tekens.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Nog geen account?{" "}
              <Link to="/registreren" className="text-primary font-semibold hover:underline">Meld u hier aan</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Dashboard({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [myEntry, setMyEntry] = useState<AvailableProfessional | undefined>(() => getByEmail(email));
  const [tick, setTick] = useState(0);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AvailForm>();

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMyEntry(getByEmail(email));
  }, [email, tick]);

  const onSubmit = async (data: AvailForm) => {
    if (data.website) return;
    await new Promise(r => setTimeout(r, 1000));
    const entry = addAvailable({ profession: data.profession, region: data.region, experience: Number(data.experience), userEmail: email });
    setMyEntry(entry);
    toast.success("U staat nu als beschikbaar!", { description: "Uw beschikbaarheid verloopt automatisch na 24 uur." });
    reset();
  };

  const handleRemove = () => {
    if (!myEntry) return;
    removeAvailable(myEntry.id);
    setMyEntry(undefined);
    toast.info("Beschikbaarheid verwijderd", { description: "U staat niet langer als beschikbaar geregistreerd." });
  };

  return (
    <div className="py-20 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-2 block">Professioneel Portaal</span>
              <h2 className="font-display text-3xl font-black text-foreground">Mijn Beschikbaarheid</h2>
              <p className="text-muted-foreground text-sm mt-1">{email}</p>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-full hover:bg-secondary transition-all">
              <LogOut className="w-4 h-4" /> Uitloggen
            </button>
          </div>
        </motion.div>

        {/* Status card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {myEntry ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 mb-1">U staat als beschikbaar geregistreerd</p>
                    <div className="space-y-1 text-sm text-green-700">
                      <p><strong>Beroep:</strong> {myEntry.profession}</p>
                      <p><strong>Regio:</strong> {myEntry.region}</p>
                      <p><strong>Ervaring:</strong> {myEntry.experience} jaar</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-mono-label">{timeRemaining(myEntry.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleRemove}
                  className="text-xs text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition-all shrink-0 font-medium">
                  Verwijderen
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-muted border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">U staat momenteel niet als beschikbaar geregistreerd</p>
                  <p className="text-sm text-muted-foreground">Vul het formulier hieronder in om uzelf beschikbaar te stellen voor inzet vandaag.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Mark available form */}
        {!myEntry && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8">
              <input {...register("website")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

              <h3 className="font-display text-xl font-bold text-foreground mb-6">Beschikbaar stellen voor vandaag</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Beroep / Specialisatie <span className="text-primary">*</span></label>
                  <select {...register("profession", { required: "Verplicht veld" })} className={`zp-input ${errors.profession ? "error" : ""}`}>
                    <option value="">Selecteer uw beroep</option>
                    {BEROEPEN.map(b => <option key={b}>{b}</option>)}
                  </select>
                  {errors.profession && <p className="text-sm text-red-500 mt-1">{errors.profession.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Regio / Stad <span className="text-primary">*</span></label>
                  <input {...register("region", { required: "Verplicht veld" })} className={`zp-input ${errors.region ? "error" : ""}`} placeholder="Bijv. Venray, Limburg" />
                  {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Jaren ervaring <span className="text-primary">*</span></label>
                  <input {...register("experience", { required: "Verplicht veld", min: { value: 0, message: "Minimaal 0" } })}
                    type="number" min="0" className={`zp-input ${errors.experience ? "error" : ""}`} placeholder="Bijv. 5" />
                  {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>}
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded-xl text-sm text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-1.5 text-primary" />
                Uw beschikbaarheid verloopt automatisch na <strong>24 uur</strong>. U kunt deze altijd eerder verwijderen.
              </div>

              <button type="submit" disabled={isSubmitting}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60">
                {isSubmitting
                  ? <><div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> Opslaan...</>
                  : <><CheckCircle className="w-5 h-5" /> Ik ben vandaag beschikbaar</>
                }
              </button>
            </form>
          </motion.div>
        )}

        {/* Links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/beschikbaar-vandaag" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-5 py-3 rounded-full hover:bg-secondary transition-all">
            Bekijk alle beschikbare professionals <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/registreren" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-5 py-3 rounded-full hover:bg-secondary transition-all">
            Profiel aanmaken / bijwerken <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function Portaal() {
  const [session, setSessionState] = useState(getSession());

  const handleLogin = (email: string) => {
    setSessionState({ email });
  };

  const handleLogout = () => {
    clearSession();
    setSessionState(null);
    toast.info("Uitgelogd");
  };

  return (
    <>
      <div className="pt-20 bg-background min-h-screen">
        {session
          ? <Dashboard email={session.email} onLogout={handleLogout} />
          : <LoginPanel onLogin={handleLogin} />
        }
      </div>
    </>
  );
}
