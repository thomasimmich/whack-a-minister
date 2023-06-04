
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
const currentLevelSymbol = "l002"

const IMAGE_URLS = {
  // Background
  bg6:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol + 'backgroundLayer6A.png',
  bg5:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol + 'backgroundLayer5A.png',
  bg4:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol + 'backgroundLayer4A.png',

  bg3A:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol + 'backgroundLayer3A.png',
  bg3B:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol + 'backgroundLayer3B.png',

  bg2A: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' +'background/' + currentLevelSymbol +'backgroundLayer2A.png',
  bg2B: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer2B.png',
  bg2C: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer2C.png',
  bg2D: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer2D.png',

  bg1A:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer1A.png',
  bg1B:  BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer1B.png',

  bg0A: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer0A.png',
  bg0B: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer0B.png',
  bg0C: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer0C.png',
  bg00: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'background/' + currentLevelSymbol + 'backgroundLayer00.png',

  // MiddleGround
  mg1A: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'middleground/' + currentLevelSymbol + 'middlegroundLayer1A.png',
  mg1B: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'middleground/' + currentLevelSymbol + 'middlegroundLayer1B.png',
  mg1C: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'middleground/' + currentLevelSymbol + 'middlegroundLayer1C.png',
  mg1D: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'middleground/' + currentLevelSymbol + 'middlegroundLayer1D.png',
  mg1E: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'middleground/' + currentLevelSymbol + 'middlegroundLayer1E.png',

  // Foreground
  fg1A: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer1A.png',
  fg1B: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer1B.png',
  
  fg2A: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2A.png',
  fg2B: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2B.png',
  fg2C: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2C.png',
  fg2D: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2D.png',
  fg2E: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2E.png',
  fg2F: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2F.png',
  fg2G: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2G.png',
  fg2H: BASE_ASSET_URL + '/images/' + currentLevelSymbol + 'Images/' + 'foreground/' + currentLevelSymbol + 'foregroundLayer2H.png',
};
export const DeCoder002 = ({ buildCode, isMoving, }: DeCoderProps) => {


  const windowSize = useWindowSize();
  let speed = 0.05;

  const alwaysMovingbackgroundGroup = buildCode.split('').map((char, idx) => {
    let x = ((2500 / windowSize.width) * idx) / 2;
    const layerUrls = getAlwaysMovingbackgrounLayerUrlsForChar(char);
    return layerUrls.map((url, index) => (
      <AlwaysMovingImage
        imageUrl={url}
        key={`${char}_${index}`}
        speed={index == 2 ? speed * 0.3 : 0 }
        x={x}
        y={0}
        z={0}
        isMoving={isMoving}
        isMovingDown={index == 1 ? true : false}
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
      {/* <TrainWithPeople/> */}
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
      return [IMAGE_URLS.bg6, IMAGE_URLS.bg5,  IMAGE_URLS.bg4, ];
      case 'b':
        return [IMAGE_URLS.bg6, IMAGE_URLS.bg5,  IMAGE_URLS.bg4, ];
    default:
      return ['/path/to/defaultImage.png'];
  }
}

function getBackgroundLayerUrlsForChar(char: string): string[] {
  // Beispiel:
  switch (char) {
    case 'a':
      return [ IMAGE_URLS.bg3A, IMAGE_URLS.bg2A,  IMAGE_URLS.bg1A ];
    case 'b':
      return [IMAGE_URLS.bg3B, IMAGE_URLS.bg2B,  IMAGE_URLS.bg1B];
    default:
      return ['/path/to/defaultImage.png'];
  }
}

function getForegroundLayerUrlsForChar(char: string): string[] {
  // URLs für Foreground-Layer entsprechend dem Buchstaben char zurückgeben
  // Beispiel:
  switch (char) {
    case 'a':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg1A];
    case 'b':
      return [IMAGE_URLS.mg1A, IMAGE_URLS.fg1B];
   
    default:
      return ['/path/to/defaultImage.png'];
  }
}
