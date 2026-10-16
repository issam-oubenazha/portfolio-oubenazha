export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    category: 'web' | 'mobile' | 'design' | 'ai' | 'cybersecurity';
    liveLink?: string;
    githubLink?: string;
    images: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Cyber X Radar – Advanced Threat Detection Platform",
        description: "A comprehensive real-time cybersecurity platform that monitors dark web activities, data breaches, and vulnerabilities. Provides complete digital risk visibility for organizations with advanced threat intelligence and automated incident response capabilities.",
        technologies: ["PHP", "Next.js", "Tailwind CSS", "REST API", "MySQL", "JavaScript", "HTML5", "CSS3"],
        category: "cybersecurity",
        liveLink: "https://scan.cyberxradar.com/",
        githubLink: "https://github.com/issam-oubenazha",
        images: [
            "/cyberxradar/1.png",
            "/cyberxradar/2.png",
            "/cyberxradar/3.png",
            "/cyberxradar/4.png",
            "/cyberxradar/5.png",
            "/cyberxradar/6.png",
            "/cyberxradar/7.png",
            "/cyberxradar/8.png",
            "/cyberxradar/9.png",
            "/cyberxradar/10.png",
            "/cyberxradar/11.png",
            "/cyberxradar/12.png",
            "/cyberxradar/13.png",
            "/cyberxradar/14.png",
            "/cyberxradar/15.png",
            "/cyberxradar/16.png",
            "/cyberxradar/17.png",
            "/cyberxradar/18.png",
            "/cyberxradar/19.png",
            "/cyberxradar/20.png"
        ]
    },

    {
        id: 2,
        title: "Gestion Stock - Premium Technology Marketplace",
        description: "Sophisticated French e-commerce platform specializing in premium technology products. Serves 50,000+ satisfied customers across 15+ countries with 24/7 support. Features advanced product filtering, AR product visualization, and comprehensive customer service system.",
        technologies: ["Python", "Mysql", "Tailwind CSS"], 
        category: "web",
        liveLink: "https:/",
        githubLink: "https://github.com/issam-oubenazha/Gestion-de-Stock",
        images: [
            "/Agristock/agristock0.png",
            "/Agristock/agristock1.png",
            "/Agristock/agristock2.png",
            "/Agristock/agristock3.png",
            "/Agristock/agristock4.png",
            "/Agristock/agristock5.png",
            "/Agristock/agristock6.png",
            "/Agristock/agristock7.png",
            "/Agristock/agristock8.png",
            "/Agristock/agristock9.png",
            "/Agristock/agristock10.png",
            "/Agristock/facture.png"
        ]
    }
];
