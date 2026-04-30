"use client";
import { useRef } from "react";
import { useRainbow } from "@/hooks/animation";


const HeroSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  useRainbow(titleRef)

  return (
    <section>
      <div className="h-[85vh] w-full flex flex-col">
        <div className="flex-2 bg-background">
          <h1
            ref={titleRef}
            className="opacity-0 text-[clamp(3rem,10vw,8rem)] text-foreground tracking-tighter font-extrabold leading-none mt-[4rem] ml-[0.7rem] uppercase"
          >
            Darshanam
          </h1>
        </div>
        <div className="flex-7 bg-foreground">
          <div className="h-full w-full relative flex justify-center">
            <img
              src="/productcard.png"
              alt="product"
              className="w-full h-full object-cover object-bottom"
            />
            <div className="absolute w-[95%] top-[0.5rem] lg:top-auto lg:bottom-[0.4rem] lg:left-[1rem] lg:max-w-[35rem] bg-foreground">
              <p className="py-[0.5rem] pl-[0.5rem] text-[clamp(1.3rem,4vw,5rem)] lg:text-[clamp(2rem,2.5vw,7rem)] font-bold leading-[1.3rem] sm:leading-[clamp(1rem,3vw,2rem)] lg:leading-8 tracking-tighter bg-background text-white">
                WHERE ENGINEERING <br />
                MEETS EXCELLENCE
              </p>
              <p className="text-background py-[0.4rem] pl-[0.5rem] leading-none">
                DRIVE INTO THE FUTURE WITH US
              </p>
            </div>
            <div className="absolute w-[95%] bottom-[0.5rem] lg:right-[1rem] lg:max-w-[20rem] bg-foreground">
              <p className="py-[1rem] lg:py-[3rem] lg:px-[rem] text-[clamp(1.1rem,3vw,5rem)] lg:text-[clamp(1rem,1.4vw,7rem)] bg-background text-foreground text-center">
                LEARN MORE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
