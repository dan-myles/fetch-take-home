export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  location: string;
  img?: string;
};

export type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type GeoBoundingBox =
  | {
      top: Coordinates;
      left: Coordinates;
      bottom: Coordinates;
      right: Coordinates;
    }
  | {
      top_left: Coordinates;
      bottom_right: Coordinates;
    }
  | {
      top_right: Coordinates;
      bottom_left: Coordinates;
    };

export type StateAbbreviation =
  | "AL"
  | "AK"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "FL"
  | "GA"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY";
