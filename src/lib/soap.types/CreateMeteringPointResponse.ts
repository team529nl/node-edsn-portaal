import * as common from "./Common";

export interface CreateMeteringPointResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  CAR_Content: CARContent;
}

export interface CARContent {
  CAR_MeteringPoint?: CARMeteringPoint;
  CAR_Rejection?: CARRejection;
}

export interface CARMeteringPoint {
  EANID: string;
  MPPhysicalCharacteristics: MPPhysicalCharacteristics;
  CAR_Mutation?: CARMutation;
}

export interface CARRejection {
  Rejection: common.Rejection[];
  CAR_MeteringPoint?: CARMeteringPoint1;
}

export interface MPPhysicalCharacteristics {
  PhysicalStatus: string;
}

export interface CARMutation {
  ExternalReference?: string;
  CAR_TransactionDossier?: common.CARTransactionDossier;
}

export interface CARMeteringPoint1 {
  EANID: string;
  CAR_Mutation?: CARMutation;
}
