import React from "react";

type Props = {
  size?: number;
  bgColor?: string;
  className?: string;
};

function Calendar({ size = 24, bgColor, className }: Props) {
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
        d="M43.0522 20.9474H20.9473V43.0524H43.0522V20.9474Z"
        fill="white"
      />
      <path
        d="M43.0523 52.9997L52.9996 43.0523L48.026 42.2038L43.0523 43.0523L42.1445 47.6017L43.0523 52.9997Z"
        fill="#EA4335"
      />
      <path
        d="M11 43.0523V49.6838C11 51.5159 12.4838 52.9997 14.3157 52.9997H20.9474L21.9686 48.026L20.9474 43.0523L15.5279 42.2038L11 43.0523Z"
        fill="#188038"
      />
      <path
        d="M52.9996 20.9474V14.3157C52.9996 12.4838 51.5159 11 49.684 11H43.0523C42.4472 13.4668 42.1445 15.2822 42.1445 16.4462C42.1445 17.61 42.4472 19.1105 43.0523 20.9474C45.2523 21.5774 46.9102 21.8924 48.026 21.8924C49.1417 21.8924 50.7996 21.5774 52.9996 20.9474Z"
        fill="#1967D2"
      />
      <path
        d="M53.0001 20.9474H43.0527V43.0524H53.0001V20.9474Z"
        fill="#FBBC04"
      />
      <path
        d="M43.0522 43.0523H20.9473V52.9997H43.0522V43.0523Z"
        fill="#34A853"
      />
      <path
        d="M43.0523 11H14.3158C12.4838 11 11 12.4838 11 14.3157V43.0523H20.9474V20.9474H43.0523V11Z"
        fill="#4285F4"
      />
      <path
        d="M25.482 38.0954C24.6558 37.5373 24.0837 36.7222 23.7715 35.6443L25.6892 34.8542C25.8631 35.5174 26.1671 36.0314 26.6011 36.3961C27.032 36.7608 27.557 36.9404 28.1705 36.9404C28.7977 36.9404 29.3364 36.7498 29.7868 36.3683C30.2373 35.9871 30.4639 35.5008 30.4639 34.9123C30.4639 34.3099 30.2261 33.818 29.751 33.4367C29.2757 33.0555 28.6789 32.8648 27.966 32.8648H26.858V30.9666H27.8527C28.4661 30.9666 28.9827 30.8008 29.4027 30.469C29.8227 30.1376 30.0327 29.6843 30.0327 29.1068C30.0327 28.593 29.8449 28.184 29.4692 27.8774C29.0935 27.5706 28.618 27.4159 28.0405 27.4159C27.4768 27.4159 27.0293 27.5651 26.6977 27.8662C26.3663 28.1682 26.1172 28.5495 25.9737 28.9743L24.0755 28.184C24.3268 27.4711 24.7883 26.8411 25.4653 26.2968C26.1423 25.7524 27.0071 25.4789 28.0571 25.4789C28.8336 25.4789 29.5327 25.6282 30.1517 25.9293C30.7705 26.2305 31.2568 26.6477 31.6077 27.1783C31.9588 27.7115 32.1327 28.3083 32.1327 28.9715C32.1327 29.6484 31.9698 30.2205 31.6438 30.6902C31.3176 31.1599 30.917 31.519 30.4417 31.7705V31.8837C31.0554 32.1368 31.5885 32.5524 31.9836 33.0858C32.3842 33.6246 32.586 34.2684 32.586 35.0201C32.586 35.7715 32.3952 36.443 32.0139 37.0315C31.6326 37.6201 31.105 38.0843 30.4361 38.4214C29.7648 38.7586 29.0105 38.93 28.1733 38.93C27.2033 38.9326 26.3082 38.6536 25.482 38.0954ZM37.2609 28.579L35.1555 30.1015L34.1028 28.5046L37.8799 25.78H39.3278V38.6314H37.2609V28.579Z"
        fill="#4285F4"
      />
    </svg>
  );
}

export default Calendar;
