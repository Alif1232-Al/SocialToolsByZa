"use client";
import { useState } from "react";
import { Scissors, User, Baby, Palette, RefreshCw, Utensils } from "lucide-react";
import ComicPanel from "./ComicPanel";

const PRICES = { dewasa: 25, anak: 20, semir: 40 };
const OWNER_SHARE = 0.6;
const EMPLOYEE_SHARE = 0.4;

export default function BarberCalculator() {
  const [dewasa, setDewasa] = useState(0);
  const [anak, setAnak] = useState(0);
  const [semir, setSemir] = useState(0);
  const [uangMakan, setUangMakan] = useState(25);

  const totalDewasa = dewasa * PRICES.dewasa;
  const totalAnak = anak * PRICES.anak;
  const totalSemir = semir * PRICES.semir;
  const grandTotal = totalDewasa + totalAnak + totalSemir;
  const owner = grandTotal * OWNER_SHARE;
  const employeeGross = grandTotal * EMPLOYEE_SHARE;
  const employeeGet = employeeGross + uangMakan;
  const ownerGet = owner - uangMakan;
  const totalCustomers = dewasa + anak + semir;
  const hasResult = totalCustomers > 0;

  return (
    <ComicPanel bgColor="bg-cyan-400" badge="HITUNG!" badgeColor="bg-pink-500 text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Scissors className="w-6 h-6" />Barber Daily Kalkulator
      </h3>
      <p className="font-body text-body-md text-gray-800 mb-4">
        Hitung pendapatan harian barber. Sistem 60:40 (Owner:Karyawan).
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <User className="w-5 h-5 shrink-0 text-pink-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Dewasa (25k)</span>
          <input type="number" min={0} value={dewasa || ""}
            onChange={(e) => setDewasa(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalDewasa}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Baby className="w-5 h-5 shrink-0 text-yellow-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Anak (20k)</span>
          <input type="number" min={0} value={anak || ""}
            onChange={(e) => setAnak(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalAnak}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Palette className="w-5 h-5 shrink-0 text-purple-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Semir (40k)</span>
          <input type="number" min={0} value={semir || ""}
            onChange={(e) => setSemir(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
          <span className="font-body text-xs text-gray-500 ml-auto">={totalSemir}k</span>
        </div>

        <div className="flex items-center gap-3 border-4 border-black bg-white p-3">
          <Utensils className="w-5 h-5 shrink-0 text-orange-600" />
          <span className="font-body font-bold text-sm min-w-[80px]">Uang Makan</span>
          <div className="flex items-center gap-1">
            <span className="font-body text-xs font-bold">Rp</span>
            <input type="number" min={0} value={uangMakan || ""}
              onChange={(e) => setUangMakan(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 p-2 border-2 border-black text-center font-body font-bold text-sm outline-none" />
            <span className="font-body text-xs font-bold">k</span>
          </div>
        </div>

        <button onClick={() => { setDewasa(0); setAnak(0); setSemir(0); setUangMakan(25); }}
          className="comic-btn bg-yellow-400 text-black w-full text-sm flex items-center justify-center gap-1 py-2">
          <RefreshCw className="w-4 h-4" /> RESET
        </button>

        {hasResult && (
          <div className="border-4 border-black bg-white p-4 space-y-3">
            <div className="text-center pb-2 border-b-2 border-dashed border-gray-300">
              <p className="font-display text-lg uppercase italic">TOTAL PENDAPATAN</p>
              <p className="font-display text-3xl font-black">{grandTotal}k</p>
              <p className="font-body text-xs text-gray-500">{totalCustomers} pelanggan</p>
            </div>

            <div className="text-center">
              <p className="font-body text-xs text-gray-500 uppercase tracking-wider">Bagi Hasil 60:40</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 text-center bg-black text-white p-3">
                <p className="font-body text-[9px] uppercase tracking-widest opacity-70">Owner (60%)</p>
                <p className="font-display text-xl font-black">{owner}k</p>
              </div>
              <div className="flex-1 text-center bg-gray-800 text-white p-3">
                <p className="font-body text-[9px] uppercase tracking-widest opacity-70">Karyawan (40%)</p>
                <p className="font-display text-xl font-black">{employeeGross}k</p>
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 p-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-orange-700 text-center">+ Uang Makan {uangMakan}k (Karyawan)</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm border-b border-orange-200 pb-1">
                  <span className="font-body font-bold">Owner (60% - {uangMakan}k)</span>
                  <span className="font-display font-black">{ownerGet}k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body font-bold">Karyawan (40% + {uangMakan}k)</span>
                  <span className="font-display font-black">{employeeGet}k</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ComicPanel>
  );
}
