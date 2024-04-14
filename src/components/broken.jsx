// Modal.js
import React from "react";

const Modal = ({ onClose, nutrition_facts, dailyCalories, dailyCarbs, dailyFat, dailyProtein }) => {
    const handleClick = () => {
      onClose(); // Close the modal
    };
  
    const { calories, total_fat, total_carbohydrate, protein, iron } = nutrition_facts;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between">
                    <div>
                        <div className="radial-progress text-primary text-center" style={{"--value":((calories)/dailyCalories) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{calories}</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Calories</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center" style={{"--value":((calories)/dailyCalories) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{iron}</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">iron</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_carbohydrate/dailyCarbs) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_carbohydrate}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Carbs</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{"--value": (total_fat/dailyFat) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_fat}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Fats</p>
                    </div>
                    <div className="mr-8">
                        <div className="radial-progress text-primary text-center " style={{"--value":(protein/dailyProtein) * 100, "--size" : "3rem", "--thickness" : "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb'}} 
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{protein}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Protein</p>
                    </div>
                </div> {/* Close modal when clicking on the content */}
      </div>
    </div>
  );
};

export default Modal;
