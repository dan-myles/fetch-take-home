export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
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
  lat: number;
  lon: number;
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

export const dogBreeds = [
  "Affenpinscher",
  "Afghan Hound",
  "African Hunting Dog",
  "Airedale",
  "American Staffordshire Terrier",
  "Appenzeller",
  "Australian Terrier",
  "Basenji",
  "Basset",
  "Beagle",
  "Bedlington Terrier",
  "Bernese Mountain Dog",
  "Black-and-tan Coonhound",
  "Blenheim Spaniel",
  "Bloodhound",
  "Bluetick",
  "Border Collie",
  "Border Terrier",
  "Borzoi",
  "Boston Bull",
  "Bouvier Des Flandres",
  "Boxer",
  "Brabancon Griffon",
  "Briard",
  "Brittany Spaniel",
  "Bull Mastiff",
  "Cairn",
  "Cardigan",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chow",
  "Clumber",
  "Cocker Spaniel",
  "Collie",
  "Curly-coated Retriever",
  "Dandie Dinmont",
  "Dhole",
  "Dingo",
  "Doberman",
  "English Foxhound",
  "English Setter",
  "English Springer",
  "EntleBucher",
  "Eskimo Dog",
  "Flat-coated Retriever",
  "French Bulldog",
  "German Shepherd",
  "German Short-haired Pointer",
  "Giant Schnauzer",
  "Golden Retriever",
  "Gordon Setter",
  "Great Dane",
  "Great Pyrenees",
  "Greater Swiss Mountain Dog",
  "Groenendael",
  "Ibizan Hound",
  "Irish Setter",
  "Irish Terrier",
  "Irish Water Spaniel",
  "Irish Wolfhound",
  "Italian Greyhound",
  "Japanese Spaniel",
  "Keeshond",
  "Kelpie",
  "Kerry Blue Terrier",
  "Komondor",
  "Kuvasz",
  "Labrador Retriever",
  "Lakeland Terrier",
  "Leonberg",
  "Lhasa",
  "Malamute",
  "Malinois",
  "Maltese Dog",
  "Mexican Hairless",
  "Miniature Pinscher",
  "Miniature Poodle",
  "Miniature Schnauzer",
  "Newfoundland",
  "Norfolk Terrier",
  "Norwegian Elkhound",
  "Norwich Terrier",
  "Old English Sheepdog",
  "Otterhound",
  "Papillon",
  "Pekinese",
  "Pembroke",
  "Pomeranian",
  "Pug",
  "Redbone",
  "Rhodesian Ridgeback",
  "Rottweiler",
  "Saint Bernard",
  "Saluki",
  "Samoyed",
  "Schipperke",
  "Scotch Terrier",
  "Scottish Deerhound",
  "Sealyham Terrier",
  "Shetland Sheepdog",
  "Shih-Tzu",
  "Siberian Husky",
  "Silky Terrier",
  "Soft-coated Wheaten Terrier",
  "Staffordshire Bullterrier",
  "Standard Poodle",
  "Standard Schnauzer",
  "Sussex Spaniel",
  "Tibetan Mastiff",
  "Tibetan Terrier",
  "Toy Poodle",
  "Toy Terrier",
  "Vizsla",
  "Walker Hound",
  "Weimaraner",
  "Welsh Springer Spaniel",
  "West Highland White Terrier",
  "Whippet",
  "Wire-haired Fox Terrier",
  "Yorkshire Terrier",
];
