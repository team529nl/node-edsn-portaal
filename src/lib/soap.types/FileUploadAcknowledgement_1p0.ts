import * as common from "./Common";

export interface FileUploadAcknowledgementEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  FileUploadAcknowledgementContent: FileUploadAcknowledgementContent;
}

export interface FileUploadAcknowledgementContent {
  EDSN_SimpleRejection: common.EDSNSimpleRejection;
  UploadDate_EDSNFileDetails: UploadDateEDSNFileDetails;
}

export interface UploadDateEDSNFileDetails {
  DateTime: string;
}
