export const PRODUCT_TYPES = [
  { value: "thirdparty", label: "Third Party" },
  { value: "comprehensive", label: "Comprehensive" },
  { value: "fire", label: "Fire" },
  { value: "goods-in-transit", label: "Goods In Transit" },
  { value: "asset-all-risks", label: "Assets All Risks" },
  { value: "money-insurance", label: "Money Insurance" },
  { value: "fire-commercial", label: "Fire Commercial" },
];

export const FIRE_CATEGORIES = [
  { value: "Private", label: "Private" },
  { value: "Business", label: "Business" },
];

export const FIRE_SUBTYPES: Record<string, { value: string; label: string }[]> = {
  Private: [
    { value: "DWELLING", label: "Dwelling" },
    { value: "HOMEGOODS", label: "Homegoods" },
  ],
  Business: [
    { value: "Commercial Property", label: "Commercial Property" },
    { value: "Industrial Property", label: "Industrial Property" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Filling Station", label: "Filling Station" },
    { value: "Gas Station", label: "Gas Station" },
    { value: "Timber Industry", label: "Timber Industry" },
    { value: "Cotton Industry", label: "Cotton Industry" },
    { value: "Foam Industry", label: "Foam Industry" },
  ],
};

// Fix: explicitly type all field arrays
export const FIRE_BASE_FIELDS: {
  name: keyof BundleInfo;
  label: string;
  type: "text" | "number" | "boolean";
}[] = [
  { name: "totalSumtobeInsured", label: "Total Sum to be Insured", type: "number" },
  {
    name: "privateDwellingSumInsured",
    label: "Private Dwelling Sum Insured",
    type: "number",
  },
  { name: "houseGoodsSumInsured", label: "House Goods Sum Insured", type: "number" },
  { name: "businessSumtobeInsured", label: "Business Sum to be Insured", type: "number" },
  { name: "privatePremises", label: "Private Premises", type: "boolean" },
  { name: "impactPeril", label: "Impact Peril", type: "boolean" },
  { name: "AircraftPeril", label: "Aircraft Peril", type: "boolean" },
  { name: "ExplosionPeril", label: "Explosion Peril", type: "boolean" },
  { name: "WindStormPeril", label: "Wind Storm Peril", type: "boolean" },
  { name: "BurstPipePeril", label: "Burst Pipe Peril", type: "boolean" },
  { name: "FloodPeril", label: "Flood Peril", type: "boolean" },
  { name: "EarthQuakePeril", label: "Earthquake Peril", type: "boolean" },
  { name: "RiotPeril", label: "Riot Peril", type: "boolean" },
  { name: "BushfirePeril", label: "Bushfire Peril", type: "boolean" },
];

export const PRODUCT_TYPE_FIELDS: Record<
  string,
  { name: keyof BundleInfo; label: string; type: "text" | "number" | "boolean" }[]
> = {
  thirdparty: [{ name: "typeofVehicle", label: "Type of Vehicle", type: "text" }],
  comprehensive: [
    { name: "typeofVehicle", label: "Type of Vehicle", type: "text" },
    { name: "valueofVehicle", label: "Value of Vehicle", type: "number" },
  ],
  fire: FIRE_BASE_FIELDS,
};

export type BundleInfo = {
  companyID: string;
  ownerID?: string;
  productType: string;
  fireCategory?: string;
  fireSubtype?: string;
  typeofVehicle?: string;
  valueofVehicle?: number;
  totalSumtobeInsured?: number;
  privatePremises?: boolean;
  privateDwellingSumInsured?: number;
  houseGoodsSumInsured?: number;
  businessSumtobeInsured?: number;
  impactPeril?: boolean;
  AircraftPeril?: boolean;
  ExplosionPeril?: boolean;
  WindStormPeril?: boolean;
  BurstPipePeril?: boolean;
  FloodPeril?: boolean;
  EarthQuakePeril?: boolean;
  RiotPeril?: boolean;
  BushfirePeril?: boolean;
};

export const defaultBundleInfo: BundleInfo = {
  companyID: "",
  ownerID: "",
  productType: "",
};

export const PAYMENT_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

// Function to map product types to quote types

export const PRODUCT_TYPE_MAP: Record<string, string> = {
  "THIRD PARTY": "Third Party",
  COMPREHENSIVE: "Comprehensive",
  "FIRE AND THEFT": "Fire and Theft",
  ASSETALLRISKS: "AssetAllRisks",
  GOODSINTRANSIT: "GoodsInTransit",
  BUYFIRECOMMERCIAL: "BuyFireCommercial",
  BUYMONEYINSURANCE: "BuyMoneyInsurance",
  FIRE: "FIREINSURANCE",
};
