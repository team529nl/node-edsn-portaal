import { ContactTypeIdentifier } from "./Types";

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export interface SOAPFault {
  ErrorCode: number;
  ErrorText: string;
  ErrorDetails?: string;
}

export interface EDSNBusinessDocumentHeader {
  ContentHash?: string;
  ConversationID?: string;
  CorrelationID?: string;
  CreationTimestamp: string;
  DocumentID?: string;
  ExpiresAt?: string;
  MessageID: string;
  ProcessTypeID?: string;
  RepeatedRequest?: string;
  TestRequest?: string;
  Destination?: Destination;
  Manifest?: Manifest;
  Source: Source;
}

export interface Destination {
  Receiver: Receiver;
  Service?: Service;
}

export interface Receiver {
  Authority?: string;
  ContactTypeIdentifier?: ContactTypeIdentifier;
  ReceiverID: string;
}

export interface Service {
  ServiceMethod?: string;
  ServiceName?: string;
}

export interface Manifest {
  NumberofItems: number;
  ManifestItem: ManifestItem[];
}

export interface ManifestItem {
  Description?: string;
  LanguageCode?: string;
  MimeTypeQualifierCode: string;
  UniformResourceIdentifier: string;
}

export interface Source {
  Authority?: string;
  ContactTypeIdentifier?: ContactTypeIdentifier;
  SenderID: string;
}

export interface CARTransactionDossier {
  ID: string;
}

export interface GridOperatorCompany {
  ID: string;
}

export interface EDSNGeographicalCoordinate {
  Latitude: string;
  Longitude: string;
}

export interface BAG {
  BAGID: string;
  BAGBuildingID?: string;
}

export interface EDSNAddressSearch {
  BAG?: BAG;
  StreetName?: string;
  BuildingNr?: number;
  ExBuildingNr?: string;
  ZIPCode?: string;
  CityName?: string;
  Country?: string;
}

export interface Rejection {
  RejectionCode: string;
  RejectionText?: string;
}

export interface PortaalRejection {
  Rejection: Rejection;
}

export interface EDSNSimpleRejection {
  Rejections: Rejection[];
}
