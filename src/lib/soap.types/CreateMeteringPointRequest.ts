import * as common from "./Common";

export interface CreateMeteringPointRequestEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  CAR_Content: CARContent;
}

export interface CARContent {
  CAR_MeteringPoint: CARMeteringPoint;
}

export interface CARMeteringPoint {
  EANID?: string;
  EDSN_AddressExtended?: EDSNAddressExtended;
  GridArea?: string;
  LocationDescription?: string;
  MarketSegment: string; // Verbruikssegment: ART, GVB, KVB (LDT2).
  ProductType: string; // Type van de aansluiting: Electriciteit, Gas of Water (LDT2).
  ValidFromDate?: string;
  GridOperator_Company: common.GridOperatorCompany;
  MPCommercialCharacteristics?: MPCommercialCharacteristics;
  MPPhysicalCharacteristics?: MPPhysicalCharacteristics;
  CAR_Mutation?: CARMutation;
  MeteringPointGroup?: MeteringPointGroup;
}

export interface CARMutation {
  DeterminationCapTarCode?: string;
  ExternalReference?: string;
  CAR_UserInformation?: CARUserInformation;
}

export interface CARUserInformation {
  UserName: string;
}

export interface EDSNAddressExtended {
  BAG?: BAG;
  StreetName?: string;
  BuildingNr?: number;
  ExBuildingNr?: string;
  ZIPCode?: string;
  CityName: string;
  Country?: string;
  EDSN_GeographicalCoordinate?: common.EDSNGeographicalCoordinate;
  TNTID?: string;
}

export interface BAG {
  BAGID: string;
  BAGBuildingID?: string;
}

export interface MPCommercialCharacteristics {
  DeterminationComplex?: string;
  Residential?: string;
}

export interface MPPhysicalCharacteristics {
  AllocationMethod?: string;
  AllocationPoint?: string;
  Appliance?: string;
  ArticleSub?: string;
  CapTarCode?: string;
  ContractedCapacity?: string;
  EACOffPeak?: string;
  EACPeak?: string;
  EnergyFlowDirection?: string;
  InvoiceMonth?: string;
  MaxConsumption?: string;
  MeteringMethod?: string;
  PhysicalCapacity?: string;
  ProfileCategory?: string;
  SDERegulation?: string;
  Subtype?: string;
  SustainableEnergy?: string;
  Switchability?: string;
}

export interface MeteringPointGroup {
  PAP: PAP;
}

export interface PAP {
  EANID: string;
}
