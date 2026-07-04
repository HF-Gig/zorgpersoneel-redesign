import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";
import { onTiltMove, onTiltLeave } from "../Root";
import NetherlandsMap from "../components/ui/NetherlandsMap";
import Iridescence from "../components/ui/Iridescence";

gsap.registerPlugin(ScrollTrigger);

const tilt = { onMouseMove: onTiltMove, onMouseLeave: onTiltLeave };

const PALETTE = {
  primary: "#5B3F94",
  accent: "#2E5CAE",
  tint: "#D9D3F2",
};

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    const step = target / (2000 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target, active]);
  return val;
}

function Hero({ isActive = true }: { isActive?: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(my, { stiffness: 60, damping: 18 });
  const rotY = useSpring(mx, { stiffness: 60, damping: 18 });
  const words = ["Vind", "direct", "gekwalificeerd", "zorgpersoneel."];

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative h-[calc(100vh-136px)] flex items-center pt-2 pb-8 overflow-hidden bg-background"
      onMouseMove={(e) => {
        const { width, height, left, top } = (
          e.currentTarget as HTMLElement
        ).getBoundingClientRect();
        mx.set(((e.clientX - left) / width - 0.5) * 18);
        my.set(-(((e.clientY - top) / height - 0.5) * 18));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[70px]" />
      </div>



      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">
          <div>
            <h1
              className="font-display font-black leading-[0.95] tracking-tighter mb-8"
              style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 48, filter: "blur(4px)" }}
                  animate={
                    isActive
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 48, filter: "blur(4px)" }
                  }
                  transition={{
                    duration: 0.75,
                    delay: isActive ? 0.25 + i * 0.08 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`inline-block mr-[0.22em] ${i === 2 ? "gradient-text italic" : "text-foreground"}`}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: isActive ? 0.85 : 0 }}
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[520px]"
            >
              Wij verbinden zorginstellingen direct met gecertificeerde
              professionals in ouderenzorg, GGZ, gehandicaptenzorg en jeugdzorg
              snel, betrouwbaar en DUO-geverifieerd.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: isActive ? 1.0 : 0 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <div className="relative">
                <motion.div
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: isActive ? 1.5 : 0 }}
                >
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
                      <motion.line
                        x1="2"
                        y1="10"
                        x2="50"
                        y2="10"
                        stroke={PALETTE.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={
                          isActive ? { pathLength: 1 } : { pathLength: 0 }
                        }
                        transition={{
                          duration: 0.7,
                          delay: isActive ? 1.5 : 0,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.path
                        d="M 62 10 L 48 2 M 62 10 L 48 18"
                        stroke={PALETTE.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={
                          isActive ? { pathLength: 1 } : { pathLength: 0 }
                        }
                        transition={{
                          duration: 0.3,
                          delay: isActive ? 2.2 : 0,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>
                <Link
                  to="/spoeddienst-aanvraag"
                  className="button2 button2-primary gap-2"
                >
                  Spoeddienst aanvragen{" "}
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </Link>
              </div>

              <div className="relative">
                <motion.div
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: isActive ? 1.9 : 0 }}
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 3.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  >
                    <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
                      <motion.line
                        x1="62"
                        y1="10"
                        x2="14"
                        y2="10"
                        stroke={PALETTE.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={
                          isActive ? { pathLength: 1 } : { pathLength: 0 }
                        }
                        transition={{
                          duration: 0.7,
                          delay: isActive ? 1.9 : 0,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.path
                        d="M 2 10 L 16 2 M 2 10 L 16 18"
                        stroke={PALETTE.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={
                          isActive ? { pathLength: 1 } : { pathLength: 0 }
                        }
                        transition={{
                          duration: 0.3,
                          delay: isActive ? 2.6 : 0,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>
                <Link
                  to="/registreren"
                  className="button2 button2-accent gap-2"
                >
                  Ik zoek werk <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: isActive ? 1.2 : 0 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { icon: Shield, t: "DUO geverifieerd" },
                { icon: Clock, t: "~15 min responstijd" },
                { icon: Users, t: "500+ instellingen" },
              ].map(({ icon: Ic, t }) => (
                <div
                  key={t}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Ic className="w-4 h-4 text-primary flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{
              duration: 1,
              delay: isActive ? 0.3 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-[380px] xl:w-[440px] flex-shrink-0"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              style={{
                rotateX: rotX,
                rotateY: rotY,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-12px_rgba(30,20,16,0.25)]">
                <img
                  src="/building.png"
                  alt="Zorgpersoneel.nl Hoofdkantoor"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="font-display text-xl font-bold text-primary-foreground leading-snug mb-1">
                    Ons Hoofdkantoor
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    Keizersveld 47D, Venray
                  </p>
                </div>
              </div>

              <motion.div
                className="absolute -top-7 -right-8 glass rounded-2xl p-4 shadow-xl"
                style={{ transform: "translateZ(70px)" }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono-label text-[10px] text-muted-foreground tracking-widest">
                      GEVERIFIEERD
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      DUO · DigiD
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/3 -right-12 glass rounded-2xl p-3.5 shadow-xl"
                style={{ transform: "translateZ(35px)" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.5,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-mono-label text-[10px] text-muted-foreground tracking-widest">
                      RESPONSTIJD
                    </p>
                    <p className="text-sm font-bold text-foreground">~15 min</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [
    "500+ Instellingen",
    "Landelijke Dekking",
    "DUO Geverifieerd",
    "15 Min Responstijd",
    "98% Tevredenheid",
    "iOS & Android App",
    "Ouderenzorg",
    "GGZ",
    "Gehandicaptenzorg",
    "Jeugdzorg",
  ];
  const row = [...items, ...items];
  return (
    <div className="bg-primary py-4 overflow-hidden flex">
      <div className="flex anim-marquee whitespace-nowrap flex-shrink-0">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-6 mx-8">
            <span className="text-primary-foreground font-medium text-sm tracking-wide">
              {item}
            </span>
            <span className="text-primary-foreground/35 text-base">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function VideoSection({ isActive = false }: { isActive?: boolean }) {
  return (
    <section className="py-4 lg:py-6 bg-background w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono-label text-[10px] tracking-[0.12em] text-primary uppercase font-bold">
                Platform in actie
              </span>
            </div>
            <h2
              className="font-display font-black text-foreground leading-[1.1] tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              Elke dag verbinden wij de juiste mensen met de juiste{" "}
              <span className="italic text-primary">zorg.</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Ons innovatieve platform automatiseert de match tussen zorginstellingen en gecertificeerde professionals. We controleren diploma's via DUO en regelen contracten in seconden, zodat u zich kunt richten op wat echt telt: kwalitatieve zorg.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Direct Match</h4>
                  <p className="text-xs text-muted-foreground">Match binnen 15 minuten</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">DUO Geverifieerd</h4>
                  <p className="text-xs text-muted-foreground">100% diploma controle</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full"
          >
            {/* Decorative glow behind video */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[32px] blur-2xl opacity-85 pointer-events-none z-0" />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_30px_70px_-15px_rgba(91,63,148,0.25)] border border-border bg-card">
              <div className="aspect-[16/9] w-full relative">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=920&h=517&fit=crop&auto=format"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="https://www.jcterapiainfantil.com/wp-content/uploads/2022/03/Pexels-Videos-2408284.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VoorInstellingenSection({ isActive = false }: { isActive?: boolean }) {
  return (
    <section className="relative py-12 bg-background overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className="tilt rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
              {...tilt}
            >
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=840&h=720&fit=crop&auto=format"
                alt="Zorgteam overleg"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-primary/12" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full border border-primary/12 pointer-events-none" />
            <motion.div
              className="absolute top-8 -right-6 glass rounded-2xl p-4 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="font-mono-label text-[10px] text-muted-foreground tracking-widest mb-1">
                BESCHIKBAAR
              </p>
              <p className="font-display text-2xl font-bold text-primary">
                2.000<span className="text-base text-foreground">+</span>
              </p>
              <p className="text-xs text-muted-foreground">Zorgverleners</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Voor Instellingen
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Altijd de juiste{" "}
              <span className="italic text-primary">medewerker</span> op het
              juiste moment.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Of u nu een verzorgingshuis, GGZ-instelling of
              thuiszorgorganisatie bent — wij leveren gekwalificeerde
              medewerkers binnen 15 minuten na uw aanvraag.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Directe toegang tot 2.000+ geverifieerde zorgverleners",
                "Vaste, transparante kosten zonder verrassingen",
                "24/7 beschikbaar, ook in het weekend",
                "Landelijke dekking in alle 12 provinciës",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/spoeddienst-aanvraag"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
            >
              Spoeddienst aanvragen <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VoorZorgverleners({ isActive = false }: { isActive?: boolean }) {
  return (
    <section className="relative py-12 bg-secondary overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Voor Zorgverleners
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Werk op uw{" "}
              <span className="italic text-primary">eigen voorwaarden.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Kies uw eigen diensten, bepaal uw werkrooster en word direct
              uitbetaald. Flexibiliteit en eerlijk loon — zo hoort het te zijn.
            </p>
            <ul className="space-y-5 mb-10">
              {[
                { icon: Heart, t: "Flexibel rooster naar eigen keuze" },
                { icon: Shield, t: "Diploma verificatie via DUO" },
                { icon: Users, t: "Persoonlijke begeleiding en ondersteuning" },
                { icon: Zap, t: "Snelle uitbetaling via de app" },
              ].map(({ icon: Ic, t }) => (
                <li key={t} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Ic className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/registreren"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              >
                Aanmelden als zorgprofessional{" "}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className="tilt rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
              {...tilt}
            >
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=720&h=840&fit=crop&auto=format"
                alt="Zorgverlener"
                className="w-full h-[560px] object-cover"
              />
              <div className="absolute inset-0 bg-foreground/8" />
            </div>
            <motion.div
              className="absolute -top-6 -left-6 glass rounded-2xl p-4 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p className="font-mono-label text-[10px] text-muted-foreground tracking-widest uppercase mb-1">
                App beschikbaar
              </p>
              <p className="text-sm font-bold text-foreground">
                iOS &amp; Android
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  val,
  suf,
  label,
  active,
}: {
  val: number;
  suf: string;
  label: string;
  active: boolean;
}) {
  const c = useCounter(val, active);
  return (
    <div className="text-center">
      <div
        className="font-display font-black text-foreground mb-2"
        style={{ fontSize: "clamp(3rem,6vw,5rem)" }}
      >
        {c}
        {suf}
      </div>
      <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase font-mono-label">
        {label}
      </p>
    </div>
  );
}

function Stats({ isActive = false }: { isActive?: boolean }) {
  const stats = [
    { val: 500, suf: "+", label: "Instellingen" },
    { val: 15, suf: " min", label: "Responstijd" },
    { val: 98, suf: "%", label: "Tevredenheid" },
    { val: 12, suf: "", label: "Provinciës" },
  ];
  return (
    <section className="py-16 bg-background border-y border-border w-full flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-12">
          <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-3 block">
            Onze Impact
          </span>
          <h2
            className="font-display font-black text-foreground leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Zorgpersoneel.nl in{" "}
            <span className="italic text-primary">cijfers</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Dagelijks verbinden wij honderden zorginstellingen met
            gekwalificeerde professionals in heel Nederland.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} active={isActive} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverageSection({ isActive = false }: { isActive?: boolean }) {
  const [highlightedProvince, setHighlightedProvince] = useState<string | null>(
    null,
  );

  const provinces = [
    {
      name: "Noord-Holland",
      stats: "Verpleegkundigen, Begeleiders, Verzorgenden",
    },
    {
      name: "Zuid-Holland",
      stats: "MZV Professionals, Verpleegkundigen, Jeugdzorg",
    },
    { name: "Utrecht", stats: "Begeleiders, Verzorgenden IG, Verpleging" },
    { name: "Gelderland", stats: "Jeugdzorgwerkers, Begeleiders, Verpleging" },
    {
      name: "Noord-Brabant",
      stats: "Verpleegkundigen, Verzorgenden IG, Begeleiding",
    },
    { name: "Overijssel", stats: "Verzorgenden IG, Begeleiders, MZV" },
    { name: "Friesland", stats: "Begeleiders, Verpleegkundigen, IG" },
    { name: "Groningen", stats: "Verpleegkundigen, Begeleiders, Jeugd" },
    { name: "Drenthe", stats: "Verzorgenden IG, Begeleiding, Verpleging" },
    { name: "Flevoland", stats: "MZV Professionals, Begeleiders, IG" },
    {
      name: "Zeeland",
      stats: "Verpleegkundigen, Verzorgenden IG, Begeleiding",
    },
    { name: "Limburg", stats: "Begeleiders, Verpleegkundigen, MZV" },
  ];

  return (
    <section className="py-4 lg:py-6 bg-background border-t border-border overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center relative bg-card/25 border border-border/40 rounded-3xl p-4 lg:p-6 backdrop-blur-sm"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[60px]" />
            </div>
            <NetherlandsMap
              highlightedProvince={highlightedProvince}
              onProvinceHover={setHighlightedProvince}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-2 block">
              Landelijke Dekking
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-3 lg:mb-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
            >
              Actief in heel{" "}
              <span className="italic text-accent">Nederland.</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-5 lg:mb-6">
              Wij verbinden zorginstellingen direct met geverifieerde
              professionals in de jeugdzorg en GGZ. Beweeg uw muis over de kaart
              of de lijst om de dekking per provincie te zien.
            </p>

            <div className="grid grid-cols-2 gap-2 lg:gap-2.5">
              {provinces.map((prov) => {
                const isHovered = highlightedProvince === prov.name;
                return (
                  <div
                    key={prov.name}
                    className={`relative p-2.5 lg:p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "bg-primary/8 border-primary shadow-md shadow-primary/5 scale-[1.02]"
                        : "bg-card border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                    onMouseEnter={() => setHighlightedProvince(prov.name)}
                    onMouseLeave={() => setHighlightedProvince(null)}
                  >
                    <p className="font-semibold text-foreground text-xs lg:text-sm">
                      {prov.name}
                    </p>
                    <p className="text-muted-foreground text-[10px] lg:text-[11px] mt-0.5">
                      {prov.stats}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DualCTA({ isActive = false }: { isActive?: boolean }) {
  return (
    <section className="py-16 bg-background border-t border-border w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              bg: "bg-primary",
              title: "Directe spoeddienst aanvragen",
              sub: "Dien een spoedaanvraag in en ontvang direct hulp voor uw zorginstelling binnen 15 minuten.",
              cta: "Spoeddienst aanvragen",
              to: "/spoeddienst-aanvraag",
              textColor: "text-primary-foreground",
              iridescenceColor: [0.36, 0.25, 0.58],
            },
            {
              bg: "bg-foreground",
              title: "Ik zoek werk",
              sub: "Meld u aan als zorgverlener en begin direct met het kiezen van uw eigen diensten.",
              cta: "Aanmelden als professional",
              to: "/registreren",
              textColor: "text-background",
              iridescenceColor: [0.18, 0.36, 0.68],
            },
          ].map(
            ({ bg, title, sub, cta, to, textColor, iridescenceColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.7,
                  delay: isActive ? 0.3 + i * 0.1 : 0,
                }}
                className={`${bg} rounded-3xl p-10 cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
                  <Iridescence
                    color={iridescenceColor}
                    speed={0.6}
                    amplitude={0.08}
                    mouseReact={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="relative z-10 pointer-events-none">
                  <h3
                    className={`font-display text-3xl font-extrabold tracking-tight ${textColor} mb-4`}
                  >
                    {title}
                  </h3>
                  <p className={`${textColor} opacity-70 leading-relaxed mb-8`}>
                    {sub}
                  </p>
                  <Link
                    to={to}
                    className={`inline-flex items-center gap-2 bg-background text-foreground px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-card transition-all hover:shadow-lg pointer-events-auto`}
                  >
                    {cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );

  const addToPanels = (el: HTMLDivElement | null) => {
    if (el && !panelsRef.current.includes(el)) {
      panelsRef.current.push(el);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return;

    let ctx = gsap.context(() => {
      const panels = panelsRef.current;

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          scrub: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.3, max: 0.8 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const currentIdx = Math.round(self.progress * (panels.length - 1));
            setActiveIndex(currentIdx);
            setScrollProgress(self.progress);
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;

        const prevPanel = panels[i - 1];

        if (i === 1) {
          gsap.set(panel, { clipPath: "circle(0% at 50% 50%)" });
          tl.to(panel, {
            clipPath: "circle(150% at 50% 50%)",
            ease: "power2.inOut",
          });
          tl.to(
            prevPanel,
            { scale: 0.9, opacity: 0.3, ease: "power2.inOut" },
            "<",
          );
        } else if (i === 2) {
          gsap.set(panel, {
            xPercent: 100,
            boxShadow: "-20px 0px 50px rgba(0,0,0,0.3)",
          });
          tl.to(panel, { xPercent: 0, ease: "power2.inOut" });
          tl.to(
            prevPanel,
            { xPercent: -30, opacity: 0.2, ease: "power2.inOut" },
            "<",
          );
        } else if (i === 3) {
          gsap.set(panel, {
            yPercent: 100,
            boxShadow: "0px -20px 50px rgba(0,0,0,0.2)",
          });
          tl.to(panel, { yPercent: 0, ease: "power2.inOut" });
          tl.to(
            prevPanel,
            { scale: 0.92, opacity: 0.3, yPercent: -10, ease: "power2.inOut" },
            "<",
          );
        } else if (i === 4) {
          gsap.set(panel, { opacity: 0, scale: 1.1 });
          tl.to(panel, { opacity: 1, scale: 1, ease: "power2.inOut" });
          tl.to(
            prevPanel,
            { scale: 0.95, opacity: 0, ease: "power2.inOut" },
            "<",
          );
        } else if (i === 5) {
          gsap.set(panel, {
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          });
          tl.to(panel, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power2.inOut",
          });
          tl.to(
            prevPanel,
            { xPercent: -15, opacity: 0.4, ease: "power2.inOut" },
            "<",
          );
        } else {
          gsap.set(panel, {
            yPercent: 100,
            boxShadow: "0px -20px 50px rgba(0,0,0,0.2)",
          });
          tl.to(panel, { yPercent: 0, ease: "power2.inOut" });
          tl.to(
            prevPanel,
            { scale: 0.92, opacity: 0.3, yPercent: -10, ease: "power2.inOut" },
            "<",
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
    };
  }, [isLargeScreen]);

  const sections = [
    <div className="w-full h-full flex flex-col justify-between">
      <Hero isActive={!isLargeScreen || activeIndex === 0} />
      <Ticker />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <VideoSection isActive={!isLargeScreen || activeIndex === 1} />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <VoorInstellingenSection isActive={!isLargeScreen || activeIndex === 2} />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <VoorZorgverleners isActive={!isLargeScreen || activeIndex === 3} />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <Stats isActive={!isLargeScreen || activeIndex === 4} />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <CoverageSection isActive={!isLargeScreen || activeIndex === 5} />
    </div>,
    <div className="w-full h-full flex items-center justify-center">
      <DualCTA isActive={!isLargeScreen || activeIndex === 6} />
    </div>,
  ];

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={
          isLargeScreen
            ? "relative w-full h-screen bg-background overflow-hidden"
            : "w-full h-auto bg-background"
        }
      >
        {isLargeScreen && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none">
            <span className="text-[9px] font-bold text-primary mb-2 tracking-widest font-mono">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            {sections.map((_, i) => {
              const isActive = activeIndex === i;
              const isLast = i === sections.length - 1;

              // Calculate progress of the line below this node
              const lineProgress = (() => {
                if (isLast) return 0;
                const segmentSize = 1 / (sections.length - 1);
                const start = i * segmentSize;
                const end = (i + 1) * segmentSize;
                if (scrollProgress >= end) return 100;
                if (scrollProgress <= start) return 0;
                return ((scrollProgress - start) / (end - start)) * 100;
              })();

              return (
                <div key={i} className="flex flex-col items-center">
                  {/* Section Indicator Node */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary scale-110 shadow-[0_0_8px_rgba(91,63,148,0.4)]"
                        : "border-muted-foreground/30 bg-background scale-100"
                    }`}
                  />

                  {/* Connecting Line Segment */}
                  {!isLast && (
                    <div className="w-[1.5px] h-8 bg-muted-foreground/15 relative my-1 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 w-full bg-primary transition-all duration-100 ease-out"
                        style={{ height: `${lineProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <span className="text-[9px] font-bold text-muted-foreground mt-2 tracking-widest font-mono">
              {String(sections.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {sections.map((section, index) => (
          <div
            key={index}
            ref={isLargeScreen ? addToPanels : undefined}
            className={
              isLargeScreen
                ? "absolute inset-0 w-full h-screen overflow-hidden bg-background pt-20"
                : "relative w-full h-auto bg-background pt-20 border-b border-border"
            }
            style={
              isLargeScreen
                ? {
                    zIndex: index + 1,
                    pointerEvents: activeIndex === index ? "auto" : "none",
                  }
                : {
                    pointerEvents: "auto",
                  }
            }
          >
            {section}
          </div>
        ))}
      </div>
    </div>
  );
}
