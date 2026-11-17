/**
 * ============================================================
 *  PORTFOLIO CONFIG: edit this file to make the site yours.
 * ============================================================
 *
 * Everything shown on the page comes from here. Two other things to add:
 *   - Your photo:   put it at  public/avatar.jpg  (or .jpeg / .png / .webp).
 *                   It's picked up automatically; no need to change anything below.
 *   - Your resume:  put it in  public/  and point resumeUrl at it (leading slash).
 *
 * The AI chat answers from  content/profile.md  (your full resume, projects, preferences).
 * Keep the two in sync: the chat only knows what's written there.
 */

import type { PortfolioConfig } from "./lib/config-types";

const config: PortfolioConfig = {
  // ---- Basics ---------------------------------------------------------------
  name: "Nthabiseng Adelaide Thema",
  title: "AI/ML Engineer · Data Scientist", // shown letter-spaced above the greeting
  pitch: "I build thoughtful AI products, from the data they learn from to the people they serve.",
  location: "South Africa · Rwanda · United States · Open to relocation and remote",

  // Phrases the hero types out one after another
  greetings: ["Hi, I'm Nthabiseng", "Ask my AI anything"],

  // ---- Photo ----------------------------------------------------------------
  // Leave empty to auto-detect public/avatar.(jpg|jpeg|png|webp); falls back to your initials.
  // Or set a path/URL explicitly, e.g. "/me.png" or "https://...".
  avatar: "",
  avatarGrayscale: false, // black-and-white photo; set false for colour

  // ---- Links ----------------------------------------------------------------
  // One address only (it's used for mailto: links). Secondary: nthabisengadelaidethema20@gmail.com
  email: "nthema@andrew.cmu.edu",
  githubUsername: "AdeiTech-star", // also powers the Projects section
  linkedinUrl: "https://www.linkedin.com/in/nthabiseng-thema-msc-981b25152", // must start with https://
  xUrl: "", // optional, leave empty to hide
  instagramUrl: "", // optional, leave empty to hide
  resumeUrl: "/NthabisengThema_Resume.pdf", // file lives in public/
  schedulingUrl: "https://calendly.com/nthema-andrew/30min", // enables "Book a call"

  // ---- About ----------------------------------------------------------------
  about: {
    // Photo: put it at public/about.jpg (or .jpeg / .png / .webp); it's picked up automatically.
    // Or set a path/URL here, e.g. photo: "/me-at-neurips.jpg". Portrait (taller than wide) works best.
    photo: "",
    heading: "A little background",
    body: "I'm an AI/ML engineer, researcher and data scientist with a production software engineering background, currently pursuing an MSc in Information Technology (Applied Machine Learning) at Carnegie Mellon University Africa as a Mastercard Foundation Scholar. I move easily between research, development and MLOps, from fine-tuning LLMs to computer vision research, and I'm driven to build AI systems that are rigorous, deployable and grounded in real African contexts. Outside of work, I organise with Women Techmakers Kigali and mentor and tutor students in CS and mathematics.",
  },

  // ---- Experience (newest first) --------------------------------------------
  experience: [
    {
      role: "Graduate Research Assistant, RISE Project",
      company: "Carnegie Mellon University Africa",
      period: "Jan 2026 - Present · Kigali, Rwanda",
      summary: "Learning analytics for an initiative reaching 1M+ out-of-school youth across Africa.",
      tech: ["Python", "Canvas LMS API", "Moodle", "Learning analytics"],
      bullets: [
        "Contributing to RISE (Resilience in Secondary Education), a learning initiative targeting 1M+ out-of-school youth across African countries",
        "Building learning analytics pipelines from Canvas LMS API and Moodle data, powering learner dashboards on the Torus platform",
      ],
    },
    {
      role: "AI Engineer Intern, AI and Trust Track",
      company: "Carnegie Mellon University Africa",
      period: "Jun 2026 - Sep 2026 · Kigali, Rwanda",
      summary: "A LangGraph learner-support agent with fairness monitoring and audit logging.",
      tech: ["LangChain", "LangGraph", "Fairlearn", "Python"],
      bullets: [
        "Built a LangChain and LangGraph agent for a learner support system powering the AI for Africa Online Certificate Program",
        "Integrated fairness monitoring with Fairlearn and structured audit logging for responsible AI deployment and post-hoc review of agent decisions",
        "Aligned system design with trustworthy AI principles for education technology, under faculty supervision",
      ],
    },
    {
      role: "R&D AI Intern, Vacation Work Programme",
      company: "Isazi Consulting",
      period: "Jun 2026 - Jul 2026 · Johannesburg, South Africa",
      summary: "KTO fine-tuning of Llama 3.1 8B on an NVIDIA DGX Spark.",
      tech: ["Llama 3.1 8B", "Unsloth", "TRL", "PEFT", "NVIDIA DGX"],
      bullets: [
        "Built a KTO (Kahneman-Tversky Optimization) fine-tuning pipeline for Llama 3.1 8B on an NVIDIA DGX Spark for an internal LLM tool",
        "Designed a percentile-based KTO dataset construction pipeline and implemented SFT LoRA adapter merging, resolving CUDA and GPU memory bottlenecks",
        "Documented DPO vs. KTO trade-offs and presented the findings to the R&D team",
      ],
    },
    {
      role: "Junior Software Developer",
      company: "Hensoldt",
      period: "Jan 2023 - Jun 2025 · Pretoria, South Africa",
      summary: "Secure VoIP and messaging for 30+ users; Spring Boot migration that lifted satisfaction 70%.",
      tech: ["Java", "Spring Boot", "TCP/IP"],
      bullets: [
        "Engineered a secure VoIP and messaging system over TCP/IP supporting 30+ concurrent users",
        "Enhanced Java frontend features through decoupled component design, reducing development time by 60%",
        "Migrated a legacy Java frontend to Spring Boot, boosting customer satisfaction by 70%, and trained 2 junior developers",
      ],
    },
    {
      role: "Software Developer Intern",
      company: "Hensoldt",
      period: "2022 · Pretoria, South Africa",
      summary: "Where it started: bug fixes, performance work and researching new system designs.",
      tech: ["Java"],
      bullets: [
        "Maintained and improved existing systems through bug fixes and performance enhancements",
        "Researched new technologies and system designs to modernise and extend existing functionality",
      ],
    },
  ],

  // ---- Featured projects ----------------------------------------------------
  // Shown first in Projects; your GitHub repos are listed below them automatically.
  // Add a `url` (repo, demo or paper) to make the card clickable.
  projects: [
    {
      name: "Cyclist Road Safety Warning System",
      description:
        "Real-time warning system for cyclists using YOLOv8 and Inverse Perspective Mapping, trained on 5,000+ traffic images and video streams, with CNN + LSTM scene captioning to improve hazard detection. Poster accepted at WiML @ NeurIPS 2025 (1 of 198 accepted submissions).",
      tech: ["YOLOv8", "PyTorch", "OpenCV", "Python"],
      highlight: "WiML @ NeurIPS 2025 poster",
      url: "https://github.com/AdeiTech-star/Computer-assisted-cyclist-road-warning-system",
    },
    {
      name: "Balepye AI",
      description:
        "AI-powered university admissions guidance platform for African students, which I founded. Frontend built in Next.js, TypeScript and shadcn/ui.",
      tech: ["Next.js", "TypeScript", "shadcn/ui"],
      highlight: "Mastercard Foundation seed funding",
    },
    {
      name: "Bank Customer Churn Prediction",
      description:
        "XGBoost churn model tuned with Optuna to 99.7% recall, after thorough EDA and cleaning. Containerised and deployed with Docker and FastAPI, with MLflow experiment tracking and monitoring across dev, test and production.",
      tech: ["XGBoost", "Optuna", "Docker", "FastAPI", "MLflow"],
      highlight: "99.7% recall",
      url: "https://www.kaggle.com/code/nthabisengthema/bank-customer-churn-and-tuning",
    },
    {
      name: "Credit Card Fraud Detection",
      description:
        "Logistic regression model detecting fraudulent transactions on a Kaggle dataset with 96% accuracy, comparing undersampling, oversampling and SMOTE to handle heavy class imbalance.",
      tech: ["Python", "Scikit-learn", "Pandas"],
      url: "https://github.com/AdeiTech-star/CreditCardFraudDetection",
    },
    {
      name: "SwapShop",
      description:
        "Team-built React Native app for community item swaps. I led front-end design and helped with OAuth login and payment integration; feedback-driven usability work raised retention by 35% and participation by 40%.",
      tech: ["React Native", "Firebase"],
      url: "https://github.com/SCRUM-OF-THE-EARTH/SwapShop",
    },
  ],

  // ---- Certifications -------------------------------------------------------
  certifications: [
    {
      name: "AWS Certified AI Practitioner",
      issuer: "AWS",
      year: "Sep 2026 - Sep 2029",
      credentialId: "5cfc9d9d-da8c-446c-99c3-ebae4741393f",
      url: "https://www.credly.com/badges/5cfc9d9d-da8c-446c-99c3-ebae4741393f/public_url",
    },
    {
      name: "Introduction to Generative AI with AWS",
      issuer: "Udacity",
      year: "2025",
      url: "https://www.udacity.com/certificate/e/4b07a73a-40c6-11f0-b366-dfc078748ccf",
    },
    {
      name: "Python for Data Science and Machine Learning Bootcamp",
      issuer: "Udemy",
      year: "2025",
      url: "https://www.udemy.com/certificate/UC-d907810d-f68a-4979-8f73-e63b4e416db0/",
    },
    {
      name: "Java 17 Masterclass",
      issuer: "Udemy",
      year: "2024",
      url: "https://www.udemy.com/certificate/UC-81387928-1905-4e24-a8b4-a6f7e5aefd9b/",
    },
  ],

  // ---- Skills (group name -> list) ------------------------------------------
  skills: {
    Languages: ["Python", "Java", "C", "C++", "SQL", "TypeScript"],
    "ML & AI": [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "XGBoost",
      "Hugging Face",
      "TRL",
      "PEFT",
      "Unsloth",
      "LangChain",
      "LangGraph",
      "Fairlearn",
      "OpenCV",
      "NLTK",
    ],
    "MLOps & Tools": ["Docker", "FastAPI", "MLflow", "Optuna", "Git", "AWS", "NVIDIA DGX"],
    "Web & Data": ["React", "Next.js", "Node.js", "Spring Boot", "Firebase", "PostgreSQL", "Pandas"],
  },

  // ---- AI chat --------------------------------------------------------------
  suggestedQuestions: [
    "What's their strongest project?",
    "Tell me about their LLM fine-tuning work",
    "Are they open to relocation?",
    "Can I book a call with them?",
  ],
};

export default config;
