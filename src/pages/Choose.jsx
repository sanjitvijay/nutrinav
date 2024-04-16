import React from 'react';
import { useNavigate } from "react-router-dom";


function Choose() {
    const navigate = useNavigate()

  return (
    <div>
        <div>
            <button
                className="btn btn-primary text-white"
                onClick={() => navigate('/manual-entry')}
            >
                Manual Entry
            </button>
        </div>
        <div>
            <button 
                className="btn btn-primary mt-5 text-white"
                onClick={() => navigate('/scanner')}
            >
                Search/Barcode Scanner
            </button>
        </div>
        <div>              
            <button onClick={() => navigate(-1)} className="btn btn-secondary mt-5 text-white"> Back </button>
        </div>
    </div>
  );
}

export default Choose;