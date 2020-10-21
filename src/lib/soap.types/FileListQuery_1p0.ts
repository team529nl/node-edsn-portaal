import * as common from "./Common"

export interface FileListQueryEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  FileListQueryContent: FileListQueryContent;
}

export interface FileListQueryContent {
  FileList_EDSNFileDetails: FileListEDSNFileDetails;
}

export interface FileListEDSNFileDetails {
  CommunicationPartner1EntityID_EDSNFileDetails: CommunicationPartner1EntityIDEDSNFileDetailsOrCommunicationPartner2EntityIDEDSNFileDetails;
  CommunicationPartner2EntityID_EDSNFileDetails: CommunicationPartner1EntityIDEDSNFileDetailsOrCommunicationPartner2EntityIDEDSNFileDetails;
  Direction: "I"|"O"|"U";
  EndDate_EDSNFileDetails?: EndDateEDSNFileDetailsOrStartDateEDSNFileDetails;
  FileType?: string;
  Group: string;
  StartDate_EDSNFileDetails?: EndDateEDSNFileDetailsOrStartDateEDSNFileDetails;
  Status?: Array<"Aangeboden"|"Teruggetrokken"|"Opgehaald"|"Afgemeld"|"Fout">;
}

export interface CommunicationPartner1EntityIDEDSNFileDetailsOrCommunicationPartner2EntityIDEDSNFileDetails {
  OrganisationID?: string;
  PartyID?: string;
}

export interface EndDateEDSNFileDetailsOrStartDateEDSNFileDetails {
  DateTime: string;
}
