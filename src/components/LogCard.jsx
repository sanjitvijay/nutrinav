import { CiTrash } from "react-icons/ci";
import { useUserInfo } from "../context/UserInfoProvider";

function LogCard({log, onDelete}) {
    const {name, nutrition_facts, servings} = log 
    const {calories, total_fat, total_carbohydrate, protein} = nutrition_facts

    const { userInfo } = useUserInfo();
    const {dailyFat, dailyCarbs, dailyProtein, dailyCalories} = userInfo
    
    return (
        <div className="flex justify-between bg-white hover:shadow-md rounded-lg p-2 items-center border-2 cursor-pointer">
            <div className="w-full">
                <div className="flex justify-between">
                    <div>
                        <h2 className="font-bold text-primary">{name}</h2>
                        <p className="mb-2">Servings: {servings}</p>
                    </div>
                    <div className="mb-2 flex justify">
                        <button 
                            className="mr-2"
                            onClick={()=>onDelete(log)}
                        >
                            <CiTrash size={25} color="red" />
                        </button>

                        {/* <button>
                            <MdOutlineEdit size={25} />
                        </button> */}
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <div className="radial-progress text-primary text-center" style={{ "--value": ((calories) / dailyCalories) * 100, "--size": "3rem", "--thickness": "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb' }}
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{calories}</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Calories</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{ "--value": (total_carbohydrate / dailyCarbs) * 100, "--size": "3rem", "--thickness": "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb' }}
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_carbohydrate}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Carbs</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{ "--value": (total_fat / dailyFat) * 100, "--size": "3rem", "--thickness": "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb' }}
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{total_fat}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Fats</p>
                    </div>
                    <div>
                        <div className="radial-progress text-primary text-center " style={{ "--value": (protein / dailyProtein) * 100, "--size": "3rem", "--thickness": "4px", boxShadow: 'inset 0 0 0 4px #e5e7eb' }}
                            role="progressbar">
                            <div>
                                <span className="text-lg text-secondary font-bold">{protein}g</span>
                            </div>
                        </div>
                        <p className="text-center text-base-400 text-xs">Protein</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogCard;