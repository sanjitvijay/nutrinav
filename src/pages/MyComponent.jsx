import React from 'react';

const MyComponent = () => {
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-pink-500 text-2xl mb-4">Header 1</h2>
      <h3 className="text-purple-500 text-xl mb-4">Header 2</h3>
      <input
        type="text"
        className="border border-gray-400 p-2 mb-4 w-full"
        placeholder="Text field"
      />
      <input
        type="text"
        className="border border-purple-500 p-2 mb-4 w-full"
        placeholder="Text field"
      />
      <input
        type="text"
        className="border border-purple-500 p-2 mb-4 w-full"
        placeholder="Text field"
        value="email@domain.com"
        readOnly
      />
      <input
        type="text"
        className="border border-pink-500 p-2 mb-4 w-full"
        placeholder="Text field"
        value="email@"
        readOnly
      />
      <button className="bg-purple-500 text-white p-2 rounded mb-4 w-full">
        Button
      </button>
      <div className="flex flex-wrap">
        <div className="w-1/2 mb-4 mr-2">
          <h4 className="text-gray-600 mb-2">Label</h4>
          <input
            type="text"
            className="border border-gray-400 p-2 w-full"
            placeholder="Text field"
          />
        </div>
        <div className="w-1/2 mb-4 ml-2">
          <h4 className="text-gray-600 mb-2">Label</h4>
          <input
            type="text"
            className="borderborder-gray-400 p-2 w-full"
            placeholder="Text field"
          />
        </div>
      </div>
      <div className="w-full mb-4">
        <h4 className="text-gray-600 mb-2">Label</h4>
        <button className="bg-purple-500 text-white p-2 rounded w-full">
          Button
        </button>
      </div>
    </div>
  );
};

export default MyComponent;