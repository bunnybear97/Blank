import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
    return (
        <div
            className="flex flex-col items-center justify-center py-20"
            id="projects"
        >
            <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
                My Projects
            </h1>
            <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
                <ProjectCard
                    src="/NextWebsite.png"
                    title="EasyFind"
                    description="A full-stack application that helps users quickly locate and manage items, built with a focus on clean architecture and an intuitive interface."
                />
                <ProjectCard
                    src="/CardImage.png"
                    title="Together Culture"
                    description="A community-focused web platform designed to connect people through shared cultural events and activities."
                />
            </div>
        </div>
    );
};

export default Projects;