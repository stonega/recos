import cl from "classnames";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className="flex flex-nowrap overflow-hidden">
      <motion.div className="flex flex-row space-x-4 pr-4" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}

const InscriptionItem = ({ src, text }: { src: string; text: string }) => {
  const capsuleClassName =
    "h-12 rounded-full bg-green-200 dark:bg-green-400 md:text-xl tracking-wide px-4 flex flex-row justify-center items-center whitespace-nowrap leading-none";
  return (
    <div className={cl(capsuleClassName)}>
      <Image
        src={src}
        width={30}
        height={30}
        unoptimized
        alt={text}
        className="mx-2 rounded-full"
      />
      <span className="mr-2">{text}</span>
    </div>
  );
};

const Inscriptions = () => {
  return (
    <>
      <div className="-mx-4 flex flex-col space-y-4 rounded-none bg-green-300 py-10 dark:bg-green-800 md:mx-0 md:space-y-10 md:rounded-2xl md:bg-green-600">
        <ParallaxText baseVelocity={3}>
          <InscriptionItem
            text="行万里路 读万卷书"
            src="https://lushu-book.vercel.app/img/logo.jpg"
          />
          <InscriptionItem
            text="要敢于去相信"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIWmezFeb7NGRPQ8S2AYBdpwzVb16YvmwxOxJRkKp1ud6aymWW"
          />
          <InscriptionItem
            text="Houston we have a podcast"
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQCDEysr0dNqI8klEvYKNfs4H1sjQ0kUcV_Wmy8vgsp2wMgIUJQ"
          />
          <InscriptionItem
            text="行万里路 读万卷书"
            src="https://lushu-book.vercel.app/img/logo.jpg"
          />
          <InscriptionItem
            text="要敢于去相信"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIWmezFeb7NGRPQ8S2AYBdpwzVb16YvmwxOxJRkKp1ud6aymWW"
          />
          <InscriptionItem
            text="Houston we have a podcast"
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQCDEysr0dNqI8klEvYKNfs4H1sjQ0kUcV_Wmy8vgsp2wMgIUJQ"
          />
        </ParallaxText>
        <ParallaxText baseVelocity={-3}>
          <InscriptionItem
            text="Hello and welcome to our brand new arseblog arsecast"
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS4ryNTGc_AMI3XDy5cZxzE0XdS4R5XbcojqLzoJYSvhpZbSZOf"
          />
          <InscriptionItem
            text="This is JS party"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQbBpZWBsd2mXR2N5EKDbY4nUNF8AV2_2XE53BdBNZvCm5maC"
          />
          <InscriptionItem
            text="Hello and welcome to our brand new arseblog arsecast"
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS4ryNTGc_AMI3XDy5cZxzE0XdS4R5XbcojqLzoJYSvhpZbSZOf"
          />
          <InscriptionItem
            text="This is JS party"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQbBpZWBsd2mXR2N5EKDbY4nUNF8AV2_2XE53BdBNZvCm5maC"
          />
        </ParallaxText>
        <ParallaxText baseVelocity={3}>
          <InscriptionItem
            text="我是一直在找酒喝的钱老板"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdauM5j6FxPksbpxNkNP1FbB0M2wqQkddjgZc8o8xbTZyVh4tN"
          />
          <InscriptionItem
            text="我们的字是文字的字"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa582Hcero1WCB6_XNSzD0ReJ5iATP_8pPX1fFPtPfMoY8KeE"
          />
          <InscriptionItem
            text="我是一直在找酒喝的钱老板"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdauM5j6FxPksbpxNkNP1FbB0M2wqQkddjgZc8o8xbTZyVh4tN"
          />
          <InscriptionItem
            text="我们的字是文字的字"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa582Hcero1WCB6_XNSzD0ReJ5iATP_8pPX1fFPtPfMoY8KeE"
          />
        </ParallaxText>
        <ParallaxText baseVelocity={-3}>
          <InscriptionItem
            text="いやー決まりましたね。 何が?"
            src="https://cachedimages.podchaser.com/256x256/aHR0cDovL3p1dHN1LWhhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNy8xMi9hcmNoaXZlLmpwZw%3D%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D"
          />
          <InscriptionItem
            text="Der Abend aus einige Gedichte von Friedrich Schiller."
            src="https://cachedimages.podchaser.com/256x256/aHR0cHM6Ly9hcmNoaXZlLm9yZy9kb3dubG9hZC9saWJyaXZveGNDRENvdmVyQXJ0MzUvZWluaWdlZ2VkaWNodGVfMTYwNy5qcGc%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D"
          />
          <InscriptionItem
            text="いやー決まりましたね。 何が?"
            src="https://cachedimages.podchaser.com/256x256/aHR0cDovL3p1dHN1LWhhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAxNy8xMi9hcmNoaXZlLmpwZw%3D%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D"
          />
          <InscriptionItem
            text="Der Abend aus einige Gedichte von Friedrich Schiller."
            src="https://cachedimages.podchaser.com/256x256/aHR0cHM6Ly9hcmNoaXZlLm9yZy9kb3dubG9hZC9saWJyaXZveGNDRENvdmVyQXJ0MzUvZWluaWdlZ2VkaWNodGVfMTYwNy5qcGc%3D/aHR0cHM6Ly93d3cucG9kY2hhc2VyLmNvbS9pbWFnZXMvbWlzc2luZy1pbWFnZS5wbmc%3D"
          />
        </ParallaxText>
      </div>
    </>
  );
};

export default Inscriptions;
