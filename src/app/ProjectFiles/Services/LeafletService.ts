import * as L from 'leaflet';
import {Icon, Map, Marker} from "leaflet";
import {MarkerClusterService} from "./MarkerClusterService";
import {Point} from "../Models/Point";

export class LeafletService {
    private map: Map | null;
    private readonly url: string;
    private markerClusterIntegration: MarkerClusterService;
    private readonly randomSeed: string;

    constructor(widgetUrl: string, widgetRandomSeed: string) {
        this.url = widgetUrl;
        this.randomSeed = widgetRandomSeed;
        this.map = null;
        this.markerClusterIntegration = new MarkerClusterService();
    }

    public Init(points: Point[]): void {
        this.SetupMap();
        this.SetupTileServer();
        this.RegisterLayer();
        let markerArray: Marker[] = [];
        points.forEach((point) => {
            markerArray.push(this.CreateMarker(point));
        });
        this.DisplayLayer(markerArray);
        this.ResizeMapObserver();
    }

    private SetupMap(): void {
        this.map = L.map(`mn-map-container-${this.randomSeed}`, {
            center: [52.229823, 21.011721],
            zoom: 8,
            zoomControl: false
        });
    }

    // google: https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=pl-PL
    // osm: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    private SetupTileServer(): void {
        if (this.map != null)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                subdomains:['mt0','mt1','mt2','mt3'],

            }).addTo(this.map);
    }

    private ResizeMapObserver(): void {
        const aokMapListWrapperContainer = document.getElementById(
            `mn-map-container-${this.randomSeed}`
        ) as HTMLDivElement | null;

        const resizeObserver = new ResizeObserver((entries) => {
            this.map!.invalidateSize();
        });

        if (aokMapListWrapperContainer != null)
            resizeObserver.observe(aokMapListWrapperContainer);
    }

    private RegisterLayer(): void {
        this.map!.addLayer(this.markerClusterIntegration.MarkerClusters!);
    }

    public CreateMarker(point: Point): Marker {
        var marker: Marker;
        marker = L.marker([point.Latitude, point.Longitude],{
            icon: this.getIcon()
        });

        return marker;
    }

    private getIcon(): Icon {
        return L.icon({
            iconUrl: this.url + '/mn-widget-library/src/images/point-icon.svg',
            iconSize: [38, 46]
        });
    }

    public DisplayLayer(markerArray: Marker[]): void {
        this.markerClusterIntegration.DisplayLayer(markerArray);
    }

}