import * as common from "./Common"

export interface FileListResponseEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  FileListResponseContent: FileListResponseContent;
}

export interface FileListResponseContent {
  EDSN_SimpleRejection: EDSNSimpleRejection;
  FileListResponse_EDSNFileDetails: FileListResponseEDSNFileDetails;
}

export interface EDSNSimpleRejection {
  Rejections: common.Rejection;
}

export interface FileListResponseEDSNFileDetails {
  CheckOutDate_EDSNFileDetails: CheckOutDateEDSNFileDetailsOrRecallDateEDSNFileDetailsOrUploadDateEDSNFileDetails;
  FileID: string;
  FileName: string;
  FileSize: string;
  FileType: string;
  Group: string;
  RecallDate_EDSNFileDetails: CheckOutDateEDSNFileDetailsOrRecallDateEDSNFileDetailsOrUploadDateEDSNFileDetails;
  ReceivingEntity_EDSNFileDetails: ReceivingEntityEDSNFileDetailsOrSendingEntityEDSNFileDetails;
  SendingEntity_EDSNFileDetails: ReceivingEntityEDSNFileDetailsOrSendingEntityEDSNFileDetails;
  Status: string;
  UploadDate_EDSNFileDetails: CheckOutDateEDSNFileDetailsOrRecallDateEDSNFileDetailsOrUploadDateEDSNFileDetails;
}

export interface CheckOutDateEDSNFileDetailsOrRecallDateEDSNFileDetailsOrUploadDateEDSNFileDetails {
  DateTime: string;
}

export interface ReceivingEntityEDSNFileDetailsOrSendingEntityEDSNFileDetails {
  OrganisationID?: string;
  OrganisationName?: string;
  PartyID?: string;
  PartyName?: string;
}
