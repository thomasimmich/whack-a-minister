import { StaticBoxContainer } from '../three/StaticBoxContainer';
import { BASE_ASSET_URL } from '../../base/Constants';
import { MovingImage } from '../three/MovingImage';
import React,{ useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

interface DeCoderProps {
  buildCode: string;
}

const IMAGE_URLS = {
  bg4: BASE_ASSET_URL + '/images/background/backgroundLayer4.png',
  bg3: BASE_ASSET_URL + '/images/background/backgroundLayer3.png',
  bg2A: BASE_ASSET_URL + '/images/background/backgroundLayer2A.png',
  bg2B: BASE_ASSET_URL + '/images/background/backgroundLayer2B.png',
  bg2C: BASE_ASSET_URL + '/images/background/backgroundLayer2C.png',
  bg2D: BASE_ASSET_URL + '/images/background/backgroundLayer2D.png',
  bg1: BASE_ASSET_URL + '/images/background/backgroundLayer1.png',
  bg0A: BASE_ASSET_URL + '/images/background/backgroundLayer0A.png',
  bg0B: BASE_ASSET_URL + '/images/background/backgroundLayer0B.png',
  bg00: BASE_ASSET_URL + '/images/background/backgroundLayer00.png',

  mg1A: BASE_ASSET_URL + '/images/middleground/middlegroundLayer1A.png',
  mg1B: BASE_ASSET_URL + '/images/middleground/middlegroundLayer1B.png',
  mg1C: BASE_ASSET_URL + '/images/middleground/middlegroundLayer1C.png',
  mg1D: BASE_ASSET_URL + '/images/middleground/middlegroundLayer1D.png',
  mg1E: BASE_ASSET_URL + '/images/middleground/middlegroundLayer1E.png',

  fg1A: BASE_ASSET_URL + '/images/foreground/foregroundLayer1A.png',
  fg1B: BASE_ASSET_URL + '/images/foreground/foregroundLayer1B.png',
  fg2A: BASE_ASSET_URL + '/images/foreground/foregroundLayer2A.png',
  fg2B: BASE_ASSET_URL + '/images/foreground/foregroundLayer2B.png',
  fg2C: BASE_ASSET_URL + '/images/foreground/foregroundLayer2C.png',
  fg2D: BASE_ASSET_URL + '/images/foreground/foregroundLayer2D.png',
  fg2E: BASE_ASSET_URL + '/images/foreground/foregroundLayer2E.png',
  fg2F: BASE_ASSET_URL + '/images/foreground/foregroundLayer2F.png',
  fg2G: BASE_ASSET_URL + '/images/foreground/foregroundLayer2G.png',
  fg2H: BASE_ASSET_URL + '/images/foreground/foregroundLayer2H.png',
};


export const DeCoder = ({ buildCode }: DeCoderProps) => {
  const [isMoving, setIsMoving] = useState(true)
  
  const windowSize = useWindowSize();
  let speed = 0.05
  const layerGroups = buildCode.split('').map((char, idx) => {
    let x = ((2500 / windowSize.width) * idx) / 2;
    setTimeout(() => {
      setIsMoving(false)
    }, 5000);

    const layerUrls = getLayerUrlsForChar(char);
    return layerUrls.map((url, index) => (
      <MovingImage
        imageUrl={url}
        key={`${char}_${index}`}
        speed={index * speed} // speed
        x={x}
        y={0}
        z={0}
        isMoving={isMoving}
      />
    ));

  });

  return (
    <>
      {layerGroups.map((group, index) => (
        <group key={`group_${index}`}>{group}</group>
      ))}
    </>
  );
};

function getLayerUrlsForChar(char: string): string[] {
  switch (char) {
    case 'a':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2B,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1A,
        IMAGE_URLS.fg2A,
        IMAGE_URLS.fg1A,
      ];
    case 'b':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2A,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg0A,
        IMAGE_URLS.mg1A,
        IMAGE_URLS.fg2B,
        IMAGE_URLS.fg1B,
      ];
    case 'c':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2B,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1B,
        IMAGE_URLS.fg2C,
        IMAGE_URLS.fg1A,
      ];
    case 'd':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2C,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1C,
        IMAGE_URLS.fg2D,
        IMAGE_URLS.fg1A,
      ];
    case 'e':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2D,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1A,
        IMAGE_URLS.fg2E,
        IMAGE_URLS.fg1B,
      ];
    case 'f':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2A,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg0B,
        IMAGE_URLS.mg1A,
        IMAGE_URLS.fg2F,
        IMAGE_URLS.fg1A,
      ];
    case 'g':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2B,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1A,
        IMAGE_URLS.fg2G,
        IMAGE_URLS.fg1B,
      ];
    case 'y':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2B,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1D,
        IMAGE_URLS.fg2H,
        IMAGE_URLS.fg1B,
      ];
    case 'z':
      return [
        IMAGE_URLS.bg4,
        IMAGE_URLS.bg3,
        IMAGE_URLS.bg2B,
        IMAGE_URLS.bg1,
        IMAGE_URLS.bg00,
        IMAGE_URLS.mg1E,
        IMAGE_URLS.fg2F,
        IMAGE_URLS.fg1A,
      ];
    default:
      return ['/path/to/defaultImage.png'];
  }
}
;
