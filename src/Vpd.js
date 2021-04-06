/******************************************************************************
 * Created Date: Monday April 5th 2021                                        *
 * Author: Sean W.                                                            *
 * -----                                                                      *
 * Last Modified: Mon Apr 05 2021                                             * 
 * Modified By: Sean W.                                                       * 
 * -----                                                                      *
 * File: /src/Vpd.js                                                          *
 * Copyright (c) 2021 Kuva                                                    *
 ******************************************************************************/

import React from "react";

const Vpd = ({ data, colors, selectedVPD }) => {
  if (!data || !data.length) return <div>No Data</div>;

  const gridTemplateColumns = data[0].map((i) => "auto").join(" ");

  return (
    <div
      className="grid-container"
      style={{ gridTemplateColumns: gridTemplateColumns }}
    >
      {data.map((r, i) => {
        return r.map((c, i2) => {
          return i == 0 || i2 == 0 ? (
            <div key={i + ":" + i2} className="grid-item">
              {c}
            </div>
          ) : (
            <div
              key={i + ":" + i2}
              className="grid-item"
              style={{ backgroundColor: i===selectedVPD[0]&&i2===selectedVPD[1]?"#000":colors[c], border:i===selectedVPD[0]&&i2===selectedVPD[1]?`3px solid #fff`:"1px solid black" }}
            ></div>
          );
        });
      })}
    </div>
  );
};

export default Vpd;
