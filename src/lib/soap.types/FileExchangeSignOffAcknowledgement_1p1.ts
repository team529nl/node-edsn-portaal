import * as common from "./Common";

export interface FileExchangeSignOffAcknowledgementEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  Portaal_Rejection: common.PortaalRejection;
}
