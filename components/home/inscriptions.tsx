import cl from "classnames";
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

const Inscriptions = () => {
  const capsuleClassName =
    "h-12 rounded-full bg-green-200 dark:bg-green-400 text-2xl tracking-wide	px-4 flex flex-row justify-center items-center whitespace-nowrap leading-none overflow-hidden";
  return (
    <>
      <div className="flex flex-col space-y-8 rounded-2xl bg-green-600 py-8 dark:bg-green-900">
        <ParallaxText baseVelocity={3}>
          <div className={cl(capsuleClassName)}>行万里路 读万卷书</div>
          <div className={cl(capsuleClassName)}>要敢于去相信</div>
          <div className={cl(capsuleClassName)}>Houston we have a podcast</div>
          <div className={cl(capsuleClassName)}>行万里路 读万卷书</div>
          <div className={cl(capsuleClassName)}>要敢于去相信</div>
          <div className={cl(capsuleClassName)}>Houston we have a podcast</div>
        </ParallaxText>
        <ParallaxText baseVelocity={-3}>
          <div className={cl(capsuleClassName)}>
            Hello and welcome to our brand new arseblog arsecast
          </div>
          <div className={cl(capsuleClassName)}>This is JS party</div>
          <div className={cl(capsuleClassName)}>
            Hello and welcome to our brand new arseblog arsecast
          </div>
          <div className={cl(capsuleClassName)}>This is JS party</div>
        </ParallaxText>
        <ParallaxText baseVelocity={3}>
          <div className={cl(capsuleClassName)}>我是一直在找酒喝的钱老板</div>
          <div className={cl(capsuleClassName)}>
            在这里 我们用你的声音讲述你的故事
          </div>
          <div className={cl(capsuleClassName)}>我们的字是文字的字</div>
          <div className={cl(capsuleClassName)}>我是一直在找酒喝的钱老板</div>
          <div className={cl(capsuleClassName)}>
            在这里 我们用你的声音讲述你的故事
          </div>
          <div className={cl(capsuleClassName)}>我们的字是文字的字</div>
        </ParallaxText>
        <ParallaxText baseVelocity={-3}>
          <div className={cl(capsuleClassName)}>Following in the footsteps of the crucified Christ</div>
          <div className={cl(capsuleClassName)}>Hey, what&apos;s good, Yeti Nation?</div>
          <div className={cl(capsuleClassName)}>Following in the footsteps of the crucified Christ</div>
          <div className={cl(capsuleClassName)}>Hey, what&apos;s good, Yeti Nation?</div>
        </ParallaxText>
      </div>
    </>
  );
};

export default Inscriptions;
