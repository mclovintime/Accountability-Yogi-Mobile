import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WavyPattern: React.FC = () => {
  return (
    <Svg
      width={Dimensions.get('window').width}
      height="100"
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path
        fill="#e6e6e6" // Updated light grey color
        fill-opacity="1"
        d="M0,96L34.3,128C68.6,160,137,224,206,234.7C274.3,245,343,203,411,197.3C480,192,549,224,617,202.7C685.7,181,754,107,823,112C891.4,117,960,203,1029,213.3C1097.1,224,1166,160,1234,154.7C1302.9,149,1371,203,1406,229.3L1440,256L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
        transform="scale(1, -1) translate(0, -320)"
      ></Path>
    </Svg>
  );
};

export default WavyPattern;