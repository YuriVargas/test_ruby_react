import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Form, Tab, Tabs, InputGroup } from "react-bootstrap";
import { APIProvider, Map, AdvancedMarker, Pin, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import Swal from 'sweetalert2'

function App() {
  const [location, setLocation] = useState([])
  const [select, setSelect] = useState(0)
  // lat: -33.4613486, lng: -70.6208912
  const [l1, setL1] = useState(Number(-33.4613486))
  const [l2, setL2] = useState(Number(-70.6208912))
  const [carSearch, setCarSearch] = useState()
  const [vehiclesMap, SetVehiclesMap] = useState({
    latitude: "0.0",
    longitude: "0.0",
    sent_at: getFecha(),
    vehicle_identifier: ""
  });

  const [car, setCar] = useState({
    vehicle_identifier: "",
    color: "",
    type: ""
  });

  const { vehicle_identifier: id, color, type } = car
  const [vehicles, setVehicles] = useState([]);
  const { vehicle_identifier, latitude, longitude } = vehiclesMap;

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
    } else if (vehiclesMap.vehicle_identifier === "" || vehiclesMap.vehicle_identifier === undefined) {
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
      try {


        const saveGps = await axios.post("http://localhost:3000/api/v1/gps",
          vehiclesMap
        ).then((response) => {
          console.log({ response })
          if (response.status === 200 && response.data.id === 3) {
            return Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "La ubicación está siendo encolada",
              showConfirmButton: false,
              timer: 1500
            });
          } else if (response.status === 201) {
            return Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Ubicación ha sido guardada con éxito",
              showConfirmButton: false,
              timer: 1500
            });
          }

        }).catch((err) => {
          return Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Duplicado",
            showConfirmButton: false,
            timer: 1500
          });
        })
      } catch (error) {
        return Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Registro duplicado",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  async function postVehicle() {

    if (color === undefined || color === "") {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la color del vehiculo",
        showConfirmButton: false,
        timer: 1500
      });
    } else if (car.vehicle_identifier === "" || car.vehicle_identifier === undefined) {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la patente del vehiculo",
        showConfirmButton: false,
        timer: 1500
      });
    } else if (type === undefined || type === "") {
      return Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Ingrese la categoría o tipo de vehículo",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const headers = {
        'Content-Type': 'application/json',
      }
      try {
        const saveVh = await axios.post("http://localhost:3000/api/v1/vehicle",
          car
        ).then((response) => {
          console.log({ response })
          if (response.status !== 201) {
            return Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "El vehículo no se ha podido añadir",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            return Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Vehículo ha sido guardada con éxito",
              showConfirmButton: false,
              timer: 1500
            });
          }

        }).catch((err) => {
          return Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Registro Duplicado",
            showConfirmButton: false,
            timer: 1500
          });
        })
      } catch (error) {
        return Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Registro duplicado",
          showConfirmButton: false,
          timer: 1500
        });
      }
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

  function getVehicle() {
    axios.get("http://localhost:3000/api/v1/vehicle-list").then((response) => {
      const VehickeList = response.data;
      setVehicles(VehickeList);

    })
  }
  function searchCar() {
    axios.get("http://localhost:3000/api/v1/search-gps/" + carSearch).then((response) => {
      const VehickeList = response.data;
      console.log(VehickeList)
      setL1(Number(VehickeList.latitude));
      setL2(Number(VehickeList.longitude));
    })
  }

  useEffect(() => {
    getGps();
    getVehicle();
  }, [])

  useEffect(() => { }, [vehiclesMap])
  // useEffect(() => {}, [l1])
  // useEffect(() => {}, [l2])
  useEffect(() => { }, [vehicles])

  const [markers, setMarker] = useState([]);

  // const onMapClick = (e) => {
  //   setMarker((current) => [
  //     ...current,
  //     {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng()
  //     }
  //   ]);
  // };

  // const mapa = useMap("uno");
  return (
    <>
      <div style={{ justifyContent: "center", with: "100%", display: "flex", padding: 10, backgroundColor: "#050404" }}>

        <h1 style={{ color: "whitesmoke" }} >- GPS PROJECT -</h1>
        <hr />
      </div>

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="vehicle" title="Agregar Vehículo">
          <Container style={{ padding: "20px", justifyContent: "center", width: "70%" }}>
            <Row style={{ justifyContent: "center", display: "flex" }}>
              <h2>Vehículo</h2>
              <hr />
            </Row>
            <Row>
              <Form.Label htmlFor="lblPatenteID">Patente Vehiculo</Form.Label>
            </Row>
            <Row>
              <Form.Control
                placeholder="HA-111"
                type="text"
                id="txtVehicleIdentifierID"

                onChange={(e) => { setCar({ ...car, vehicle_identifier: e.target.value }) }}
              />
            </Row>

            <Row>
              <Form.Label htmlFor="lblColor">Color</Form.Label>
            </Row>
            <Row>
              <Form.Control
                placeholder="Rojo"
                type="text"
                id="txtColor"
                value={color}
                onChange={(e) => { setCar({ ...car, color: e.target.value }) }}
              />
            </Row>
            <Row>
              <Form.Label htmlFor="lblType">Tipo</Form.Label>
            </Row>
            <Row>
              <Form.Control
                placeholder="Auto"
                type="text"
                id="txtTipo"
                value={type}
                onChange={(e) => { setCar({ ...car, type: e.target.value }) }}
              />
            </Row>
            <br />
            <Row>
              <Button variant="primary" onClick={() => { postVehicle() }}>Guardar</Button>
            </Row>

          </Container>
        </Tab>
        <Tab eventKey="home" title="Agregar Coordenadas">
          <Container style={{ padding: "20px", justifyContent: "center", width: "70%" }}>
            <h2>Coordenadas</h2>
            <hr />
            <Row>
              <Form.Label htmlFor="lblPatente">Patente Vehiculo</Form.Label>
            </Row>
            <Row>
              <Form.Select name="txtVehicleIdentifier" id="txtVehicleIdentifier" onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, vehicle_identifier: e.target.value }) }}
              >
                <option value="0">Seleccione Patente</option>
                {vehicles.map((veh) => {
                  return (
                    <option key={veh.id} value={veh.vehicle_identifier}>{veh.vehicle_identifier}</option>)
                })}
              </Form.Select>
              {/*              
              <Form.Control
                placeholder="HA-111"
                type="text"
                id="txtVehicleIdentifier"
                value={vehicle_identifier}
                onChange={(e) => { SetVehiclesMap({ ...vehiclesMap, vehicle_identifier: e.target.value }) }}
              /> */}
            </Row>
            <Row>
              <Form.Label htmlFor="lblLatitud">Latitud</Form.Label>
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

              <Form.Label htmlFor="txtLongitude">Longitud</Form.Label>

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
            <br />
            <Row>
              <Button variant="primary" onClick={() => { postGps(); }}>Guardar</Button>
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="profile" title="Ver mapa">

          <InputGroup className="mb-3" style={{ width: "300px", marginLeft: "30px" }}>

            <Form.Control
              placeholder="HA-111"
              type="text"
              id="txtVehicleIdentifierID"

              onChange={(e) => { setCarSearch(e.target.value) }}
            />
            <Button variant="outline-secondary" id="button-addon1" onClick={(e) => { searchCar(e) }}>
              Buscar
            </Button>
          </InputGroup>


          <APIProvider apiKey={"AIzaSyDdccbpMuE9qc4c0N3hsLUqnO5A69qCtU0"}>
            <Map
              mapId="uno"
              style={{ width: '200vh', height: '70vh', padding: "5vh", justifyContent: "center" }}
              defaultZoom={13}
              defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
              center={{ lat: l1, lng: l2 }}

            >
              <PoiMarkers pois={location} />


            </Map>
          </APIProvider>

        </Tab>
      </Tabs>
    </>
  );
}

const PoiMarkers = (props) => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const handleClick = React.useCallback((ev) => {
    console.log(ev)
    if (!map) return;
    if (!ev.latLng) return;
    console.log('Marca clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  });
  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedCenter(null);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  },
  []);
  
  return (
    <>
      {selectedCenter && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedCenter(null);
          }}
          position={{
            lat: selectedCenter.latitude,
            lng: selectedCenter.longitude
          }}
        >
        </InfoWindow>
      )}
      {props.pois.map((poi) => (

        <AdvancedMarker

          key={poi.key}
          title={poi.key}
          position={poi.location}>
          clickable={true}
          onClick={() => {
            setSelectedCenter(center);
          }}
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