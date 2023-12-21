import * as L from 'leaflet';
import {Icon, Map, Marker} from "leaflet";
import {MarkerClusterService} from "./MarkerClusterService";
import {Point} from "../Models/Point";
import {LeafletRoutingMachineService} from "./LeafletRoutingMachineService";

export class LeafletService {
    private map: Map | null;
    private readonly url: string;
    private markerClusterIntegration: MarkerClusterService;
    private leafletRoutingMachineService: LeafletRoutingMachineService;
    private readonly randomSeed: string;

    constructor(widgetUrl: string, widgetRandomSeed: string) {
        this.url = widgetUrl;
        this.randomSeed = widgetRandomSeed;
        this.map = null;
        this.markerClusterIntegration = new MarkerClusterService();
        this.leafletRoutingMachineService = new LeafletRoutingMachineService();
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
        // this.test();
    }

    private SetupMap(): void {
        this.map = L.map(`mn-map-container-${this.randomSeed}`, {
            center: [57.6792, 11.949],
            zoom: 12,
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
        const mnMapListWrapperContainer = document.getElementById(
            `mn-map-container-${this.randomSeed}`
        ) as HTMLDivElement | null;

        const resizeObserver = new ResizeObserver((entries) => {
            this.map!.invalidateSize();
        });

        if (mnMapListWrapperContainer != null)
            resizeObserver.observe(mnMapListWrapperContainer);
    }

    private RegisterLayer(): void {
        this.map!.addLayer(this.markerClusterIntegration.MarkerClusters!);
    }

    public SetMapPosition(latitude: number, longitude: number): void {
        this.map!.setView([latitude, longitude], 15);
    }

    private CreateMarker(point: Point): Marker {
        var marker: Marker;
        marker = L.marker([point.Latitude, point.Longitude],{
            icon: this.GetIcon()
        });

        marker.bindPopup(this.GetPopupHtml(point));

        marker.on('popupopen', (event) => {
            this.GeneratePopupEvents(point.Id, point.Latitude, point.Longitude);
        });
        return marker;
    }

    private GetIcon(): Icon {
        return L.icon({
            iconUrl: this.url + '/mn-widget-library/src/images/point-icon.svg',
            iconSize: [38, 46]
        });
    }

    private DisplayLayer(markerArray: Marker[]): void {
        this.markerClusterIntegration.DisplayLayer(markerArray);
    }

    private GetPopupHtml(point: Point): string {
        return `<div>
                    <p>${point.Name}</p>
                    <p>${point.Address}</p>
                    <p>${point.City}</p>
                    <p>${point.PostalCode}</p>
                    <p>${point.Description}</p>
                    <button id="mn-navigation-button-${point.Id}" class="mn-navigation-button">Nawiguj</button>
                </div>`;
    }

    public GeneratePopupEvents(pointId: number, latitude: number, longitude: number) : void {
        document.getElementById(
            `mn-navigation-button-${pointId}`
        )?.addEventListener('click', () => {
            this.leafletRoutingMachineService.GenerateRoute(this.map!, latitude, longitude);
        });
    }
}