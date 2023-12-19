import { Marker, MarkerClusterGroup} from "leaflet";

export class MarkerClusterService {
    public MarkerClusters: MarkerClusterGroup | null;

    constructor() {
        this.MarkerClusters = window.L.markerClusterGroup({
            showCoverageOnHover: false
        }) as MarkerClusterGroup;
    }

    public DisplayLayer(markerArray: Marker[]): void {
        this.MarkerClusters?.addLayers(markerArray);
    }
}