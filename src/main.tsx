import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import App from "./SiteRoot";
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
import "./heroLanding.css";
import "./race3DPreview.css";
import "./editorial.css";
import "./earthJourney.css";
import "./typography.css";
import "./dataExperience.css";
import "./immersiveScene.css";
import "./installApp.css";
import "./mobileScenes.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppBoundary><App /></AppBoundary>
  </React.StrictMode>,
);
