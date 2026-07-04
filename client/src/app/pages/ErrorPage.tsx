import { useRouteError, Link } from "react-router";
import { AlertTriangle, Home, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function ErrorPage() {
  const error: any = useRouteError();
  const [showDetails, setShowDetails] = useState(false);

  console.error("Caught routing/rendering error:", error);

  const errorMessage = error?.message || error?.statusText || "Onbekende fout opgetreden.";
  const errorStack = error?.stack || JSON.stringify(error, null, 2);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs to match site aesthetics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#2c7ab9]/5 blur-[80px]" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* Animated Icon Container */}
        <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/5">
          <AlertTriangle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display font-black text-3xl text-foreground mb-4">
          Oeps! Er ging iets mis.
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Er is een onverwachte fout opgetreden in de applicatie. We excuses voor het ongemak.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Pagina herladen
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-full font-semibold transition-all"
          >
            <Home className="w-4 h-4" /> Naar Home
          </Link>
        </div>

        {/* Expandable Technical Details */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-5 py-4 flex items-center justify-between text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Technische Details</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="px-5 pb-5 border-t border-border pt-4 bg-muted/30">
              <p className="font-mono text-xs text-red-500 font-semibold mb-2 break-all">
                {errorMessage}
              </p>
              <pre className="font-mono text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-40 break-all p-3 bg-background rounded-lg border border-border">
                {errorStack}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
