import { motion } from "framer-motion";
import { styles } from "../style";
import { ComputersCanvas } from "./canvas";
// import { repeat } from "maath/dist/declarations/src/misc";
const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto ">
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl my-auto mx-auto ${styles.paddingX} flex flex-row items-start gap-5 `}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-4 h-4 rounded-full bg-[#915eff]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
        <div className={`${styles.heroHeadText} text-white`}>
          <h1>
            Hi, I'm <span className="text-[#915EFF]">Kanish</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-gray-100 `}>
            I develop intelligent AI models, user-friendly
            <br className="sm:block hidden" /> interfaces, and full-stack web
            applications
          </p>
        </div>
      </div>
      // …inside your Hero component…
      {/* push the canvas down 200px and give 100px gap below */}
      <ComputersCanvas />
      <div className="absolute xs:bottom-10  bottom-10 w-full flex justify-center items-center'  ">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
