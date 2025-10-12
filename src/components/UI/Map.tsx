import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import { GeoAddress, Module, SubModule } from 'shared/types';
import Page from 'components/UI/Page';

type MapViewProps = {
  module: Module;
  subModule: SubModule;
  loading?: boolean;
  geoAddress?: GeoAddress;
  noLocationTemplate?: React.ReactElement;
} & MapContainerProps;

const MapView: React.FC<MapViewProps> = ({ module, subModule, loading, geoAddress, noLocationTemplate, ...props }) => {
  if (loading) {
    return null;
  }

  if (!geoAddress) {
    return (
      noLocationTemplate ?? (
        <Page module={module} subModule={subModule} sx={{ my: 0 }}>
          <Page.Subtitle variant="h6">Location data is unavailable.</Page.Subtitle>
        </Page>
      )
    );
  }

  const position: [number, number] = [geoAddress.lat, geoAddress.lng];

  return (
    <MapContainer center={position} zoom={13} style={{ height: 400, width: '100%' }} {...props}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{geoAddress.label}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
