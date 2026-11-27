import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/700-italic.css";
import App from "./RaceHub";
import AppBoundary from "./AppBoundary";
import "./theme.css";
import "./style.css";
import "./spacing.css";
import "./experience.css";
import "./visualExperience.css";
import "./explorerVisual.css";
import "./priceNotebook.css";
import "./circuitLayout.css";
import "./circuitStudy.css";
import "./raceCards.css";
import "./raceEvents.css";
import "./racingCentre.css";
import "./venueStands.css";
import "./venueReferences.css";
import "./standConcept.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppBoundary><App /></AppBoundary>
  </React.StrictMode>,
);
