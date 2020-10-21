import * as common from "./Common";

export interface SearchMeteringPointsResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: common.XOR<PortaalContentOK, PortaalContentNOK>;
}

export interface PortaalContentOK {
  Result: Result;
}

export interface PortaalContentNOK {
  Portaal_Rejection: common.PortaalRejection;
}

export interface Result {
  ReachedMaxResult: string;
  Portaal_MeteringPoint: PortaalMeteringPoint;
}

export interface PortaalMeteringPoint {
  EANID: string;
  EDSN_AddressSearch: common.EDSNAddressSearch;
  GridArea: string;
  LocationDescription: string;
  MarketSegment: string;
  ProductType: string;
  GridOperator_Company: GridOperatorCompany;
  MPCommercialCharacteristics: MPCommercialCharacteristics;
  Portaal_EnergyMeter: PortaalEnergyMeter;
  MPPhysicalCharacteristics: MPPhysicalCharacteristics;
  MeteringPointGroup: MeteringPointGroup;
}

export interface BAG {
  BAGID: string;
  BAGBuildingID: string;
}
export interface GridOperatorCompany {
  ID: string;
  Name: string;
}
export interface MPCommercialCharacteristics {
  DeterminationComplex: string;
  Residential: string;
}
export interface PortaalEnergyMeter {
  ID: string;
}
export interface MPPhysicalCharacteristics {
  AllocationMethod: string;
  ContractedCapacity: string;
  EnergyFlowDirection: string;
  InvoiceMonth: string;
  MeteringMethod: string;
  PhysicalCapacity: string;
  ProfileCategory: string;
  Subtype: string;
}
export interface MeteringPointGroup {
  PAP: PAP;
}
export interface PAP {
  EANID: string;
}
