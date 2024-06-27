import React from "react";

type Props = {
  size?: number;
  bgColor?: string;
};

function Slack({ size = 24, bgColor }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49 0H15C6.71573 0 0 6.71573 0 15V49C0 57.2843 6.71573 64 15 64H49C57.2843 64 64 57.2843 64 49V15C64 6.71573 57.2843 0 49 0Z"
        fill={bgColor ?? "#262626"}
      />
      <path
        d="M19.8231 37.5402C19.8231 39.9693 17.8421 41.9533 15.4127 41.9533C12.9833 41.9533 11 39.9693 11 37.5402C11 35.1112 12.984 33.1272 15.413 33.1272H19.8234L19.8231 37.5402ZM22.0464 37.5402C22.0464 35.1112 24.0304 33.1272 26.4594 33.1272C28.8885 33.1272 30.8725 35.1109 30.8725 37.5402V48.5869C30.8725 51.016 28.8888 53 26.4594 53C24.0304 53 22.0464 51.016 22.0464 48.5869V37.5402Z"
        fill="#DE1C59"
      />
      <path
        d="M26.4594 19.8231C24.0304 19.8231 22.0464 17.8421 22.0464 15.4127C22.0464 12.9833 24.0304 11 26.4594 11C28.8885 11 30.8725 12.984 30.8725 15.413V19.8234L26.4594 19.8231ZM26.4594 22.0464C28.8885 22.0464 30.8725 24.0304 30.8725 26.4594C30.8725 28.8885 28.8888 30.8725 26.4594 30.8725H15.4127C12.9837 30.8725 11 28.8888 11 26.4594C11 24.0304 12.984 22.0464 15.413 22.0464H26.4594Z"
        fill="#35C5F0"
      />
      <path
        d="M44.1763 26.4594C44.1763 24.0304 46.1573 22.0464 48.5867 22.0464C51.0161 22.0464 52.9998 24.0304 52.9998 26.4594C52.9998 28.8885 51.0158 30.8725 48.5867 30.8725H44.1763V26.4594ZM41.953 26.4594C41.953 28.8885 39.969 30.8725 37.54 30.8725C35.111 30.8725 33.127 28.8888 33.127 26.4594V15.4127C33.127 12.9837 35.1106 11 37.54 11C39.969 11 41.953 12.984 41.953 15.413V26.4594Z"
        fill="#2EB57D"
      />
      <path
        d="M37.54 44.1766C39.969 44.1766 41.953 46.1576 41.953 48.5869C41.953 51.0163 39.969 53 37.54 53C35.111 53 33.127 51.016 33.127 48.5869V44.1766H37.54ZM37.54 41.9533C35.111 41.9533 33.127 39.9693 33.127 37.5402C33.127 35.1112 35.1106 33.1272 37.54 33.1272H48.5867C51.0158 33.1272 52.9998 35.1109 52.9998 37.5402C52.9998 39.9693 51.0158 41.9533 48.5867 41.9533H37.54Z"
        fill="#EBB02E"
      />
    </svg>
  );
}

export default Slack;
