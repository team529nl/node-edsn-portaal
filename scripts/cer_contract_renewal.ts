import {
  DefaultFileExchangeMessageWriter,
  DefaultFileMessageWriter,
  FileExchangeMessageWriter,
  FileMessageWriter
} from "../src/lib/message";
import config from "config";
import {
  DefaultFileClient, DefaultFileExchangeClient,
  DefaultGridOperatorClient,
  EDSN_EAN, TestParties
} from "../src/lib/client";
import {deep, getTestCertificates, stringStream} from "../src/lib/util";
import {
  contractRenewalFilenames,
  createContractRenewalCSV
} from "../src/lib/csv";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import format from 'xml-formatter';
import { ContactTypeIdentifier } from "../src/lib/soap.types/Types";
import {FileUploadNotificationEnvelope} from "../src/lib/soap.types/FileUploadNotification_1p0";
import {FileListQueryEnvelope} from "../src/lib/soap.types/FileListQuery_1p0";
import * as crypto from "crypto"

interface TestConfig {
  fileMessageWriter: FileMessageWriter,
  fileExchangeMessageWriter: FileExchangeMessageWriter,
  uploadMessage: FileUploadNotificationEnvelope;
  listMessage: FileListQueryEnvelope;
  privateKey: Buffer;
  publicCert: Buffer;
  csv: string;
}

function LVATest(): TestConfig {
  const {privateKey, publicCert} = getTestCertificates(TestParties.LVA);
  const fileMessageWriter = new DefaultFileMessageWriter(TestParties.LVA, ContactTypeIdentifier.LV_MARKTPARTIJ, EDSN_EAN, ContactTypeIdentifier.EDSN);
  const fileExchangeMessageWriter = new DefaultFileExchangeMessageWriter(TestParties.LVA, ContactTypeIdentifier.LV_MARKTPARTIJ, EDSN_EAN, ContactTypeIdentifier.EDSN);
  const filenames = contractRenewalFilenames(TestParties.LVA, EDSN_EAN, new Date(Date.now()));
  const filename = filenames.next().value;
  return {
    fileMessageWriter, fileExchangeMessageWriter,
    privateKey, publicCert,
    uploadMessage: fileMessageWriter.fileUpload(filename, TestParties.LVA),
    listMessage: fileMessageWriter.listFiles(),
    csv: createContractRenewalCSV(TestParties.LVA, TestParties.LVA, EDSN_EAN,
      [{
        meteringPoint: "[ean18]",
        endDate: new Date(2021, 0, 1),
        noticePeriodInDays: 10
      },])
  }
}

async function testUpload() {

  const {privateKey, publicCert, uploadMessage, csv} =
    LVATest();


  console.debug(csv);

  const client = await new DefaultFileClient('https://portaal-opt.edsn.nl', privateKey, publicCert).init();
  client.on('request', xml => {console.debug(`"REQUEST\n${xml}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));
  const result = await client.upload(uploadMessage, stringStream(csv));
  console.info(deep(result));

}

async function testListFiles() {
  const {privateKey, publicCert, listMessage} =
    LVATest();

  const client = await new DefaultFileClient('https://portaal-opt.edsn.nl', privateKey, publicCert).init();
  client.on('request', xml => {console.debug(`"REQUEST\n${xml}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));
  const result = await client.list(listMessage);
  console.info(deep(result));

}

async function exchangeNotification() {
  const {privateKey, publicCert, fileExchangeMessageWriter, csv} =
    LVATest();

  const client = await new DefaultFileExchangeClient('https://portaal-opt.edsn.nl', privateKey, publicCert).init();
  client.on('request', xml => {console.debug(`"REQUEST\n${xml}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));

  console.info(crypto.createHash("md5").update(csv).digest("hex"))

  const message = fileExchangeMessageWriter.notification("ContractRenewal_[ean13]_8712423010208_20200117_01.csv",
    "901e99b0-1897-4e4c-bfa1-9192cffaa7f7", crypto.createHash("md5").update(csv).digest("hex"));

  const result = await client.notify(message);
  console.info(deep(result));

}

// testUpload().catch(e => console.error(e)).then(_ => console.debug("done"));
// testListFiles().catch(e => console.error(e)).then(_ => console.debug("done"));
exchangeNotification().catch(e => console.error(e)).then(_ => console.debug("done"));
