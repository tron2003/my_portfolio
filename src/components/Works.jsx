import React from "react";
import { motion } from "framer-motion";

import { Tilt } from "react-tilt";
import { styles } from "../style";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { p } from "framer-motion/client";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 gap-2 card-img_hover">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="github"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
            <div
              onClick={() => window.open(live_link, "_blank")}
              className="green-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <span className="text-white text-[16px] font-bold">🔗</span>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[15px]">{description}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <section id="project">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>My Work</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Projects</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p>
          <div
            variants={fadeIn("", "", 0.1, 1)}
            className="mt-3 text-secondary text-[17px] w-xl leading-[30px] xl:text-center xs:text-justify"
          >
            Throughout my academic journey and hands-on explorations, I’ve
            engineered a diverse range of projects — each rooted in curiosity,
            designed with intention, and executed with industry-aligned best
            practices. Whether it’s building scalable web applications,
            deploying deep learning models for medical imaging, or architecting
            intelligent systems, my projects reflect a problem-solving mindset
            combined with technical adaptability. From frontend finesse to
            backend logic, from algorithmic thinking to real-world deployment —
            each project sharpened my ability to bridge theory and practice,
            while continuously refining my understanding of modern tech stacks
            and software craftsmanship.
          </div>
          <div className="mt-20 flex flex-wrap gap-7">
            {projects.map((project, index) => (
              <ProjectCard
                key={`project-${index}`}
                index={index}
                {...project}
              />
            ))}
          </div>
        </motion.p>
      </div>
    </section>
  );
};

export default SectionWrapper(Works, "");
