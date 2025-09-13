// src/app/components/LocationPicker.tsx
"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

export default function LocationPicker({
  value,
  onChange,
}: {
  value: [number, number] | null;
  onChange: (c: [number, number]) => void;
}) {
  function PickerInner() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        onChange([lng, lat]);
      },
    });
    return null;
  }

  const center = value ? [value[1], value[0]] : [12.97, 77.58]; // lat,lng for map center

  return (
    <div className="h-64 rounded border overflow-hidden">
      <MapContainer
        center={center as any}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <PickerInner />
        {value && <Marker position={[value[1], value[0]] as any} />}
      </MapContainer>
    </div>
  );
}
