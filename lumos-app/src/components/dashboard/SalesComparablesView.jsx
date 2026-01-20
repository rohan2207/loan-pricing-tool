import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function SalesComparablesView({ borrowerData = {} }) {
  const [activeView, setActiveView] = useState('table');
  
  const property = borrowerData.property || {};
  
  // Subject property data
  const subjectProperty = {
    address: property.address || '468 CHAMBERLIN DR',
    city: property.city || 'MANCHESTER',
    state: property.state || 'MO',
    zip: property.zip || '63021-5118',
    avmValue: property.avmValue || 312000,
    estimatedPrice: property.purchasePrice || 262802,
    purchaseDate: property.purchaseDate || 'Aug 24, 2022',
    beds: property.bedrooms || 3,
    baths: property.bathrooms || 2,
    sqFt: property.livingArea || 1455,
    lotSize: 15150,
    pricePerSqFt: property.pricePerSqFt || 214,
    yearBuilt: property.yearBuilt || 1973
  };

  // Sample comparables data
  const comparables = [
    {
      address: '425 CHAMBERLIN DR',
      city: 'BALLWIN',
      state: 'MO',
      zip: '63021-5104',
      price: 247380,
      priceDiff: -64620,
      lastSaleDate: 'Oct 2, 2025',
      beds: 3,
      bedsDiff: 0,
      baths: 2,
      bathsDiff: 0,
      sqFt: 1439,
      sqFtDiff: -16,
      lotSize: 7248,
      lotSizeDiff: -7902,
      yearBuilt: 1955,
      yearBuiltDiff: -18,
      pricePerSqFt: 172,
      pricePerSqFtDiff: -42,
      distance: '0.14 mi'
    },
    {
      address: '424 CHAMBERLIN DR',
      city: 'BALLWIN',
      state: 'MO',
      zip: '63021-5103',
      price: 1480000,
      priceDiff: 1168000,
      lastSaleDate: 'Aug 25, 2025',
      beds: 3,
      bedsDiff: 0,
      baths: 1,
      bathsDiff: -1,
      sqFt: 1421,
      sqFtDiff: -34,
      lotSize: 5998,
      lotSizeDiff: -9152,
      yearBuilt: 1955,
      yearBuiltDiff: -18,
      pricePerSqFt: 1042,
      pricePerSqFtDiff: 828,
      distance: '0.14 mi'
    },
    {
      address: '340 HILLCREST BLVD',
      city: 'BALLWIN',
      state: 'MO',
      zip: '63021-5223',
      price: 260680,
      priceDiff: -51320,
      lastSaleDate: 'Aug 19, 2025',
      beds: 2,
      bedsDiff: -1,
      baths: 1,
      bathsDiff: -1,
      sqFt: 1354,
      sqFtDiff: -101,
      lotSize: 7501,
      lotSizeDiff: -7649,
      yearBuilt: 1954,
      yearBuiltDiff: -19,
      pricePerSqFt: 193,
      pricePerSqFtDiff: -21,
      distance: '0.28 mi'
    },
    {
      address: '17 ROLAND AVE',
      city: 'BALLWIN',
      state: 'MO',
      zip: '63021-5259',
      price: 282635,
      priceDiff: -29365,
      lastSaleDate: 'Dec 1, 2025',
      beds: 3,
      bedsDiff: 0,
      baths: 1,
      bathsDiff: -1,
      sqFt: 1332,
      sqFtDiff: -123,
      lotSize: 5998,
      lotSizeDiff: -9152,
      yearBuilt: 1968,
      yearBuiltDiff: -5,
      pricePerSqFt: 212,
      pricePerSqFtDiff: -2,
      distance: '0.37 mi'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDiff = (diff) => {
    if (diff === 0) return null;
    const formatted = diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
    const colorClass = diff > 0 ? 'text-[#3e8051]' : 'text-[#ad0000]';
    return <span className={`font-bold text-xs ${colorClass}`}>{formatted}</span>;
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="border-b border-neutral-l3 mb-4">
        <div className="flex">
          <button
            onClick={() => setActiveView('split')}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeView === 'split' 
                ? 'border-b-2 border-[#ff8300] text-neutral-d2' 
                : 'text-neutral hover:border-b-2 hover:border-[#ffcd99]'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeView === 'table' 
                ? 'border-b-2 border-[#ff8300] text-neutral-d2' 
                : 'text-neutral hover:border-b-2 hover:border-[#ffcd99]'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Table View Content */}
      {activeView === 'table' && (
        <div className="w-full flex flex-col">
          {/* Subject Property Card */}
          <div className="rounded border border-[#8db7d7] bg-[#e8f0f7] shadow-sm hover:shadow-md transition-shadow mb-4">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold">{subjectProperty.address}</div>
                  <div className="text-sm text-neutral-l1">{subjectProperty.city}, {subjectProperty.state} {subjectProperty.zip}</div>
                </div>
                <div className="text-right">
                  <div className="flex gap-2 items-baseline justify-end">
                    <div className="text-xs text-neutral-l1">AVM Value</div>
                    <div className="font-semibold">{formatCurrency(subjectProperty.avmValue)}</div>
                  </div>
                  <div className="flex gap-2 items-baseline justify-end">
                    <div className="text-xs text-neutral-l1">Estimated Price</div>
                    <div className="font-semibold">{formatCurrency(subjectProperty.estimatedPrice)}</div>
                  </div>
                  <div className="text-xs text-neutral-l1 mt-1">{subjectProperty.purchaseDate}</div>
                </div>
              </div>
              <div className="flex gap-4 justify-between mb-4">
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">Beds</div>
                  <div className="font-semibold">{subjectProperty.beds}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">Bath</div>
                  <div className="font-semibold">{subjectProperty.baths}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">Sq Ft</div>
                  <div className="font-semibold">{subjectProperty.sqFt.toLocaleString()}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">Lot Size (Sq Ft)</div>
                  <div className="font-semibold">{subjectProperty.lotSize.toLocaleString()}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">$/Sq Ft</div>
                  <div className="font-semibold">${subjectProperty.pricePerSqFt}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-neutral-l1 mb-1">Built</div>
                  <div className="font-semibold">{subjectProperty.yearBuilt}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparables Table */}
          <div className="bg-white rounded border border-neutral-l3 pb-2">
            <div className="px-2 overflow-x-auto max-h-[600px]">
              <table className="border-separate w-full">
                <thead>
                  <tr className="w-fit h-14">
                    <TableHeader>Address</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Last Sale Date</TableHeader>
                    <TableHeader>Beds</TableHeader>
                    <TableHeader>Baths</TableHeader>
                    <TableHeader>Sq Ft</TableHeader>
                    <TableHeader>Lot Size (Sq Ft)</TableHeader>
                    <TableHeader>Built</TableHeader>
                    <TableHeader>$/Sq Ft</TableHeader>
                    <TableHeader>Distance</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {comparables.map((comp, index) => (
                    <tr key={index} className="group w-fit font-normal text-sm h-14 hover:bg-[#f2f8f9]">
                      <td className="border-b border-neutral-l3 p-2" style={{ width: '200px' }}>
                        <div className="flex items-center">
                          <div className="mr-4 w-[120px]">
                            <div className="w-full max-h-[60px] flex items-center justify-center overflow-hidden bg-neutral-l4 rounded">
                              <div className="text-xs text-neutral-l1 p-2 text-center">Street View</div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{comp.address}</div>
                            <div className="text-xs text-neutral-l1">{comp.city}, {comp.state} {comp.zip}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{formatCurrency(comp.price)}</span>
                          {formatDiff(comp.priceDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">{comp.lastSaleDate}</td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.beds}</span>
                          {formatDiff(comp.bedsDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.baths}</span>
                          {formatDiff(comp.bathsDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.sqFt.toLocaleString()}</span>
                          {formatDiff(comp.sqFtDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.lotSize.toLocaleString()}</span>
                          {formatDiff(comp.lotSizeDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.yearBuilt}</span>
                          {formatDiff(comp.yearBuiltDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>${comp.pricePerSqFt}</span>
                          {formatDiff(comp.pricePerSqFtDiff)}
                        </div>
                      </td>
                      <td className="border-b border-neutral-l3 p-2">
                        <div className="flex flex-col items-start">
                          <span>{comp.distance}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Split View Content */}
      {activeView === 'split' && (
        <div className="text-center py-12 text-neutral-l1">
          <p>Split View - Coming Soon</p>
          <p className="text-sm mt-2">This view will show side-by-side comparison of properties</p>
        </div>
      )}
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th className="group relative p-2 border-b border-neutral-l1 cursor-pointer select-none text-left" style={{ width: '150px' }}>
      <div className="flex items-center gap-1">
        <span className="text-sm">{children}</span>
        <ChevronDown className="w-4 h-4 text-neutral-l1" />
      </div>
    </th>
  );
}
