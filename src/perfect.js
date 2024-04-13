import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null); // Store the selected food object

  const appId = '6662affa';
  const appKey = '7703b56657e05f4b1ee6f8eeda154d9c';
  const openFoodFactsUrl = 'https://world.openfoodfacts.org';

  const fetchData = () => {
    let url;
    if (/^\d+$/.test(query) && query.length >= 8 && query.length <= 13) {
      // If the input is a barcode, fetch from Open Food Facts API
      url = `${openFoodFactsUrl}/api/v2/product/${query}.json`;
    } else {
      // If the input is a food name, fetch from Open Food Facts API
      url = `${openFoodFactsUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          // If the data is returned directly (barcode search), set selected food
          setSelectedFood(data.product);
          setResults([]); // Clear previous results
        } else if (data.products && data.products.length > 0) {
          // If the data is returned in a list (food name search), set results
          setResults(data.products);
          setSelectedFood(data.products[0]); // Set the first item as selected by default
        } else {
          // If no data found
          setSelectedFood(null);
          setResults([]);
          alert('Product not found');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Function to handle button click and set the selected food
  const handleButtonClick = (food) => {
    setSelectedFood(food);
  };

  // Render property value based on its type, including array and object handling
  const renderPropertyValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2); // Stringify object with formatting
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
              <div>
                <img src={selectedFood.image_url} alt={`Product named: ${selectedFood.product_name}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
            {selectedFood.nutriments && (
              <div>
                <h3>Nutritional Information:</h3>
                {Object.entries(selectedFood.nutriments).map(([key, value]) => (
                  <p key={key}>
                    {key}: {renderPropertyValue(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
