import * as https from 'https';
import * as http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

let agent: https.Agent;
const configInfo = { region: process.env.awsRegion };

let httpsInstance: https.Agent = new https.Agent();
let httpInstance: http.Agent = new http.Agent();



if (process.env.LOCAL_HTTP_PROXY) {
  console.log("Using proxy: " + process.env.LOCAL_HTTP_PROXY)
  httpsInstance = new HttpsProxyAgent(process.env.LOCAL_HTTP_PROXY);
  httpInstance = new HttpProxyAgent(process.env.LOCAL_HTTP_PROXY);
  const config = { ...configInfo, httpOptions: { agent: httpsInstance } };
}

export const httpsAgent = httpsInstance;
export const httpAgent = httpInstance;

