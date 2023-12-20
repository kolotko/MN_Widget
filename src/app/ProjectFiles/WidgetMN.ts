import {PointService} from "./Services/PointService";
import {LeafletService} from "./Services/LeafletService";
import {SearchService} from "./Services/SearchService";

export class WidgetMN {
    private readonly randomSeed: string;
    private readonly mnContainer: HTMLDivElement;
    private readonly pointService: PointService;
    private readonly leafletService: LeafletService;
    private readonly searchService: SearchService;


    constructor(url: string, containerId: string) {
        this.randomSeed = this.GenerateRandomSeed();
        this.mnContainer = this.GetReferenceForMapContainer(containerId);
        this.pointService = new PointService(url);
        this.leafletService = new LeafletService(url, this.randomSeed);
        this.searchService = new SearchService(this.randomSeed);
    }

    public Init(): void {
        this.searchService.GeocodingEvent.subscribe((geocodingResult) => this.leafletService.SetMapPosition(geocodingResult[0], geocodingResult[1]));
        this.GenerateHTML();

        this.pointService?.GetPointsList().then(receivedPoints => {
            if (receivedPoints.length > 0)
            {
                this.leafletService.Init(receivedPoints);
                this.searchService.Init();
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
                    <div id="mn-hints-${this.randomSeed}" class="mn-hints"></div>
                </div>
                <div id="mn-map-container-${this.randomSeed}" class="mn-map-container"></div>
            </div>`;
    }
}