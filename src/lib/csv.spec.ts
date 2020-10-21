import * as chai from 'chai';
import { suite, test } from 'mocha';
import {
  ContractRenewalRecord, ContractRenewalResult,
  createContractRenewalCSV,
  parseContractRenewalResultCSV
} from "./csv";
const expect = chai.expect;

const testRecords: ReadonlyArray<ContractRenewalRecord> = [
  {meteringPoint: "100000000000000001", endDate: new Date(2021,0,1), noticePeriodInDays: 10},
  {meteringPoint: "100000000000000002", endDate: new Date(2020,0,1), noticePeriodInDays: 110},
  {meteringPoint: "100000000000000002", noticePeriodInDays: 110}
];



suite('ContractRenewal', () => {
  test('generate csv', () => {
    const result = createContractRenewalCSV("[ean13 org]", "[ean13 supplier]", "[ean13 edsn]", testRecords, {
      timestampGenerator: () => new Date(Date.parse("2019-12-01")),
      uuidGenerator: () => "00000000-0000-0000-0000-000000000000"
    });

    const expected = `"2019-12-01T00:00:00Z","00000000-0000-0000-0000-000000000000","[ean13 org]","[ean13 edsn]"
"[ean13 supplier]"
"100000000000000001","2021-01-01","10"
"100000000000000002","2020-01-01","99"
"100000000000000002",,"99"`;

    expect(result).to.eq(expected)
  });
});

suite('ContractRenewalResult', () => {
  test('parse csv', () => {
    const source = `"2012-03-23T18:23:55Z","bd48a920-2d9c-11e2-81c1-0800200c9a66","[ean13 edsn]","[ean13 rec]"
"ContractRenewal_[ean13 rec]_[ean13 edsn]_20120801_01.csv","829435","830215","[ean13 rec]"`;

    const result = parseContractRenewalResultCSV(source);
    expect(result).to.eql({
      header: {
        creationTimestamp: new Date(Date.parse("2012-03-23T18:23:55Z")),
        messageId: "bd48a920-2d9c-11e2-81c1-0800200c9a66",
        senderId: "[ean13 edsn]",
        receiverId: "[ean13 rec]"
      },
      report: {
        reference: "ContractRenewal_[ean13 rec]_[ean13 edsn]_20120801_01.csv",
        nProcessed: 829435,
        nTotal: 830215,
        supplier: "[ean13 rec]"
      },
      rejections: []
    } as ContractRenewalResult)

  });

  test('parse csv with rejections', () => {
    const source = `"2012-03-23T18:23:55Z","bd48a920-2d9c-11e2-81c1-0800200c9a66","[ean13 edsn]","[ean13 rec]"
"ContractRenewal_[ean13 rec]_[ean13 edsn]_20120801_01.csv","2","3","[ean13 rec]"
"[ean18 a]","2013-06-01","10","252","onbekend"
"[ean18 b]",,"10","252",`;

    const result = parseContractRenewalResultCSV(source);
    expect(result).to.eql({
      header: {
        creationTimestamp: new Date(Date.parse("2012-03-23T18:23:55Z")),
        messageId: "bd48a920-2d9c-11e2-81c1-0800200c9a66",
        senderId: "[ean13 edsn]",
        receiverId: "[ean13 rec]"
      },
      report: {
        reference: "ContractRenewal_[ean13 rec]_[ean13 edsn]_20120801_01.csv",
        nProcessed: 2,
        nTotal: 3,
        supplier: "[ean13 rec]"
      },
      rejections: [
        {
        meteringPoint: "[ean18 a]",
        endDate: new Date(Date.parse("2013-06-01T00:00:00.000Z")),
        noticePeriodInDays: 10,
        rejectionCode: "252",
        rejectionText: "onbekend"
        },
        {
          meteringPoint: "[ean18 b]",
          noticePeriodInDays: 10,
          rejectionCode: "252",
          rejectionText:""
        }
      ]
    } as ContractRenewalResult)

  })
});
