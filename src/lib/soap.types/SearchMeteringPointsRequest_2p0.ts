import * as common from "./Common";

export interface SearchMeteringPointsRequestEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  CAR_Content: CARContent;
}

export interface CARContent {
  CAR_MeteringPoint: CARMeteringPoint;
}

export interface CARMeteringPoint {
  EANID?: string;
  GridArea?: string;
  EDSN_AddressExtended?: EDSNAddressExtended;
  MarketSegment?: string;
  LocationDescription?: string;
  ProductType?: string;
  Result?: Result;
  GridOperator_Company?: common.GridOperatorCompany;
  MPCommercialCharacteristics?: MPCommercialCharacteristics;
  MPPhysicalCharacteristics?: MPPhysicalCharacteristics;
}

export interface EDSNAddressExtended {
  BAG?: common.BAG;
  StreetName?: string;
  BuildingNr?: number;
  ExBuildingNr?: string;
  ZIPCode?: string;
  CityName?: string;
  Country?: string;
  EDSN_GeographicalCoordinate?: common.EDSNGeographicalCoordinate;
  TNTID?: string;
}

export interface Result {
  ResultSet: string;
}

export interface MPCommercialCharacteristics {
  DeterminationComplex?: string;
  Residential?: string;
}
export interface MPPhysicalCharacteristics {
  Appliance?: string;
  EnergyDeliveryStatus?: string;
  PhysicalStatus?: string;
  Subtype?: string;
  Type?: string;
}
