import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import VoorInstellingen from "./pages/VoorInstellingen";
import Registreren from "./pages/Registreren";
import SpoeddienstAanvraag from "./pages/SpoeddienstAanvraag";
import Portaal from "./pages/Portaal";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "voor-instellingen", Component: VoorInstellingen },
      { path: "registreren", Component: Registreren },
      { path: "spoeddienst-aanvraag", Component: SpoeddienstAanvraag },
      { path: "portaal", Component: Portaal },
    ],
  },
]);
