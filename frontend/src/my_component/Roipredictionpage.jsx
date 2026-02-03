
import React, { useState } from "react";

// Pure SVG Icons for a sexy look without external dependencies
const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const IconTrending = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

const IconCalculator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

function Roipredictionpage({ user, onLogout }) {

  const [formData, setFormData] = useState({
    area: "",
    beds: "",
    bathrooms: "",
    balconies: "",
    area_rate: "",
    locality_enc: "",
    furnishing: "SemiFurnished",
    city: "Mumbai",
    purchase_price: "",
    total_expenses: "",
    total_investment: "",
    years: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert furnishing → one hot
  const furnishingEncoding = () => ({
    furnishing_Furnished: formData.furnishing === "Furnished" ? 1 : 0,
    furnishing_SemiFurnished: formData.furnishing === "SemiFurnished" ? 1 : 0,
    furnishing_Unfurnished: formData.furnishing === "Unfurnished" ? 1 : 0
  });

  // Convert city → one hot
  const cityEncoding = () => ({
    city_Bangalore: formData.city === "Bangalore" ? 1 : 0,
    city_Mumbai: formData.city === "Mumbai" ? 1 : 0,
    city_Nagpur: formData.city === "Nagpur" ? 1 : 0,
    city_NewDelhi: formData.city === "NewDelhi" ? 1 : 0,
    city_Pune: formData.city === "Pune" ? 1 : 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        area: parseFloat(formData.area),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        balconies: parseInt(formData.balconies),
        area_rate: parseFloat(formData.area_rate),
        locality_enc: parseFloat(formData.locality_enc),

        ...furnishingEncoding(),
        ...cityEncoding(),

        purchase_price: parseFloat(formData.purchase_price),
        total_expenses: parseFloat(formData.total_expenses),
        total_investment: parseFloat(formData.total_investment),
        years: parseFloat(formData.years)
      };

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError("Backend connection failed. Ensure FastAPI is running on http://127.0.0.1:8000");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setFormData({
      area: "",
      beds: "",
      bathrooms: "",
      balconies: "",
      area_rate: "",
      locality_enc: "",
      furnishing: "SemiFurnished",
      city: "Mumbai",
      purchase_price: "",
      total_expenses: "",
      total_investment: "",
      years: ""
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-12">
      {/* SEXY HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 text-white">
              <IconBuilding />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">
                Prop<span className="text-blue-600">ROI</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Intelligence Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900">{user.name}</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Premium Member</span>
            </div>
            <button 
              onClick={onLogout}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <IconLogout />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 grid lg:grid-cols-12 gap-10 items-start">
        
        {/* FORM SIDE (LHS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="bg-slate-50/50 border-b border-slate-100 p-6 px-8 flex justify-between items-center">
              <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">Property Portfolio</h2>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <IconCalculator />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Area (SqFt)</label>
                  <input name="area" placeholder="e.g. 1200" value={formData.area} onChange={handleChange} className="sexy-input" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Beds</label>
                  <input name="beds" placeholder="e.g. 3" value={formData.beds} onChange={handleChange} className="sexy-input" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Bathrooms</label>
                  <input name="bathrooms" placeholder="e.g. 2" value={formData.bathrooms} onChange={handleChange} className="sexy-input" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Balconies</label>
                  <input name="balconies" placeholder="e.g. 1" value={formData.balconies} onChange={handleChange} className="sexy-input" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Area Rate (₹)</label>
                  <input name="area_rate" placeholder="Rate / SqFt" value={formData.area_rate} onChange={handleChange} className="sexy-input font-bold" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Locality Score</label>
                  <input name="locality_enc" placeholder="1.0 - 10.0" value={formData.locality_enc} onChange={handleChange} className="sexy-input" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Furnishing</label>
                  <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="sexy-input cursor-pointer">
                    <option value="Furnished">Furnished</option>
                    <option value="SemiFurnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">City Node</label>
                  <select name="city" value={formData.city} onChange={handleChange} className="sexy-input cursor-pointer">
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="NewDelhi">New Delhi</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Purchase Price</label>
                  <input name="purchase_price" placeholder="Total Cost" value={formData.purchase_price} onChange={handleChange} className="sexy-input font-black text-blue-600" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Expenses</label>
                  <input name="total_expenses" placeholder="Maint / Tax" value={formData.total_expenses} onChange={handleChange} className="sexy-input" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Capital Investment</label>
                  <input name="total_investment" placeholder="Outflow" value={formData.total_investment} onChange={handleChange} className="sexy-input" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Horizon (Years)</label>
                  <input name="years" placeholder="Holding Period" value={formData.years} onChange={handleChange} className="sexy-input" required />
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <IconCalculator />
                      Generate ROI Forecast
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleReset} 
                  className="w-full py-3 border-2 border-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <IconRefresh />
                  Clear Workspace
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RESULTS SIDE (RHS) */}
        <div className="lg:col-span-7 space-y-8">
          
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4 text-rose-600 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
              <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="font-black text-xs uppercase tracking-widest">Network Error</p>
                <p className="text-sm mt-1 font-medium opacity-80">{error}</p>
              </div>
            </div>
          )}

          {!result && !loading ? (
            <div className="h-full min-h-[550px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
                <IconTrending />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight relative z-10">Intelligence Terminal</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium text-sm leading-relaxed relative z-10">
                Complete the property profile to activate our high-precision forecasting engine.
              </p>
              <div className="mt-10 flex gap-2 relative z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both">
              
              {/* ROI HERO CARD */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-[2.5rem] p-12 shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <IconTrending />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80">Analysis Finalized</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-2">
                      <h3 className="text-blue-200/60 text-[10px] font-black uppercase tracking-[0.2em]">Total ROI Projection</h3>
                      <div className="text-8xl font-black tracking-tighter flex items-start">
                        {result.roi_percent.toFixed(2)}
                        <span className="text-2xl mt-4 ml-1 opacity-40">%</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex-1 md:max-w-[240px]">
                      <div className="flex items-center justify-between text-blue-200/40 text-[9px] font-black uppercase tracking-widest mb-3">
                        <span>Classification</span>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="text-xl font-black tracking-tight uppercase italic">
                        {result.roi_percent > 15 ? "High Yield" : result.roi_percent > 8 ? "Market Plus" : "Stable Yield"}
                      </p>
                      <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min(result.roi_percent * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DATA TILES */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase">Income</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Predicted Monthly Rent</p>
                  <div className="flex items-baseline gap-1.5 text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    <span className="text-2xl font-bold opacity-30 tracking-tighter">₹</span>
                    {result.predicted_monthly_rent.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg uppercase">Asset</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Future Property Value</p>
                  <div className="flex items-baseline gap-1.5 text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    <span className="text-2xl font-bold opacity-30 tracking-tighter">₹</span>
                    {result.assumed_future_property_value.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* FOOTNOTE */}
              <div className="p-8 bg-blue-600 rounded-[2rem] text-white/90 flex items-center justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white">System Insight</p>
                    <p className="text-sm font-medium opacity-70 italic mt-0.5">Predictions optimized for {formData.city} node datasets.</p>
                  </div>
                </div>
                <button className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all relative z-10">
                  Detailed PDF <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          ) : null}
          
          {loading && (
            <div className="h-full min-h-[550px] flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-slate-50 rounded-full border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconCalculator />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mt-10 tracking-tight uppercase">Processing Core</h3>
              <p className="text-slate-400 text-sm mt-3 font-medium animate-pulse">Running proprietary ML simulations...</p>
            </div>
          )}
        </div>

      </main>

      <style>{`
        .sexy-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .sexy-input:focus {
          background-color: white;
          border-color: #3b82f6;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }
        .sexy-input::placeholder {
          color: #cbd5e1;
          font-weight: 600;
        }
        select.sexy-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
          background-size: 1rem;
          background-position: right 1.25rem center;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
}

export default Roipredictionpage;
