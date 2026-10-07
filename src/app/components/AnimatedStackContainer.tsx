import { useLocation, useNavigationType, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Native iOS/Android Stack Navigator animation specifications
const pageTransition: any = {
  type: "tween",
  ease: [0.32, 0.72, 0, 1], // Native App Stack cubic-bezier curve (iOS spec)
  duration: 0.28,
};

export default function AnimatedStackContainer() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const outlet = useOutlet();

  const isPop = navigationType === "POP";
  const isPush = navigationType === "PUSH";

  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden bg-[#f7f9fb]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={
            isPop
              ? { x: "-20%", opacity: 0.85 }
              : isPush
              ? { x: "100%", opacity: 1 }
              : { opacity: 0 }
          }
          animate={{
            x: "0%",
            opacity: 1,
          }}
          exit={
            isPop
              ? { x: "100%", opacity: 1 }
              : isPush
              ? { x: "-20%", opacity: 0.85 }
              : { opacity: 0 }
          }
          transition={pageTransition}
          className="w-full h-full min-h-full relative bg-[#f7f9fb]"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
