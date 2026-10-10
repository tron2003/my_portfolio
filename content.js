// All site content lives here. Edit this file to update the portfolio.
window.SITE = {
  name: "Kanish Mahato",
  first: "Kanish",
  last: "Mahato",
  kana: "カニシュ・マハト",
  role: "AI engineer building agentic systems and the web apps around them.",
  bio: "I work across machine learning and full-stack development: LLM agents with LangGraph and local models, medical imaging research, and the APIs and interfaces that put these systems in front of people.",
  location: "Chandigarh, India",
  email: "kanishm245@gmail.com",
  github: "https://github.com/tron2003",
  linkedin: "https://www.linkedin.com/in/kanish-mahato-26a445223",

  // Each link currently points to the GitHub profile; replace with the project's own repo or demo.
  projects: [
    { name: "Immortal Twin AI", year: "2025", desc: "A conversational system that generates personality-driven replies and speaks them aloud with integrated text-to-speech.", tags: ["Python", "NLP", "TTS"], link: "https://github.com/tron2003" },
    { name: "MagicSearch", year: "2025", desc: "A semantic search engine using embedding-based retrieval and vector similarity for context-aware results.", tags: ["Next.js", "Snowflake Arctic", "PostgreSQL", "Upstash Vector"], link: "https://github.com/tron2003" },
    { name: "Alzheimer's MRI classification", year: "2025", desc: "Classifies MRI scans into Alzheimer's stages using DenseNet121 and hybrid CNN-Transformer models.", tags: ["Python", "TensorFlow", "Keras", "DenseNet121"], link: "https://github.com/tron2003" },
    { name: "Email spam classifier", year: "2024", desc: "Separates spam from legitimate email using NLP preprocessing and feature engineering.", tags: ["Python", "scikit-learn", "NLP"], link: "https://github.com/tron2003" },
  ],

  // Newest first.
  jobs: [
    {
      title: "AI Engineer Intern",
      org: "DTLS Mohali",
      date: "Jul – Dec 2025",
      points: [
        "Built a user-facing AI application combining text generation with text-to-speech.",
        "Generated personalised, context-aware responses from form data and geo-location inputs.",
        "Implemented Go middleware for a banking app with secure API routing and real-time transactions.",
      ],
    },
    {
      title: "AI Research Intern",
      org: "CSIR-CSIO Chandigarh",
      date: "Jan – Apr 2024",
      points: [
        "Engineered a cGAN with a U-Net generator translating MRI scans into synthetic CT, trained on 18,000 paired samples.",
        "Improved a U-Net for medical image segmentation, raising IoU by 5%.",
        "Modularised Python pipelines for faster experimentation across datasets.",
      ],
    },
  ],

  skills: [
    { group: "Languages", items: "Python, TypeScript, JavaScript, C++, C, SQL, Bash" },
    { group: "AI and ML", items: "PyTorch, TensorFlow, Keras, LangChain, LangGraph, Ollama, RAG, Self-RAG, CRAG, Transformers, GANs, U-Net, OpenCV, scikit-learn" },
    { group: "Web", items: "React, Next.js, Express, FastAPI, REST APIs, PostgreSQL, MongoDB, Bun" },
    { group: "MLOps and cloud", items: "Docker, MLflow, DVC, DagsHub, Airflow, Grafana, LangSmith, AWS (EC2, S3, IAM)" },
  ],

  education: { degree: "B.Tech in Computer Science and Engineering", school: "Punjab Engineering College (PEC)", place: "Chandigarh", date: "2021 – 2025", cgpa: "7.18/10" },

  certifications: [
    { name: "Complete MLOps Bootcamp", by: "Udemy", date: "Jan 2026" },
    { name: "Data Analytics", by: "Udemy", date: "Jul 2023" },
    { name: "Web Development Bootcamp", by: "Udemy", date: "Jul 2023" },
    { name: "Data Structures and Algorithms", by: "GeeksforGeeks", date: "Jun 2023" },
  ],

  achievements: [
    "Solved 830+ data structures and algorithms problems across LeetCode, GeeksforGeeks and CodeStudio",
    "Kept a 200-day continuous LeetCode streak",
    "Contributed to open source in Hacktoberfest 2022 and 2023",
  ],

  // Contact form. Fill these in from your EmailJS dashboard (https://dashboard.emailjs.com)
  // to make the form send. Left empty, the form asks visitors to email you directly.
  emailjs: { serviceId: "service_6216w6r", templateId: "template_dj2st43", publicKey: "vzs_xhNEMcrF_tztj" },
};
