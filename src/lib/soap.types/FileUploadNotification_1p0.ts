import * as common from "./Common";

export interface FileUploadNotificationEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  FileUploadNotificationContent: FileUploadNotificationContent;
}

export interface FileUploadNotificationContent {
  FileUpload_EDSNFileDetails: FileUploadEDSNFileDetails;
}

export interface FileUploadEDSNFileDetails {
  FileType: string;
  Group: string;
  ReceivingEntityID_EDSNFileDetails: ReceivingEntityIDEDSNFileDetailsOrSendingEntityIDEDSNFileDetails;
  SendingEntityID_EDSNFileDetails: ReceivingEntityIDEDSNFileDetailsOrSendingEntityIDEDSNFileDetails;
}

export interface ReceivingEntityIDEDSNFileDetailsOrSendingEntityIDEDSNFileDetails {
  OrganisationID?: string;
  PartyID?: string;
}
