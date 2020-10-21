import * as common from "./Common";

export interface ContractDataRequestEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  Portaal_MeteringPoint: PortaalMeteringPoint;
}

export interface PortaalMeteringPoint {
  EANID: string;
  MPCommercialCharacteristics?: MPCommercialCharacteristics;
  Portaal_Mutation: PortaalMutation;
}

export interface MPCommercialCharacteristics {
  GridContractParty?: GridContractParty;
}

export interface GridContractParty {
  BirthDayKey?: string;
  IBANKey?: string;
}

export interface PortaalMutation {
  ExternalReference?: string;
  Initiator: string;
  ConsentID?: string;
}
