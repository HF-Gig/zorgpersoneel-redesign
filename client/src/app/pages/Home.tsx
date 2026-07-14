import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
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

const tilt = { onMouseMove: onTiltMove, onMouseLeave: onTiltLeave };

const PALETTE = {
  primary: "#1E3A5F",
  accent: "#C8960C",
  tint: "#EEF2F8",
};

/* ─── Intersection-observer hook for scroll-reveal ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // only trigger once
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated counter ─── */
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

/* ════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════ */
function Hero() {
  const words = ["Vind", "direct", "gekwalificeerd", "zorgpersoneel."];
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-10 pb-16 overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-30"
          style={{ background: PALETTE.primary }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
          style={{ background: PALETTE.accent }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">
          {/* Left content */}
          <div>
            <h1
              className="font-display font-black leading-[0.95] tracking-tighter mb-8 pt-18"
              style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 48, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.75,
                    delay: 0.2 + i * 0.1,
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[520px]"
            >
              Wij verbinden zorginstellingen direct met gecertificeerde
              professionals in ouderenzorg, GGZ, gehandicaptenzorg en jeugdzorg
              — snel, betrouwbaar en DUO-geverifieerd.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/spoeddienst-aanvraag"
                className="button2 button2-primary gap-2"
              >
                Spoeddienst aanvragen{" "}
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </Link>
              <Link to="/registreren" className="button2 button2-accent gap-2">
                Ik zoek werk <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.2 }}
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
                  <Ic
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: PALETTE.accent }}
                  />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[380px] xl:w-[440px] flex-shrink-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-12px_rgba(30,58,95,0.3)]">
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

            {/* Floating badge 1 */}
            <motion.div
              className="absolute -top-7 -right-8 glass rounded-2xl p-4 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${PALETTE.primary}18` }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: PALETTE.primary }}
                  />
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

            {/* Floating badge 2 */}
            <motion.div
              className="absolute top-1/3 -right-12 glass rounded-2xl p-3.5 shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${PALETTE.accent}22` }}
                >
                  <Clock
                    className="w-4 h-4"
                    style={{ color: PALETTE.accent }}
                  />
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
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   TICKER
════════════════════════════════════════════════ */
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
    <div
      className="py-4 overflow-hidden flex"
      style={{ background: PALETTE.primary }}
    >
      <div className="flex anim-marquee whitespace-nowrap flex-shrink-0">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-6 mx-8">
            <span className="text-primary-foreground font-medium text-sm tracking-wide">
              {item}
            </span>
            <span
              className="text-primary-foreground/35 text-base"
              style={{ color: PALETTE.accent }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   VIDEO SECTION
════════════════════════════════════════════════ */
function VideoSection() {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} className="py-20 lg:py-28 bg-background w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
              style={{
                background: `${PALETTE.primary}0D`,
                borderColor: `${PALETTE.primary}25`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: PALETTE.primary }}
              />
              <span
                className="font-mono-label text-[10px] tracking-[0.12em] uppercase font-bold"
                style={{ color: PALETTE.primary }}
              >
                Platform in actie
              </span>
            </div>
            <h2
              className="font-display font-black text-foreground leading-[1.1] tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              Elke dag verbinden wij de juiste mensen met de juiste{" "}
              <span className="italic" style={{ color: PALETTE.primary }}>
                zorg.
              </span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Ons innovatieve platform automatiseert de match tussen
              zorginstellingen en gecertificeerde professionals. We controleren
              diploma's via DUO en regelen contracten in seconden, zodat u zich
              kunt richten op wat echt telt: kwalitatieve zorg.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  title: "Direct Match",
                  sub: "Match binnen 15 minuten",
                  color: PALETTE.accent,
                },
                {
                  icon: Shield,
                  title: "DUO Geverifieerd",
                  sub: "100% diploma controle",
                  color: PALETTE.primary,
                },
              ].map(({ icon: Ic, title, sub, color }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Ic className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      {title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative w-full"
          >
            <div
              className="absolute -inset-3 rounded-[32px] blur-2xl opacity-70 pointer-events-none z-0"
              style={{
                background: `linear-gradient(135deg, ${PALETTE.primary}30, ${PALETTE.accent}25)`,
              }}
            />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_30px_70px_-15px_rgba(30,58,95,0.25)] border border-border bg-card">
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

/* ════════════════════════════════════════════════
   VOOR INSTELLINGEN
════════════════════════════════════════════════ */
function VoorInstellingenSection() {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 bg-secondary overflow-hidden w-full"
    >
      {/* Decorative gold accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${PALETTE.accent}, transparent)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
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
              <div
                className="absolute inset-0"
                style={{ background: `${PALETTE.primary}14` }}
              />
            </div>
            <div
              className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full border pointer-events-none"
              style={{ borderColor: `${PALETTE.primary}18` }}
            />
            <motion.div
              className="absolute top-8 -right-6 glass rounded-2xl p-4 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="font-mono-label text-[10px] text-muted-foreground tracking-widest mb-1">
                BESCHIKBAAR
              </p>
              <p
                className="font-display text-2xl font-bold"
                style={{ color: PALETTE.primary }}
              >
                2.000<span className="text-base text-foreground">+</span>
              </p>
              <p className="text-xs text-muted-foreground">Zorgverleners</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span
              className="font-mono-label text-[11px] tracking-[0.16em] uppercase mb-4 block font-bold"
              style={{ color: PALETTE.accent }}
            >
              Voor Instellingen
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Altijd de juiste{" "}
              <span className="italic" style={{ color: PALETTE.primary }}>
                medewerker
              </span>{" "}
              op het juiste moment.
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
                  <CheckCircle
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: PALETTE.accent }}
                  />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/spoeddienst-aanvraag"
              className="inline-flex items-center gap-2 text-primary-foreground px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: PALETTE.primary,
                boxShadow: `0 4px 24px ${PALETTE.primary}30`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#162D4A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  PALETTE.primary;
              }}
            >
              Spoeddienst aanvragen <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   VOOR ZORGVERLENERS
════════════════════════════════════════════════ */
function VoorZorgverleners() {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 bg-background overflow-hidden w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="font-mono-label text-[11px] tracking-[0.16em] uppercase mb-4 block font-bold"
              style={{ color: PALETTE.accent }}
            >
              Voor Zorgverleners
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Werk op uw{" "}
              <span className="italic" style={{ color: PALETTE.primary }}>
                eigen voorwaarden.
              </span>
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
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${PALETTE.primary}12` }}
                  >
                    <Ic
                      className="w-4 h-4"
                      style={{ color: PALETTE.primary }}
                    />
                  </div>
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/registreren"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl border-2"
              style={{
                borderColor: PALETTE.primary,
                color: PALETTE.primary,
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = PALETTE.primary;
                el.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = PALETTE.primary;
              }}
            >
              Aanmelden als zorgprofessional <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
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

/* ════════════════════════════════════════════════
   STATS
════════════════════════════════════════════════ */
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
        <span style={{ color: PALETTE.primary }}>{c}</span>
        <span style={{ color: PALETTE.accent }}>{suf}</span>
      </div>
      <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase font-mono-label">
        {label}
      </p>
    </div>
  );
}

function Stats() {
  const { ref, inView } = useInView(0.2);
  const stats = [
    { val: 500, suf: "+", label: "Instellingen" },
    { val: 15, suf: " min", label: "Responstijd" },
    { val: 98, suf: "%", label: "Tevredenheid" },
    { val: 12, suf: "", label: "Provinciës" },
  ];
  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 border-y border-border w-full"
      style={{ background: PALETTE.primary }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-14">
          <span
            className="font-mono-label text-[11px] tracking-[0.16em] uppercase mb-3 block font-bold"
            style={{ color: PALETTE.accent }}
          >
            Onze Impact
          </span>
          <h2
            className="font-display font-black text-primary-foreground leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Zorgpersoneel.nl in{" "}
            <span className="italic" style={{ color: PALETTE.accent }}>
              cijfers
            </span>
          </h2>
          <p className="text-sm text-primary-foreground/60 max-w-md mx-auto">
            Dagelijks verbinden wij honderden zorginstellingen met
            gekwalificeerde professionals in heel Nederland.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════
   COVERAGE
════════════════════════════════════════════════ */
function CoverageSection() {
  const { ref, inView } = useInView();
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
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-background border-t border-border overflow-hidden w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center relative bg-card/25 border border-border/40 rounded-3xl p-4 lg:p-6 backdrop-blur-sm"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] opacity-20"
                style={{ background: PALETTE.primary }}
              />
            </div>
            <NetherlandsMap
              highlightedProvince={highlightedProvince}
              onProvinceHover={setHighlightedProvince}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span
              className="font-mono-label text-[11px] tracking-[0.16em] uppercase mb-2 block font-bold"
              style={{ color: PALETTE.accent }}
            >
              Landelijke Dekking
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.05] tracking-tight mb-3 lg:mb-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
            >
              Actief in heel{" "}
              <span className="italic" style={{ color: PALETTE.primary }}>
                Nederland.
              </span>
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
                        ? "scale-[1.02] shadow-md"
                        : "bg-card border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                    style={
                      isHovered
                        ? {
                            background: `${PALETTE.primary}0C`,
                            borderColor: `${PALETTE.primary}60`,
                            boxShadow: `0 4px 16px ${PALETTE.primary}15`,
                          }
                        : {}
                    }
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

/* ════════════════════════════════════════════════
   DUAL CTA
════════════════════════════════════════════════ */
function DualCTA() {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-secondary border-t border-border w-full"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-12">
          <h2
            className="font-display font-black text-foreground leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Klaar om te beginnen?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Kies uw pad en ontdek hoe Zorgpersoneel.nl u verder helpt.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              bg: PALETTE.primary,
              title: "Directe spoeddienst aanvragen",
              sub: "Dien een spoedaanvraag in en ontvang direct hulp voor uw zorginstelling binnen 15 minuten.",
              cta: "Spoeddienst aanvragen",
              to: "/spoeddienst-aanvraag",
              textColor: "#FFFFFF",
              iridescenceColor: [0.12, 0.22, 0.38] as [number, number, number],
            },
            {
              bg: "#0D1B2A",
              title: "Ik zoek werk",
              sub: "Meld u aan als zorgverlener en begin direct met het kiezen van uw eigen diensten.",
              cta: "Aanmelden als professional",
              to: "/registreren",
              textColor: "#FFFFFF",
              iridescenceColor: [0.78, 0.59, 0.05] as [number, number, number],
            },
          ].map(
            ({ bg, title, sub, cta, to, textColor, iridescenceColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                className="rounded-3xl p-10 cursor-pointer relative overflow-hidden"
                style={{ background: bg }}
              >
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                  <Iridescence
                    color={iridescenceColor}
                    speed={0.6}
                    amplitude={0.08}
                    mouseReact={true}
                    className="w-full h-full"
                  />
                </div>
                {/* Gold accent line top */}
                <div
                  className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${PALETTE.accent}, transparent)`,
                  }}
                />
                <div className="relative z-10 pointer-events-none">
                  <h3
                    className="font-display text-3xl font-extrabold tracking-tight mb-4"
                    style={{ color: textColor }}
                  >
                    {title}
                  </h3>
                  <p
                    className="leading-relaxed mb-8"
                    style={{ color: `${textColor}B3` }}
                  >
                    {sub}
                  </p>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:shadow-lg pointer-events-auto"
                    style={{
                      background: PALETTE.accent,
                      color: PALETTE.primary,
                    }}
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

/* ════════════════════════════════════════════════
   HOME — Normal vertical scroll, no GSAP pinning
════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Ticker />
      <VideoSection />
      <VoorInstellingenSection />
      <VoorZorgverleners />
      <Stats />
      <CoverageSection />
      <DualCTA />
    </div>
  );
}
