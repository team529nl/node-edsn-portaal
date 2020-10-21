import * as soap from "soap"
import {CreateMeteringPointRequestEnvelope} from "./soap.types/CreateMeteringPointRequest";
import {CreateMeteringPointResponseEnvelope} from "./soap.types/CreateMeteringPointResponse";
import request from "request";
import {EventEmitter} from "events";
import * as path from "path";
import {ContractDataRequestEnvelope} from "./soap.types/ContractDataRequest_1p1";
import {ContractDataResponseEnvelope} from "./soap.types/ContractDataResponse_1p2";
import {FileUploadNotificationEnvelope} from "./soap.types/FileUploadNotification_1p0"
import {FileUploadAcknowledgementEnvelope} from "./soap.types/FileUploadAcknowledgement_1p0"
import {IAttachment} from "soap/lib/http";
import ReadableStream = NodeJS.ReadableStream;
import {SearchMeteringPointsRequestEnvelope} from "./soap.types/SearchMeteringPointsRequest_1p2";
import {SearchMeteringPointsResponseEnvelope} from "./soap.types/SearchMeteringPointsResponse_1p6";
import {FileListQueryEnvelope} from "./soap.types/FileListQuery_1p0";
import {FileListResponseEnvelope} from "./soap.types/FileListResponse_1p0";
import {FileExchangeNotificationEnvelope} from "./soap.types/FileExchangeNotification_1p4";
import {FileExchangeAcknowledgementEnvelope} from "./soap.types/FileExchangeAcknowledgement_1p1";

export enum TestParties {
  LVA="[EAN13]",
  PVA="[EAN13]",
  PVB="[EAN13]",
  MVA="[EAN13]",
  MVB="[EAN13]",
  NB="[EAN13]"
}

export const EDSN_EAN = "8712423010208";

export interface SoapResult<T> {
  response? : T,
  error?: string
}

type soapCall<I,O> = (msg: I, options?: any) => [O, string, object, string]; // result, rawResponse, headers, rawRequest

export interface PortaalClient {
  on(event: 'request'|'response', listener: (xml: string) => void): void
  off(event: 'request'|'response', listener: (xml: string) => void): void
}

export interface CERClient extends  PortaalClient {
  requestContractInformation(message: ContractDataRequestEnvelope): Promise<SoapResult<ContractDataResponseEnvelope>>
}

export interface GridOperatorClient extends PortaalClient {
  createMeteringPoint(message: CreateMeteringPointRequestEnvelope): Promise<SoapResult<CreateMeteringPointResponseEnvelope>>
}

export interface FileClient extends PortaalClient {
  upload(message: FileUploadNotificationEnvelope, data: ReadableStream): Promise<SoapResult<FileUploadAcknowledgementEnvelope>>
  list(message: FileListQueryEnvelope): Promise<SoapResult<FileListResponseEnvelope>>
}

export interface FileExchangeClient extends PortaalClient {
  notify(message: FileExchangeNotificationEnvelope): Promise<SoapResult<FileExchangeAcknowledgementEnvelope>>
}

export interface CARClient extends PortaalClient {
  search(message: SearchMeteringPointsRequestEnvelope): Promise<SoapResult<SearchMeteringPointsResponseEnvelope>>
}

abstract class Client implements PortaalClient{

  protected endpointBase: string;
  protected privateKey: Buffer;
  protected publicCert: Buffer;
  protected proxy?: string | undefined;

  protected emitter = new EventEmitter();

  public constructor(endpointBase: string, privateKey: Buffer, publicCert: Buffer, proxy?: string) {
    this.endpointBase = endpointBase;
    this.privateKey = privateKey;
    this.publicCert = publicCert;
  }

  abstract async init(): Promise<this>;

  off(event: "request" | "response", listener: (xml: string) => void): void {
    this.emitter.addListener(event, listener);
  }

  on(event: "request" | "response", listener: (xml: string) => void): void {
    this.emitter.addListener(event, listener);
  }

  protected async _createSoapClient(wsdl: string, endpointPath: string): Promise<soap.Client> {
    const sslSecurity = new soap.ClientSSLSecurity(this.privateKey, this.publicCert, {strictSSL: false, rejectUnauthorized: false});
    const options = this.proxy ? {request: request.defaults({proxy: this.proxy})} : {}; // {request};
    const client = await soap.createClientAsync(path.join(__dirname, './../../../resources/xsd/' + wsdl),
      {...options, endpoint: this.endpointBase + endpointPath});

    client.setSecurity(sslSecurity);

    // @ts-ignore
    client.on('request', (xml, eid) => this.emitter.emit('request', xml));
    // @ts-ignore
    client.on('response', (body, response, eid) => this.emitter.emit('response', body));

    return client;
  }

}

export class DefaultCERClient extends Client implements CERClient {
  private contractDataClient: soap.Client | undefined;

  async init(): Promise<this> {
    this.contractDataClient = await this._createSoapClient('cer/ContractData_2.wsdl', '/b2b/synchroon/ResponderContractDataRespondingActivity');
    return this;
  }

  async requestContractInformation(message: ContractDataRequestEnvelope): Promise<SoapResult<ContractDataResponseEnvelope>> {
    try {
      const [result, , ,] = await (this.contractDataClient!.ContractDataAsync as soapCall<ContractDataRequestEnvelope, ContractDataResponseEnvelope>)(message);
      return {response: result};
    }
    catch (e) {
      return {error: e};
    }
  }

}

export class DefaultGridOperatorClient extends Client implements GridOperatorClient {
  private mpClient: soap.Client | undefined;

  async init(): Promise<this> {
    this.mpClient = await this._createSoapClient('rgo/CreateMeteringPoint_2.wsdl', '/b2b/synchroon/ResponderCreateMeteringPointRespondingActivity');
    return this;
  }

  async createMeteringPoint(message: CreateMeteringPointRequestEnvelope): Promise<SoapResult<CreateMeteringPointResponseEnvelope>> {
    try {
      const [result, , ,] = await (this.mpClient!.CreateMeteringPointRequestAsync as soapCall<CreateMeteringPointRequestEnvelope, CreateMeteringPointResponseEnvelope>)(message);
      return {response: result};
    }
    catch (e) {
      return {error: e};
    }
  }

}

export class DefaultFileClient extends Client implements FileClient {
  private uploadClient: soap.Client | undefined;
  private listClient: soap.Client | undefined

  async init(): Promise<this> {
    this.uploadClient = await this._createSoapClient('file/FileUpload.wsdl', '/b2b/bulk/upload/FileUpload');
    this.listClient = await this._createSoapClient('file/FileList.wsdl', '/b2b/bulk/generic/FileList');
    return this;
  }

  async upload(message: FileUploadNotificationEnvelope, data: ReadableStream): Promise<SoapResult<FileUploadAcknowledgementEnvelope>> {
    try {
      const filename: string = message.EDSNBusinessDocumentHeader.Manifest!.ManifestItem[0].UniformResourceIdentifier;
      const [result, , ,] = await (this.uploadClient!.FileUploadNotificationAsync as soapCall<FileUploadNotificationEnvelope, FileUploadAcknowledgementEnvelope>)(message,
        {
          attachments: [
            {
              mimetype: "text/xml",
              contentId: filename,
              name: filename,
              body: data} as IAttachment
          ]}
          );
      return {response: result}
    }
    catch(e) {
      return {error: e};
    }
  }

  async list(message: FileListQueryEnvelope): Promise<SoapResult<FileListResponseEnvelope>> {
    try {
      const [result, , ,] = await (this.listClient!.FileListQueryAsync as soapCall<FileListQueryEnvelope, FileListResponseEnvelope>)(message);
      return {response: result}
    }
    catch(e) {
      return {error: e};
    }
  }

}

export class DefaultFileExchangeClient extends Client implements FileExchangeClient {
  private client: soap.Client | undefined;

  async init(): Promise<this> {
    this.client = await this._createSoapClient('file/FileExchange_1.wsdl', '/b2b/synchroon/ResponderFileExchangeInboxRespondingActivity');
    return this;
  }

  async notify(message: FileExchangeNotificationEnvelope): Promise<SoapResult<FileExchangeAcknowledgementEnvelope>> {
    try {
      const [result, , ,] = await (this.client!.FileExchangeNotificationAsync as soapCall<FileExchangeNotificationEnvelope, FileExchangeAcknowledgementEnvelope>)(message);
      return {response: result}
    }
    catch(e) {
      return {error: e};
    }
  }

}

export class DefaultCARClient extends Client implements CARClient {
  private searchClient: soap.Client | undefined;


  async init(): Promise<this> {
    this.searchClient = await this._createSoapClient('car/SearchMeteringPointsMP_1.wsdl', '/b2b/synchroon/ResponderSearchMeteringPointsMPRespondingActivity')
    return this;
  }

  async search(message: SearchMeteringPointsRequestEnvelope): Promise<SoapResult<SearchMeteringPointsResponseEnvelope>> {
    try {
      const [result, , ,] = await (this.searchClient!.SearchMeteringPointsAsync as soapCall<SearchMeteringPointsRequestEnvelope, SearchMeteringPointsResponseEnvelope>)(message);
      return {response: result};
    }
    catch (e) {
      return {error: e}
    }
  }

}
