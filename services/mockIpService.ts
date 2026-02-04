
import { IP2ProxyResult } from '../types';

const mockDatabases: Record<string, Partial<IP2ProxyResult>> = {
  '8.8.8.8': {
    isProxy: 2,
    proxyType: 'DCH',
    countryShort: 'US',
    countryLong: 'United States',
    region: 'California',
    city: 'Mountain View',
    isp: 'Google LLC',
    domain: 'google.com',
    usageType: 'DCH',
    asn: '15169',
    asName: 'Google LLC',
    lastSeen: '1',
    threat: '-',
    provider: '-',
    fraudScore: '0'
  },
  '1.1.1.1': {
    isProxy: 2,
    proxyType: 'DCH',
    countryShort: 'AU',
    countryLong: 'Australia',
    region: 'Queensland',
    city: 'Brisbane',
    isp: 'CloudFlare Inc',
    domain: 'cloudflare.com',
    usageType: 'CDN',
    asn: '13335',
    asName: 'CloudFlare Inc',
    lastSeen: '1',
    threat: '-',
    provider: '-',
    fraudScore: '0'
  },
  '185.156.172.1': {
    isProxy: 1,
    proxyType: 'VPN',
    countryShort: 'SE',
    countryLong: 'Sweden',
    region: 'Stockholm',
    city: 'Stockholm',
    isp: 'Mullvad VPN',
    domain: 'mullvad.net',
    usageType: 'VPN',
    asn: '39351',
    asName: 'Mullvad VPN AB',
    lastSeen: '2',
    threat: '1',
    provider: 'Mullvad',
    fraudScore: '45'
  }
};

export const lookupIp = async (ip: string): Promise<IP2ProxyResult> => {
  // Artificial delay to simulate processing
  await new Promise(r => setTimeout(r, 150));
  
  const found = mockDatabases[ip];
  if (found) {
    return { ...found, ipAddress: ip } as IP2ProxyResult;
  }

  // Generate semi-random clean data for unknown IPs
  return {
    ipAddress: ip,
    isProxy: 0,
    proxyType: '-',
    countryShort: 'US',
    countryLong: 'United States',
    region: 'Unknown',
    city: 'Unknown',
    isp: 'Generic ISP',
    domain: 'example.com',
    usageType: 'RES',
    asn: '0000',
    asName: 'Unknown ASN',
    lastSeen: '-',
    threat: '-',
    provider: '-',
    fraudScore: '0'
  };
};
