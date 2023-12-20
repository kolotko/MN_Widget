import { OpenStreetMapProvider } from 'leaflet-geosearch';
import {SearchResult} from "leaflet-geosearch/src/providers/provider";
import {NominatimAddress} from "../Models/NominatimAddress";
import {NominatimLocation} from "../Models/NominatimLocation";
import {AutocompleteAddress} from "../Models/AutocompleteAddress";
import {GeocodingLocation} from "../Models/GeocodingLocation";

export class NominatimServices {
    private provider: OpenStreetMapProvider;

    constructor() {
        this.provider = new OpenStreetMapProvider({
            params:{
                'accept-language': 'pl',
                'countrycodes': 'pl',
                'format': 'json',
                'addressdetails': 1
            }
        });
    }

    public GeocodingAddress(address: string): Promise<GeocodingLocation>
    {
        return this.provider.search({ query: address })
            .then((results: SearchResult[]) => {
                    if (results.length > 0)
                    {
                        let nominatimLocation = this.prepareAddressDetails(results[0])

                        return {
                            Longitude: nominatimLocation.Longitude,
                            Latitude: nominatimLocation.Latitude
                        } as GeocodingLocation;
                    }
                    else
                        return {} as GeocodingLocation;
                }
            )
            .catch(err => {
                return {} as GeocodingLocation;
            });
    }

    public async AutocompleteAddress(address: string): Promise<AutocompleteAddress> {
        return this.provider.search({ query: address })
            .then((results: SearchResult[]) => {
                    if (results.length > 0)
                    {
                        let predictionsAddress: string[] = [];
                        results.forEach((result) => {
                            predictionsAddress.push(this.prepareAddressDetails(result).Predictions);
                        });

                        let uniquePredictionsAddress = [...new Set(predictionsAddress)];

                        return {
                            status: 'OK',
                            predictions: uniquePredictionsAddress
                        } as AutocompleteAddress;
                    }
                    else
                        return {} as AutocompleteAddress;
                }
            )
            .catch(err => {
                return {} as AutocompleteAddress;
            });
    }

    private prepareAddressDetails(searchResult: SearchResult): NominatimLocation {
        var address = searchResult.raw.address as NominatimAddress;
        let addressToDisplay = this.prepareAddressToDisplay(address);

        return {
            Longitude: searchResult.x,
            Latitude: searchResult.y,
            Predictions: addressToDisplay
        } as NominatimLocation;
    }

    private prepareAddressToDisplay(address: NominatimAddress): string {
        let resultAddress: string = "";

        if (address.road)
            resultAddress = address.road + " ";

        resultAddress += this.getCityName(address);

        if (address.state)
            resultAddress += address.state + " ";

        if (address.country)
            resultAddress += address.country + " ";


        return resultAddress;
    }

    private getCityName(address: NominatimAddress): string {
        let resultAddress: string = "";

        if (address.city)
            resultAddress += address.city + " ";

        if (address.town)
            resultAddress += address.town + " ";

        if (address.village)
            resultAddress += address.village + " ";

        if (address.hamlet)
            resultAddress += address.hamlet + " ";

        if (address.house_number)
            resultAddress += address.house_number + " ";

        return resultAddress;
    }
}