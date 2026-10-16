export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    category: 'web' | 'mobile' | 'Desktop Application' | 'ai' | 'cybersecurity';
    liveLink?: string;
    githubLink?: string;
    images: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: "9biya Store – Boutique en ligne",
        description: "9biya Store est un projet de boutique en ligne conçu pour offrir une expérience d’achat simple, moderne et intuitive. La plateforme permet aux utilisateurs de découvrir les produits, de consulter leurs détails et de naviguer facilement entre les différentes sections du site.",
        technologies: ["JavaScript", "Vue", "Tailwind CSS", "HTML"],
        category: "web",
        liveLink: "https://",
        githubLink: "https://github.com/issam-oubenazha/9biya-store",
        images: [
            "/9biya-store/qbiya1.png",
            "/9biya-store/qbiya2.png",
            "/9biya-store/qbiya3.png",
            "/9biya-store/qbiya4.png",
            "/9biya-store/qbiya5.png",
            "/9biya-store/qbiya6.png",
            "/9biya-store/qbiya7.png",
            "/9biya-store/qbiya8.png",
            "/9biya-store/qbiya9.png"
        ]
    },

    {
        id: 2,
        title: "Agri_Stock - Agricultural Stock Management System",
        description: "Agri_Stock is a desktop application designed to simplify agricultural inventory management. Built with Python, Tkinter, and MySQL, it helps users organize and manage agricultural products efficiently through a user-friendly interface",
        technologies: ["Python", "Mysql", "html","PowerShell","Batch file","Tkinter"], 
        category: "Desktop Application",
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
