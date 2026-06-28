import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { getAvailable } from "../lib/availability";

function useInView(threshold = 0.1) {
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
    const step = target / (1500 / 16);
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

export default function BeschikbaarVandaag() {
  const [count, setCount] = useState(0);
  const { ref, v } = useInView();
  const animatedCount = useCounter(count, true);

  useEffect(() => {
    setCount(getAvailable().length);
  }, []);

  return (
    <>
      {/* Hero counter */}
      <section
        ref={ref}
        className="pt-36 pb-20 bg-background overflow-hidden relative border-b border-border"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/7 blur-[60px]" />
          <div className="anim-spin absolute top-1/2 right-1/4 w-64 h-64 rounded-full border border-primary/8 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="font-mono-label text-[11px] tracking-[0.16em] text-primary uppercase mb-6 block">
              Live beschikbaarheid
            </span>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative flex items-center">
                <span className="w-4 h-4 rounded-full bg-green-500 anim-pulse absolute" />
                <span className="w-4 h-4 rounded-full bg-green-500" />
              </div>
              <span
                className="font-display font-black text-foreground"
                style={{ fontSize: "clamp(4rem,10vw,8rem)" }}
              >
                {animatedCount}
              </span>
            </div>

            <h1
              className="font-display font-black text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
            >
              Vandaag <span className="gradient-text italic">beschikbaar</span>{" "}
              voor directe inzet
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Heeft u dringend personeel nodig door ziekte of tekorten? Bekijk
              hieronder welke professionals vandaag direct inzetbaar zijn en
              dien een aanvraag in.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/voor-instellingen"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Personeel nu aanvragen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/portaal"
                className="flex items-center justify-center gap-2 border border-border text-foreground px-8 py-4 rounded-full font-medium hover:border-primary/30 hover:bg-secondary transition-all"
              >
                Beschikbaar stellen als professional
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA bar */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl font-black text-primary-foreground mb-4">
            Klaar om deze professionals in te zetten?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8">
            Dien een aanvraag in en ons team koppelt u binnen 15 minuten aan de
            juiste medewerker.
          </p>
          <Link
            to="/voor-instellingen"
            className="inline-flex items-center gap-2 bg-background text-foreground px-10 py-4 rounded-full font-semibold hover:bg-card hover:shadow-xl transition-all"
          >
            Personeel nu aanvragen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
