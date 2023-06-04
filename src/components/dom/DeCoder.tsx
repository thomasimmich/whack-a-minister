
import { BASE_ASSET_URL } from '../../base/Constants';
import { MovingImage } from '../three/MovingImage';
import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import { TrainWithPeople } from '../three/TrainWithPeople';
import { AlwaysMovingImage } from '../three/AlwaysMovingImage';

interface DeCoderProps {
  buildCode: string,
  isTrainVisible: boolean,
  isMoving: boolean,
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
  bg0C: BASE_ASSET_URL + '/images/background/backgroundLayer0C.png',
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
export const DeCoder = ({ buildCode, isMoving, }: DeCoderProps) => {


  const windowSize = useWindowSize();
  let speed = 0.05;

  const alwaysMovingbackgroundGroup = buildCode.split('').map((char, idx) => {
    let x = ((2500 / windowSize.width) * idx) / 2;
    const layerUrls = getAlwaysMovingbackgrounLayerUrlsForChar(char);
    return layerUrls.map((url, index) => (
      <AlwaysMovingImage
        imageUrl={url}
        key={`${char}_${index}`}
        speed={index * speed }
        x={x}
        y={0}
        z={0}
        isMoving={isMoving}
        isMovingDown={false}
      />
    ));
  });

  const backgroundGroup = buildCode.split('').map((char, idx) => {
    let x = ((2500 / windowSize.width) * idx) / 2;
    const layerUrls = getBackgroundLayerUrlsForChar(char);
    return layerUrls.map((url, index) => (
      <MovingImage
        isLastImage={false}
        imageUrl={url}
        key={`${char}_${index}`}
        speed={(index + 2) * speed}
        x={x}
        y={0}
        z={0}
        isMoving={isMoving}
        IsAlwaysMoving={false}
        idx={index + 2}
      />
    ));
  });

  const foregroundGroup = buildCode.split('').map((char, idx) => {
    let x = ((2500 / windowSize.width) * idx) / 2;
    const layerUrls = getForegroundLayerUrlsForChar(char);
    return layerUrls.map((url, index) => (
      <MovingImage
        isLastImage={idx == buildCode.length - 1 && true}
        imageUrl={url}
        key={`${char}_${index}`}
        speed={(index + 6) * speed}
        x={x}
        y={0}
        z={0}
        isMoving={isMoving}
        IsAlwaysMoving={false}
        idx={index + 6}
      />
    ));
  });

  return (
    <>


      {alwaysMovingbackgroundGroup.map((group, index) => (
        <group key={`group_${index}`}>{group}</group>
      ))}


      {backgroundGroup.map((group, index) => (
        <group key={`group_${index}`}>{group}</group>
      ))}
       <TrainWithPeople/> 
      {foregroundGroup.map((group, index) => (
        <group position={[0 ,0, 0.002]} key={`group_${index}`}>{group}</group>
      ))}
    </>
  );
};


function getAlwaysMovingbackgrounLayerUrlsForChar(char: string): string[] {
  // Beispiel:
  switch (char) {
    case 'a':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    case 'b':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3, IMAGE_URLS.bg1, ];
    case 'c':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3, IMAGE_URLS.bg1, ];
    case 'd':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    case 'e':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    case 'f':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3, IMAGE_URLS.bg1, ];
    case 'g':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    case 'h':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1,];
    case 'y':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    case 'z':
      return [IMAGE_URLS.bg4, IMAGE_URLS.bg3,  IMAGE_URLS.bg1, ];
    default:
      return ['/path/to/defaultImage.png'];
  }
}

function getBackgroundLayerUrlsForChar(char: string): string[] {
  // Beispiel:
  switch (char) {
    case 'a':
      return [ IMAGE_URLS.bg2B, IMAGE_URLS.bg00];
    case 'b':
      return [ IMAGE_URLS.bg2A,  IMAGE_URLS.bg0A];
    case 'c':
      return [ IMAGE_URLS.bg2B,  IMAGE_URLS.bg0C];
    case 'd':
      return [ IMAGE_URLS.bg2C, IMAGE_URLS.bg00];
    case 'e':
      return [ IMAGE_URLS.bg2D,  IMAGE_URLS.bg00];
    case 'f':
      return [ IMAGE_URLS.bg2A,  IMAGE_URLS.bg0B];
    case 'g':
      return [ IMAGE_URLS.bg2B, IMAGE_URLS.bg00];
    case 'h':
      return [ IMAGE_URLS.bg2B, IMAGE_URLS.bg00];
    case 'y':
      return [ IMAGE_URLS.bg2B, IMAGE_URLS.bg00];
    case 'z':
      return [ IMAGE_URLS.bg2B,  IMAGE_URLS.bg00];
    default:
      return ['/path/to/defaultImage.png'];
  }
}

function getForegroundLayerUrlsForChar(char: string): string[] {
  // URLs für Foreground-Layer entsprechend dem Buchstaben char zurückgeben
  // Beispiel:
  switch (char) {
    case 'a':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2A, IMAGE_URLS.fg1A];
    case 'b':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2B, IMAGE_URLS.fg1B];
    case 'c':
      return [IMAGE_URLS.mg1B, IMAGE_URLS.fg2C, IMAGE_URLS.fg1A];
    case 'd':
      return [IMAGE_URLS.mg1C, IMAGE_URLS.fg2D, IMAGE_URLS.fg1A];
    case 'e':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2E, IMAGE_URLS.fg1B];
    case 'f':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2F, IMAGE_URLS.fg1A];
    case 'g':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2G, IMAGE_URLS.fg1B];
    case 'h':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg2H, IMAGE_URLS.fg1B];
    case 'y':
      return [IMAGE_URLS.mg1D, IMAGE_URLS.fg2H, IMAGE_URLS.fg1B];
    case 'z':
      return [IMAGE_URLS.mg1E, IMAGE_URLS.fg2F, IMAGE_URLS.fg1A];
    default:
      return ['/path/to/defaultImage.png'];
  }
}
