import type { SVGProps } from "react";

const CashSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        className="fill-current m-auto"
        viewBox="0 0 40 24"
        height="40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        {...props}
    >

    <text x="0" y="18" className="font-bold italic">Cash</text>
  </svg>
);

export default CashSVG;