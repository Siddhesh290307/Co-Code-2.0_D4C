import { useState } from 'react';

// This 'export default' fixes the error you are seeing
export default function Roipredictionpage() {
  
  // 1. State for form inputs
  const [formData, setFormData] = useState({
    area: '',
    beds: '',
    bathrooms: '',
    balconies: '',
    area_rate: '',
    locality_enc: '',
    purchase_price: '',
    total_expenses: '',
    total_investment: '',
    years: '',
    furnishing: 'Furnished', // Default match for dropdown
    city: 'Mumbai'           // Default match for dropdown
  });

  // 2. State for the prediction result
  const [result, setResult] = useState(null);

  // 3. Handle text/number changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Submit & Talk to Python Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload (One-Hot Encoding logic)
    const payload = {
      // Convert numbers
      area: Number(formData.area),
      beds: Number(formData.beds),
      bathrooms: Number(formData.bathrooms),
      balconies: Number(formData.balconies),
      area_rate: Number(formData.area_rate),
      locality_enc: Number(formData.locality_enc),
      purchase_price: Number(formData.purchase_price),
      total_expenses: Number(formData.total_expenses),
      total_investment: Number(formData.total_investment),
      years: Number(formData.years),

      // Convert Furnishing to 0/1 flags
      "furnishing_Furnished": formData.furnishing === "Furnished" ? 1.0 : 0.0,
      "furnishing_Semi-Furnished": formData.furnishing === "SemiFurnished" ? 1.0 : 0.0,
      "furnishing_Unfurnished": formData.furnishing === "Unfurnished" ? 1.0 : 0.0,

      // Convert City to 0/1 flags
      "city_Bangalore": formData.city === "Bangalore" ? 1.0 : 0.0,
      "city_Mumbai": formData.city === "Mumbai" ? 1.0 : 0.0,
      "city_Nagpur": formData.city === "Nagpur" ? 1.0 : 0.0,
      "city_New Delhi": formData.city === "New Delhi" ? 1.0 : 0.0,
      "city_Pune": formData.city === "Pune" ? 1.0 : 0.0,
    };

    try {
      // Send data to FastAPI
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch prediction');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to backend. Is FastAPI running?");
    }
  };

  // 5. Render the Form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">ROI Predictor</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Area */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Area (sq ft)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. 1200" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Beds */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Bedrooms</label>
              <input type="number" name="beds" value={formData.beds} onChange={handleChange} placeholder="e.g. 2" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="e.g. 2" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Balconies */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Balconies</label>
              <input type="number" name="balconies" value={formData.balconies} onChange={handleChange} placeholder="e.g. 1" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Area Rate */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Area Rate (₹/sq ft)</label>
              <input type="number" name="area_rate" value={formData.area_rate} onChange={handleChange} placeholder="e.g. 15000" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Locality Enc */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Locality Enc</label>
              <input type="number" name="locality_enc" value={formData.locality_enc} onChange={handleChange} placeholder="Enter Code" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Purchase Price (₹)</label>
              <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleChange} placeholder="Total Price" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Total Expenses */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Total Expenses (₹)</label>
              <input type="number" name="total_expenses" value={formData.total_expenses} onChange={handleChange} placeholder="Renovation/Fees" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Total Investment */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Total Investment (₹)</label>
              <input type="number" name="total_investment" value={formData.total_investment} onChange={handleChange} placeholder="Downpayment + Costs" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Years */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Years Holding</label>
              <input type="number" name="years" value={formData.years} onChange={handleChange} placeholder="e.g. 5" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Furnished">Furnished</option>
                <option value="SemiFurnished">SemiFurnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">City</label>
              <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Nagpur">Nagpur</option>
                <option value="New Delhi">New Delhi</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md">
            Calculate Prediction
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Prediction Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Predicted Monthly Rent</p>
                <p className="text-xl font-bold text-slate-800">₹ {result.predicted_monthly_rent}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Total Rental Income</p>
                <p className="text-xl font-bold text-slate-800">₹ {result.total_rental_income}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-500">Future Property Value</p>
                <p className="text-xl font-bold text-slate-800">₹ {result.future_property_value}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-green-400">
                <p className="text-sm text-gray-500">Return on Investment (ROI)</p>
                <p className="text-2xl font-bold text-green-600">{result.roi_percent}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}