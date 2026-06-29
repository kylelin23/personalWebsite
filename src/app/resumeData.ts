export type Skill = {
  name: string;
  img: string;
  imgAlt: string;
  key: number;
};

export const programmingLanguages: Skill[] = [
  {
    name: "Python",
    img: "assets/logos/python-logo-only.png",
    imgAlt: "Python Logo",
    key: 0,
  },
  {
    name: "Java",
    img: "assets/logos/javaLogo.png",
    imgAlt: "Java Logo",
    key: 1,
  },
  {
    name: "C",
    img: "assets/logos/cLogo.png",
    imgAlt: "C Logo",
    key: 2,
  },
  {
    name: "SQL (Postgres)",
    img: "assets/logos/postgresqlLogo.png",
    imgAlt: "PostgreSQL Logo",
    key: 3,
  },
  {
    name: "JavaScript",
    img: "assets/logos/javascriptLogo.png",
    imgAlt: "JavaScript Logo",
    key: 4,
  },
  {
    name: "TypeScript",
    img: "assets/logos/typescriptLogo.png",
    imgAlt: "TypeScript Logo",
    key: 5,
  },
  {
    name: "HTML",
    img: "assets/logos/htmlIcon.png",
    imgAlt: "HTML Logo",
    key: 6,
  },
  {
    name: "CSS",
    img: "assets/logos/cssIcon.png",
    imgAlt: "CSS Logo",
    key: 7,
  },
];

export const frameworks: Skill[] = [
  {
    name: "React Native",
    img: "assets/logos/reactNativeIcon.png",
    imgAlt: "React Native Logo",
    key: 0,
  },
  {
    name: "React",
    img: "assets/logos/reactNativeIcon.png",
    imgAlt: "React Logo",
    key: 1,
  },
  {
    name: "Vite",
    img: "assets/logos/viteLogo.png",
    imgAlt: "Vite Logo",
    key: 2,
  },
];

export const developerTools: Skill[] = [
  {
    name: "Git",
    img: "assets/logos/gitLogo.png",
    imgAlt: "Git Logo",
    key: 0,
  },
  {
    name: "GitHub",
    img: "assets/logos/github-mark.png",
    imgAlt: "GitHub Logo",
    key: 1,
  },
  {
    name: "Docker",
    img: "assets/logos/dockerLogo.svg",
    imgAlt: "Docker Logo",
    key: 2,
  },
  {
    name: "VSCode",
    img: "assets/logos/vscode.svg",
    imgAlt: "VSCode Logo",
    key: 3,
  },
  {
    name: "MongoDB",
    img: "assets/logos/mongoDBLogo.png",
    imgAlt: "MongoDB Logo",
    key: 4,
  },
];

export const certifications: Skill[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    img: "assets/logos/awsIcon.png",
    imgAlt: "AWS Logo",
    key: 0,
  },
];
