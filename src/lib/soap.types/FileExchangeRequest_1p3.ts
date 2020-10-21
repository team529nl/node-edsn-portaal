import * as common from "./Common";

export interface FileExchangeRequestEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  GenericFileDetails: GenericFileDetails;
}

export interface GenericFileDetails {
  From: string;
  To: string;
  FileSort: string;
  ExternalReference: string;
}
