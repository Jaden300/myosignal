const EN = {
  // Navbar
  nav_demos:          "Tools",
  nav_learn:          "Learn",
  nav_company:        "About",
  nav_contact:        "Contact",
  nav_howItWorks:     "How it works",
  nav_education:      "Education hub",
  nav_educators:      "For educators",
  nav_about:          "About",
  nav_team:           "Team",
  nav_careers:        "Careers",
  nav_corporations:   "For corporations",
  nav_changelog:      "Changelog",
  nav_research:       "Research paper",
  nav_download:       "Download",

  // Landing – hero
  landing_badge:      "Open education platform · EMG science · Open source",
  landing_hero:       "Explore the science of",
  landing_sub:        "myojam is an open educational platform for learning EMG signal processing, gesture classification, and assistive technology - through real data, working code, and free lesson plans.",
  landing_try:        "Explore the education hub",
  landing_science:    "For educators →",

  // Landing – stats
  stat_accuracy:      "Cross-subject accuracy",
  stat_accuracy_sub:  "Tested on unseen individuals",
  stat_articles:      "Published articles",
  stat_articles_sub:  "From neuroscience to hardware",
  stat_demos:         "Lesson plans",
  stat_demos_sub:     "Middle school to university",
  stat_license:       "Open source license",
  stat_license_sub:   "Free to use, fork, and build on",

  // Landing – how it works
  how_label:          "The EMG pipeline",
  how_title:          "From electrode to classification.",
  how_step1_title:    "Signal capture",
  how_step1_body:     "Surface EMG electrodes on the forearm read electrical activity at 200 Hz across 16 channels. No needles - adhesive stickers on skin.",
  how_step2_title:    "Feature extraction",
  how_step2_body:     "Each 200-sample window is compressed into 64 features - MAV, RMS, ZC, WL per channel - capturing muscle activation patterns.",
  how_step3_title:    "Classification",
  how_step3_body:     "A Random Forest trained on 16,269 windows from 10 Ninapro subjects classifies the gesture in under 5ms with 84.85% cross-subject accuracy.",
  how_step4_title:    "Real-world applications",
  how_step4_body:     "Classified gestures can drive cursor movement, clicks, keypresses, or any custom action - opening the door to hands-free and assistive computer control.",

  // Landing – pillars
  pillars_label:      "What myojam offers",
  pillars_title:      "One platform. Every learning path.",
  pillars_sub:        "Whether you're a student, a teacher, or a researcher - myojam has a path for you. Articles, lesson plans, interactive tools, and a fully documented open-source codebase.",

  // Landing – articles
  articles_label:     "Education hub",
  articles_title:     "Recent articles.",
  articles_all:       "All articles →",

  // Landing – CTA
  cta_title:          "Start learning.",
  cta_sub:            "No hardware required. Every article, tool, and lesson plan is free and open access.",
  cta_demos:          "Explore the education hub",
  cta_articles:       "Browse articles",
  cta_educators:      "For educators",

  // About
  about_pill:         "Education platform · Open source",
  about_hero:         "Open education for the next generation of biotech.",
  about_sub:          "myojam is an open educational platform teaching the science of EMG - from the biology of muscle contraction to the machine learning behind gesture classification. Everything is free, open source, and curriculum-aligned.",

  // How it works
  howitworks_label:   "Technical deep dive",
  howitworks_title:   "How EMG gesture classification works.",
  howitworks_sub:     "A walkthrough of the full signal processing pipeline - from raw electrode data to gesture classification. Every stage is documented, reproducible, and openly published.",

  // Footer
  footer_tagline:     "Open education for EMG science.",
  footer_rights:      "MIT licensed. Built in public.",
}

export function t(key) {
  return EN[key] ?? key
}
