export interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: {
            [key: string]: {
                official: string;
                common: string;
            };
        };
    };
    cca2: string;
    cca3: string;
    ccn3?: string;
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    area?: number;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    coatOfArms?: {
        png?: string;
        svg?: string;
    };
    languages?: {
        [key: string]: string;
    };
    currencies?: {
        [key: string]: {
            name: string;
            symbol?: string;
        };
    };
    timezone?: string[];
    continents?: string[];
    borders?: string[];
    startOfWeek?: string;
    capitalInfo?: {
        latlng?: [number, number];
    };
}