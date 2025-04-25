import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />

          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        {/* <Feedbacks /> */}
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>

        {/* <div className="">
          <button
            onClick={() => {
              throw new Error("This is your first error! 💥");
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "5px",
            }}
          >
            Break the world
          </button>
        </div> */}
        <div className="relative z-0">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
