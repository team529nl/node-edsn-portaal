import config from 'config';
import {
  DefaultCERClient,
  EDSN_EAN
} from "../src/lib/client";
import * as fs from "fs";
import {
  DefaultCERMessageWriter, IBANKey
} from "../src/lib/message";
import { ContactTypeIdentifier } from '../src/lib/soap.types/Types';
import format from "xml-formatter";
import {deep} from "../src/lib/util";
import {ContractDataResponseEnvelope} from "../src/lib/soap.types/ContractDataResponse_1p2";

const privateKey = fs.readFileSync(config.get<string>('Client.privateKey'));
const publicCert = fs.readFileSync(config.get<string>('Client.publicCert'));

async function setup(): Promise<ContractDataResponseEnvelope> {
  const client = await new DefaultCERClient('https://portaal-opt.edsn.nl', privateKey, publicCert).init();

  client.on('request', xml => {console.debug(`"REQUEST\n${format(xml)}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));

  const writer = new DefaultCERMessageWriter(config.get<string>('Client.sender'), ContactTypeIdentifier.LV_ORG, EDSN_EAN, ContactTypeIdentifier.EDSN);

  const {response, error} = await client.requestContractInformation(
    writer.createContractDataRequestMessage('[ean18]', config.get<string>('Client.levEAN'),
    new IBANKey("889"), undefined, "889"));
  // const {response, error} = await client.createMeteringPoint({} as any);
  // console.debug(error);
  return response!;
}

setup().catch(e => console.debug(e)).then(r => console.info(deep(r)));
