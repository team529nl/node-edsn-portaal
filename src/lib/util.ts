import config from 'config';
import tunnel from 'tunnel-ssh';
import {Server} from "net";
import * as util from "util";
import * as path from "path";
import * as fs from "fs";
import ReadableStream = NodeJS.ReadableStream;
import {Readable} from "stream";
export const {promisify} = util;

export function deep(o: any):  any {
  return o ? util.inspect(o, false, null) : {};
}

export function formatXml(src: string): string {
  let formatted = '';
  const reg = /(>)(<)(\/*)/g;
  const xml = src.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match( /.+<\/\w[^>]*>$/ )) {
      indent = 0;
    } else if (node.match( /^<\/\w/ )) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) {
      indent = 1;
    } else {
      indent = 0;
    }

    let padding = '';
    for (let i = 0; i < pad; i++) {
      padding += '  ';
    }

    formatted += padding + node + '\r\n';
    pad += indent;
  });

  return formatted;
}

const asyncTunnel = promisify(tunnel);

export async function createProxyTunnel(host: string, username: string, privateKey: Buffer): Promise<{server: Server, address: string}> {
  const proxyConfig = {
    keepAlive:true,
    host: 'host',
    dstHost: '127.0.0.1',
    dstPort: '8888',
    port: 22,
    username,
    privateKey
  };

  const server = await asyncTunnel(proxyConfig);
  return {server, address: `http://${proxyConfig.dstHost}:${proxyConfig.dstPort}`};
}

export async function defaultProxyTunnel(): Promise<{server: Server, address: string}> {
  return createProxyTunnel(config.get<string>('Proxy.host'), config.get<string>('Proxy.username'), fs.readFileSync(config.get<string>('Proxy.key')));
}

export function getTestCertificates(ean: string): {privateKey: Buffer, publicCert: Buffer} {
  const certsDir = config.get<string>('Test.certsDir');
  const privateKey = fs.readFileSync(path.join(certsDir, `${ean}${config.get<string>('Test.keySuffix')}`));
  const publicCert = fs.readFileSync(path.join(certsDir, `${ean}${config.get<string>('Test.certSuffix')}`));
  return {privateKey, publicCert}
}

export function stringStream(data: string): ReadableStream {
  const s = new Readable();
  s._read = () => {}; // redundant? for repl usage?
  s.push(data);
  s.push(null);
  return s;
}
