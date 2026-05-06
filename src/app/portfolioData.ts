export type Project = {
    title: string;
    tech: string;
    description: string;
    image: string;
    imageAlt: string;
    imageLink: string;
    imageWidth: number;
    key: number;
}

const projects: Project[] = [
    {
        title: "Early Head Start Learning Library",
        tech: 'React.js, Vite',
        description: 'This is a website for teachers to access a database of best teaching practices for infants and toddlers for the Neighborhood House Association. There are many resources to access teaching strategies from, however this website will be a centralized place to access all of them. The website will accomplish this by fetching, filtering (based off of dropdowns), and displaying data from over 2000 rows of google sheet data. I was the project lead in charge of a group of four (one first year who I mentored in React.js and two UI designers). As a project lead, I led weekly team meetings and assigned work.',
        image: "assets/EHSProjectScreenshot.png",
        imageAlt: "EHS Website Screenshot",
        imageLink: 'https://ehs-learning-library-pb25.onrender.com',
        imageWidth: 300,
        key: 0,
    },
    {
        title: "Cat Adoption App",
        tech: 'React Native, Expo Go',
        description: "The goal of this app is to let new cat adopters have a more smooth adoption. There are countless things to remember and worry about when adopting a cat, such as what to feed them, whether or not to let them outside, and much more. So, this app's goal is to create a user-friendly way for new cat adopters to easily access reliable information on cat adoption.",
        image: "assets/catAdoptionAppScreenshot.png",
        imageAlt: "Cat Adoption App Screenshot",
        imageLink: 'https://github.com/kylelin23/catAdoptionApp',
        imageWidth: 100,
        key: 1,
    },
    {
        title: "Aether",
        tech: 'React Native, Expo Go, Supabase',
        description: "When college students and young adults enter the adult world, they face many challenges, one of which is financial responsibility. Being a student in college or entering life as an adult allows individuals to spend as much as they like on items such as food, fashion, and accessories. This in turn creates bad spending habits leading to irresponsible and unchecked spending. The purpose of this app is to help control this chaotic spending.",
        image: "assets/aetherScreenshot.png",
        imageAlt: "Aether Screenshot",
        imageLink: 'https://github.com/kylelin23/aether',
        imageWidth: 100,
        key: 2,
    },
    {
        title: "Personal Website",
        tech: 'React',
        description: "This is a personal website built using the Hack4Impact Starter Pack! The goal of this website is to showcase who I am and my skills as a software engineer. Features of the website include an about me page, my resume, a blog, a portfolio, and a contact page in case you ever need to contact me!",
        image: "assets/personal-website.png",
        imageAlt: "Personal Website Screenshot",
        imageLink: '/',
        imageWidth: 300,
        key: 3,
    },
];
export default projects;