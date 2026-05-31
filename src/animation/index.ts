import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);
type ScrollTriggerVars = InstanceType<typeof ScrollTrigger>["vars"];
// gsap.registerEffect({
//   name: "rainbow",
//   effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
//     const tl = gsap.timeline({
//     //   scrollTrigger: {
//     //     trigger: targets as gsap.DOMTarget,
//     //     start: "top center",
//     //     toggleActions: "play none none none",
//     //   },
//     });

//     tl.fromTo(
//       targets,
//       {
//         opacity: 0,
//         x: -50,
//       },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.6,
//         ease: "power3.out",
//         ...config,
//       },
//     );

//     tl.to(
//       targets,
//       {
//         x: 1600,
//         duration: 0.4,
//         scrollTrigger: {
//           trigger: targets as gsap.DOMTarget,
//           start: "top top",
//           toggleActions: "play none none none",
//         },
//         ...config,
//       },
//       "+=1",
//     );

//     return tl;
//   },
//   defaults: {},
//   extendTimeline: true,
// });

type RainbowConfig = {
  durationIn?: number;
  durationOut?: number;
  easeIn?: string;
  easeOut?: string;
  scrollTrigger?: ScrollTriggerVars;
};

gsap.registerEffect({
  name: "rainbow",
  effect: (
    targets: gsap.TweenTarget,
    config: RainbowConfig = {},
  ): gsap.core.Timeline => {
    const {
      durationIn = 0.6,
      durationOut = 0.6,
      easeIn = "power3.out",
      easeOut = "none",
      scrollTrigger = {},
    } = config;

    const el = gsap.utils.toArray(targets);

    const trigger = el[0] as Element;

    // -------------------------
    // 1. SET INITIAL STATE (NO ANIMATION)
    // -------------------------
    gsap.set(el, {
      opacity: 0,
      x: -50,
    });

    // -------------------------
    // 2. LOAD ANIMATION (independent)
    // -------------------------
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: durationIn,
      ease: easeIn,
      overwrite: "auto",
    });

    // -------------------------
    // 3. SCROLL ANIMATION (ONLY THIS IS SCROLL DRIVEN)
    // -------------------------
    gsap.to(el, {
      x: () => window.innerWidth,
      duration: durationOut,
      ease: easeOut,
      overwrite: "auto",
      scrollTrigger: {
        trigger,
        start: "top 16.5%",
        scrub: true,
        markers: false,
        invalidateOnRefresh: true,
        ...scrollTrigger,
      },
    });

    return gsap.timeline();
  },
});
