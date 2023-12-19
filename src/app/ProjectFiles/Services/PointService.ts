import {Point} from "../Models/Point";
import {PointResponse} from "../DTO/PointResponse";

export class PointService {
    private readonly url: string;
    constructor(widgetUrl: string) {
        this.url = widgetUrl;
    }

    public async GetPointsList(): Promise<Point[]> {
        const options: RequestInit = {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        };

        return await fetch(`${this.url}/points/examplePoints.json`, options)
            .then(response => {
                return response.json() as Promise<PointResponse>
            }).then(data => {
                return data.Points;
            })
            .catch(err => {
                return [];
            });
    }
}