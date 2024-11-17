// AddFood.jsx
import supabaseClient from "../supabaseClient";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import MenuDisplay from "../components/MenuDisplay";
import ToggleIcon from "../components/ToggleIcon";
import { CiFilter } from "react-icons/ci";


function AddFood() {
    const supabase = supabaseClient();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [diningHall, setDiningHall] = useState('Bursley');

    const [breakfast, setBreakfast] = useState({});
    const [brunch, setBrunch] = useState({});
    const [lunch, setLunch] = useState({});
    const [dinner, setDinner] = useState({});

    const [showBreakfast, setShowBreakfast] = useState(false);
    const [showBrunch, setShowBrunch] = useState(false);
    const [showLunch, setShowLunch] = useState(false);
    const [showDinner, setShowDinner] = useState(false);

    const [loading, setLoading] = useState(false);
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        nutrient: '',
        order: 'asc', // 'asc' for smallest to largest, 'desc' for largest to smallest
    });


    
    const MealTimes = {
        BREAKFAST: 'is_breakfast',
        BRUNCH: 'is_brunch',
        LUNCH: 'is_lunch',
        DINNER: 'is_dinner'
    };

    useEffect(() => {
        fetchMenu(MealTimes.BREAKFAST);
        fetchMenu(MealTimes.BRUNCH);
        fetchMenu(MealTimes.LUNCH);
        fetchMenu(MealTimes.DINNER);
    }, [diningHall]);

    const fetchMenu = async (mealTime) => {
        setLoading(true);
        let mealCondition = '';
        switch(mealTime){
            case MealTimes.BREAKFAST: 
                mealCondition = MealTimes.BREAKFAST;
                break;
            case MealTimes.BRUNCH: 
                mealCondition = MealTimes.BRUNCH;
                break;
            case MealTimes.LUNCH: 
                mealCondition = MealTimes.LUNCH;
                break;
            default: 
                mealCondition = MealTimes.DINNER;
        }

        const { data, error } = await supabase
            .from(diningHall)
            .select('*')
            .eq(mealCondition, true);

        if (error) {
            console.log('Error:', error);
        } else {
            // Group data by subheader
            const groupedData = data.reduce((result, item) => {
                const subheader = item.subheader || 'Others';
                if (!result[subheader]) {
                    result[subheader] = [];
                }
                result[subheader].push(item);
                return result;
            }, {});

            // Update state with grouped data
            switch(mealTime){
                case MealTimes.BREAKFAST: 
                    setBreakfast(groupedData);
                    break;
                case MealTimes.BRUNCH: 
                    setBrunch(groupedData);
                    break;
                case MealTimes.LUNCH: 
                    setLunch(groupedData);
                    break;
                default: 
                    setDinner(groupedData);
            }
        }
        setLoading(false);
    };

    const onChange = (option) => {
        setDiningHall(option);
    };

    return (
        <div className="pb-5">
            <div className="flex justify-between items-center">
                <div>
                    <CustomDropdown 
                        options={['Bursley', 'East Quad', 'Markley', 'Mosher-Jordan', 'North Quad', 'South Quad', 'Twigs at Oxford']} 
                        onChange={onChange}
                    />
                </div> 
                <div>
                    <button 
                        className="btn btn-primary text-white"
                        onClick={() => navigate('/choose')}
                    >
                        Add More
                    </button>
                </div>
            </div>
            
            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    placeholder="Search for food items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button
                    className="ml-2 btn btn-secondary"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <CiFilter size={24} />
                </button>
            </div>

            {isFilterOpen && (
        <dialog id="filter_modal" className="modal" open>
            <div className="modal-box">
                <h3 className="font-bold text-xl mb-4">Filter Options</h3>
                <div className="mb-4">
                    <label className="block mb-2">Select Nutrient:</label>
                    <select
                        value={filterCriteria.nutrient}
                        onChange={(e) =>
                            setFilterCriteria({ ...filterCriteria, nutrient: e.target.value })
                        }
                        className="select select-bordered w-full"
                    >
                        <option value="">None</option>
                        <option value="calories">Calories</option>
                        <option value="protein">Protein</option>
                        <option value="total_fat">Fat</option>
                        <option value="total_carbohydrate">Carbs</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Select Order:</label>
                    <select
                        value={filterCriteria.order}
                        onChange={(e) =>
                            setFilterCriteria({ ...filterCriteria, order: e.target.value })
                        }
                        className="select select-bordered w-full"
                    >
                        <option value="asc">Smallest to Largest</option>
                        <option value="desc">Largest to Smallest</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="btn btn-secondary mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setIsFilterOpen(false);
                            // Trigger a re-render by updating filterCriteria state
                            setFilterCriteria({ ...filterCriteria });
                        }}
                        className="btn btn-primary"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </dialog>
    )}
            {loading ? 
                <div className="flex justify-center mt-3">
                    <span className="loading loading-spinner loading-lg text-secondary"></span>
                </div> 
                : 
                <>
                    {breakfast && Object.keys(breakfast).length > 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowBreakfast(!showBreakfast)}>
                                <h1 className="text-primary font-bold text-3xl">Breakfast</h1>
                                <ToggleIcon toggle={showBreakfast}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showBreakfast && <MenuDisplay menu={breakfast} time={'breakfast'} searchQuery={searchQuery} filterCriteria={filterCriteria}/>}
                        </div>
                    }

                    {brunch && Object.keys(brunch).length > 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowBrunch(!showBrunch)}>
                                <h1 className="text-primary font-bold text-3xl">Brunch</h1>
                                <ToggleIcon toggle={showBrunch}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showBrunch && <MenuDisplay menu={brunch} time={'brunch'} searchQuery={searchQuery} filterCriteria={filterCriteria}/>}
                        </div>
                    }

                    {lunch && Object.keys(lunch).length > 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowLunch(!showLunch)}>
                                <h1 className="text-primary font-bold text-3xl">Lunch</h1>
                                <ToggleIcon toggle={showLunch}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showLunch && <MenuDisplay menu={lunch} time={'lunch'} searchQuery={searchQuery} filterCriteria={filterCriteria}/>}
                        </div>
                    }

                    {dinner && Object.keys(dinner).length > 0 && 
                        <div>
                            <button className="flex items-center mt-5" onClick={() => setShowDinner(!showDinner)}>
                                <h1 className="text-primary font-bold text-3xl">Dinner</h1>   
                                <ToggleIcon toggle={showDinner}/>
                            </button>
                            <div className="divider -mt-1"></div> 
                            {showDinner && <MenuDisplay menu={dinner} time={'dinner'} searchQuery={searchQuery} filterCriteria={filterCriteria}/>}
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default AddFood;
