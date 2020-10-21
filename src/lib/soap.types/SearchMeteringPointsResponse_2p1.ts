import * as common from "./Common";

export interface SearchMeteringPointsResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  CAR_Content: common.XOR<CARContentOK,CARContentNOK>;
}

export interface CARContentOK {
  Result: Result;
}

export interface CARContentNOK {
  CAR_Rejection: CARRejection;
}

export interface Result {
  MaxResults: string;
  ResultSet: string;
  CAR_MeteringPoint: CARMeteringPoint[];
}

export interface CARMeteringPoint {
  EANID: string;
  EDSN_Address?: EDSNAddress;
  LocationDescription?: string;
  MPPhysicalCharacteristics: MPPhysicalCharacteristics;
}

export interface EDSNAddress {
  StreetName?: string;
  BuildingNr?: string;
  ExBuildingNr?: string;
  ZIPCode?: string;
  CityName?: string;
  Country?: string;
}

export interface MPPhysicalCharacteristics {
  Appliance?: string;
  Subtype: string;
  Type: string;
}

export interface CARRejection {
  Rejection: common.Rejection;
}
