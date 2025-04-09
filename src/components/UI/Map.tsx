import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import { GeoAddress, Module, SubModule } from 'shared/models';
import Page, { PageSubtitle } from './Page';

type MapViewProps = {
  module: Module;
  subModule: SubModule;
  loading?: boolean;
  geoAddress?: GeoAddress;
} & MapContainerProps;

const MapView: React.FC<MapViewProps> = ({ module, subModule, loading, geoAddress, ...mapProps }) => {
  if (loading) {
    return null;
  }

  if (!geoAddress) {
    return (
      <Page module={module} subModule={subModule} sx={{ my: 0 }}>
        <PageSubtitle variant="h6">Location data is unavailable.</PageSubtitle>
      </Page>
    );
  }

  const position: [GeoAddress['lat'], GeoAddress['lng']] = [geoAddress.lat, geoAddress.lng];

  return (
    <MapContainer center={position} zoom={13} style={{ height: 400, width: '100%' }} {...mapProps}>
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
