import React, { useState, useEffect } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';

const ScannerPage = () => {
    const [screen, setScreen] = useState('choice');
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [visibleResults, setVisibleResults] = useState(5);
    const openFoodFactsUrl = 'https://world.openfoodfacts.org';
  
    useEffect(() => {
      if (screen === 'scanner') {
        const codeReader = new BrowserBarcodeReader();
        codeReader.decodeFromInputVideoDevice(undefined, 'video')
          .then(result => {
            setInput(result.text);
            fetchData(result.text);
          })
          .catch(err => console.error("Error scanning barcode: ", err));
  
        return () => {
          codeReader.reset();
        };
      }
    }, [screen]);
  
    const fetchData = (query) => {
      let url = /^\d+$/.test(query) ? `${openFoodFactsUrl}/api/v2/product/${query}.json` :
        `${openFoodFactsUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.status === 1) {
            setSelectedFood(data.product);
            setResults([]);
    
            // Log all keys of the nutriments object
            if (data.product && data.product.nutriments) {
              console.log("Nutriment keys:", Object.keys(data.product.nutriments));
            }
          } else if (data.products && data.products.length > 0) {
            setResults(data.products);
            setSelectedFood(null);
          } else {
            setSelectedFood(null);
            setResults([]);
            alert('Product not found');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };
    
  
    const handleScreenChoice = (choice) => {
      if (choice === 'choice') {
        setInput('');
        setResults([]);
        setSelectedFood(null);
      }
      setScreen(choice);
    };
  
    const handleSubmit = () => {
      if (input) fetchData(input);
    };
  
    const navigate = useNavigate();

    const handleSeeMore = () => {
      setVisibleResults(prev => Math.min(prev + 10, results.length));
    };
  
    const handleButtonClick = (item) => {
      setSelectedFood(item);
      setResults([]);
    };
  
    const renderPropertyValue = (value) => {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
      }
      return value.toString();
    };
  
    return (
      <div className="App">
        <header className="App-header">
          {screen === 'choice' && (
            <div>
              <button className="btn btn-primary text-white" onClick={() => handleScreenChoice('scanner')}>Scan Barcode</button>
              <button className="btn btn-primary text-white" onClick={() => handleScreenChoice('manual')}>Enter Food Name</button>
              <button onClick={() => navigate(-1)} className="btn btn-secondary text-white"> Back </button>
            </div>
          )}
          {(screen === 'scanner' || screen === 'manual') && (
            <div>
              {screen === 'scanner' && (
                <>
                  <video id="video" style={{ width: '100%' }} autoPlay muted></video>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter barcode manually"
                  />
                  <button className="btn btn-primary text-white"
                  onClick={handleSubmit}>Submit</button>
                </>
              )}
              {screen === 'manual' && (
                <>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search for food by name"
                  />
                  <button className="btn btn-primary text-white"
                  onClick={handleSubmit}>Search</button>
                </>
              )}
              <button className="btn btn-secondary text-white"
              onClick={() => handleScreenChoice('choice')}>Back</button>
            </div>
          )}
  
          {results.slice(0, visibleResults).map((item, index) => (
            <button key={index} className="btn btn-primary text-white"
            onClick={() => handleButtonClick(item)} style={{ margin: "5px" }}>
              {item.product_name || item.product_name_fr || 'Unknown'}
            </button>
          ))}
  
          {results.length > visibleResults && (
            <button className="btn btn-secondary text-white"
            onClick={handleSeeMore}>See More</button>
          )}
  
          {selectedFood && (
            <div>
              <h2>Product Information:</h2>
              <p><strong>Name:</strong> {selectedFood.product_name || 'N/A'}</p>
              <p><strong>Brand:</strong> {selectedFood.brands || 'N/A'}</p>
              <p><strong>Quantity:</strong> {selectedFood.quantity || 'N/A'}</p>
              <p><strong>Ingredients:</strong> {selectedFood.ingredients_text || 'N/A'}</p>
              <p><strong>Sugar:</strong> {selectedFood.sugars_serving || 'N/A'}</p>
  
              <img src={selectedFood.image_url} alt={`Product named: ${selectedFood.product_name}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              {Object.entries(selectedFood.nutriments)
              .filter(([key, _]) => key.endsWith('serving'))
              .map(([key, value]) => (
                <p key={key}>
                  {key}: {renderPropertyValue(value)}
                </p>
              ))}

            </div>
          )}
        </header>
      </div>
    );
  }

export default ScannerPage;