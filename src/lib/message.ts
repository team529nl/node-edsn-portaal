import {CreateMeteringPointRequestEnvelope} from "./soap.types/CreateMeteringPointRequest";
import {ContractDataRequestEnvelope} from "./soap.types/ContractDataRequest_1p1";
import {FileUploadNotificationEnvelope} from "./soap.types/FileUploadNotification_1p0";
import {v1 as uuidv1} from "uuid";
import {MarketPartyEAN, MeteringPointEAN} from "./types";
import {utcDateTimeStringForSOAP} from "./formatting";
import {EDSNBusinessDocumentHeader, Manifest} from "./soap.types/Common";
import {SearchMeteringPointsRequestEnvelope} from "./soap.types/SearchMeteringPointsRequest_1p2";
import {ContactTypeIdentifier} from "./soap.types/Types";
import {FileListQueryEnvelope} from "./soap.types/FileListQuery_1p0";
import {subDays} from "date-fns"
import {FileExchangeNotificationEnvelope} from "./soap.types/FileExchangeNotification_1p4";

export class IBANKey {
  private readonly key: string;

  constructor(last3DigitsOfIban: string) {
    if (last3DigitsOfIban.length !== 3) {
      throw Error("Length should be 3")
    }
    if (isNaN(+last3DigitsOfIban)) {
      throw Error("Should be numeric")
    }
    this.key = last3DigitsOfIban;
  }

  toString(): string {
    return this.key;
  }
}

export class BirthDayKey {
  private readonly month: number;
  private readonly day: number;

  constructor(month: number, day: number) {
    if (month < 1 || month > 12) {
      throw Error("Invalid month")
    }
    if (day < 1 || day > 31) {
      throw Error("Invalid day")
    }
    this.month = month;
    this.day = day;
  }

  toString(): string {
    const sMonth = this.month.toString().padStart(2, '0');
    const sDay = this.day.toString().padStart(2, '0');
    return `--${sMonth}-${sDay}`;
  }
}

export interface CERMessageWriter {
  createContractDataRequestMessage(ean: MeteringPointEAN, supplier?: MarketPartyEAN,
                                   ibanKey?: IBANKey, birthDayKey?: BirthDayKey, consentID?: string): ContractDataRequestEnvelope
}

export interface GridOperatorMessageWriter {
  createMeteringPoint(postcode: string, huisnummer: number, woonplaats: string): CreateMeteringPointRequestEnvelope;
}

export interface FileMessageWriter {
  fileUpload(filename: string, supplier?: MarketPartyEAN): FileUploadNotificationEnvelope;
  listFiles(): FileListQueryEnvelope
}

export interface FileExchangeMessageWriter {
  notification(filename: string, gbuId: string, hash: string): FileExchangeNotificationEnvelope;
}

export interface CARMessageWriter {
  searchMPWithZipCode(zipCode: string, number: number): SearchMeteringPointsRequestEnvelope
}

export interface MessageWriterOptions {
  timestampGenerator?: () => Date;
  uuidGenerator?: () => string;
}

abstract class MessageWriter {
  protected sender: MarketPartyEAN;
  protected senderType: ContactTypeIdentifier;
  protected receiver: MarketPartyEAN;
  protected receiverType: ContactTypeIdentifier;

  protected now: () => Date;
  protected uuid: () => string;

  public constructor(sender: MarketPartyEAN, senderType: ContactTypeIdentifier,
                     receiver: MarketPartyEAN, receiverType: ContactTypeIdentifier,
                     options?: MessageWriterOptions) {
    this.sender = sender;
    this.senderType = senderType;
    this.receiver = receiver;
    this.receiverType = receiverType;

    this.now = options && options.timestampGenerator ? options.timestampGenerator : () => new Date(Date.now());
    this.uuid = options && options.uuidGenerator ? options.uuidGenerator : uuidv1;
  }

  protected defaultHeader(): {EDSNBusinessDocumentHeader: EDSNBusinessDocumentHeader} {
    return {
      EDSNBusinessDocumentHeader: {
        CreationTimestamp: utcDateTimeStringForSOAP(this.now()),
        MessageID: this.uuid(),
        Destination: {
          Receiver: {
            Authority: "EAN.UCC",
            ContactTypeIdentifier: this.receiverType,
            ReceiverID: this.receiver
          }
        },
        Source: {
          Authority: "EAN.UCC",
          ContactTypeIdentifier: this.senderType,
          SenderID: this.sender
        }
      }
    }
  }

  protected fileHeader(properties?: {manifest?: Manifest}): {EDSNBusinessDocumentHeader: EDSNBusinessDocumentHeader} {
    return {
      EDSNBusinessDocumentHeader: {
        CreationTimestamp: utcDateTimeStringForSOAP(this.now()),
        Destination: {
          Receiver: {
            Authority: "EAN.UCC",
            ContactTypeIdentifier: this.receiverType,
            ReceiverID: this.receiver
          }
        },
        ...((properties && properties.manifest) ? {Manifest: properties.manifest} : {}),
        MessageID: this.uuid(),
        Source: {
          Authority: "EAN.UCC",
          ContactTypeIdentifier: this.senderType,
          SenderID: this.sender
        }
      }
    }
  }

  protected fileExchangeHeader(properties?: {manifest?: Manifest}): {EDSNBusinessDocumentHeader: EDSNBusinessDocumentHeader} {
    return {
      EDSNBusinessDocumentHeader: {
        CreationTimestamp: utcDateTimeStringForSOAP(this.now()),
        MessageID: this.uuid(),
        Destination: {
          Receiver: {
            Authority: "EAN.UCC",
            ContactTypeIdentifier: this.receiverType,
            ReceiverID: this.receiver
          }
        },
        ...((properties && properties.manifest) ? {Manifest: properties.manifest} : {}),
        Source: {
          Authority: "EAN.UCC",
          ContactTypeIdentifier: this.senderType,
          SenderID: this.sender
        }
      }
    }
  }
}

export class DefaultCERMessageWriter extends MessageWriter implements CERMessageWriter {

  createContractDataRequestMessage(ean: MeteringPointEAN, supplier?: MarketPartyEAN,
                                   ibanKey?: IBANKey, birthDayKey?: BirthDayKey, consentID?: string): ContractDataRequestEnvelope {

    if (!!consentID && !(!!ibanKey || !!birthDayKey)) {
      throw Error("consentId requires ibanKey and/or birthDayKey");
    }

    if ((!!ibanKey || !!birthDayKey) && !consentID) {
      throw Error("customerKey (iban, birthday) requires consentId");
    }

    if (!!consentID && consentID.length > 60) {
      throw Error("consentId max length == 60");
    }

    return {
      ...this.defaultHeader(),
      Portaal_Content: {
        Portaal_MeteringPoint: {
          EANID: ean,
          ...(!!birthDayKey || ibanKey? {MPCommercialCharacteristics: {
            GridContractParty: {
              ...(!!birthDayKey ? {BirthDayKey: birthDayKey.toString()} : {}),
              ...(!!ibanKey ? {IBANKey: ibanKey.toString()} : {})
            }
          }} : {}),
          Portaal_Mutation: {
            Initiator: supplier || this.sender,
            ...(!!consentID ? {ConsentID: consentID} : {})
          }
        }
      }
    }
  }
}

export class DefaultGridOperatorMessageWriter extends MessageWriter implements GridOperatorMessageWriter {

  createMeteringPoint(postcode: string, huisnummer: number, woonplaats: string): CreateMeteringPointRequestEnvelope {
    return {
      ...this.defaultHeader(),
      CAR_Content: {
        CAR_MeteringPoint: {
          EDSN_AddressExtended: {
            BuildingNr: huisnummer,
            ZIPCode: postcode,
            CityName: woonplaats
          },
          MarketSegment: "KVB",
          ProductType: "ELK",
          GridOperator_Company: {ID: this.sender},
          MPCommercialCharacteristics: {
            DeterminationComplex: "N",
            Residential: "J"
          },
          MPPhysicalCharacteristics: {
            AllocationMethod: "PRF",
            MeteringMethod: "MND",
            PhysicalCapacity: "3x25",
            ProfileCategory: "E1A",
            Subtype: "GWN",
            SustainableEnergy: "NVT"
          },
          CAR_Mutation: {
            DeterminationCapTarCode: "AUT"
          }
        }
      }
    }
  }
}

export class DefaultFileMessageWriter extends MessageWriter implements FileMessageWriter {

  fileUpload(filename: string, supplier?: MarketPartyEAN): FileUploadNotificationEnvelope {
    return {
      ...this.fileHeader({manifest: {
        ManifestItem: [{
          MimeTypeQualifierCode: "" ,
          UniformResourceIdentifier: filename
        }],
          NumberofItems: 1,} as Manifest}),
      FileUploadNotificationContent: {
        FileUpload_EDSNFileDetails: {
          FileType: "CER Contract Bronbestand",
          Group: "CER",
          ReceivingEntityID_EDSNFileDetails: {
            OrganisationID: this.receiver
          },
          SendingEntityID_EDSNFileDetails: {
            OrganisationID: this.sender
          }
        }
      }
    }
  }

  listFiles(): FileListQueryEnvelope {
    const now = this.now();
    return {
      ...this.fileHeader(),
      FileListQueryContent: {
        FileList_EDSNFileDetails: {
          CommunicationPartner1EntityID_EDSNFileDetails: {
            OrganisationID: this.sender
          },
          CommunicationPartner2EntityID_EDSNFileDetails: {
            OrganisationID: this.receiver
          },
          Direction: "O",
          EndDate_EDSNFileDetails: {
            DateTime: utcDateTimeStringForSOAP(now)
          },
          Group: "CER",
          StartDate_EDSNFileDetails: {
            DateTime: utcDateTimeStringForSOAP(subDays(now, 31))
          }
        }
      }
    }
  }
}

export class DefaultFileExchangeMessageWriter extends MessageWriter implements FileExchangeMessageWriter {
  notification(filename: string, gbuId: string, hash: string): FileExchangeNotificationEnvelope {
    return {
      ...this.fileExchangeHeader(),
      Portaal_Content: {
        GenericFileDetails: {
          From: this.sender,
          To: this.receiver,
          FileName: filename,
          FileSort: "CNTRCT",
          ExchangeChannel: "GBU",
          TotalNumberSegments: 1,
          Hash: hash,
          GBUFileDetails: [{
            NumberSegment: 1,
            Hash: hash,
            GBUFileID: gbuId,
            GBUFileSort: "CER",
            GBUExchangeGroup: "CER Contract Bronbestand"
          }]
        }
      }
    }
  }

}

export class DefaultCARMessageWriter extends MessageWriter implements CARMessageWriter {
  searchMPWithZipCode(zipCode: string, number: number): SearchMeteringPointsRequestEnvelope {
    return {
      ...this.defaultHeader(),
      Portaal_Content: {
        Portaal_MeteringPoint: {
          EDSN_AddressSearch: {
            BuildingNr: number,
            ZIPCode: zipCode
          }
        }
      }
    }
  }

}
