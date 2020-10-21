import * as common from "./Common";

export interface FileExchangeResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  GenericFileDetails?: GenericFileDetails;
  Portaal_Rejection?: common.PortaalRejection;
}
export interface GenericFileDetails {
  From: string;
  To: string;
  FileID: string;
  FileName: string;
  FileSort: string;
  ExchangeChannel: string;
  TotalNumberSegments: string;
  ExternalReference: string;
  Note: string;
  Hash: string;
  GBUFileDetails: GBUFileDetails;
  SFTPFileDetails: SFTPFileDetails;
}

export interface GBUFileDetails {
  NumberSegment: string;
  Hash: string;
  GBUFileID: string;
  GBUFileSort: string;
  GBUExchangeGroup: string;
}

export interface SFTPFileDetails {
  NumberSegment: string;
  Hash: string;
  SFTPLocation: string;
  SFTPFileName: string;
}

export interface PortaalRejection {
  Rejection: common.Rejection;
}
