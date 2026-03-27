/** Static resume copy — British English (e.g. optimised). */

export interface ResumeExperience {
  id: string
  title: string
  company: string
  location: string
  dateRange: string
  highlights: string[]
  technologies?: string
  impact?: string
}

export interface ResumeEducation {
  id: string
  degree: string
  institution: string
  dateRange: string
  highlights: string[]
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export const resumeExperience: ResumeExperience[] = [
  {
    id: 'traq',
    title: 'Lead Software Engineer',
    company: 'Traq Authenticator',
    location: 'Remote',
    dateRange: 'Jan 2024 – Present',
    highlights: [
      'Spearheaded the architecture, delivery, and operation of a production authentication platform, ensuring high availability and security.',
      'Designed and implemented a modular IAM (Identity and Access Management) system, streamlining authentication workflows across multiple services.',
      'Built scalable Django backend services, optimised for cloud environments using Docker and Kubernetes for containerisation.',
      'Introduced automated CI/CD pipelines, reducing deployment friction and improving continuous delivery pipelines.',
      'Enhanced platform resilience through Redis-based rate limiting, integrated breach detection, and malware scanning APIs, implementing security-first infrastructure practices.',
      'Led technical roadmap decisions and aligned engineering efforts with business stakeholder goals.',
    ],
    technologies:
      'Django, Python, Redis, Docker, Kubernetes, CI/CD, GitHub Actions, AWS, Authentication Systems',
  },
  {
    id: 'manufacturing',
    title: 'Data Engineer / Energy Analyst',
    company: 'Manufacturing Sector',
    location: 'UK',
    dateRange: 'Jan 2021 – Dec 2022',
    highlights: [
      'Developed Python and SQL-based data pipelines to process operational telemetry and performance metrics for improved data analysis.',
      'Designed automated ETL workflows, enabling near real-time monitoring and data visualisation.',
      'Contributed to ISO 50001 energy optimisation through advanced analytics and system modelling.',
      'Reduced manual reporting overhead by automating data workflows, fostering a data-driven decision-making culture.',
    ],
    impact:
      'Enhanced operational decision-making capabilities, enabling more efficient use of energy resources.',
    technologies:
      'Python, SQL, ETL Pipelines, Data Modelling, Power BI, Analytics Engineering',
  },
  {
    id: 'startup-ops',
    title: 'Technical Operations Lead',
    company: 'Remote Digital Startup',
    location: 'Remote',
    dateRange: 'Jan 2021 – Dec 2023',
    highlights: [
      'Owned internal tooling and workflow architecture, driving collaboration between product and engineering teams.',
      'Improved system adoption by 60% through the automation of processes and a redesign focused on usability.',
      'Acted as a liaison between engineering, product management, and business stakeholders, ensuring alignment with business goals.',
      'Standardised technical documentation, improving onboarding speed and delivery velocity.',
    ],
    technologies: 'Python, Automation, Technical Documentation, Workflow Architecture',
  },
  {
    id: 'blockchain',
    title: 'Blockchain Data Research Analyst',
    company: 'Digital Finance Sector',
    location: 'Remote',
    dateRange: 'Jan 2021 – Dec 2023',
    highlights: [
      'Automated blockchain data analysis using Python scripts, processing over 1,000 datasets for actionable insights.',
      'Reduced analysis turnaround time by 50% through improved data processing workflows.',
      'Delivered insights on blockchain ecosystem growth, supporting product strategy and investment decisions.',
      'Collaborated within Agile sprint cycles alongside engineering and marketing teams.',
    ],
    technologies: 'Python, Data Analysis, Blockchain Infrastructure, Agile Methodologies',
  },
  {
    id: 'bcf',
    title: 'Volunteer IT & Data Officer',
    company: 'Breast Cancer Foundation',
    location: 'UK',
    dateRange: 'Jan 2020 – Dec 2020',
    highlights: [
      'Developed automated reporting systems and dashboards, providing real-time visibility into programme performance.',
      'Digitised organisational data workflows, reducing administrative overhead and improving reporting accuracy.',
    ],
    technologies: 'Python, Data Automation, Reporting Systems, Dashboards',
  },
]

export const resumeEducation: ResumeEducation[] = [
  {
    id: 'msc',
    degree: 'MSc Renewable Energy & Sustainable Technology',
    institution: 'University of South Wales',
    dateRange: 'Sep 2023 – Sep 2024',
    highlights: [
      'Dissertation: Developed a Python-based model for predicting policy-driven renewable energy adoption, incorporating systems analysis and data modelling.',
      'Key modules: Data & Decision Analysis, Systems Modelling, Research Methods',
    ],
  },
]

export const resumeSkillCategories: ResumeSkillCategory[] = [
  {
    category: 'Cloud & Infrastructure',
    items: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Helm'],
  },
  {
    category: 'Databases & Data Engineering',
    items: [
      'Redis',
      'ETL Pipelines',
      'Data Modelling',
      'SQL Server',
      'Analytics Engineering',
    ],
  },
  {
    category: 'Frameworks & Development',
    items: ['Django', 'REST APIs', 'Async Processing', 'Authentication Systems'],
  },
  {
    category: 'Programming',
    items: ['Python', 'SQL'],
  },
  {
    category: 'Communication & collaboration',
    items: [
      'Communication',
      'Collaboration',
      'Stakeholder engagement',
      'Cross-functional teamwork',
      'Technical writing & documentation',
    ],
  },
]

export const resumeWhyIExcel =
  'I am a solutions-driven Lead Software Engineer and Data Engineer with a proven track record of building scalable backends, secure platforms, and automated workflows. From cloud-native systems to blockchain analysis and energy optimisation, my diverse experience makes me highly adaptable to the challenges of modern software development. Whether leading engineering teams, collaborating with stakeholders, or architecting production-grade services, my focus is always on efficiency, security, and performance.'
