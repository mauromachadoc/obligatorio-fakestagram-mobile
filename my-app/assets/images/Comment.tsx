import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

export const Comment = () => {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G clipPath="url(#clip0_9_552)">
        <Path
          d="M20.656 17.008C21.8711 14.9061 22.2794 12.4337 21.8047 10.0527C21.33 7.67171 20.0047 5.54496 18.0765 4.06977C16.1482 2.59458 13.7488 1.87185 11.3265 2.0366C8.90424 2.20135 6.6248 3.2423 4.91401 4.96501C3.20323 6.68771 2.17811 8.97432 2.03018 11.3977C1.88224 13.821 2.6216 16.2153 4.11014 18.1333C5.59868 20.0514 7.73457 21.3618 10.1188 21.82C12.503 22.2782 14.9725 21.8527 17.066 20.623L22 22L20.656 17.008Z"
          stroke="#262626"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_9_552">
          <Rect width={24} height={24} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
