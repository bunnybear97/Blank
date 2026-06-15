const config = {
  title: "Subhasree Babu | Full-Stack Developer",
  description: {
    long: "Explore the portfolio of Subhasree Babu, a Computer Science graduate and full-stack developer specializing in Java, Spring Boot, React, and TypeScript. Discover my latest work, including EasyFind and Together Culture. Let's build something amazing together!",
    short:
      "Discover the portfolio of Subhasree Babu, a Computer Science graduate and full-stack developer creating reliable, modern web applications.",
  },
  keywords: [
    "Subhasree Babu",
    "portfolio",
    "full-stack developer",
    "computer science graduate",
    "web development",
    "EasyFind",
    "Together Culture",
    "web design",
    "Java",
    "Spring Boot",
    "React",
    "Next.js",
    "TypeScript",
  ],
  author: "Subhasree Babu",
  email: "subhasreebabu11.b@gmail.com",
  site: "https://bunnybear97.github.io/Blank",

  // for github stars button
  githubUsername: "bunnybear97",
  githubRepo: "Blank",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    linkedin: "#",
    github: "https://github.com/bunnybear97",
    twitter: "#",
    instagram: "#",
  },
};
export { config };
