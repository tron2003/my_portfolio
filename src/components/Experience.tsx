import { experiences, skills } from "../constants";

export default function Experience() {
  return (
    <section className="mb-stack-xl border-b-2 border-surface-container-high pb-stack-xl" id="kernel">
      <div className="flex items-center gap-4 mb-stack-md">
        <span className="text-neon-red font-body-md text-body-md">&gt;</span>
        <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">CAREER_DATA [KERNEL]</h2>
        <div className="h-px bg-surface-container-highest flex-grow ml-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Experience Module */}
        <div>
          <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
            Primary_Directives // Experience
          </h3>

          <div className="flex flex-col gap-6">
            {experiences.map((experience, index) => (
              <div key={index} className="bg-cyber-surface cyber-border p-4 relative group">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-red"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-body-md text-sm font-bold uppercase">{experience.title}</h4>
                    <p className="text-on-surface-variant text-[10px] font-label-sm uppercase mt-1">
                      {experience.company_name} / {experience.date}
                    </p>
                  </div>
                  <span className="bg-neon-red/10 text-neon-red border border-neon-red/30 px-1.5 py-0.5 text-[8px] font-label-sm mt-1">
                    {experience.icon}
                  </span>
                </div>
                <ul className="text-on-surface-variant font-label-sm text-[11px] leading-relaxed space-y-1">
                  {experience.points.map((point, idx) => (
                    <li key={idx}>&gt; {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills Module */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
              Training_Origins // Education
            </h3>

            <div className="bg-cyber-surface cyber-border p-4 relative">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-body-md text-sm font-bold uppercase">
                    B.Tech in Computer Science Engineering
                  </h4>
                  <p className="text-on-surface-variant text-[10px] font-label-sm uppercase mt-1">
                    Punjab Engineering College (PEC) / 2021 - 2025
                  </p>
                </div>
              </div>
              <p className="text-on-surface-variant font-label-sm text-[11px] leading-relaxed">
                &gt; CGPA: 7.18/10<br />
                &gt; Focus on AI/ML, Data Structures, and Web Technologies
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
              Tactical_Loadout // Skills
            </h3>

            <div className="bg-cyber-black cyber-border p-4 font-label-sm text-[11px] leading-relaxed space-y-2">
              <div>
                <span className="text-neon-red mr-2 block mb-1">LANGUAGES:</span>
                <span className="text-white text-[10px]">{skills.languages.join(", ")}</span>
              </div>
              <div>
                <span className="text-neon-red mr-2 block mb-1">WEB_STACK:</span>
                <span className="text-white text-[10px]">{skills.web.join(", ")}</span>
              </div>
              <div>
                <span className="text-neon-red mr-2 block mb-1">AI_FRAMEWORKS:</span>
                <span className="text-white text-[10px]">{skills.ai.join(", ")}</span>
              </div>
              <div>
                <span className="text-neon-red mr-2 block mb-1">DEVOPS_TOOLS:</span>
                <span className="text-white text-[10px]">{skills.devops.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
