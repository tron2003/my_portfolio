import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
    company1
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Work",
    },
    {
        id: "project",
        title: "Project"
    },
    {
        id: "contact",
        title: "Contact",
    },
];
const services = [
    {
        title: "Full MERN Stack Web Developer",
        icon: web,
    },
    {
        title: "AI Engineer",
        icon: creator, // swapped from mobile to creator for AI
    },
    {
        title: "Data Analytics",
        icon: backend,
    },
    {
        title: "DSA",
        icon: mobile, // swapped from creator to mobile for now
    },
];

const technologies = [
    {
        name: "HTML 5",
        icon: html,
    },
    {
        name: "CSS 3",
        icon: css,
    },
    {
        name: "JavaScript",
        icon: javascript,
    },
    {
        name: "TypeScript",
        icon: typescript,
    },
    {
        name: "React JS",
        icon: reactjs,
    },
    {
        name: "Redux Toolkit",
        icon: redux,
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
    },
    {
        name: "Node JS",
        icon: nodejs,
    },
    {
        name: "MongoDB",
        icon: mongodb,
    },
    {
        name: "Three JS",
        icon: threejs,
    },
    {
        name: "git",
        icon: git,
    },
    {
        name: "figma",
        icon: figma,
    },
    {
        name: "docker",
        icon: docker,
    },
];

const experiences = [
    {
        title: "GenAI Research Intern",
        company_name: "CSIR-CSIO",
        icon: company1,
        iconBg: "#383E56",
        date: "March 2020 - April 2021",
        points: [
            "Researched Generative Adversarial Networks (GANs) to enhance synthetic data generation for image augmentation, achieving a 10% improvement in image quality metrics.",
            "Explored U-Net architecture for medical image segmentation, improving model comprehension and implementation by 10%.",
            "Applied Python programming to automate data preprocessing and analysis workflows, boosting coding efficiency by 15%.",
            "Collaborated in code reviews and actively provided feedback to peers to maintain code quality and knowledge sharing.",
        ],
    },
    // {
    //     title: "React Native Developer",
    //     company_name: "Tesla",
    //     icon: tesla,
    //     iconBg: "#E6DEDD",
    //     date: "Jan 2021 - Feb 2022",
    //     points: [
    //         "Developing and maintaining web applications using React.js and other related technologies.",
    //         "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
    //         "Implementing responsive design and ensuring cross-browser compatibility.",
    //         "Participating in code reviews and providing constructive feedback to other developers.",
    //     ],
    // },
    // {
    //     title: "Web Developer",
    //     company_name: "Shopify",
    //     icon: shopify,
    //     iconBg: "#383E56",
    //     date: "Jan 2022 - Jan 2023",
    //     points: [
    //         "Developing and maintaining web applications using React.js and other related technologies.",
    //         "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
    //         "Implementing responsive design and ensuring cross-browser compatibility.",
    //         "Participating in code reviews and providing constructive feedback to other developers.",
    //     ],
    // },
    // {
    //     title: "Full stack Developer",
    //     company_name: "Meta",
    //     icon: meta,
    //     iconBg: "#E6DEDD",
    //     date: "Jan 2023 - Present",
    //     points: [
    //         "Developing and maintaining web applications using React.js and other related technologies.",
    //         "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
    //         "Implementing responsive design and ensuring cross-browser compatibility.",
    //         "Participating in code reviews and providing constructive feedback to other developers.",
    //     ],
    // },
];

const testimonials = [
    {
        testimonial:
            "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
        name: "Sara Lee",
        designation: "CFO",
        company: "Acme Co",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        testimonial:
            "I've never met a web developer who truly cares about their clients' success like Rick does.",
        name: "Chris Brown",
        designation: "COO",
        company: "DEF Corp",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        testimonial:
            "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
        name: "Lisa Wang",
        designation: "CTO",
        company: "456 Enterprises",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
];

const projects = [
    {
        name: "Portfolio Website",
        description:
            "A personal portfolio website showcasing my skills, projects, and experience as a Full Stack Developer and AI enthusiast — designed to reflect my passion for clean code and creative solutions.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "tailwind",
                color: "green-text-gradient",
            },
            {
                name: "threejs",
                color: "pink-text-gradient",
            },
        ],
        image: "portfolio_image_placeholder", // replace with your portfolio image asset
        source_code_link: "https://github.com/yourusername/portfolio-repo",
        live_link: "https://your-live-portfolio-link.com",
    },
    {
        name: "Real Blog Website",
        description:
            "A full-stack MERN-powered blogging platform allowing users to write, edit, and manage posts, designed with a responsive and modern UI for smooth content creation.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: carrent, // replace this with your real blog image asset
        source_code_link: "https://github.com/yourusername/your-blog-repo",
        live_link: "https://your-blog-live-link.com",
    },
    {
        name: "Real Estate Website",
        description:
            "A user-friendly property listing and search platform where clients can browse, filter, and explore real estate listings with interactive maps and advanced search features.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "nodejs",
                color: "green-text-gradient",
            },
            {
                name: "mongodb",
                color: "pink-text-gradient",
            },
        ],
        image: "realestate_image_placeholder",
        source_code_link: "https://github.com/yourusername/realestate-repo",
        live_link: "https://your-realestate-live-link.com",
    },
    {
        name: "MagicSearch Website",
        description:
            "A lightning-fast search engine clone that can perform real-time keyword searches across multiple categories, using modern frontend optimization and backend indexing.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "express",
                color: "green-text-gradient",
            },
            {
                name: "elasticsearch",
                color: "pink-text-gradient",
            },
        ],
        image: "magicsearch_image_placeholder",
        source_code_link: "https://github.com/yourusername/magicsearch-repo",
        live_link: "https://your-magicsearch-live-link.com",
    },
    {
        name: "Email Spam Classifier",
        description:
            "A machine learning model designed to classify emails as 'Spam' or 'Not Spam' using Natural Language Processing and feature engineering techniques.",
        tags: [
            {
                name: "python",
                color: "blue-text-gradient",
            },
            {
                name: "scikit-learn",
                color: "green-text-gradient",
            },
            {
                name: "nlp",
                color: "pink-text-gradient",
            },
        ],
        image: "emailspam_image_placeholder",
        source_code_link: "https://github.com/yourusername/email-spam-classifier",
        live_link: "https://your-emailspam-live-link.com",
    },
    {
        name: "Generation of CT from MRI Image",
        description:
            "A deep learning project using Conditional GANs (cGAN) to translate MRI scans into synthetic CT images for better medical imaging assistance.",
        tags: [
            {
                name: "tensorflow",
                color: "blue-text-gradient",
            },
            {
                name: "cgan",
                color: "green-text-gradient",
            },
            {
                name: "medical-imaging",
                color: "pink-text-gradient",
            },
        ],
        image: "ctmri_image_placeholder",
        source_code_link: "https://github.com/yourusername/ct-from-mri",
        live_link: "https://your-ctfrommri-live-link.com",
    },
];

export { services, technologies, experiences, testimonials, projects };
