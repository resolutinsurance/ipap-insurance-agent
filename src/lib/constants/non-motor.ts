import { NonMotorQuoteType } from "../interfaces/non-motor/loyalty";

export const NON_MOTOR_VEHICLE_USAGE_TYPES = [
  { id: "1", type: "X1" },
  { id: "2", type: "X4" },
  { id: "3", type: "TAXI" },
  { id: "5", type: "AMBULANCE/HEARSE" },
  { id: "8", type: "ART/TANKERS" },
  { id: "13", type: "GW1 CLASS 1" },
  { id: "14", type: "GW1 CLASS 2" },
  { id: "15", type: "GW1 CLASS 3" },
  { id: "16", type: "HIRING CARS" },
  { id: "17", type: "MINI BUS" },
  { id: "18", type: "MAXI BUS" },
  { id: "11", type: "Z.802 ON SITE" },
  { id: "12", type: "Z.802 ON ROAD" },
  { id: "4", type: "MOTOR CYCLE" },
  { id: "6", type: "OWN GOODS Z.300" },
  { id: "9", type: "GEN. CARTAGE Z. 301" },
];

export const INSURANCE_CLASSES = [
  { id: 2, className: "MOTOR" },
  { id: 22, className: "BOND" },
  { id: 3, className: "MARINE" },
  { id: 18, className: "AVIATION" },
  { id: 19, className: "FIRE" },
  { id: 20, className: "GENERAL ACCIDENT" },
  { id: 23, className: "ENGINEERING" },
  { id: 15, className: "LIABILITY" },
  { id: 16, className: "AGRICULTURE" },
];

export const NON_MOTOR_BUY_EXCESS = [
  {
    id: 0,
    label: "NO",
  },
  {
    id: 1,
    label: "YES",
  },
];

export const NON_MOTOR_PRODUCT_TYPES = [
  { id: "60", name: "Plant And Machinery" },
  { id: "55", name: "Shop Owners Comprehensive" },
  { id: "71", name: "Assets All Risks" },
  { id: "122", name: "Umbrella TPPD" },
  { id: "94", name: "Fidelity Guarantee" },
  { id: "123", name: "Cyber Risk Insurance" },
  { id: "99", name: "Advance Payment / Guarantee Bond" },
  { id: "104", name: "Customs Temporary Import Bond" },
  { id: "129", name: "Crop Insurance" },
  { id: "40", name: "Bid And Tender Bond" },
  { id: "110", name: "General Exportation Bond" },
  { id: "63", name: "Boiler And Pressure Plant" },
  { id: "116", name: "Household Content Insurance Policy" },
  { id: "111", name: "Vanguard Safe Travel (VST)" },
  { id: "91", name: "Aviation Hull" },
  { id: "96", name: "Aviation Liability" },
  { id: "58", name: "Contractors All Risk" },
  { id: "124", name: "Forestry Insurance" },
  { id: "128", name: "Weather Index Insurance" },
  { id: "89", name: "Goods In Transit" },
  { id: "131", name: "Machinery Insurance" },
  { id: "68", name: "Thermal Risks" },
  { id: "125", name: "Multi-Peril Crop Insurance (MPCI)" },
  { id: "62", name: "Machinery Breakdown" },
  { id: "28", name: "Marine cargo-Open cover-Export" },
  { id: "39", name: "Marine Hull" },
  { id: "48", name: "Liability" },
  { id: "95", name: "Money Insurance" },
  { id: "75", name: "Foreign Travel (CICL)" },
  { id: "85", name: "Professional Indemnity" },
  { id: "49", name: "Plate Glass" },
  { id: "73", name: "Foreign Travel (MAPFRE)" },
  { id: "59", name: "Erection All Risk" },
  { id: "30", name: "Marine Cargo-Single Transit-Import" },
  { id: "31", name: "Comprehensive" },
  { id: "32", name: "Third Party" },
  { id: "26", name: "Credit Guarantee Bond" },
  { id: "43", name: "Group Personal Accident" },
  { id: "93", name: "Burglary" },
  { id: "61", name: "Deterioration of Stock" },
  { id: "101", name: "Retention Bond" },
  { id: "103", name: "Customs Bonds: Security Bond" },
  { id: "106", name: "Customs Transit Bond" },
  { id: "65", name: "Electronic Equipment" },
  { id: "87", name: "Bankers Indemnity" },
  { id: "53", name: "Happy Home Insurance Policy" },
  { id: "41", name: "Individual Personal Accident" },
  { id: "29", name: "Marine Cargo Single Transit - Export" },
  { id: "127", name: "Poultry Insurance" },
  { id: "51", name: "Combined All Risk" },
  { id: "46", name: "Third Party Fire And Theft" },
  { id: "107", name: "Customs Transshipment Bond" },
  { id: "121", name: "Homeprehensive" },
  { id: "92", name: "Airport Owners or Operators Liability" },
  { id: "109", name: "Customs Bond:Customs House Agt" },
  { id: "50", name: "Directors & Officers Liability" },
  { id: "100", name: "Performance Bond" },
  { id: "88", name: "Workmen's Compensation" },
  { id: "102", name: "Customs Removal Bond" },
  { id: "108", name: "Customs Bonds: Shipspares" },
  { id: "105", name: "Customs Re-exportation Bond" },
  { id: "130", name: "Livestock insurance" },
  { id: "56", name: "Combined Fire & Burglary" },
  { id: "84", name: "Product Liability" },
  { id: "27", name: "Marine cargo-Open cover- Import" },
  { id: "54", name: "Fire Loss of Profit" },
  { id: "67", name: "Engineering Loss of Profit" },
  { id: "76", name: "Landlords' Insurance Policy" },
  { id: "52", name: "Commercial/ Industrial Fire" },
  { id: "118", name: "General Liability" },
  { id: "83", name: "Public Liability" },
  { id: "126", name: "Area Yield Index Insurance (AYII)" },
];

export const BANK_BRANCHES = [
  { id: "1", name: "Greater Accra" },
  { id: "2", name: "Ashanti Region" },
  { id: "3", name: "Western Region" },
  { id: "4", name: "Central Region" },
  { id: "5", name: "Eastern Region" },
  { id: "6", name: "Volta Region" },
  { id: "7", name: "Northern Region" },
  { id: "8", name: "Upper East Region" },
  { id: "9", name: "Upper West Region" },
  { id: "10", name: "Brong Ahafo Region" },
];

export const BASE_HARDCODED_VALUES = {
  user_type: "individual",
  user_category: 7,
  customer_org_id: 1,
};

export const LOCATION_HARDCODED_VALUES = {
  branch_region: "Greater Accra",
  branch_city: "Accra",
  location: "Tema Industrial Zone",
};

export type LoyaltyNonMotorProduct = {
  id: NonMotorQuoteType;
  name: string;
  description: string;
};
export const LOYALTY_NON_MOTOR_PRODUCTS: LoyaltyNonMotorProduct[] = [
  {
    id: "fire-insurance",
    name: "Fire Insurance",
    description: "Protect your property from fire damage",
  },
  {
    id: "asset-all-risk",
    name: "Asset All Risk",
    description: "Comprehensive coverage for your assets",
  },
  {
    id: "buy-money-insurance",
    name: "Money Insurance",
    description: "Secure your money and valuables",
  },
  {
    id: "goods-in-transit",
    name: "Goods in Transit",
    description: "Protect goods during transportation",
  },
];
