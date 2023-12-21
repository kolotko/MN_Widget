import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {Control, Map} from "leaflet";

export class LeafletRoutingMachineService {

    private control: Control | null;

    constructor() {
        this.control = null;
    }

    public GenerateRoute(map: Map, latitude: number, longitude: number) {
        if (this.control instanceof Control) {
            map.removeControl(this.control);
        }

        this.control = window.L.Routing.control({
            waypoints: [
                L.latLng(57.74, 11.94),
                L.latLng(latitude, longitude)
            ]
        }).addTo(map);
    }
}