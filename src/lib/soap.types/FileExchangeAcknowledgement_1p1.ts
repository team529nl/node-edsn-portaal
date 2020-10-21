import * as common from "./Common";

export interface FileExchangeAcknowledgementEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  GenericFileDetails: GenericFileDetails;
  Portaal_Rejection: common.PortaalRejection;
}

export interface GenericFileDetails {
  FileID: string;
  ExternalReference: string;
}
