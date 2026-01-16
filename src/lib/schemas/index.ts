import * as z from "zod";
import { PAYMENT_METHODS } from "../constants";

export const insuranceDetailsSchema = z.object({
  usageType: z.string().min(1, "Usage type is required"),
  currency: z.string().min(1, "Currency is required"),
  numberOfDays: z.string().min(1, "Number of days is required"),
  class: z.string().min(1, "Class is required"),
  userCategory: z.string().min(1, "User category is required"),
  sumInsured: z.string().min(1, "Sum insured is required"),
  productId: z.string().min(1, "Product ID is required"),
  inceptionDate: z.string().min(1, "Inception date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  userType: z.string().min(1, "User type is required"),
});

export type InsuranceDetailsForm = z.infer<typeof insuranceDetailsSchema>;

export const vehicleDetailsSchema = z.object({
  fuelType: z.string().min(1, "Fuel type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  yearOfManufacture: z.string().min(1, "Year of manufacture is required"),
  engineCapacity: z.string().min(1, "Engine capacity is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  mileage: z.string().min(1, "Mileage is required"),
  noOfSeats: z.string().min(1, "Number of seats is required"),
  extraSeats: z.string().min(1, "Extra seats is required"),
  registrationNo: z.string().min(1, "Registration number is required"),
  colorOfCar: z.string().min(1, "Color of car is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleTrim: z.string().min(1, "Vehicle trim is required"),
  vehicleNoCylinders: z.string().min(1, "Number of cylinders is required"),
  vehicleClaimFree: z.string().min(1, "Vehicle claim free is required"),
  vehicleAdditionalRemarks: z.string(),
  vehicleCapacity: z.string().min(1, "Vehicle capacity is required"),
  vehicleDriveType: z.string().min(1, "Vehicle drive type is required"),
});

export type VehicleDetailsForm = z.infer<typeof vehicleDetailsSchema>;

export const insuranceFormSchema = z.object({
  riskClass: z.string().min(1, "Risk class is required"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .max(3, "Currency must be 3 characters"),
  noOfDays: z.string().min(1, "Number of days is required"),
  class: z.string().min(1, "Class is required"),
  sumInsured: z.string().min(1, "Sum insured is required"),
  specifyDays: z.string().min(1, "Please specify days"),
  inceptionDate: z.string().min(1, "Inception date is required"),
  insuredItems: z.string().optional(),
  userID: z.string(),
});

export type InsuranceFormValues = z.infer<typeof insuranceFormSchema>;

export const companyFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNo: z.string().min(1, "Registration number is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  stateRegion: z.string().min(1, "State or Region is required"),
  country: z.string().min(1, "Country is required"),
  websiteURL: z.string().min(1, "Website is required").optional(),
  addedValueForFireandTheft: z
    .string()
    .min(1, "Added value for fire and theft is required")
    .optional(),
  addedValueForComprehensive: z
    .string()
    .min(1, "Added value for comprehensive is required")
    .optional(),
  addedValueForThirdParty: z
    .string()
    .min(1, "Added value for third party is required")
    .optional(),
  companyLogo: z.any().optional(),
  registrationDoc: z.any().optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const agentFormSchema = z.object({
  pasportpicGuarantor: z.any().nullable(),
  passportpicAgent: z.any().nullable(),
  guarantoridCard: z.any().nullable(),
  agentidCard: z.any().nullable(),
  educationQualification: z.any().nullable(),
  yearsofExperience: z.string().min(1, "Years of experience is required"),
});

// New schema for creating an agent profile with all fields required
export const createAgentFormSchema = z.object({
  pasportpicGuarantor: z.any().refine((val) => val !== null, {
    message: "Guarantor passport picture is required",
  }),
  passportpicAgent: z.any().refine((val) => val !== null, {
    message: "Agent passport picture is required",
  }),
  guarantoridCard: z.any().refine((val) => val !== null, {
    message: "Guarantor ID card is required",
  }),
  agentidCard: z.any().refine((val) => val !== null, {
    message: "Agent ID card is required",
  }),
  educationQualification: z.any().refine((val) => val !== null, {
    message: "Education qualification is required",
  }),
  yearsofExperience: z.string().min(1, "Years of experience is required"),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;
export type CreateAgentFormValues = z.infer<typeof createAgentFormSchema>;

export const signUpFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits")
      .regex(/^\+?[\d\s-]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      }, "You must be at least 18 years old"),
    acceptTerms: z.boolean().refine((data) => data, {
      message: "You must accept the terms and conditions",
    }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    referredBy: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const verifyPasswordResetCodeSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyPasswordResetCodeFormData = z.infer<
  typeof verifyPasswordResetCodeSchema
>;

// Motor Policy Form Schema
export const motorPolicyFormSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year_of_manufacture: z.string().optional(),
  engine_capacity: z.string().optional(),
  chasis_number: z.string().optional(),
  mileage: z.string().optional(),
  body_type: z.string().optional(),
  days: z.string().optional(),
  noof_seats: z.string().optional(),
  extra_seats: z.string().optional(),
  sum_insured: z.string().optional(),
  registration_no: z.string().optional(),
  inception_date: z.string().optional(),
  expiry_date: z.string().optional(),
  currency: z.string().optional(),
  color_of_car: z.string().optional(),
  reqQuoteID: z.string().optional(),
  requestStatus: z.string().optional(),
  fuel_type: z.string().optional(),
  class: z.string().optional(),
  cover_type_id: z.string().optional(),
  product_id: z.string().optional(),
  usage_type_id: z.string().optional(),
  user_category_id: z.string().optional(),
  user_type: z.string().optional(),
  vehicle_additional_remarks: z.string().optional(),
  vehicle_capacity: z.string().optional(),
  vehicle_claim_free: z.string().optional(),
  vehicle_drive_type: z.string().optional(),
  vehicle_no_cylinders: z.string().optional(),
  vehicle_trim: z.string().optional(),
});

export type MotorPolicyFormValues = z.infer<typeof motorPolicyFormSchema>;

// Non-Motor Policy Form Schema
export const nonMotorPolicyFormSchema = z.object({
  risk_type_id: z.string().optional(),
  insuredItems: z.string().optional(),
  sum_insured: z.string().optional(),
  inception_date: z.string().optional(),
  expiry_date: z.string().optional(),
  noofdays: z.string().optional(),
  specify_days: z.string().optional(),
  currency: z.string().optional(),
  risk_class_id: z.string().optional(),
  userID: z.string().optional(),
  reqQuoteID: z.string().optional(),
  requestStatus: z.string().optional(),
});

export type NonMotorPolicyFormValues = z.infer<typeof nonMotorPolicyFormSchema>;

export const customerFormSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  dob: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const quoteFormSchema = z.object({
  premiumAmount: z.string().min(1, "Premium is required"),
  paymentFrequency: z.enum(["monthly", "annual"], {
    message: "Payment frequency is required",
  }),
  inputter: z.string().optional(),
  requestquote_id: z.string(),
  userID: z.string(),
  companyID: z.string(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const quotePaymentFormSchema = z.object({
  premiumAmount: z.string().min(1, "Premium amount is required"),
  method: z.enum(
    [PAYMENT_METHODS.MOBILE_MONEY, PAYMENT_METHODS.BANK_TRANSFER, PAYMENT_METHODS.CARD],
    {
      required_error: "Method is required",
    }
  ),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  methodCode: z.string().min(1, "Method code is required"),
  methodName: z.string().min(1, "Method name is required"),
});

export type QuotePaymentFormValues = z.infer<typeof quotePaymentFormSchema>;

export const basePolicyDetailsSchema = z.object({
  name: z.string().optional(),
  registrationNo: z.string().min(1, "Registration number is required"),
  typeofVehicle: z.string().min(1, "Vehicle type is required"),
  yearofMake: z.string().min(1, "Year of make is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
});

export const comprehensiveFieldsSchema = z.object({
  ...basePolicyDetailsSchema.shape,
  valueofVehicle: z.string().min(1, "Value of vehicle is required"),
  tppdLimit: z.string().min(1, "Third party property damage limit is required"),
  excess: z.string().min(1, "Excess amount is required"),
});

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type BasePolicyDetailsForm = z.infer<typeof basePolicyDetailsSchema>;
export type ComprehensivePolicyDetailsForm = z.infer<typeof comprehensiveFieldsSchema>;
export type PolicyDetailsForm = BasePolicyDetailsForm | ComprehensivePolicyDetailsForm;
export type EmailForm = z.infer<typeof emailSchema>;

export const comprehensiveCoverSettingsSchema = z.object({
  PrivateIndividual: z.boolean(),
  PrivateCoorperate: z.boolean(),
  uberorhiringortaxiCover: z.boolean(),
  owngoodsCover: z.boolean(),
  generalcartageCover: z.boolean(),
  motorcycleCover: z.boolean(),
  articulatorortankerCover: z.boolean(),
  ambulanceCover: z.boolean(),
  specialtypeonroadCover: z.boolean(),
  specialtypeonsiteCover: z.boolean(),
});

export type ComprehensiveCoverSettings = z.infer<typeof comprehensiveCoverSettingsSchema>;

export const fireDiscountSettingsSchema = z.object({
  CommercialPropertyLTA: z.boolean(),
  CommercialPropertyFEA: z.boolean(),
  CommercialPropertyHydrant: z.boolean(),
  FillingStationLTA: z.boolean(),
  FillingStationFEA: z.boolean(),
  FillingStationHydrant: z.boolean(),
  TimberIndustryLTA: z.boolean(),
  TimberIndustryFEA: z.boolean(),
  TimberIndustryHydrant: z.boolean(),
  CottenIndustryLTA: z.boolean(),
  CottenIndustryFEA: z.boolean(),
  CottenIndustryHydrant: z.boolean(),
});

export type FireDiscountSettings = z.infer<typeof fireDiscountSettingsSchema>;

export const fireDeductibleSettingsSchema = z.object({
  CommercialProperty: z.boolean(),
  FillingStation: z.boolean(),
  TimberIndustry: z.boolean(),
  CottenIndustry: z.boolean(),
});

export type FireDeductibleSettings = z.infer<typeof fireDeductibleSettingsSchema>;

export const firePerilSettingsSchema = z.object({
  impactPeril: z.boolean(),
  AircraftPeril: z.boolean(),
  ExplosionPeril: z.boolean(),
  WindStormPeril: z.boolean(),
  BurstPipePeril: z.boolean(),
  FloodPeril: z.boolean(),
  EarthQuakePeril: z.boolean(),
  RiotPeril: z.boolean(),
  BushfirePeril: z.boolean(),
});

export type FirePerilSettings = z.infer<typeof firePerilSettingsSchema>;

export const QuoteCompletionSchema = z.object({
  address: z.string().min(1, "Address is required"),
  telephoneNumber: z.string().min(1, "Telephone number is required"),
  emailAddress: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"), // you can refine with regex/date validation
  ghanaCard: z.string().min(1, "Ghana Card number is required"),
  occupation: z.string().min(1, "Occupation is required"),
  seatingCapacity: z.number().int().nonnegative(),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  colourOfVehicle: z.string().min(1, "Vehicle colour is required"),
  cubicCapacity: z.number().int().nonnegative(),
  commencementDate: z
    .string()
    .min(1, "Commencement date is required")
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        return selectedDate >= today;
      },
      {
        message: "Commencement date cannot be in the past",
      }
    ),
  duration: z.enum(["1month", "3months", "6months", "1year"], {
    required_error: "Duration is required",
  }),
  expiryDate: z.string().min(1, "Expiry date is required"), // or refine to match a date format
  declaration: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms",
    })
    .optional(),
});

// Optional: Infer TypeScript type from schema
export type QuoteCompletionFormValues = z.infer<typeof QuoteCompletionSchema>;

// Form Schema
export const claimsFormSchema = z.object({
  // Claimant Information
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  insuranceType: z.string().min(1, "Insurance type is required"),

  // Policy Details
  policyholderName: z.string().min(1, "Policyholder name is required"),
  coverageType: z.string().min(1, "Coverage type is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  brokerDetails: z.string().optional(),
  idNumber: z.string().min(1, "ID number is required"),
  policyNumber: z.string().min(1, "Policy number is required"),

  // Incident Details
  incidentDate: z.string().min(1, "Incident date is required"),
  incidentTime: z.string().min(1, "Incident time is required"),
  incidentLocation: z.string().min(1, "Incident location is required"),
  incidentDescription: z.string().min(1, "Incident description is required"),
  causeOfLoss: z.string().min(1, "Cause of loss is required"),
  injuries: z.string().min(1, "Please specify if there were any injuries"),
  authoritiesNotified: z.string().min(1, "Please specify if authorities were notified"),
  caseNumber: z.string().optional(),

  // Supporting Documents
  damagePhotos: z.any().optional(),
  policeReport: z.any().optional(),
  medicalReport: z.any().optional(),
  repairEstimates: z.any().optional(),
  proofOfOwnership: z.any().optional(),
  idProof: z.any().optional(),

  // Claim Details
  claimType: z.string().min(1, "Claim type is required"),
  estimatedAmount: z.string().min(1, "Estimated amount is required"),
  thirdPartyInfo: z.string().optional(),
  witnessInfo: z.string().optional(),

  // Payment Information
  paymentMethod: z.string().min(1, "Payment method is required"),
  accountDetails: z.string().min(1, "Account details is required"),
  accountName: z.string().min(1, "Account name is required"),

  // Authorization
  digitalSignature: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

export type ClaimsFormValues = z.infer<typeof claimsFormSchema>;

// Funeral Insurance Form Schema
export const funeralInsuranceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  beneficiaries: z
    .array(
      z.object({
        name: z.string().min(1, "Beneficiary name is required"),
        relation: z.string().min(1, "Relation is required"),
        age: z
          .number({
            required_error: "Beneficiary age is required",
            invalid_type_error: "Beneficiary age must be a number",
          })
          .int("Beneficiary age must be an integer")
          .min(1, "Beneficiary age must be at least 1")
          .max(120, "Beneficiary age must be less than 120"),
      })
    )
    .min(1, "At least one beneficiary is required"),
  maritalStatus: z.enum(["single", "divorced", "married", "widow", "widower"], {
    required_error: "Marital status is required",
  }),
  frequency: z.enum(["monthly", "biannually", "annually"], {
    required_error: "Frequency is required",
    invalid_type_error: "Frequency must be one of: monthly, biannually, annually",
  }),
  spouseName: z.string().optional(),
  spouseAge: z
    .number({
      invalid_type_error: "Spouse age must be a number",
    })
    .int("Spouse age must be an integer")
    .min(1, "Spouse age must be at least 1")
    .max(120, "Spouse age must be less than 120")
    .optional(),
  phone: z.string().min(1, "Phone number is required"),
  userEmail: z.string().email("Invalid email address").min(1, "Email is required"),
});

export type FuneralInsuranceFormValues = z.infer<typeof funeralInsuranceFormSchema>;

// Form schemas for each step
export const basicInfoSchema = z.object({
  proposerName: z.string().min(1, "Proposer name is required"),
  postOffice: z.string().min(1, "Post office is required"),
  phone: z.string().min(1, "Phone number is required"),
  userEmail: z.string().email("Valid email is required"),
  occupationorBusiness: z.string().min(1, "Occupation or business is required"),
});

export const propertyTypeSchema = z.object({
  privatePremises: z.boolean(),
  privateDwellingSelected: z.boolean().optional(),
  householdGoodsSelected: z.boolean().optional(),
  bussinessType: z.string().optional(),
});

export const propertyDetailsSchema = z.object({
  situationofProperty: z.string().min(1, "Property situation is required"),
  constructionBuiltWith: z.string().optional(),
  constructionRoofedtWith: z.string().optional(),
});

export const privateCoverageSchema = z.object({
  privateDwellingSumInsured: z.number().optional(),
  privatebuildingValue: z.number().optional(),
  outprivatebuildingValue: z.number().optional(),
  privatewallorFence: z.number().optional(),
  privateotherValue: z.number().optional(),
  houseGoodsSumInsured: z.number().optional(),
  houseGoodsDescription: z.string().optional(),
  houseGoodsValue: z.number().optional(),
});

export const businessCoverageSchema = z.object({
  businessbuildingValue: z.number().optional(),
  outbusinessbuildingValue: z.number().optional(),
  businesswallorFence: z.number().optional(),
  businessotherValue: z.number().optional(),
  businessRawMaterial: z.string().optional(),
  businesSemifinishedgoods: z.string().optional(),
  businesfinishedgoods: z.string().optional(),
});

export const policyPeriodSchema = z.object({
  commencementDate: z.string().min(1, "Commencement date is required"),
  ExpiryDate: z.string().min(1, "Expiry date is required"),
});

export const perilsSchema = z.object({
  impactPeril: z.boolean(),
  AircraftPeril: z.boolean(),
  ExplosionPeril: z.boolean(),
  WindStormPeril: z.boolean(),
  BurstPipePeril: z.boolean(),
  FloodPeril: z.boolean(),
  EarthQuakePeril: z.boolean(),
  RiotPeril: z.boolean(),
  BushfirePeril: z.boolean(),
});

// Combined schema for the entire form
export const fireInsuranceFormSchema = z.object({
  ...basicInfoSchema.shape,
  ...propertyTypeSchema.shape,
  // ...propertyDetailsSchema.shape,
  ...privateCoverageSchema.shape,
  ...businessCoverageSchema.shape,
  // ...policyPeriodSchema.shape,
  ...perilsSchema.shape,
  currencyID: z.string().min(1, "Currency is required"),
  totalSumtobeInsured: z.number(),
  businessSumtobeInsured: z.number(),
  usersufferedDamagebyFireorPeril: z.string().optional(),
  RejectedProposals: z.string().optional(),
  isproposedPropertyInsuredDetails: z.string().optional(),
  signatureofProposer: z.string().optional(),
  signatureofAgent: z.string().optional(),
  companyID: z.string().optional().nullable(),
  userAgentID: z.string().optional(),
  userID: z.string().optional(),
});

export type FireInsuranceFormValues = z.infer<typeof fireInsuranceFormSchema>;

export const claimRewardFormSchema = z
  .object({
    rewardType: z.enum(["Money", "Airtime"], {
      required_error: "Reward type is required",
    }),
    points: z
      .number({
        required_error: "Points is required",
        invalid_type_error: "Points must be a number",
      })
      .positive("Points must be greater than 0")
      .int("Points must be a whole number"),
    method: z.string().min(1, "Payment method is required"),
    methodName: z.string().min(1, "Method name is required"),
    methodCode: z.string().min(1, "Method code is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    accountName: z.string().min(1, "Account name is required"),
  })
  .refine(
    (data) => {
      if (data.rewardType === "Money") {
        return data.points >= 3;
      }
      if (data.rewardType === "Airtime") {
        return data.points >= 1;
      }
      return true;
    },
    {
      message: "Money requires minimum 3 points, Airtime requires minimum 1 point",
      path: ["points"],
    }
  );

export type ClaimRewardFormValues = z.infer<typeof claimRewardFormSchema>;
