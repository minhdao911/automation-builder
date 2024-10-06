import React from "react";

type Props = {
  size?: number;
  bgColor?: string;
  className?: string;
};

function Gmail({ size = 24, bgColor, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        className="fill-neutral-100 dark:fill-[#303030]"
        d="M49 0H15C6.71573 0 0 6.71573 0 15V49C0 57.2843 6.71573 64 15 64H49C57.2843 64 64 57.2843 64 49V15C64 6.71573 57.2843 0 49 0Z"
        style={{ fill: bgColor }}
      />
      <path
        d="M13.8636 48.4545H20.5455V31.2336L11 23.6364V45.4156C11 47.0971 12.284 48.4545 13.8636 48.4545Z"
        fill="#4285F4"
      />
      <path
        d="M43.4546 48.4545H50.1365C51.7209 48.4545 53 47.092 53 45.4157V23.6364L43.4546 31.2337"
        fill="#34A853"
      />
      <path
        d="M43.4546 19.0497V32.2273L53 24.6251V20.57C53 16.8095 48.9576 14.6655 46.1274 16.921"
        fill="#FBBC04"
      />
      <path
        d="M20.5454 31.8369V18.8641L32 27.8449L43.4545 18.8636V31.8367L32 40.8182"
        fill="#EA4335"
      />
      <path
        d="M11 20.57V24.6247L20.5455 32.2273V19.0498L17.8728 16.921C15.0377 14.6655 11 16.8095 11 20.57Z"
        fill="#C5221F"
      />
    </svg>
  );
}

export default Gmail;
