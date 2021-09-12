import React from "react";
import Health from "./Health";
import Name from "./Name";

function HealthBox({
  playerName = "",
  DragonName = "",
  playerHealth,
  DragonHealth,
  className = "",
}) {
  let pN = playerName ? playerName.match(/([^\s]+)/g)[0] : "";
  return (
    <div className={`health-box${className && " " + className}`}>
      <div className="item item1">
        <Name className="col col1">
          {pN.length > 6 ? pN.slice(0, 6) + "..." : pN}
        </Name>

        <div className="col col2"></div>

        <Name className="col col3">{DragonName}</Name>
      </div>

      <div className="item item2">
        <Health
          className="col col1"
          healthPercentage={playerHealth}
          bg={playerHealth >= DragonHealth ? "yellowgreen" : "red"}
        />

        <p className="col col2" style={{ fontWeight: "bold" }}>
          Vs
        </p>

        <Health
          className="col col3"
          healthPercentage={DragonHealth}
          bg={DragonHealth >= playerHealth ? "yellowgreen" : "red"}
        />
      </div>
    </div>
  );
}

export default HealthBox;
