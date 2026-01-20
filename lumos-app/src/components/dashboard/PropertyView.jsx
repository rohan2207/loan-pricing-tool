import React, { useState } from 'react';

export function PropertyView({ borrowerData = {} }) {
  const [activeTab, setActiveTab] = useState('property');
  
  const property = borrowerData.property || {};
  
  // Calculate derived values
  const appreciation = property.appreciation || 18.7;
  const currentEquity = property.currentEquity || 63307;
  const pricePerSqFt = property.pricePerSqFt || 214;
  const ownershipYears = property.ownershipYears || 4;

  return (
    <div className="p-6 space-y-4">
      {/* Property Investment Analysis Banner */}
      <div className="rounded bg-white border border-neutral-l3 w-full bg-gradient-to-r from-[#edf6f2] to-[#e8f0f7] p-2">
        <div className="p-4">
          <p className="not-italic text-base font-medium mb-4">Property Investment Analysis</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#3e8051]">+{appreciation}%</p>
              <p className="text-xs font-normal text-neutral-l1">Appreciation</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1a1a2e]">${currentEquity.toLocaleString()}</p>
              <p className="text-xs font-normal text-neutral-l1">Current Equity</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1c70af]">${pricePerSqFt}</p>
              <p className="text-xs font-normal text-neutral-l1">Price per Sq Ft</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#ff8300]">{ownershipYears} yrs</p>
              <p className="text-xs font-normal text-neutral-l1">Ownership</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-4">
        {/* Left Column - Property Details */}
        <div className="flex-1 space-y-4">
          {/* Address & Location Card */}
          <div className="rounded bg-white border border-neutral-l3 w-full">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-base font-medium flex items-center gap-2">Address & Location</p>
              </div>
              <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                <PropertyRow label="Street Address:" value={property.address || '468 CHAMBERLIN DR'} colSpan={2} />
                <PropertyRow label="Unit/Apt:" value={property.unit || ''} />
                <PropertyRow label="City:" value={property.city || 'MANCHESTER'} />
                <PropertyRow label="State:" value={property.state || 'MO'} />
                <PropertyRow label="ZIP Code:" value={property.zip || '63021-5118'} />
                <PropertyRow label="County:" value={property.county || 'ST. LOUIS'} />
                <PropertyRow label="APN:" value={property.apn || '23R-33-1070'} />
                <PropertyRow label="FIPS Code:" value={property.fipsCode || '29189'} />
                <PropertyRow label="Legal Description:" value={property.legalDescription || 'CHAPPARAL PARK PLAT 1 LOT 2'} colSpan={2} />
                <PropertyRow label="Owners:" value={property.owners || 'THOMPSON DERRICK / THOMPSON LORI T'} colSpan={2} />
                <PropertyRow label="Ownership Rights:" value={property.ownershipRights || ''} />
              </div>
            </div>
          </div>

          {/* Valuation & Financial Data Card */}
          <div className="rounded bg-white border border-neutral-l3 w-full">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-base font-medium flex items-center gap-2">Valuation & Financial Data</p>
              </div>
              <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                <ValuationRow label="Purchase Price:" value={`$${(property.purchasePrice || 262802).toLocaleString()}`} subValue={property.purchaseDate || 'Aug 30, 2022'} />
                <ValuationRow label="AVM Value:" value={`$${(property.avmValue || 312000).toLocaleString()}`} subValue={property.avmDate || 'Jan 13, 2026'} valueColor="text-[#3e8051]" />
                <ValuationRow label="Confidence:" value={`${property.confidence || 59}%`} subValue="Low" valueColor="text-[#3e8051]" />
                <ValuationRow label="Std Deviation:" value={`${property.stdDeviation || 4}%`} valueColor="text-[#3e8051]" />
                <PropertyRow label="AVM Low:" value={`$${(property.avmLow || 295000).toLocaleString()}`} />
                <PropertyRow label="AVM High:" value={`$${(property.avmHigh || 331000).toLocaleString()}`} />
                <PropertyRow label="Market Value:" value={`$${(property.marketValue || 306200).toLocaleString()}`} />
                <PropertyRow label="Tax Year:" value={property.taxYear || '2024'} />
                <PropertyRow label="Land Value:" value={`$${(property.landValue || 31390).toLocaleString()}`} />
                <PropertyRow label="Improvement Value:" value={`$${(property.improvementValue || 26790).toLocaleString()}`} />
                <PropertyRow label="Total Assessed:" value={`$${(property.totalAssessed || 58180).toLocaleString()}`} />
                <PropertyRow label="Annual Tax:" value={`$${(property.annualTax || 3337.97).toLocaleString()}`} />
              </div>
            </div>
          </div>

          {/* Building & Lot Details Card */}
          <div className="rounded bg-white border border-neutral-l3 w-full">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-base font-medium flex items-center gap-2">Building & Lot Details</p>
              </div>
              <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                <PropertyRow label="Year Built:" value={property.yearBuilt || '1973'} />
                <PropertyRow label="Effective Year:" value={property.effectiveYear || '1973'} />
                <PropertyRow label="Living Area:" value={`${(property.livingArea || 1455).toLocaleString()} sq ft`} />
                <PropertyRow label="Total Building:" value={`${(property.totalBuilding || 1895).toLocaleString()} sq ft`} />
                <PropertyRow label="Ground Floor:" value={`${(property.groundFloor || 1455).toLocaleString()} sq ft`} />
                <PropertyRow label="Garage:" value={`${property.garage || 440} sq ft`} />
                <PropertyRow label="Bedrooms:" value={property.bedrooms || '3'} />
                <PropertyRow label="Bathrooms:" value={`${property.bathrooms || '2'} (2F)`} />
                <PropertyRow label="Total Rooms:" value={property.totalRooms || '6'} />
                <PropertyRow label="Stories:" value={`${property.stories || '1'} Story`} />
                <PropertyRow label="Construction:" value={property.construction || 'Frame'} />
                <PropertyRow label="Exterior:" value={property.exterior || 'Siding (Alum/Vinyl)'} />
                <PropertyRow label="Lot Size:" value="0.348 acres" />
                <PropertyRow label="Lot Sq Ft:" value="15,150 sq ft" />
                <PropertyRow label="Heating:" value="Electric" />
                <PropertyRow label="Cooling:" value="Central" />
                <PropertyRow label="Fireplace:" value="1" />
                <PropertyRow label="Garage Type:" value="Attached Garage" />
                <PropertyRow label="Subdivision:" value="CHAPPARAL PARK PLAT 1" />
                <PropertyRow label="School District:" value="Parkway C-2 School District" />
                <PropertyRow label="Zoning:" value="94R-1" />
                <PropertyRow label="Census Tract:" value="217931" />
                <PropertyRow label="Property Type:" value="Single Family Residential" colSpan={2} />
                <PropertyRow label="HOA:" value="None" colSpan={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="w-[400px] space-y-4">
          <div className="rounded bg-white border border-neutral-l3 w-full">
            <div className="p-4">
              <p className="text-xs font-medium mb-2">Interactive Property Map</p>
              <p className="text-xs font-normal text-neutral-l2 mb-3">
                Use controls to switch between satellite, map, and street view. Drag the yellow pegman for Street View.
              </p>
              <div className="rounded border border-neutral-l3 h-[400px] w-full relative overflow-hidden bg-gray-200">
                {/* Map placeholder - in production this would be Google Maps */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-neutral-l1">
                    <div className="mb-2">
                      <svg className="w-12 h-12 mx-auto text-neutral-l2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">{property.address || '468 CHAMBERLIN DR'}</p>
                    <p className="text-xs">{property.city || 'MANCHESTER'}, {property.state || 'MO'} {property.zip || '63021-5118'}</p>
                  </div>
                </div>
                {/* Map Controls */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button className="px-3 py-1 bg-white text-sm font-medium rounded shadow">Satellite</button>
                  <button className="px-3 py-1 bg-white text-sm text-neutral-l1 rounded shadow">Map</button>
                </div>
                <div className="absolute top-2 right-32 flex flex-col gap-1">
                  <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-20 right-2 flex flex-col gap-1">
                  <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-lg font-bold">+</button>
                  <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-lg font-bold">−</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ label, value, colSpan = 1 }) {
  return (
    <div className={`flex justify-between items-center border-b border-neutral-l3 pb-2 ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <span className="text-sm font-normal text-neutral-l1">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function ValuationRow({ label, value, subValue, valueColor = 'text-neutral' }) {
  return (
    <div className="flex justify-between items-center border-b border-neutral-l3 pb-2">
      <span className="text-sm font-normal text-neutral-l1">{label}</span>
      <div className="text-right flex flex-col items-end">
        <span className={`text-sm font-bold ${valueColor}`}>{value}</span>
        {subValue && <span className={`text-xs ${valueColor} mt-1`}>{subValue}</span>}
      </div>
    </div>
  );
}
