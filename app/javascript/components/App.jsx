import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Form, Tab, Tabs } from "react-bootstrap";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import Swal from 'sweetalert2'

function App() {
  const [location, setLocation] = useState([])
  const [vehiclesMap, SetVehiclesMap] = useState({
    latitude: "0,0",
    longitude: "0,0",
    sent_at: getFecha(),
    vehicle_identifier: ""
  });

  const { vehicle_identifier, latitude, longitude } = vehiclesMap;

  useEffect(() => {
    getGps();
  }, [])

  useEffect(() => {

  }, [vehiclesMap])

  async function postGps() {
    console.log(latitude)
    if (latitude === undefined || latitude === 0) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la latitud de la ubicación del vehiculo",
        showConfirmButton: false,
        timer: 1500
      });
    } else if (vehicle_identifier === "" || vehicle_identifier === undefined) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la patente del vehiculo",
        showConfirmButton: false,
        timer: 1500
      });
    } else if (longitude === undefined || longitude === 0) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la longitud de la ubicación del vehiculo",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const headers = {
        'Content-Type': 'application/json',
      }
      const saveGps = await axios.post("http://localhost:3000/api/v1/gps",
        vehiclesMap
      ).then((response) => {
        console.log(response)
      })
    }


  }

  function getGps() {
    axios.get("http://localhost:3000/api/v1/list").then((response) => {
      console.log(response)
      const gpsList = response.data;
      const points = []
      for (let i = 0; i < gpsList.length; i++) {
        points[i] = {
          key: gpsList[i].vehicle_identifier,
          location: {
            lat: parseFloat(gpsList[i].latitude),
            lng: parseFloat(gpsList[i].longitude)
          }
        }
      }
      setLocation(points)
    })
  }
  const [markers, setMarker] = useState([]);

  const onMapClick = (e) => {
    setMarker((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
  };



  const mapa = useMap("uno");
  return (
    <>
      <div style={{ justifyContent: "center", with: "100%", display: "flex" }}>

        <h1 >- GPS PROJECT -</h1>
        <hr />
      </div>

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="vehicle" title="Agregar Vehículo">
          <Container>



            <Row>
              <Form.Label htmlFor="lblPatenteID">Patente Vehiculo</Form.Label>
            </Row>
            <Row>
              <Form.Control
                placeholder="HA-111"
                type="text"
                id="txtVehicleIdentifierID"
                value={vehicle_identifier}
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, vehicle_identifier: e.target.value }) }}
              />
            </Row>

            <Row>
              <Form.Label htmlFor="lblColor">Color</Form.Label>
            </Row>
            <Row>
              <Form.Control
                placeholder="HA-111"
                type="text"
                id="txtColor"
                value={vehicle_identifier}
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, vehicle_identifier: e.target.value }) }}
              />
            </Row>

          </Container>
        </Tab>
        <Tab eventKey="home" title="Agregar Coordenadas">
          <Container>

            <Row>
              <Form.Label htmlFor="lblPatente">Patente Vehiculo</Form.Label>

            </Row>
            <Row>
              <Form.Control
                placeholder="HA-111"
                type="text"
                id="txtVehicleIdentifier"
                value={vehicle_identifier}
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, vehicle_identifier: e.target.value }) }}
              />
            </Row>
            <Row>
              <Form.Label htmlFor="lblLatitud">latitud</Form.Label>

            </Row>
            <Row>
              <Form.Control
                placeholder="0.77899999"
                type="text" id="txtLatitud"
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, latitude: e.target.value }) }}
                value={latitude}
                aria-describedby="passwordHelpBlock"
              />
            </Row>
            <Row>

              <Form.Label htmlFor="txtLongitude">longitud</Form.Label>

            </Row>
            <Row>
              <Form.Control
                placeholder="0.77899999"
                type="text"
                id="txtLongitude"
                value={longitude}
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, longitude: e.target.value }) }}
              />
            </Row>
            <Button variant="primary" onClick={() => { postGps(); }}>Guardar</Button>

          </Container>
        </Tab>
        <Tab eventKey="profile" title="Ver mapa">
          <APIProvider apiKey={"AIzaSyDdccbpMuE9qc4c0N3hsLUqnO5A69qCtU0"}>
            <Map
              mapId="uno"
              style={{ width: '150vh', height: '80vh', padding: "5vh", justifyContent: "center" }}
              defaultZoom={13}
              defaultCenter={{ lat: -33.4613486, lng: -70.6208912 }}
              onCameraChanged={(ev) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
              }

              onClick={(e) => { onMapClick(e) }}


            > <PoiMarkers pois={location} />
            </Map>
          </APIProvider>

        </Tab>
      </Tabs>
    </>
  );
}

const PoiMarkers = (props) => {

  const handleClick = React.useCallback((ev) => {
    if (!map) return;
    if (!ev.latLng) return;
    console.log('Marca clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  });

  return (
    <>
      {props.pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
          clickable={true}
          onClick={handleClick}
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};
export default App;

export const getFecha = () => {
  const date = new Date();

  const fecha = date.toLocaleDateString('es-CL', {
    timeZone: 'America/Santiago',
    year: "numeric",
    month: '2-digit',
    day: '2-digit',
  })
  const hora = date.toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  return `${convertDateFormat(fecha)} ${hora}`
}

export function convertDateFormat(texto) {
  var info = texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1').split('-').join('/');
  return info;
}