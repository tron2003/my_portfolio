import { projects } from "../constants";

export default function Projects() {
  return (
    <section className="mb-stack-xl border-b-2 border-surface-container-high pb-stack-xl" id="projects">
      <div className="flex items-center gap-4 mb-stack-md">
        <span className="text-neon-red font-body-md text-body-md">&gt;</span>
        <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">EXECUTED_PROJECTS</h2>
        <div className="h-px bg-surface-container-highest flex-grow ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {projects.map((project, index) => (
          <div key={index} className="bg-cyber-surface cyber-border p-6 relative group hover:border-neon-red transition-colors duration-300">
            <div className="absolute top-2 right-2 font-label-sm text-[10px] text-on-surface-variant">
              ID:0x{(index + 1).toString(16).toUpperCase()}
            </div>

            <div className="h-40 w-full mb-4 cyber-border relative overflow-hidden bg-cyber-black flex items-center justify-center">
              <div className="text-6xl opacity-30">🚀</div>
            </div>

            <div className="mb-4 flex flex-wrap gap-1">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="bg-neon-red text-cyber-black text-[10px] font-label-sm px-1 py-0.5">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-body-md text-body-md text-white font-bold mb-2 uppercase">{project.name}</h3>

            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 h-16 overflow-hidden">
              {project.description}
            </p>

            <p className="font-label-sm text-[10px] text-neon-red mb-4">{project.date}</p>

            <a
              href={project.source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-neon-red text-neon-red font-label-sm text-label-sm py-2 uppercase hover:bg-neon-red hover:text-white transition-colors shadow-neon flex justify-center items-center gap-2 cursor-pointer"
            >
              VIEW_PROJECT <span className="text-sm">→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
