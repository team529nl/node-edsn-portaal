import * as common from "./Common";

export interface ContractDataResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  Portaal_MeteringPoint?: PortaalMeteringPoint;
  Portaal_Rejection?: PortaalRejection;
}

export interface PortaalMeteringPoint {
  EANID: string;
  MPCommercialCharacteristics: MPCommercialCharacteristics;
  Portaal_Mutation: PortaalMutation;
}

export interface MPCommercialCharacteristics {
  EndDateContract?: string;
  NoticePeriod: string;
}

export interface PortaalMutation {
  ExternalReference?: string;
  Dossier: Dossier;
}

export interface Dossier {
  ID: string;
}

export interface PortaalRejection {
  Rejection?: Rejection;
  Portaal_MeteringPoint: PortaalMeteringPoint1;
}

export interface Rejection {
  RejectionCode: string;
  RejectionText: string;
}

export interface PortaalMeteringPoint1 {
  EANID: string;
  Portaal_Mutation: PortaalMutation;
}
