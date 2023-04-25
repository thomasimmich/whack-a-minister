

import { StaticBoxContainer } from '../../components/three/StaticBoxContainer';
import { BASE_ASSET_URL } from '../../base/Constants';

interface DeCoderProps {
  generateCode: string;
}
  
export const DeCoder = ({ generateCode }: DeCoderProps) => {
  let sections = []
  //let output = []

  

  //const BGLayer4 = BASE_ASSET_URL + '/images/background/backgroundLayer4.png';
  //const BGLayer3 = BASE_ASSET_URL + '/images/background/backgroundLayer3.png';
  //const BGLayer2 = BASE_ASSET_URL + '/images/background/backgroundLayer2.png';
  //const BGLayer1 = BASE_ASSET_URL + '/images/background/backgroundLayer1.png';

  //const MGLayer1 = BASE_ASSET_URL + '/images/middleground/middleGround.png';

  const FGLayer1 = BASE_ASSET_URL + '/images/foreground/foreground.png';
  //const FGLayer2 = BASE_ASSET_URL + '/images/foreground/foreground.png';
 // const FGLayer3 = BASE_ASSET_URL + '/images/foreground/foreground.png';
  //const FGLayer4 = BASE_ASSET_URL + '/images/foreground/foreground.png';

  // Entschlüsseln des generateCode Strings

    let charArray = generateCode.split('');
    let layerCount = 9 // die größe an Layers pro Section

    // eine Section hat Fünf Zeichen, die einzelen Chars werden in einen Section Array gemacht 
    for (let i = 0; i < charArray.length / layerCount; i++) {
      let section = charArray.splice(0, layerCount); // die ersten 9 Chars aus charArray entnehmen
      let layers = [{}]

      section.map((char) => {
        let image = FGLayer1
        if (char == "a" ) {}
        let layer = {
          component :  <StaticBoxContainer speed={0.06} imageUrl={image} y={0} z={0} />,
        }
        layers.push(layer)
      })
      sections.push(layers); // section zum sections Array hinzufügen
    }



    
   
};
  