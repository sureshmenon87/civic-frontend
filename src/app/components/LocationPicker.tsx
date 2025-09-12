"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  value?: [number, number]; // [lng, lat]
  onChange: (coords: [number, number]) => void;
}

function Picker({
  onChange,
}: {
  onChange: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lng, e.latlng.lat]);
    },
  });
  return null;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  return (
    <MapContainer
      center={value ? [value[1], value[0]] : [20, 78]} // default India center
      zoom={13}
      style={{ height: 300, width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Picker onChange={onChange} />
      {value && <Marker position={[value[1], value[0]]} />}
    </MapContainer>
  );
}
