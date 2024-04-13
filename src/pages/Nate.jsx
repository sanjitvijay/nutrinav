// src/pages/Nate.js
import React, { useState } from 'react';
import '../App.css'; // Adjust the path as necessary

function Nate() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  const openFoodFactsUrl = 'https://world.openfoodfacts.org';

  const fetchData = () => {
    let url;
    if (/^\d+$/.test(query) && query.length >= 8 && query.length <= 13) {
      url = `${openFoodFactsUrl}/api/v2/product/${query}.json`;
    } else {
      url = `${openFoodFactsUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          setSelectedFood(data.product);
          setResults([]);
        } else if (data.products && data.products.length > 0) {
          setResults(data.products);
          setSelectedFood(data.products[0]);
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

  const handleButtonClick = (food) => {
    setSelectedFood(food);
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
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food or enter barcode"
        />
        <button onClick={fetchData}>Search</button>

        {results.map((item, index) => (
          <div key={index}>
            <button onClick={() => handleButtonClick(item)}>
              {item.product_name || item.product_name_fr || 'Unknown'}
            </button>
          </div>
        ))}

        {selectedFood && (
          <div>
            <h2>Product Information:</h2>
            <p><strong>Name:</strong> {selectedFood.product_name || 'N/A'}</p>
            <p><strong>Brands:</strong> {selectedFood.brands || 'N/A'}</p>
            <p><strong>Quantity:</strong> {selectedFood.quantity || 'N/A'}</p>
            <p><strong>Ingredients:</strong> {selectedFood.ingredients_text || 'N/A'}</p>
            {selectedFood.image_url && (
              <img src={selectedFood.image_url} alt={`Product named: ${selectedFood.product_name}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            )}
            {selectedFood.nutriments && (
              <div>
                <h3>Nutritional Information:</h3>
                {Object.entries(selectedFood.nutriments).map(([key, value]) => (
                  <p key={key}>{key}: {renderPropertyValue(value)}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default Nate;
