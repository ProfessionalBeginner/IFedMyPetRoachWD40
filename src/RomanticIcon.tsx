import React from "react";
import { SvgIcon } from "@mui/material";

const icons = [
  (props: any) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="#4a90e2"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
          5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
          2.09C13.09 3.81 14.76 3 16.5 
          3 19.58 3 22 5.42 22 8.5c0 
          3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </SvgIcon>
  ),
  (props: any) => (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <path
        fill="#4a90e2"
        d="M32 2s-2 11-10 11S2 20 2 34s14 20 30 28c16-8 30-14 30-28S42 13 42 13s-8 0-10-11z"
      />
    </SvgIcon>
  ),
];

export default function RomanticIcon() {
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  return <Icon sx={{ ml: 1, fontSize: 20, verticalAlign: "middle" }} />;
}
