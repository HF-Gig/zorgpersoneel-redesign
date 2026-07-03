import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Menu, X, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import GlassSurface from "./components/ui/GlassSurface";
import Lenis from "lenis";

function GlobalStyles() {
  return (
    <style>{`
      @keyframes float-a { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(1.5deg)} 70%{transform:translateY(-6px) rotate(-1deg)} }
      @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes pulse-ring { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }
      @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

      .anim-float-a  { animation: float-a 6s ease-in-out infinite; }
      .anim-float-b  { animation: float-b 8s ease-in-out infinite; }
      .anim-marquee  { animation: marquee 35s linear infinite; }
      .anim-pulse    { animation: pulse-ring 2s ease-out infinite; }
      .anim-spin     { animation: spin-slow 20s linear infinite; }

      ::-webkit-scrollbar { width: 0; }

      .gradient-text {
        background: linear-gradient(130deg, #ab5c9d 0%, #2c7ab9 60%, #ab5c9d 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }
      .glass {
        background: rgba(250,246,239,0.85);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(196,100,58,0.18);
      }
      .tilt { transition: transform 0.18s cubic-bezier(0.23,1,0.32,1), box-shadow 0.18s ease; }

      .grain::after {
        content:'';
        position:fixed;
        inset:0;
        pointer-events:none;
        z-index:9999;
        background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        opacity:0.03;
        mix-blend-mode:multiply;
      }

      /* Form inputs */
      .zp-input {
        width: 100%;
        padding: 0.75rem 1rem;
        background: var(--color-background);
        border: 1.5px solid var(--color-border);
        border-radius: 0.75rem;
        font-size: 0.9375rem;
        color: var(--color-foreground);
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        font-family: 'DM Sans', sans-serif;
      }
      .zp-input:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(196,100,58,0.12);
      }
      .zp-input::placeholder { color: var(--color-muted-foreground); }
      .zp-input.error { border-color: #e53e3e; }
      select.zp-input { cursor: pointer; }
      textarea.zp-input { resize: vertical; min-height: 120px; }
    `}</style>
  );
}

// ─── Tilt helpers ─────────────────────────────────────────────────────────────
export function onTiltMove(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
  el.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(30,20,16,0.12)`;
}
export function onTiltLeave(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = "";
  e.currentTarget.style.boxShadow = "";
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Voor Instellingen", to: "/voor-instellingen" },
  { label: "Voor Zorgprofessionals", to: "/registreren" },
  { label: "Spoeddienst aanvraag", to: "/spoeddienst-aanvraag" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragHover, setDragHover] = useState<string | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/96 backdrop-blur-2xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/logo.png"
            alt="Zorgpersoneel.nl"
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        <div
          ref={containerRef}
          className="hidden lg:flex items-center gap-1 p-1 bg-muted/40 border border-[#aa5c9c] rounded-full backdrop-blur-md"
        >
          {NAV_LINKS.map(({ label, to }) => {
            const isActive = pathname === to;
            const isHighlighted = dragHover ? dragHover === to : isActive;

            return (
              <Link
                key={to}
                to={to}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full whitespace-nowrap select-none ${
                  isHighlighted
                    ? "text-foreground"
                    : "text-[#aa5c9c]/75 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    id="active-pill-id"
                    layoutId="active-nav-pill"
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={containerRef}
                    dragSnapToOrigin={true}
                    dragElastic={0.1}
                    onDrag={(e, info) => {
                      const pill = document.getElementById("active-pill-id");
                      if (pill) pill.style.pointerEvents = "none";
                      const el = document.elementFromPoint(
                        info.point.x,
                        info.point.y,
                      );
                      if (pill) pill.style.pointerEvents = "auto";

                      const targetLink = el?.closest("a");
                      const href = targetLink?.getAttribute("href");
                      if (href) setDragHover(href);
                      else setDragHover(null);
                    }}
                    onDragEnd={(e, info) => {
                      const pill = document.getElementById("active-pill-id");
                      if (pill) pill.style.pointerEvents = "none";
                      const el = document.elementFromPoint(
                        info.point.x,
                        info.point.y,
                      );
                      if (pill) pill.style.pointerEvents = "auto";

                      const targetLink = el?.closest("a");
                      const href = targetLink?.getAttribute("href");
                      setDragHover(null);
                      if (href && href !== pathname) {
                        navigate(href);
                      }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    style={{ zIndex: 0 }}
                  >
                    <GlassSurface
                      width="100%"
                      height="100%"
                      borderRadius={9999}
                      borderWidth={0.06}
                      brightness={45}
                      opacity={0.8}
                      blur={8}
                      displace={4}
                      backgroundOpacity={0.15}
                      saturation={1.4}
                      distortionScale={-80}
                      mixBlendMode="screen"
                      className="absolute inset-0 w-full h-full"
                    />
                  </motion.div>
                )}

                <span className="relative z-10 pointer-events-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* <a
            href="tel:0478229003"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" /> 0478-229 003
          </a> */}
          <Link
            to="/spoeddienst-aanvraag"
            className="button2 button2-primary button2-sm gap-2"
          >
            Spoeddienst aanvragen{" "}
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-border px-6 py-5 space-y-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`block text-base font-medium py-2.5 transition-colors ${
                pathname === to
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border mt-2">
            <Link
              to="/spoeddienst-aanvraag"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold"
            >
              Spoeddienst aanvragen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}

function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="mb-4 block">
              <img
                src="/logo.png"
                alt="Zorgpersoneel.nl"
                className="h-10 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-xs text-sm">
              De toonaangevende matching-partner voor zorgpersoneel in
              Nederland. Snel, betrouwbaar en DUO-geverifieerd.
            </p>
            <div className="space-y-2.5">
              {[
                {
                  icon: Mail,
                  text: "info@zorgpersoneel.nl",
                  href: "mailto:info@zorgpersoneel.nl",
                },
                { icon: Phone, text: "0478-229 003", href: "tel:0478229003" },
                {
                  icon: MapPin,
                  text: "Keizersveld 47D, 5801 AM Venray",
                  href: "#",
                },
              ].map(({ icon: Ic, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Ic className="w-4 h-4 text-primary flex-shrink-0" />
                  {text}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4 text-sm">
              Platform
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4 text-sm">
              Contact
            </p>
            <ul className="space-y-3">
              {[
                "Spoeddienst aanvragen",
                "Aanmelden als professional",
                "Klantenservice",
                "Privacybeleid",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Zorgpersoneel.nl — Alle rechten voorbehouden
          </p>
          <p className="font-mono-label text-xs text-muted-foreground">
            Keizersveld 47D · Venray · Nederland
          </p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/31478229003?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20zorgpersoneel."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#25D366] anim-pulse opacity-20 pointer-events-none" />
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-110 transition-transform duration-200">
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          Chat met ons
        </span>
      </div>
    </a>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Root() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="grain bg-background text-foreground overflow-x-hidden">
      <GlobalStyles />
      <ScrollToTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
