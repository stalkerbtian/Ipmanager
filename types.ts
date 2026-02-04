
export interface IP2ProxyResult {
  ipAddress: string;
  isProxy: number; // 0: No, 1: Proxy, 2: VPN/DCH
  proxyType: string;
  countryShort: string;
  countryLong: string;
  region: string;
  city: string;
  isp: string;
  domain: string;
  usageType: string;
  asn: string;
  asName: string;
  lastSeen: string;
  threat: string;
  provider: string;
  fraudScore: string;
}

export enum ProxyStatus {
  CLEAN = 'Clean',
  PROXY = 'Proxy',
  VPN_DCH = 'VPN/DataCenter'
}

export interface SecurityInsight {
  ip: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendation: string;
}
