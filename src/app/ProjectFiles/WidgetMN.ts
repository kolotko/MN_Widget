import {PointService} from "./Services/PointService";
import {LeafletService} from "./Services/LeafletService";

export class WidgetMN {
    private readonly randomSeed: string;
    private readonly mnContainer: HTMLDivElement;
    private readonly pointService: PointService;
    private readonly leafletService: LeafletService;


    constructor(url: string, containerId: string) {
        this.randomSeed = this.GenerateRandomSeed();
        this.mnContainer = this.GetReferenceForMapContainer(containerId);
        this.pointService = new PointService(url);
        this.leafletService = new LeafletService(url, this.randomSeed);
    }

    public Init(): void {
        this.GenerateHTML();

        this.pointService?.GetPointsList().then(receivedPoints => {
            if (receivedPoints.length > 0)
            {
                this.leafletService.Init(receivedPoints);
            }
        });
    }

    private GenerateRandomSeed(): string {
        return Math.floor(Math.random() * Date.now()).toString(8);
    }

    private GetReferenceForMapContainer(containerId: string): HTMLDivElement {
        return document.getElementById(
            containerId
        ) as HTMLDivElement;
    }

    private GenerateHTML():void {
        this.mnContainer.innerHTML =
            `<div class="mn-container">
                <div class="mn-search-container">
                    <input id="mn-search-input-${this.randomSeed}" type="text" class="mn-search-input" placeholder="Wyszukaj adres">
                </div>
                <div id="mn-map-container-${this.randomSeed}" class="mn-map-container"></div>
            </div>`;
    }
}