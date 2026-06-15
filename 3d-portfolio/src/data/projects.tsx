import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import {
  RiNextjsFill,
  RiNodejsFill,
  RiReactjsFill,
} from "react-icons/ri";
import {
  SiCsharp,
  SiCplusplus,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiPython,
  SiSpring,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  next: { title: "Next.js", bg: "black", fg: "white", icon: <RiNextjsFill /> },
  react: { title: "React", bg: "black", fg: "white", icon: <RiReactjsFill /> },
  node: { title: "Node.js", bg: "black", fg: "white", icon: <RiNodejsFill /> },
  ts: { title: "TypeScript", bg: "black", fg: "white", icon: <SiTypescript /> },
  js: { title: "JavaScript", bg: "black", fg: "white", icon: <SiJavascript /> },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  java: { title: "Java", bg: "black", fg: "white", icon: <FaJava /> },
  spring: { title: "Spring Boot", bg: "black", fg: "white", icon: <SiSpring /> },
  python: { title: "Python", bg: "black", fg: "white", icon: <SiPython /> },
  cpp: { title: "C++", bg: "black", fg: "white", icon: <SiCplusplus /> },
  csharp: { title: "C#", bg: "black", fg: "white", icon: <SiCsharp /> },
  mysql: { title: "MySQL", bg: "black", fg: "white", icon: <SiMysql /> },
  mongo: { title: "MongoDB", bg: "black", fg: "white", icon: <SiMongodb /> },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "easyfind",
    category: "Web app",
    title: "EasyFind",
    src: "/assets/seo/og-image.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.java, PROJECT_SKILLS.spring, PROJECT_SKILLS.mysql],
    },
    live: "#",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            EasyFind is a full-stack application that helps users quickly
            locate and manage items, built with a focus on clean architecture
            and an intuitive interface using Java, Spring Boot, and React.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
        </div>
      );
    },
  },
  {
    id: "togetherculture",
    category: "Community platform",
    title: "Together Culture",
    src: "/assets/seo/og-image.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.js, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.mongo],
    },
    live: "#",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Together Culture is a community-focused web platform designed to
            connect people through shared cultural events and activities.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
        </div>
      );
    },
  },
];

export default projects;
