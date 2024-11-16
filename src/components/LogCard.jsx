// LogCard.jsx
import { useState } from "react";
import { CiTrash, CiEdit } from "react-icons/ci";
import { useUserInfo } from "../context/UserInfoProvider";

function LogCard({ log, onDelete, onUpdate }) {
  const { name, nutrition_facts, servings } = log;
  const { calories, total_fat, total_carbohydrate, protein } = nutrition_facts;

  const { userInfo } = useUserInfo();
  const { dailyFat, dailyCarbs, dailyProtein, dailyCalories } = userInfo;

  // Define maximum servings
  const MAX_SERVINGS = 10; // Set your desired maximum limit here

  // State for modal visibility and updated servings
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedServings, setUpdatedServings] = useState(servings);

  // Open and close the modal
  const openModal = () => {
    setUpdatedServings(servings); // Reset updatedServings when opening modal
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Handle servings update
  const handleUpdate = () => {
    const newServings = Number(updatedServings);

    if (isNaN(newServings) || newServings <= 0 || newServings > MAX_SERVINGS) {
      alert(`Please enter a valid number of servings (1 to ${MAX_SERVINGS}).`);
      return;
    }

    // Calculate per-serving nutrition facts
    const perServingNutritionFacts = {};
    for (let key in nutrition_facts) {
      perServingNutritionFacts[key] = Number(nutrition_facts[key]) / servings;
    }

    // Calculate new total nutrition facts based on new servings
    const updatedNutritionFacts = {};
    for (let key in perServingNutritionFacts) {
      updatedNutritionFacts[key] = perServingNutritionFacts[key] * newServings;
    }

    const updatedLog = {
      ...log,
      servings: newServings,
      nutrition_facts: updatedNutritionFacts,
    };

    // Call the onUpdate prop to inform parent component of changes
    if (onUpdate) {
      onUpdate(updatedLog);
    }

    closeModal();
  };

  return (
    <div className="flex justify-between bg-white hover:shadow-md rounded-lg p-2 items-center border-2 cursor-pointer">
      <div className="w-full">
        <div className="flex justify-between">
          <div>
            <h2 className="font-bold text-primary">{name}</h2>
            <p className="mb-2">Servings: {servings}</p>
          </div>
          <div className="mb-2 flex justify">
            <button className="mr-2" onClick={openModal}>
              <CiEdit size={25} />
            </button>

            <button className="mr-2" onClick={() => onDelete(log)}>
              <CiTrash size={25} color="red" />
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <div
              className="radial-progress text-primary text-center"
              style={{
                "--value": (Number(calories) / dailyCalories) * 100,
                "--size": "3rem",
                "--thickness": "4px",
                boxShadow: "inset 0 0 0 4px #e5e7eb",
              }}
              role="progressbar"
            >
              <div>
                <span className="text-lg text-secondary font-bold">
                  {Number(calories).toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-center text-base-400 text-xs">Calories</p>
          </div>
          {/* Carbs */}
          <div>
            <div
              className="radial-progress text-primary text-center"
              style={{
                "--value": (Number(total_carbohydrate) / dailyCarbs) * 100,
                "--size": "3rem",
                "--thickness": "4px",
                boxShadow: "inset 0 0 0 4px #e5e7eb",
              }}
              role="progressbar"
            >
              <div>
                <span className="text-lg text-secondary font-bold">
                  {Number(total_carbohydrate).toFixed(0)}g
                </span>
              </div>
            </div>
            <p className="text-center text-base-400 text-xs">Carbs</p>
          </div>
          {/* Fats */}
          <div>
            <div
              className="radial-progress text-primary text-center"
              style={{
                "--value": (Number(total_fat) / dailyFat) * 100,
                "--size": "3rem",
                "--thickness": "4px",
                boxShadow: "inset 0 0 0 4px #e5e7eb",
              }}
              role="progressbar"
            >
              <div>
                <span className="text-lg text-secondary font-bold">
                  {Number(total_fat).toFixed(0)}g
                </span>
              </div>
            </div>
            <p className="text-center text-base-400 text-xs">Fats</p>
          </div>
          {/* Protein */}
          <div>
            <div
              className="radial-progress text-primary text-center"
              style={{
                "--value": (Number(protein) / dailyProtein) * 100,
                "--size": "3rem",
                "--thickness": "4px",
                boxShadow: "inset 0 0 0 4px #e5e7eb",
              }}
              role="progressbar"
            >
              <div>
                <span className="text-lg text-secondary font-bold">
                  {Number(protein).toFixed(0)}g
                </span>
              </div>
            </div>
            <p className="text-center text-base-400 text-xs">Protein</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog id="edit_servings_modal" className="modal" open>
          <div className="modal-box w-80">
            <h3 className="font-bold text-xl mb-4">Edit Servings</h3>
            <input
              type="number"
              min="1"
              max={MAX_SERVINGS}
              value={updatedServings}
              onChange={(e) => setUpdatedServings(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="btn btn-primary text-white px-4 py-2 rounded-md mr-2"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="btn btn-secondary text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>Close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

export default LogCard;
