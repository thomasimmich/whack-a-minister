import { useEffect, useState } from "react";
import styled from "styled-components";
import { useGame } from "../hooks";

interface HammerAnimation {
  isActive: boolean;
  position: { x: number; y: number };
}

interface HammerCursorProps {
  isHitting: boolean;
  animation: HammerAnimation;
}

const CursorContainer = styled.div<{ isAnimating: boolean }>`
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -50%)
    rotate(${(props) => (props.isAnimating ? "0deg" : "-40deg")});
  transition: transform 0.1s ease-out;
`;

const HammerImage = styled.img<{ isAnimating: boolean }>`
  width: 200px;
  height: 200px;
  transform: ${(props) => (props.isAnimating ? "scale(1.2)" : "scale(1)")};
  transition: transform 0.1s ease-out;
`;

const HammerCursor = () => {
  const { isHitting, hammerAnimation: animation } = useGame();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (!animation.isActive) {
        setPosition({ x: e.clientX, y: e.clientY });
        setShouldRender(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [animation.isActive]);

  useEffect(() => {
    if (isHitting) {
      setShouldRender(true);
      setIsAnimating(true);

      // After a short delay, transition to default state
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100);

      // Hide the hammer after animation completes
      const hideTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isHitting]);

  if (!shouldRender) {
    return null;
  }

  return (
    <CursorContainer
      isAnimating={isAnimating}
      style={{
        left: (animation.isActive ? animation.position.x : position.x) + 50,
        top: (animation.isActive ? animation.position.y : position.y) - 60,
      }}
    >
      <HammerImage
        src="/assets/images/hammer.png"
        alt="hammer"
        isAnimating={isAnimating}
      />
    </CursorContainer>
  );
};

export default HammerCursor;
