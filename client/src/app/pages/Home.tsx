import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useScroll,
} from "motion/react";
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Star,
  Zap,
  Heart,
  AlertCircle,
} from "lucide-react";
import { onTiltMove, onTiltLeave } from "../Root";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import Ballpit from "../components/ui/Ballpit";
import NetherlandsMap from "../components/ui/NetherlandsMap";
import Iridescence from "../components/ui/Iridescence";
import FloatingAvatars from "../components/ui/FloatingAvatars";


const tilt = { onMouseMove: onTiltMove, onMouseLeave: onTiltLeave };

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
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
function Hero() {
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
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-background"
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
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-accent/4 blur-[70px]" />
      </div>

      {/* Interactive 3D Ballpit Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Ballpit
          count={windowWidth < 768 ? 15 : 30}
          colors={[0xab5c9d, 0x2c7ab9, 0xe9d5ff]}
          minSize={0.5}
          maxSize={1.1}
          gravity={0.03}
          friction={0.992}
          followCursor={true}
        />
      </div>

      {/* Floating Healthcare Staff Avatars */}
      <FloatingAvatars />




      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">
          {/* Left */}
          <div>
            <h1
              className="font-display font-black leading-[0.92] tracking-tight mb-8"
              style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 48, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.75,
                    delay: 0.25 + i * 0.08,
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
              transition={{ duration: 0.7, delay: 0.85 }}
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[520px]"
            >
              Wij verbinden zorginstellingen direct met gecertificeerde
              professionals in ouderenzorg, GGZ, gehandicaptenzorg en jeugdzorg
              snel, betrouwbaar en DUO-geverifieerd.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              {/* Button 1 — arrow from left side pointing right */}
              <div className="relative">
                <motion.div
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
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
                        stroke="#ab5c9d"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.7,
                          delay: 1.5,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.path
                        d="M 62 10 L 48 2 M 62 10 L 48 18"
                        stroke="#ab5c9d"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 2.2,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>
                <Link
                  to="/voor-instellingen"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Personeel aanvragen <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Button 2 — arrow from right side pointing left */}
              <div className="relative">
                <motion.div
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.9 }}
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
                        stroke="#2c7ab9"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.7,
                          delay: 1.9,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.path
                        d="M 2 10 L 16 2 M 2 10 L 16 18"
                        stroke="#2c7ab9"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 2.6,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>
                <Link
                  to="/registreren"
                  className="flex items-center gap-2 border border-border bg-card text-foreground px-8 py-4 rounded-full text-base font-medium hover:border-primary/30 hover:bg-secondary transition-all duration-300"
                >
                  Ik zoek werk <ArrowRight className="w-5 h-5 text-primary" />
                </Link>
              </div>
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
                  <Ic className="w-4 h-4 text-primary flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D card scene */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                  src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=880&h=980&fit=crop&auto=format"
                  alt="Therapeut in gesprek met cliënt"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="font-display text-xl font-bold text-primary-foreground leading-snug mb-1">
                    Vandaag professionals beschikbaar
                  </p>
                  <Link
                    to="/beschikbaar-vandaag"
                    className="text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors"
                  >
                    Bekijk wie er beschikbaar is →
                  </Link>
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

// ─── Video Section ────────────────────────────────────────────────────────────
function VideoSection() {
  const { ref, v } = useInView(0.1);

  return (
    <section className="py-20 bg-background">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={v ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(30,20,16,0.25)]"
          style={{ aspectRatio: "16/9" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop&auto=format"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://www.jcterapiainfantil.com/wp-content/uploads/2022/03/Pexels-Videos-2408284.mp4"
              type="video/mp4"
            />
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-foreground/10" />

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
                Zorgpersoneel.nl in actie
              </span>
              <h2
                className="font-display font-black text-primary-foreground leading-tight max-w-3xl"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
              >
                Elke dag verbinden wij de juiste mensen{" "}
                <br className="hidden lg:block" />
                met de juiste{" "}
                <span className="italic gradient-text">zorg.</span>
              </h2>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function VoorInstellingenSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const gridOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [0, 1, 1, 0],
  );
  const leftX = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [-60, 0, 0, -60],
  );
  const leftY = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [60, 0, 0, -60],
  );
  const rightX = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [60, 0, 0, 60],
  );
  const rightY = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [80, 0, 0, -80],
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div
            style={{ opacity: gridOpacity, x: leftX, y: leftY }}
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent" />
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

          <motion.div style={{ opacity: gridOpacity, x: rightX, y: rightY }}>
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Voor Instellingen
            </span>
            <h2
              className="font-display font-black text-foreground leading-[1.0] mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Altijd de juiste{" "}
              <span className="italic gradient-text">medewerker</span> op het
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
              to="/voor-instellingen"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
            >
              Personeel aanvragen <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Voor Zorgverleners section ───────────────────────────────────────────────
function VoorZorgverleners() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const gridOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [0, 1, 1, 0],
  );
  const leftX = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [-60, 0, 0, -60],
  );
  const leftY = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [60, 0, 0, -60],
  );
  const rightX = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [60, 0, 0, 60],
  );
  const rightY = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.75],
    [80, 0, 0, -80],
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-secondary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div style={{ opacity: gridOpacity, x: leftX, y: leftY }}>
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Voor Zorgverleners
            </span>
            <h2
              className="font-display font-black text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Werk op uw{" "}
              <span className="italic gradient-text">eigen voorwaarden.</span>
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
                Aanmelden als zorgverlener <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/beschikbaar-vandaag"
                className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-8 py-4 rounded-full text-base font-medium hover:border-primary/30 transition-all duration-300"
              >
                Beschikbaar vandaag
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: gridOpacity, x: rightX, y: rightY }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
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

// ─── Stats ────────────────────────────────────────────────────────────────────
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

function Stats() {
  const { ref, v } = useInView(0.3);
  const stats = [
    { val: 500, suf: "+", label: "Instellingen" },
    { val: 15, suf: " min", label: "Responstijd" },
    { val: 98, suf: "%", label: "Tevredenheid" },
    { val: 12, suf: "", label: "Provinciës" },
  ];
  return (
    <section className="py-24 bg-background border-y border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} active={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CoverageSection ─────────────────────────────────────────────────────────
function CoverageSection() {
  const [highlightedProvince, setHighlightedProvince] = useState<string | null>(
    null,
  );
  const { ref, v } = useInView(0.15);

  const provinces = [
    { name: "Noord-Holland", stats: "140+ professionals" },
    { name: "Zuid-Holland", stats: "165+ professionals" },
    { name: "Utrecht", stats: "95+ professionals" },
    { name: "Gelderland", stats: "110+ professionals" },
    { name: "Noord-Brabant", stats: "130+ professionals" },
    { name: "Overijssel", stats: "75+ professionals" },
    { name: "Friesland", stats: "50+ professionals" },
    { name: "Groningen", stats: "60+ professionals" },
    { name: "Drenthe", stats: "45+ professionals" },
    { name: "Flevoland", stats: "55+ professionals" },
    { name: "Zeeland", stats: "35+ professionals" },
    { name: "Limburg", stats: "70+ professionals" },
  ];

  return (
    <section
      ref={ref}
      className="py-32 bg-background border-t border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 xl:gap-24 items-center">
          {/* Left: Map Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={v ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center relative bg-card/25 border border-border/40 rounded-3xl p-8 backdrop-blur-sm"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/4 blur-[60px]" />
            </div>
            <NetherlandsMap
              highlightedProvince={highlightedProvince}
              onProvinceHover={setHighlightedProvince}
            />
          </motion.div>

          {/* Right: Text and Province List */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={v ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-4 block">
              Landelijke Dekking
            </span>
            <h2
              className="font-display font-black text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
            >
              Actief in heel{" "}
              <span className="italic gradient-text">Nederland.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Wij verbinden zorginstellingen direct met geverifieerde
              professionals in de jeugdzorg en GGZ. Beweeg uw muis over de kaart
              of de lijst om de dekking per provincie te zien.
            </p>

            {/* Interactive Grid of Provinces */}
            <div className="grid grid-cols-2 gap-3">
              {provinces.map((prov) => {
                const isActive = highlightedProvince === prov.name;
                return (
                  <div
                    key={prov.name}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-primary/8 border-primary shadow-md shadow-primary/5 scale-[1.02]"
                        : "bg-card border-border hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                    onMouseEnter={() => setHighlightedProvince(prov.name)}
                    onMouseLeave={() => setHighlightedProvince(null)}
                  >
                    <p className="font-semibold text-foreground text-sm">
                      {prov.name}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
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

// ─── Dual CTA ─────────────────────────────────────────────────────────────────
function DualCTA() {
  const { ref, v } = useInView();
  return (
    <section className="py-24 bg-background border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              bg: "bg-primary",
              title: "Ik zoek personeel",
              sub: "Dien een aanvraag in en ontvang een gekwalificeerde medewerker binnen 15 minuten.",
              cta: "Personeel aanvragen",
              to: "/voor-instellingen",
              textColor: "text-primary-foreground",
              iridescenceColor: [0.67, 0.36, 0.62], // brand purple
            },
            {
              bg: "bg-secondary",
              title: "Ik zoek werk",
              sub: "Meld u aan als zorgverlener en begin direct met het kiezen van uw eigen diensten.",
              cta: "Aanmelden als professional",
              to: "/registreren",
              textColor: "text-foreground",
              iridescenceColor: [0.17, 0.48, 0.73], // brand blue
            },
          ].map(
            ({ bg, title, sub, cta, to, textColor, iridescenceColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                animate={v ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`${bg} rounded-3xl p-10 cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute inset-0 z-0 pointer-events-none opacity-45">
                  <Iridescence
                    color={iridescenceColor}
                    speed={0.8}
                    amplitude={0.12}
                    mouseReact={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="relative z-10 pointer-events-none">
                  <h3
                    className={`font-display text-3xl font-black ${textColor} mb-4`}
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
  return (
    <>
      <Hero />
      <Ticker />
      <VideoSection />
      <VoorInstellingenSection />
      <VoorZorgverleners />
      <Stats />
      <CoverageSection />
      <DualCTA />
    </>
  );
}
