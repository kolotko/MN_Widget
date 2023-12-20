import {NominatimServices} from "./NominatimServices";
import {SimpleEventDispatcher} from "strongly-typed-events";

export class SearchService {

    private readonly randomSeed: string;
    private mnSearchInput: HTMLInputElement | null;
    private mnHintContainer: HTMLInputElement | null;
    private addressHintDelay: ReturnType<typeof setTimeout> | null;
    private readonly nominatimServices: NominatimServices;
    public GeocodingEvent = new SimpleEventDispatcher<[number, number]>();

    constructor(widgetRandomSeed: string) {
        this.mnSearchInput = null;
        this.mnHintContainer = null;
        this.addressHintDelay = null;
        this.randomSeed = widgetRandomSeed;
        this.nominatimServices = new NominatimServices();
    }

    public Init(): void {
        this.mnSearchInput = this.GetSearchInput();
        this.mnHintContainer = this.GetHintContainer();
        this.FocusInputEvent();
        this.KeyPressInputEvent();
    }

    private GetSearchInput(): HTMLInputElement {
        return document.getElementById(
            `mn-search-input-${this.randomSeed}`
        ) as HTMLInputElement;
    }

    private GetHintContainer(): HTMLInputElement {
        return document.getElementById(
            `mn-hints-${this.randomSeed}`
        ) as HTMLInputElement;
    }

    private FocusInputEvent(): void {
        this.mnSearchInput!.addEventListener('focus', () => {
            this.mnHintContainer!.classList.add("show");
        });
        this.mnSearchInput!.addEventListener('focusout', () => {
            setTimeout(() => { this.mnHintContainer!.classList.remove("show"); }, 200);
        });
    }
    private HideHint():void {
        this.mnHintContainer!.classList.remove("show");
    }

    private KeyPressInputEvent(): void {
        this.mnSearchInput?.addEventListener('keyup', (event) => {
            //enter click
            if (event.which == 13) {
                this.HideHint();
                this.GeocodingAddress();
                return;
            }
            this.AddressHint();
        });
    }

    private AddressHint(): void {
        if (this.addressHintDelay != null)
            clearTimeout(this.addressHintDelay);

        this.addressHintDelay = setTimeout(() => { this.AddressHintReload() }, 200);
    }

    private AddressHintReload(): void {
        var address: string = this.mnSearchInput?.value ?? '';
        if (address) {
            this.nominatimServices!.AutocompleteAddress(address)
                .then(data => {
                    if (data.status == 'OK') {
                        if (data.predictions.length > 0) {
                            var hintHtml = '';
                            var hintsId: string[] = [];
                            let hintNumber: number = 0
                            data.predictions.forEach((prediction) => {
                                if (hintNumber > 3)
                                    return;

                                var randomId: string = Math.random().toString(16).slice(2).toString();
                                hintsId.push(randomId);
                                hintHtml += this.GenerateHint(prediction, randomId);
                                hintNumber += 1;
                            });

                            this.mnHintContainer!.innerHTML = hintHtml;
                            this.GenerateHintEvent(hintsId);
                        }
                    }
                });
        }
    }

    private GenerateHint(prediction: string, id: string): string {
        return `<div id="mn-hint-${id}" class="mn-hint">${prediction}</div>`;
    }

    private GenerateHintEvent(hintsId: string[]):void {
        hintsId.forEach((hintId) => {
            document.getElementById(
                `mn-hint-${hintId}`
            )?.addEventListener('click', () => {
                this.HintToInputValue(hintId);
            });
        });
    }

    private HintToInputValue(hintId: string):void {
        var hint = document.getElementById(
            `mn-hint-${hintId}`
        ) as HTMLDivElement | null;

        if (this.mnSearchInput && hint) {
            this.mnSearchInput!.value = hint.innerHTML;
            this.GeocodingAddress();
        }
    }

    private GeocodingAddress() {
        var address: string = this.mnSearchInput?.value ?? '';
        if (address) {
            this.nominatimServices!.GeocodingAddress(address)
                .then(data => {
                    if (data)
                    {
                        this.GeocodingEvent.dispatch([data.Latitude, data.Longitude]);
                    }
                });
        }
    }
}