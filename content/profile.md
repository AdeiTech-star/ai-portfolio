<!--
  This file is the chat agent's knowledge base. It is loaded into the system prompt on every
  request, and the agent answers ONLY from this file plus GitHub data. Anything not written
  here, it will say it doesn't know. Everything here is public: visitors can ask about any of it.
  Filled in from NthabisengThema_Resume.pdf. Sections marked TODO need your input.
-->

# Nthabiseng Adelaide Thema

## Summary
AI/ML engineer, researcher and data scientist with a production software engineering background, currently pursuing an MSc in Information Technology (Applied Machine Learning) at Carnegie Mellon University Africa as a Mastercard Foundation Scholar. Track record spanning LLM fine-tuning and computer vision research. Moves easily between research, development and MLOps, and is driven to build AI systems that are rigorous, deployable and grounded in real African contexts.

## Role preferences
- Target roles: AI/ML Engineer, Data Scientist, ML/AI Research roles
- Locations: South Africa, Rwanda, United States. Open to relocation and to remote work.
- Availability: Currently studying at CMU Africa (MSc expected May 2027). TODO: add when you're available (internships, full-time start date) and whether you're open to part-time work while studying.
- Work authorization: TODO (optional; only add what you're comfortable sharing publicly)

## Experience

### Graduate Research Assistant, RISE Project - Carnegie Mellon University Africa (Jan 2026 - Present, Kigali, Rwanda)
- Contributing to RISE (Resilience in Secondary Education), a technology-enabled learning initiative targeting 1M+ out-of-school youth across African countries, under Dr. Amy Ogan and Dr. Tutaleni Asino.
- Building learning analytics pipelines using the Canvas LMS API and Moodle data, powering learner dashboards on the Torus platform.

### AI Engineer Intern, AI and Trust Track - Carnegie Mellon University Africa (Jun 2026 - Sep 2026, Kigali, Rwanda)
- Built a LangChain and LangGraph agent for a learner support system powering the AI for Africa Online Certificate Program.
- Integrated fairness monitoring with Fairlearn and structured audit logging to support responsible AI deployment and post-hoc review of agent decisions.
- Collaborated with a fellow research intern under faculty supervision to align system design with trustworthy AI principles for education technology.

### R&D AI Intern, Vacation Work Programme - Isazi Consulting (Jun 2026 - Jul 2026, Johannesburg, South Africa)
- Built a KTO (Kahneman-Tversky Optimization) fine-tuning pipeline for Llama 3.1 8B using Unsloth, TRL and PEFT on an NVIDIA DGX Spark, for an internal LLM tool.
- Designed a percentile-based KTO dataset construction pipeline and implemented SFT LoRA adapter merging with reference-free PEFT training, resolving CUDA and GPU memory bottlenecks.
- Produced internal documentation comparing DPO and KTO trade-offs and presented the findings to the R&D team.

### Junior Software Developer - Hensoldt (Jan 2023 - Jun 2025, Pretoria, South Africa)
- Engineered a secure VoIP and messaging system over TCP/IP supporting 30+ concurrent users, applying operations research methods to optimise resource allocation.
- Enhanced Java frontend features through decoupled component design, reducing development time by 60%.
- Migrated a legacy Java frontend to Spring Boot, boosting customer satisfaction by 70%, and trained 2 junior developers on internal systems.

### Software Developer Intern - Hensoldt (2022, Pretoria, South Africa)
- Maintained and improved existing systems through bug fixes and performance enhancements.
- Explored new technologies and system designs, researching ways to integrate modern solutions and improve overall functionality.

### Tutor - Prep2Perfection and TeachMe2 (2021 - Present, Remote)
- Tutors and mentors students at all levels in Mathematics, Physical Science, Accounting and Computer Science.

## Research interests
Machine Learning applications, Natural Language Processing, Computer Vision, Software Engineering and Data Science.

## Education
- **Carnegie Mellon University Africa** (Kigali, Rwanda), Aug 2025 - May 2027: M.S. in Information Technology (Applied Machine Learning). Coursework: Applied Machine Learning, Deep Learning, NLP, Data Structures & Algorithms, Agentic AI, Data Science, Big Data Science. Full scholarship as a Mastercard Foundation Scholar.
- **University of the Witwatersrand** (Johannesburg, South Africa), Feb 2023 - Dec 2024: B.Sc. Honours in Computer Science.
- **University of the Witwatersrand** (Johannesburg, South Africa), Feb 2020 - Dec 2022: B.Sc. in Computational Mathematics and Computer Science.

## Projects

### Computer Assisted Cyclist Road Safety Warning System (repo: Computer-assisted-cyclist-road-warning-system)
- Real-time cyclist safety warning system using YOLOv8 and Inverse Perspective Mapping, trained on 5,000+ traffic images and video streams.
- Combined CNN and LSTM models for feature extraction and scene captioning to improve hazard detection.
- Research poster accepted at the WiML (Women in Machine Learning) Workshop at NeurIPS 2025 in San Diego, one of 198 accepted submissions. Authors: Thema N, Prof. Hairong Bau.
- Code: https://github.com/AdeiTech-star/Computer-assisted-cyclist-road-warning-system

### Bank Customer Churn Prediction and Deployment
- XGBoost churn model with Optuna hyperparameter tuning, achieving 99.7% recall; comprehensive EDA, data cleaning and preprocessing with Pandas, Scikit-learn, Matplotlib and Seaborn.
- Containerised and deployed with Docker and FastAPI, with MLflow for experiment tracking and automated monitoring across dev, test and production.
- Notebook: https://www.kaggle.com/code/nthabisengthema/bank-customer-churn-and-tuning

### Credit Card Fraud Detection (repo: CreditCardFraudDetection)
- Logistic regression model detecting fraudulent transactions on a Kaggle dataset, with 96% accuracy.
- Explored handling class imbalance with undersampling, oversampling and SMOTE; planned next step is testing models such as Random Forest.
- Code: https://github.com/AdeiTech-star/CreditCardFraudDetection

### SwapShop (team project)
- React Native app enabling community item swaps. Focused on front-end design and helped with backend features such as OAuth login and payment integration (Firebase).
- Improved usability through user feedback, boosting retention by 35% and community participation by 40%.
- Code: https://github.com/SCRUM-OF-THE-EARTH/SwapShop

### Balepye AI (founder)
- Founded an AI-powered university admissions guidance platform for African students, backed by Mastercard Foundation seed funding.
- Built the frontend in Next.js, TypeScript and shadcn/ui.

## Skills
- Languages: Python, Java, C, C++, SQL, JavaScript/TypeScript
- ML & AI: PyTorch, TensorFlow, Keras, Scikit-learn, XGBoost, Hugging Face, TRL, PEFT, Unsloth, LangChain, LangGraph, Fairlearn, OpenCV, NLTK
- MLOps & Tools: Docker, FastAPI, MLflow, Optuna, Git, GitHub, Next.js, Spring Boot, NVIDIA DGX, CI/CD, REST APIs
- Web & data: React, React Native, JavaScript, Node.js, Firebase, PostgreSQL, Pandas, Seaborn, ETL/ELT, EDA, statistical testing, technical writing
- Strongest areas: LLM fine-tuning and alignment (KTO/DPO, LoRA/PEFT), agentic AI systems (LangChain/LangGraph), computer vision, responsible AI / fairness monitoring, and production software engineering in Java.

## Certifications
- AWS Certified AI Practitioner (Amazon Web Services, issued Sep 2026, expires Sep 2029; credential ID 5cfc9d9d-da8c-446c-99c3-ebae4741393f): https://www.credly.com/badges/5cfc9d9d-da8c-446c-99c3-ebae4741393f/public_url
- Introduction to Generative AI with AWS (Udacity, 2025): https://www.udacity.com/certificate/e/4b07a73a-40c6-11f0-b366-dfc078748ccf
- Python for Data Science and Machine Learning Bootcamp (Udemy, 2025): https://www.udemy.com/certificate/UC-d907810d-f68a-4979-8f73-e63b4e416db0/
- Java 17 Masterclass (Udemy, 2024): https://www.udemy.com/certificate/UC-81387928-1905-4e24-a8b4-a6f7e5aefd9b/

## Honors and awards
- beVisioneers Mercedes-Benz Fellowship: selected for Cohort 4, receiving mentorship and funding to bring an environmental project to life.
- African Computer Vision Summer School (ACVSS 2026): selected as 1 of 31 from 312 applicants.
- Mastercard Foundation Scholar: full scholarship for the MSc at Carnegie Mellon University Africa.
- Milliman Scholarship: recognised among the top 16 STEM students worldwide for academic excellence.
- Postgraduate Merit Award; 13 First Class awards across multiple courses.

## Leadership and community
- Treasurer, Women in Tech Club, CMU Africa
- Organiser, Women Techmakers Kigali (including International Women's Day 2026)
- Mentor, excel@uni program
- Tutor at Prep2Perfection (Computer Science, Mathematics, Accounting and Physics)

## Contact
- Email: nthema@andrew.cmu.edu (also nthabisengadelaidethema20@gmail.com)
- LinkedIn: https://www.linkedin.com/in/nthabiseng-thema-msc-981b25152
- GitHub: https://github.com/AdeiTech-star
- Book a call: https://calendly.com/nthema-andrew/30min
- Phone numbers are not shared here; ask by email.
