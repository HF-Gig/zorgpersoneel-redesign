import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import VoorInstellingen from "./pages/VoorInstellingen";
import Registreren from "./pages/Registreren";
import BeschikbaarVandaag from "./pages/BeschikbaarVandaag";
import Portaal from "./pages/Portaal";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "voor-instellingen", Component: VoorInstellingen },
      { path: "registreren", Component: Registreren },
      { path: "beschikbaar-vandaag", Component: BeschikbaarVandaag },
      { path: "portaal", Component: Portaal },
    ],
  },
]);
