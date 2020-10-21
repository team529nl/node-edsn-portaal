import {
  DefaultGridOperatorClient,
  EDSN_EAN,
  TestParties
} from "../src/lib/client";
import {DefaultGridOperatorMessageWriter} from "../src/lib/message";
import {
  deep,
  defaultProxyTunnel,
  getTestCertificates
} from "../src/lib/util";
import { ContactTypeIdentifier } from "../src/lib/soap.types/Types";
import {CreateMeteringPointResponseEnvelope} from "../src/lib/soap.types/CreateMeteringPointResponse";

const {privateKey, publicCert} = getTestCertificates(TestParties.NB);

async function setup(): Promise<CreateMeteringPointResponseEnvelope> {
  const {server, address: proxyAddress} = await defaultProxyTunnel();
  const client = await new DefaultGridOperatorClient('https://portaal-opt.edsn.nl', privateKey, publicCert, proxyAddress).init();

  client.on('request', xml => {console.debug(`"REQUEST\n${xml}`)});
  client.on('response', xml => console.debug(`RESPONSE\n${xml}`));

  const writer = new DefaultGridOperatorMessageWriter(TestParties.NB, ContactTypeIdentifier.RNB_MARKTPARTIJ, EDSN_EAN, ContactTypeIdentifier.EDSN);

  const {response, error} = await client.createMeteringPoint(writer.createMeteringPoint('1111AA', 11, "Amsterdam"));
  // const {response, error} = await client.createMeteringPoint({} as any);
  // console.debug(error);

  server.close()
  return response!;
}

setup().catch(e => console.debug(e)).then(r => console.info(deep(r)));
