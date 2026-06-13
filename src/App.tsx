import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import emailjs from "emailjs-com";
import MatrixRain from "./components/MatrixRain";

export default function App() {
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const templateParams = {
        to_email: import.meta.env.VITE_CONTACT_EMAIL || "your-email@example.com",
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      };

      console.log("Sending with params:", templateParams);
      console.log("Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID);
      console.log("Template ID:", import.meta.env.VITE_EMAILJS_TEMPLATE_ID);

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setFeedback({ type: "success", message: "DATA_TRANSMITTED_SUCCESSFULLY. AWAITING_RESPONSE..." });
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (error: any) {
      console.error("EmailJS Error:", error);
      const errorMsg = error?.text || error?.message || "TRANSMISSION_FAILED";
      setFeedback({ type: "error", message: `ERROR: ${errorMsg}` });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const container = threeContainerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const neonRed = 0xff003c;
    const darkGrey = 0x1a1c1c;

    const skullGroup = new THREE.Group();

    const craniumGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const material = new THREE.MeshPhongMaterial({ 
        color: darkGrey, 
        wireframe: true, 
        emissive: neonRed, 
        emissiveIntensity: 0.5 
    });
    const cranium = new THREE.Mesh(craniumGeo, material);
    skullGroup.add(cranium);

    const jawGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const jaw = new THREE.Mesh(jawGeo, material);
    jaw.position.y = -0.6;
    jaw.position.z = 0.1;
    skullGroup.add(jaw);

    const eyeGeo = new THREE.BoxGeometry(0.3, 0.2, 0.2);
    const eyeMat = new THREE.MeshBasicMaterial({ color: neonRed });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 0.1, 0.55);
    skullGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 0.1, 0.55);
    skullGroup.add(rightEye);

    for(let i = -2; i <= 2; i++) {
        const toothGeo = new THREE.BoxGeometry(0.1, 0.15, 0.1);
        const tooth = new THREE.Mesh(toothGeo, eyeMat);
        tooth.position.set(i * 0.15, -0.45, 0.5);
        skullGroup.add(tooth);
    }

    group.add(skullGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(neonRed, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.1;
        group.rotation.x += (mouseY * 0.5 - group.rotation.x) * 0.1;
        
        skullGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;
        
        renderer.render(scene, camera);
    };

    const handleResize = () => {
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="bg-transparent text-on-background font-body-md min-h-screen flex flex-col selection:bg-neon-red selection:text-white relative z-0">
      
      {/* Cyberpunk Ambient Red Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0B0B0B] overflow-hidden">
        <MatrixRain />
        {/* Glowing Red Orbs (Shader-like ambient light) */}
        <div className="absolute top-[-20%] left-[10%] w-[80%] h-[80%] opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #FF003C 0%, transparent 60%)', filter: 'blur(100px)', animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 50%, #FF003C 0%, transparent 60%)', filter: 'blur(80px)', animationDuration: '12s', animationDelay: '2s' }}></div>
        
        {/* Red Tech Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#FF003C 1px, transparent 1px), linear-gradient(90deg, #FF003C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 20%, #0B0B0B 100%)' }}></div>
      </div>

      {/* TopNavBar */}
      <nav className="bg-surface dark:bg-surface text-primary dark:text-primary w-full top-0 left-0 border-b-2 border-primary dark:border-primary shadow-neon flex justify-between items-center px-gutter py-unit h-16 z-50 sticky">
        <div className="font-headline-md text-headline-md text-primary dark:text-primary tracking-tighter">
          SYS_COMMAND_V1.0
        </div>
        
        {/* Web Navigation */}
        <div className="hidden md:flex items-center gap-gutter">
          <a className="font-body-md text-body-md uppercase tracking-widest text-on-surface dark:text-on-surface border-b-2 border-primary pb-1 active:translate-x-1 active:translate-y-1" href="#">ROOT</a>
          <a className="font-body-md text-body-md uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 px-2 py-1" href="#projects">LOGS</a>
          <a className="font-body-md text-body-md uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 px-2 py-1" href="#kernel">KERNEL</a>
          <a className="font-body-md text-body-md uppercase tracking-widest text-on-surface-variant dark:text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 px-2 py-1" href="#contact">UPLINK</a>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative border-b border-outline-variant">
            <input className="bg-transparent border-none text-label-sm font-label-sm text-on-surface focus:ring-0 px-2 py-1 w-32 placeholder-on-surface-variant focus:outline-none" placeholder="SEARCH_DB..." type="text"/>
            <span className="material-symbols-outlined text-primary text-sm absolute right-1 top-1.5">search</span>
          </div>
          <button className="material-symbols-outlined hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 p-1">terminal</button>
          <button className="material-symbols-outlined hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 p-1">sensors</button>
          <button className="material-symbols-outlined hover:bg-primary-container hover:text-on-primary-container transition-all duration-75 active:translate-x-1 active:translate-y-1 p-1 hidden md:block">settings</button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant z-50 flex justify-around py-2">
        <a className="flex flex-col items-center text-primary" href="#">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>directory_sync</span>
          <span className="font-label-sm text-[10px] mt-1">ROOT</span>
        </a>
        <a className="flex flex-col items-center text-on-surface-variant" href="#projects">
          <span className="material-symbols-outlined">memory</span>
          <span className="font-label-sm text-[10px] mt-1">LOGS</span>
        </a>
        <a className="flex flex-col items-center text-on-surface-variant" href="#kernel">
          <span className="material-symbols-outlined">database</span>
          <span className="font-label-sm text-[10px] mt-1">KERNEL</span>
        </a>
        <a className="flex flex-col items-center text-on-surface-variant" href="#contact">
          <span className="material-symbols-outlined">rocket_launch</span>
          <span className="font-label-sm text-[10px] mt-1">UPLINK</span>
        </a>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col container mx-auto px-margin-sm md:px-gutter max-w-7xl pt-stack-xl pb-32">
        
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between min-h-[614px] border-b-2 border-surface-container-high pb-stack-xl mb-stack-xl relative">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none hidden md:block" style={{ backgroundImage: "radial-gradient(#FF003C 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
          
          <div className="w-full md:w-1/2 relative z-10">
            <div className="inline-block bg-neon-red text-cyber-black font-label-sm text-label-sm px-2 py-1 mb-stack-md uppercase shadow-neon">
              SYS.STATUS: ONLINE
            </div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-stack-xs uppercase cyber-cursor shadow-neon bg-transparent" style={{ textShadow: "0px 0px 8px rgba(255,0,60,0.5)", borderLeft: "4px solid #FF003C", paddingLeft: "16px" }}>
              OPERATOR_ARCHITECT
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-xl max-w-2xl pl-5 mt-4">
              &gt; SPECIALIZING_IN_HIGH_SPEED_INTERFACES<br/>
              &gt; MINIMAL_LATENCY<br/>
              &gt; MAXIMUM_IMPACT
            </p>
            <div className="flex gap-4 pl-5">
              <a className="bg-neon-red text-white font-label-sm text-label-sm px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-neon-red transition-colors glitch-hover inline-flex items-center gap-2" href="#projects">
                <span className="material-symbols-outlined text-sm">play_arrow</span> INITIATE_SEQUENCE
              </a>
              <a className="border border-neon-red text-neon-red font-label-sm text-label-sm px-6 py-3 uppercase tracking-widest hover:bg-neon-red hover:text-white transition-colors shadow-neon inline-flex items-center gap-2" href="#contact">
                <span className="material-symbols-outlined text-sm">wifi_tethering</span> ESTABLISH_LINK
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative z-10 mt-10 md:mt-0 flex justify-center items-center">
            <div className="w-full h-[400px] bg-transparent" style={{ display: "block" }}>
              <div id="threejs-container" ref={threeContainerRef} style={{ width:"100%", height:"100%" }}></div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-stack-xl border-b-2 border-surface-container-high pb-stack-xl" id="projects">
          <div className="flex items-center gap-4 mb-stack-md">
            <span className="text-neon-red font-body-md text-body-md">&gt;</span>
            <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">EXECUTED_PROJECTS</h2>
            <div className="h-px bg-surface-container-highest flex-grow ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* Project Card 1 */}
            <div className="bg-cyber-surface cyber-border p-6 relative group hover:border-neon-red transition-colors duration-300">
              <div className="absolute top-2 right-2 font-label-sm text-[10px] text-on-surface-variant">ID:0x1A</div>
              <div className="h-40 w-full mb-4 cyber-border relative overflow-hidden bg-cyber-black">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-6xl text-neon-red">hub</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="bg-neon-red text-cyber-black text-[10px] font-label-sm px-1 py-0.5 mr-2">SYS_UI</span>
                <span className="bg-surface-container-high text-white text-[10px] font-label-sm px-1 py-0.5">REACT.JS</span>
              </div>
              <h3 className="font-body-md text-body-md text-white font-bold mb-2 uppercase">NEURAL_NET_DASHBOARD</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-6 h-12 overflow-hidden">
                Real-time visualization interface for localized neural network processing nodes.
              </p>
              <button className="w-full border border-neon-red text-neon-red font-label-sm text-label-sm py-2 uppercase hover:bg-neon-red hover:text-white transition-colors shadow-neon flex justify-center items-center gap-2 cursor-pointer">
                RUN_PROGRAM <span className="material-symbols-outlined text-sm">terminal</span>
              </button>
            </div>
            
            {/* Project Card 2 */}
            <div className="bg-cyber-surface cyber-border p-6 relative group hover:border-neon-red transition-colors duration-300">
              <div className="absolute top-2 right-2 font-label-sm text-[10px] text-on-surface-variant">ID:0x2B</div>
              <div className="h-40 w-full mb-4 cyber-border relative overflow-hidden bg-cyber-black">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-6xl text-neon-red">database</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="bg-neon-red text-cyber-black text-[10px] font-label-sm px-1 py-0.5 mr-2">DATA_VIZ</span>
                <span className="bg-surface-container-high text-white text-[10px] font-label-sm px-1 py-0.5">WEBGL</span>
              </div>
              <h3 className="font-body-md text-body-md text-white font-bold mb-2 uppercase">QUANTUM_LEDGER_UI</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-6 h-12 overflow-hidden">
                High-performance rendering engine for cryptographic transaction tracking.
              </p>
              <button className="w-full border border-neon-red text-neon-red font-label-sm text-label-sm py-2 uppercase hover:bg-neon-red hover:text-white transition-colors shadow-neon flex justify-center items-center gap-2 cursor-pointer">
                RUN_PROGRAM <span className="material-symbols-outlined text-sm">terminal</span>
              </button>
            </div>
            
            {/* Project Card 3 */}
            <div className="bg-cyber-surface cyber-border p-6 relative group hover:border-neon-red transition-colors duration-300">
              <div className="absolute top-2 right-2 font-label-sm text-[10px] text-on-surface-variant">ID:0x3C</div>
              <div className="h-40 w-full mb-4 cyber-border relative overflow-hidden bg-cyber-black">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-6xl text-neon-red">security</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="bg-neon-red text-cyber-black text-[10px] font-label-sm px-1 py-0.5 mr-2">SECURITY</span>
                <span className="bg-surface-container-high text-white text-[10px] font-label-sm px-1 py-0.5">VUE.JS</span>
              </div>
              <h3 className="font-body-md text-body-md text-white font-bold mb-2 uppercase">FIREWALL_CONTROL_PANEL</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-6 h-12 overflow-hidden">
                Tactical oversight interface for managing inbound autonomous threats.
              </p>
              <button className="w-full border border-neon-red text-neon-red font-label-sm text-label-sm py-2 uppercase hover:bg-neon-red hover:text-white transition-colors shadow-neon flex justify-center items-center gap-2 cursor-pointer">
                RUN_PROGRAM <span className="material-symbols-outlined text-sm">terminal</span>
              </button>
            </div>
          </div>
        </section>

        {/* Career Data (Kernel) */}
        <section className="mb-stack-xl border-b-2 border-surface-container-high pb-stack-xl" id="kernel">
          <div className="flex items-center gap-4 mb-stack-md">
            <span className="text-neon-red font-body-md text-body-md">&gt;</span>
            <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">CAREER_DATA [KERNEL]</h2>
            <div className="h-px bg-surface-container-highest flex-grow ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Experience Module */}
            <div>
              <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Primary_Directives // Experience</h3>
              
              <div className="flex flex-col gap-6">
                <div className="bg-cyber-surface cyber-border p-4 relative group">
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-red"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-body-md text-sm font-bold uppercase">Senior Frontend Engineer</h4>
                      <p className="text-on-surface-variant text-[10px] font-label-sm uppercase mt-1">CyberDyne Systems / 2022 - Present</p>
                    </div>
                    <span className="bg-neon-red/10 text-neon-red border border-neon-red/30 px-1.5 py-0.5 text-[8px] font-label-sm mt-1">ACTIVE</span>
                  </div>
                  <p className="text-on-surface-variant font-label-sm text-[11px] leading-relaxed">
                    &gt; Architected high-frequency trading dashboards.<br/>
                    &gt; Reduced render latency by 45% using WebGL/React.<br/>
                    &gt; Led a squad of 5 operatives in core system migrations.
                  </p>
                </div>

                <div className="bg-cyber-surface cyber-border p-4 relative group opacity-80 hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-body-md text-sm font-bold uppercase">UI Developer</h4>
                      <p className="text-on-surface-variant text-[10px] font-label-sm uppercase mt-1">Nexus Corp / 2019 - 2022</p>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-label-sm text-[11px] leading-relaxed">
                    &gt; Built component library for internal telemetry tools.<br/>
                    &gt; Implemented rigid grid systems and brutalist guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Education & Skills Module */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Training_Origins // Education</h3>
                
                <div className="bg-cyber-surface cyber-border p-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-body-md text-sm font-bold uppercase">B.S. Computer Science</h4>
                      <p className="text-on-surface-variant text-[10px] font-label-sm uppercase mt-1">MIT (Massachusetts Inst. of Tech) / 2015 - 2019</p>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-label-sm text-[11px] leading-relaxed">
                    &gt; Focus on Human-Computer Interaction & Systems Architecture.<br/>
                    &gt; Honors: Summa Cum Laude
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-neon-red font-label-sm text-[10px] uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Tactical_Loadout // Skills</h3>
                
                <div className="bg-cyber-black cyber-border p-4 font-label-sm text-[11px] leading-relaxed">
                  <div className="mb-2">
                    <span className="text-neon-red mr-2">LANGUAGES:</span>
                    <span className="text-white">TypeScript, JavaScript, GLSL, Python</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-neon-red mr-2">FRAMEWORKS:</span>
                    <span className="text-white">React, Next.js, Three.js, Tailwind CSS</span>
                  </div>
                  <div>
                    <span className="text-neon-red mr-2">SYS_TOOLS:</span>
                    <span className="text-white">Git, Docker, Vite, Figma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Bio Data */}
        <section className="mb-stack-xl border-b-2 border-surface-container-high pb-stack-xl flex flex-col md:flex-row gap-gutter" id="about">
          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-4 mb-stack-md">
              <span className="text-neon-red font-body-md text-body-md">&gt;</span>
              <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">BIO_DATA</h2>
            </div>
            <div className="bg-cyber-surface cyber-border p-4 relative">
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neon-red"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neon-red"></div>
              <ul className="font-label-sm text-label-sm space-y-2 text-on-surface-variant">
                <li><span className="text-neon-red mr-2">CLASS:</span> FRONT_END_ENGINEER</li>
                <li><span className="text-neon-red mr-2">LEVEL:</span> 99</li>
                <li><span className="text-neon-red mr-2">FACTION:</span> INDEPENDENT</li>
                <li><span className="text-neon-red mr-2">LOCATION:</span> SECTOR_7</li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-2/3 bg-cyber-black cyber-border p-6 font-label-sm text-label-sm text-on-surface-variant leading-relaxed relative mt-10 md:mt-0">
            <span className="absolute top-2 left-2 text-surface-container-high material-symbols-outlined text-4xl">format_quote</span>
            <p className="relative z-10 mt-4">
              &gt; INITIALIZING_MEMORY_BANK...<br/>
              &gt; DATA_RETRIEVAL_SUCCESSFUL.<br/><br/>
              I engineer digital structures that prioritize raw performance and uncompromising aesthetics. Operating at the intersection of brutalist design and cutting-edge web technologies, my objective is to construct interfaces that do not merely function, but command attention.<br/><br/>
              I eliminate bloat. I enforce rigid grids. I weaponize contrast.<br/><br/>
              &gt; END_OF_FILE.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-stack-lg" id="contact">
          <div className="flex items-center gap-4 mb-stack-md">
            <span className="text-neon-red font-body-md text-body-md">&gt;</span>
            <h2 className="font-headline-md text-headline-md text-white uppercase tracking-widest">LINK_ESTABLISHED</h2>
            <div className="h-px bg-surface-container-highest flex-grow ml-4"></div>
          </div>
          <div className="bg-cyber-surface cyber-border p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-red"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-red"></div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[10px] text-neon-red uppercase">TRANSMITTER_ID [NAME]</label>
                <input
                  className="bg-transparent border-0 border-b border-white/30 cyber-input text-white font-body-md py-2 px-0 focus:ring-0 focus:border-b-neon-red outline-none"
                  placeholder="ENTER_ALIAS"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[10px] text-neon-red uppercase">COMM_CHANNEL [EMAIL]</label>
                <input
                  className="bg-transparent border-0 border-b border-white/30 cyber-input text-white font-body-md py-2 px-0 focus:ring-0 focus:border-b-neon-red outline-none"
                  placeholder="ENTER_ADDRESS"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="font-label-sm text-[10px] text-neon-red uppercase">PAYLOAD [MESSAGE]</label>
                <textarea
                  className="bg-transparent border-0 border-b border-white/30 cyber-input text-white font-body-md py-2 px-0 focus:ring-0 focus:border-b-neon-red outline-none resize-none h-24"
                  placeholder="ENCODE_MESSAGE..."
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>
              {feedback && (
                <div className={`font-label-sm text-[11px] uppercase tracking-widest py-2 px-3 ${
                  feedback.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}>
                  {feedback.message}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-neon-red text-white font-label-sm text-label-sm py-4 uppercase tracking-widest hover:bg-white hover:text-neon-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors glitch-hover shadow-neon self-start px-8 cursor-pointer">
                {isLoading ? "TRANSMITTING..." : "TRANSMIT_DATA"}
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-dim dark:bg-surface-dim w-full border-t border-outline-variant dark:border-outline-variant px-gutter py-4 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="font-label-sm text-label-sm tracking-tighter text-primary dark:text-primary animate-pulse">
          © 2024 NEURAL_LINK_ESTABLISHED // ALL_RIGHTS_RESERVED
        </div>
        <div className="flex gap-4">
          <a className="font-label-sm text-label-sm tracking-tighter text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary transition-colors" href="#">DEBUG</a>
          <a className="font-label-sm text-label-sm tracking-tighter text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary transition-colors" href="#">ENCRYPT</a>
          <a className="font-label-sm text-label-sm tracking-tighter text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary transition-colors" href="#">BYPASS</a>
        </div>
        <div className="font-headline-md text-primary">
          SYS_COMMAND_V1.0
        </div>
      </footer>
      
    </div>
  );
}
