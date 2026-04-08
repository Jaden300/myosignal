import { createContext, useContext, useState } from "react"

const EN = {
  // Navbar
  nav_howItWorks: "How it works",
  nav_about: "About",
  nav_team: "Team",
  nav_contact: "Contact",
  nav_education: "Education",
  nav_download: "Download for Mac",

  // Landing
  landing_badge: "Open source · Assistive technology",
  landing_hero1: "Control your",
  landing_hero2: "computer",
  landing_hero3: "with your muscles.",
  landing_sub: "myojam reads EMG signals from your forearm and classifies hand gestures in real time — giving people with motor impairments a new way to interact with computers.",
  landing_try: "Try the demo",
  landing_how_title: "From muscle to action",
  landing_how_label: "How it works",
  landing_cta_title: "See it in action",
  landing_cta_sub: "Load real EMG data from the Ninapro dataset and watch the classifier run live in your browser.",
  landing_cta_btn: "Open demo",
  landing_dl_title: "Download myojam",
  landing_dl_sub: "The native macOS application. Connect your EMG sensor and control your computer with muscle signals.",
  landing_dl_btn: "↓ Download for Mac",
  landing_dl_source: "View source",
  landing_dl_note: "macOS 12+ · Requires Accessibility permission · MyoWare 2.0 sensor optional",

  // About
  about_badge: "Open source · Assistive technology",
  about_h1a: "We believe muscle",
  about_h1b: "signals shouldn't be",
  about_h1c: "a barrier.",
  about_sub: "myojam is an open-source assistive technology project that lets people control a computer using surface EMG signals from their forearm — no keyboard, no mouse, no hands required. It started as a personal research project and grew into something we think could genuinely help people.",
  about_mission_label: "Our mission",
  about_mission: "To make gesture-based human-computer interaction accessible, open, and free — starting with people who need it most.",
  about_what_title: "What myojam actually does",
  about_values_title: "What we believe",
  about_timeline_title: "How we got here",
  about_oss_title: "myojam is fully open source",
  about_oss_sub: "The full codebase — signal processing pipeline, ML model, web frontend, FastAPI backend, and macOS desktop app — is public on GitHub under the MIT license.",
  about_oss_link: "View on GitHub ↗",

  // Footer
  footer_tos: "Terms of Service",
  footer_privacy: "Privacy Policy",
  footer_github: "GitHub",
  footer_copy: "© 2025 myojam™. All rights reserved. · Built with ♥ for assistive technology.",

  // Education
  edu_badge: "Educational hub",
  edu_title1: "Learn about EMG",
  edu_title2: "& assistive technology.",
  edu_sub: "In-depth articles on the science behind myojam — from how muscles generate electrical signals to how machine learning classifies them into computer actions.",
  edu_sort: "Sort by",
  edu_latest: "Latest",
  edu_popular: "Most popular",
  edu_helpful: "Most helpful",
  edu_submit_title: "Submit your own article",
  edu_submit_sub: "Written something about EMG, assistive technology, or myojam? Submit it for review — accepted articles are published here with full author credit.",

  // Playground
  playground_badge: "Interactive · No hardware needed",
  playground_title1: "Signal playground.",
  playground_title2: "Draw a waveform, see the math.",
  playground_sub: "Sketch an EMG-like signal with your mouse and watch the same feature extraction pipeline that runs inside myojam compute in real time.",
}

const FR = {
  nav_howItWorks: "Comment ça marche",
  nav_about: "À propos",
  nav_team: "Équipe",
  nav_contact: "Contact",
  nav_education: "Éducation",
  nav_download: "Télécharger pour Mac",

  landing_badge: "Open source · Technologie d'assistance",
  landing_hero1: "Contrôlez votre",
  landing_hero2: "ordinateur",
  landing_hero3: "avec vos muscles.",
  landing_sub: "myojam lit les signaux EMG de votre avant-bras et classifie les gestes de la main en temps réel — offrant aux personnes à mobilité réduite une nouvelle façon d'interagir avec les ordinateurs.",
  landing_try: "Essayer la démo",
  landing_how_title: "Du muscle à l'action",
  landing_how_label: "Comment ça marche",
  landing_cta_title: "Voir en action",
  landing_cta_sub: "Chargez de vraies données EMG du dataset Ninapro et regardez le classifieur s'exécuter en direct dans votre navigateur.",
  landing_cta_btn: "Ouvrir la démo",
  landing_dl_title: "Télécharger myojam",
  landing_dl_sub: "L'application macOS native. Connectez votre capteur EMG et contrôlez votre ordinateur avec des signaux musculaires.",
  landing_dl_btn: "↓ Télécharger pour Mac",
  landing_dl_source: "Voir le code source",
  landing_dl_note: "macOS 12+ · Nécessite la permission d'accessibilité · Capteur MyoWare 2.0 optionnel",

  about_badge: "Open source · Technologie d'assistance",
  about_h1a: "Nous croyons que les signaux",
  about_h1b: "musculaires ne devraient pas",
  about_h1c: "être une barrière.",
  about_sub: "myojam est un projet de technologie d'assistance open-source qui permet aux personnes de contrôler un ordinateur en utilisant les signaux EMG de surface de leur avant-bras — sans clavier, sans souris, sans mains.",
  about_mission_label: "Notre mission",
  about_mission: "Rendre l'interaction gestuelle homme-ordinateur accessible, ouverte et gratuite — en commençant par les personnes qui en ont le plus besoin.",
  about_what_title: "Ce que fait vraiment myojam",
  about_values_title: "Ce que nous croyons",
  about_timeline_title: "Comment nous en sommes arrivés là",
  about_oss_title: "myojam est entièrement open source",
  about_oss_sub: "Le code complet — pipeline de traitement du signal, modèle ML, frontend React, backend FastAPI et application macOS — est public sur GitHub sous licence MIT.",
  about_oss_link: "Voir sur GitHub ↗",

  footer_tos: "Conditions d'utilisation",
  footer_privacy: "Politique de confidentialité",
  footer_github: "GitHub",
  footer_copy: "© 2025 myojam™. Tous droits réservés. · Construit avec ♥ pour la technologie d'assistance.",

  edu_badge: "Centre éducatif",
  edu_title1: "En apprendre davantage sur l'EMG",
  edu_title2: "& la technologie d'assistance.",
  edu_sub: "Articles approfondis sur la science derrière myojam — de la façon dont les muscles génèrent des signaux électriques à la manière dont l'apprentissage automatique les classifie.",
  edu_sort: "Trier par",
  edu_latest: "Plus récent",
  edu_popular: "Plus populaire",
  edu_helpful: "Plus utile",
  edu_submit_title: "Soumettre votre propre article",
  edu_submit_sub: "Vous avez écrit quelque chose sur l'EMG, la technologie d'assistance ou myojam ? Soumettez-le pour examen — les articles acceptés sont publiés ici avec plein crédit à l'auteur.",

  playground_badge: "Interactif · Sans matériel",
  playground_title1: "Terrain de jeu de signaux.",
  playground_title2: "Dessinez une forme d'onde, voyez les maths.",
  playground_sub: "Esquissez un signal de type EMG avec votre souris et regardez le même pipeline d'extraction de caractéristiques qui s'exécute dans myojam calculer en temps réel.",
}

const TRANSLATIONS = { en: EN, fr: FR }

const LangContext = createContext({ lang: "en", t: k => EN[k] || k, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en")

  function t(key) {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key
  }

  function switchLang(l) {
    setLang(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang: switchLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}