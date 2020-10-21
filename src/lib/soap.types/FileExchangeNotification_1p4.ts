import * as common from "./Common";

export interface FileExchangeNotificationEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  GenericFileDetails: GenericFileDetails;
}

export interface GenericFileDetails {
  From: string;
  To: string;
  FileName: string;
  FileSort: string;
  ExchangeChannel: "SFTP"|"GBU";
  TotalNumberSegments: number;
  ExternalReference?: string;
  Note?: string;
  Hash: string;
  GBUFileDetails?: GBUFileDetails[];
  SFTPFileDetails?: SFTPFileDetails[];
}

export interface GBUFileDetails {
  NumberSegment: number;
  Hash: string;
  GBUFileID: string;
  GBUFileSort: string;
  GBUExchangeGroup: string;
}

export interface SFTPFileDetails {
  NumberSegment: number;
  Hash: string;
  SFTPLocation: string;
  SFTPFileName: string;
}
