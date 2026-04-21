const EN = {
  // Navbar
  nav_demos:          "Demos",
  nav_learn:          "Learn",
  nav_company:        "Company",
  nav_contact:        "Contact",
  nav_elevate:        "ELEVATE",
  nav_howItWorks:     "How it works",
  nav_education:      "Education hub",
  nav_educators:      "For educators",
  nav_about:          "About",
  nav_team:           "Team",
  nav_careers:        "Careers",
  nav_corporations:   "For corporations",
  nav_changelog:      "Changelog",
  nav_research:       "Research paper",
  nav_download:       "Download for Mac",

  // Landing – hero
  landing_badge:      "Open source · Assistive technology · Education platform",
  landing_hero:       "Control your computer",
  landing_sub:        "myojam reads surface EMG signals from your forearm and classifies hand gestures in real time. An open-source platform for assistive technology, machine learning education, and human-computer interaction research.",
  landing_try:        "Try the demos",
  landing_science:    "Read the science →",
  landing_elevate:    "ELEVATE competition ✦",

  // Landing – stats
  stat_accuracy:      "Cross-subject accuracy",
  stat_accuracy_sub:  "Tested on unseen individuals",
  stat_articles:      "Published articles",
  stat_articles_sub:  "From neuroscience to hardware",
  stat_demos:         "Interactive demos",
  stat_demos_sub:     "No hardware required",
  stat_license:       "Open source license",
  stat_license_sub:   "Free to use, fork, and build on",

  // Landing – how it works
  how_label:          "How it works",
  how_title:          "From muscle to action in under 5ms.",
  how_step1_title:    "Signal capture",
  how_step1_body:     "Surface EMG electrodes on the forearm read electrical activity at 200 Hz across 16 channels. No needles — adhesive stickers on skin.",
  how_step2_title:    "Feature extraction",
  how_step2_body:     "Each 200-sample window is compressed into 64 features — MAV, RMS, ZC, WL per channel — capturing muscle activation patterns.",
  how_step3_title:    "Classification",
  how_step3_body:     "A Random Forest trained on 16,269 windows from 10 Ninapro subjects classifies the gesture in under 5ms with 84.85% cross-subject accuracy.",
  how_step4_title:    "Assistive output",
  how_step4_body:     "Detected gestures map to computer actions — cursor movement, clicks, keypresses — hands-free, in real time.",

  // Landing – pillars
  pillars_label:      "What myojam is",
  pillars_title:      "Four things in one platform.",
  pillars_sub:        "myojam started as a gesture classifier. It's grown into an education and research platform — with demos, articles, lesson plans, and an international competition.",

  // Landing – articles
  articles_label:     "Education hub",
  articles_title:     "Recent articles.",
  articles_all:       "All articles →",

  // Landing – CTA
  cta_title:          "Start exploring.",
  cta_sub:            "No hardware required for any of the demos, articles, or tools. Everything runs in your browser.",
  cta_demos:          "Try the demos",
  cta_articles:       "Browse articles",
  cta_myocode:        "Try myocode",

  // About
  about_pill:         "Open source · Assistive technology",
  about_hero:         "We believe muscle signals shouldn't be a barrier.",
  about_sub:          "myojam is an open-source project that lets people control a computer using surface EMG signals from their forearm — and an education platform teaching the science behind it. No keyboard, no mouse, no hands required.",

  // How it works
  howitworks_label:   "Technical overview",
  howitworks_title:   "From muscle signal to action in 50ms.",
  howitworks_sub:     "How myojam turns a forearm twitch into a cursor move, click, or keypress — from raw electrode data to system-level control.",

  // Footer
  footer_tagline:     "Open-source assistive technology.",
  footer_rights:      "MIT licensed. Built in public.",
}

export function t(key) {
  return EN[key] ?? key
}
