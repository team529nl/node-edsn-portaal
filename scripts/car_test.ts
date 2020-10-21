import {DefaultCARClient, EDSN_EAN, TestParties} from "../src/lib/client";
import {DefaultCARMessageWriter} from "../src/lib/message";
import {deep, getTestCertificates} from "../src/lib/util";
import {ContactTypeIdentifier} from "../src/lib/soap.types/Types";
import format from 'xml-formatter';
import { SearchMeteringPointsResponseEnvelope } from "../src/lib/soap.types/SearchMeteringPointsResponse_1p6";

const {privateKey, publicCert} = getTestCertificates(TestParties.NB);
//
// const privateKey = fs.readFileSync(config.get<string>('Client.privateKey'));
// const publicCert = fs.readFileSync(config.get<string>('Client.publicCert'));

async function setup(): Promise<SearchMeteringPointsResponseEnvelope> {
  // const {server, address: proxyAddress} = await defaultProxyTunnel();
  const client = await new DefaultCARClient('https://portaal-opt.edsn.nl', privateKey, publicCert).init();

  client.on('request', xml => {console.debug(`"REQUEST\n${xml}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));

  const writer = new DefaultCARMessageWriter(TestParties.NB, ContactTypeIdentifier.RNB_MARKTPARTIJ, EDSN_EAN, ContactTypeIdentifier.EDSN);
  // const writer = new DefaultCARMessageWriter(config.get<string>('Client.sender'), ContactTypeIdentifier.LV_ORG, EDSN_EAN, ContactTypeIdentifier.EDSN);

  const {response, error} = await client.search(writer.searchMPWithZipCode('1111AA', 10));
  // console.debug(error);

  // server.close()
  return response!;
}

setup().catch(e => console.debug(e)).then(r => console.info(deep(r)));
