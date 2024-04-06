import { useEffect, useState } from "react";
import supabaseClient from "../supabaseClient";
import LogDisplay from "../components/LogDisplay";
import { set } from "date-fns";

function Log() {
    const supabase = supabaseClient();
    const [logs,setLogs] = useState([]);

    useEffect(() => {
        const fetchLog = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('users')
                .select('log')
                .eq('id', user.id)
            if (error) {
                console.log('Error:', error)
            } else {
                setLogs(data[0].log)
            }
        }

        fetchLog()
    }, [supabase])

    const onDelete = async(log)=>{
        const { data: { user } } = await supabase.auth.getUser()

        const newLogs = logs.filter((item) => item.name !== log.name)
        setLogs(newLogs)

        const { error } = await supabase
            .from('users')
            .upsert([{ id: user.id, log: newLogs }]);
        if (error) {
            console.log(error);
        }

        const { data } = await supabase
        .from('users')
        .select('nutrition')
        .eq('id', user.id)

        let prev = data[0].nutrition
        for (let key in log.nutrition_facts) {
            prev[key] = String(Number(prev[key]) - Number(log.nutrition_facts[key]))
        }
        const { error: error2 } = await supabase
            .from('users')
            .upsert([{ id: user.id, nutrition: prev }]);
        if (error2) {
            console.log(error2);
        }
    }

    return (
        <div className="mb-5">
            <h1 className="text-primary font-bold text-3xl">Breakfast</h1>
            <div className="divider -mt-1"></div>
            <LogDisplay logs={logs} time="breakfast" onDelete={onDelete}/>

            <h1 className="text-primary font-bold text-3xl mt-3">Lunch</h1>
            <div className="divider -mt-1"></div>
            <LogDisplay logs={logs} time="lunch" onDelete={onDelete}/>

            <h1 className="text-primary font-bold text-3xl mt-3">Dinner</h1>
            <div className="divider -mt-1"></div>
            <LogDisplay logs={logs} time="dinner" onDelete={onDelete}/> 

        </div>
    );
}

export default Log;