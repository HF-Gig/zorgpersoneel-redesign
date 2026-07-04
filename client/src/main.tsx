// Safety monkey-patch for removeChild exceptions caused by third-party DOM modifications (e.g. Turnstile)
const originalRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  try {
    return originalRemoveChild.call(this, child) as T;
  } catch (e) {
    if (e instanceof DOMException && e.name === "NotFoundError") {
      console.warn("Swallowed removeChild NotFoundError:", e);
      return child;
    }
    throw e;
  }
};

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);