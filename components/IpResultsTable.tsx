
import React from 'react';
import { IP2ProxyResult } from '../types';

interface IpResultsTableProps {
  results: IP2ProxyResult[];
}

export const IpResultsTable: React.FC<IpResultsTableProps> = ({ results }) => {
  const getStatusBadge = (isProxy: number) => {
    switch (isProxy) {
      case 0: return <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">Clean</span>;
      case 1: return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">Proxy</span>;
      case 2: return <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">VPN/DCH</span>;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-700">
          <tr>
            <th className="px-4 py-3">IP Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">ISP</th>
            <th className="px-4 py-3">Fraud Score</th>
            <th className="px-4 py-3">Threat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {results.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-slate-500 italic">
                No IP addresses processed yet. Use the tool above to begin.
              </td>
            </tr>
          ) : (
            results.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 mono text-indigo-300">{r.ipAddress}</td>
                <td className="px-4 py-3">{getStatusBadge(r.isProxy)}</td>
                <td className="px-4 py-3 font-medium">{r.proxyType}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{r.countryLong}</span>
                    <span className="text-xs text-slate-500">{r.city}, {r.region}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400 truncate max-w-[200px]">{r.isp}</td>
                <td className="px-4 py-3">
                  <span className={`font-mono ${parseInt(r.fraudScore) > 40 ? 'text-red-400' : 'text-slate-400'}`}>
                    {r.fraudScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.threat}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
