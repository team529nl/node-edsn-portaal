import * as common from "./Common";

export interface FileExchangeResultResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  GenericFileDetails: GenericFileDetails;
  Portaal_Rejection: common.PortaalRejection;
}

export interface GenericFileDetails {
  From: string;
  To: string;
  FileID: string;
  Portaal_Rejection: common.PortaalRejection;
}
