import {MarketPartyEAN, MeteringPointEAN} from "./types";
import {v1 as uuidv1} from "uuid";
import {
  dateStringForContractEnd, dateStringForFilename,
  utcDateTimeStringForSOAP
} from "./formatting";

const parse = require('csv-parse/lib/sync');

export function* contractRenewalFilenames(sender: MarketPartyEAN, receiver: MarketPartyEAN, date: Date): Generator<string> {
  const datestring = dateStringForFilename(date);
  let i = 1
  while(i < 100) {
    yield `ContractRenewal_${sender}_${receiver}_${datestring}_${i.toString().padStart(2,"0")}.csv`;
    ++i;
  }
}

export interface CSVOptions {
  timestampGenerator?: () => Date
  uuidGenerator?: () => string
}

export interface EDSNCSVHeader {
  creationTimestamp: Date
  messageId: string
  senderId: MarketPartyEAN
  receiverId: MarketPartyEAN
}

export interface ContractRenewalProcessingReport {
  reference: string
  nProcessed: number
  nTotal: number
  supplier: MarketPartyEAN
}

export interface ContractRenewalRecord {
  meteringPoint: MeteringPointEAN
  endDate?: Date
  noticePeriodInDays: number
}

export interface ContractRenewalRejectionRecord extends ContractRenewalRecord {
  rejectionCode: string
  rejectionText: string
}

export interface ContractRenewalResult {
  header: EDSNCSVHeader
  report: ContractRenewalProcessingReport
  rejections: ContractRenewalRejectionRecord[]
}

/* Contract renewal
1     EDSNCSVDocumentHeader.CreationTimestamp,EDSNCSVDocumentHeader.MessageID,Source.SenderID,Receiver.ReceiverID
2     BalanceSupplierCompany.ID
3..n  Portaal_MeteringPoint.EANID,CommercialCharacteristics.EndDateContract,CommercialCharacteristics.NoticePeriod
 */

export function createContractRenewalCSV(senderId: MarketPartyEAN, supplierID: MarketPartyEAN, receiverID: MarketPartyEAN,
                                         records: ReadonlyArray<ContractRenewalRecord>, options?: CSVOptions): string {
  const tg = options && options.timestampGenerator ? options.timestampGenerator : () => new Date(Date.now());
  const uuidg = options && options.uuidGenerator ? options.uuidGenerator : uuidv1;
  const lines: string[] = [];
  lines.push(`"${utcDateTimeStringForSOAP(tg())}","${uuidg()}","${senderId}","${receiverID}"`);
  lines.push(`"${supplierID}"`);
  for (const o of records) {
    const csvNoticePeriod = Math.min(o.noticePeriodInDays, 99); // because maximum of 2 digits.
    lines.push(`"${o.meteringPoint}",${o.endDate ? '"'+dateStringForContractEnd(o.endDate)+ '"' : ''},"${csvNoticePeriod}"`)
  }
  return lines.join("\n");
}

/* Contract renewal result
1    EDSNCSVDocumentHeader.CreationTimestamp,EDSNCSVDocumentHeader.MessageID,Source.SenderID,Receiver.ReceiverID
2    Portaal_Mutation.ExternalReference,Result.NumberProcessed,Result.TotalNumber,BalanceSupplierCompany.ID
3..n Portaal_MeteringPoint.EANID,CommercialCharacteristics.EndDateContract,CommercialCharacteristics.NoticePeriod,Portaal_Rejection.RejectionCode,Rejection.RejectionText
 */

export function parseContractRenewalResultCSV(csv: string): ContractRenewalResult {
  const lines = csv.split(/\r?\n/);
  const [header, report] = parse(lines.slice(0,2).join("\n"), {delimiter: ",", quote: "\""});

  const [datestring, messageId, senderId, receiverId] = header;
  const [reference, processed, total, supplier] = report;

  const rejections = parse(lines.slice(2).join("\n"), {delimiter: ",", quote: "\""});
  console.debug(rejections)
  return {
    header: {
      creationTimestamp: new Date(Date.parse(datestring)),
      messageId: messageId,
      senderId: senderId,
      receiverId: receiverId
    },
    report: {
      reference: reference,
      nProcessed: parseInt(processed),
      nTotal: parseInt(total),
      supplier: supplier
    },
    rejections: rejections.map(([mp, ed, np, rc, rt]: [string, string, string, string, string])=>
    {return {meteringPoint: mp, ...(ed !== "" ? {endDate: new Date(Date.parse(ed)) }: {}) , noticePeriodInDays: parseInt(np),
      rejectionCode: rc, rejectionText: rt} as ContractRenewalRejectionRecord;})
  }
}
