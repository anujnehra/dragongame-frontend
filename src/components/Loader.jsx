import React from "react";
import { ScaleLoader } from "react-spinners";

function Loader({
  color = "#0d3d3d",
  height = 35,
  width = 4,
  radius = 2,
  margin = 2,
}) {
  return (
    <div className="loader">
      <ScaleLoader {...{ color, width, height, radius, margin }} />
    </div>
  );
}

export default Loader;
