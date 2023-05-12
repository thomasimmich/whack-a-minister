import { useWindowSize } from '../../hooks/useWindowSize';
import { MovingImage } from './MovingImage';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

interface StaticBoxContainerProps {
  imageUrl: string;
  y: number;
  z: number;
  speed: number;
}

export const StaticBoxContainer = ({ imageUrl, y, z, speed }: StaticBoxContainerProps) => {
  const windowSize = useWindowSize();
  const textureURL = imageUrl;
  const texture = useLoader(TextureLoader, textureURL);
  const coachWidth = texture.image.width / windowSize.width;

  const boxes = Array(10).fill(0).map((_, index) => (
    <MovingImage
      key={index}
      imageUrl={imageUrl}
      x={index * coachWidth}
      y={y}
      z={z}
      speed={speed}
    />
  ));

  return (
    <>
      {boxes}
    </>
  );
};
