import React, { useState, useEffect } from "react";
import { Map, Polyline, TileLayer } from "react-leaflet";
import "../styles/ActivityMap.scss";
import { getBounds } from "../shared/getBounds";

const Zoom = 16;

const ActivityMap = props => {
  const { center, latlng } = props;
  const [bounds, setBounds] = useState([]);

  useEffect(() => {
    setBounds(getBounds(latlng));
  }, [latlng]);
  
  return (
      <Map
          center={center}
          zoom={Zoom}
          {...(bounds.length !== 0 ? { bounds: bounds } : {})}
      >
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline color="#3f51b5" positions={latlng} />
      </Map>
  );
};

export { ActivityMap };
