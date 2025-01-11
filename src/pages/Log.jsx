// Log.jsx
import { useEffect, useState } from "react";
import supabaseClient from "../supabaseClient";
import LogDisplay from "../components/LogDisplay";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function Log() {
  const supabase = supabaseClient();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLog = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("log")
        .eq("id", user.id);
      if (error) {
        console.log("Error:", error);
      } else {
        setLogs(data[0].log);
      }
      setLoading(false);
    };

    fetchLog();
  }, [supabase, user.id]);

  const onDelete = async (log) => {
    if (deleteLoading) return;

    setDeleteLoading(true);

    // Corrected filter condition
    const newLogs = logs.filter(
      (item) => !(item.name === log.name && item.time === log.time)
    );
    setLogs(newLogs);

    // Update logs in Supabase
    const { error } = await supabase
      .from("users")
      .upsert([{ id: user.id, log: newLogs }]);
    if (error) {
      toast.error("Error deleting log");
    }

    // Update user's nutrition data
    const { data } = await supabase
      .from("users")
      .select("nutrition")
      .eq("id", user.id);

    let prev = data[0].nutrition;
    for (let key in log.nutrition_facts) {
      prev[key] = String(Number(prev[key]) - Number(log.nutrition_facts[key]));
    }
    const { error: error2 } = await supabase
      .from("users")
      .upsert([{ id: user.id, nutrition: prev }]);
    if (error2) {
      toast.error("Error updating nutrition data");
    }
    setDeleteLoading(false);
  };

  const onUpdate = async (updatedLog) => {
    // Update the logs state
    const newLogs = logs.map((log) =>
      log.name === updatedLog.name && log.time === updatedLog.time
        ? updatedLog
        : log
    );
    setLogs(newLogs);

    // Update the log in Supabase
    const { error } = await supabase
      .from("users")
      .upsert([{ id: user.id, log: newLogs }]);
    if (error) {
      toast.error("Error updating log");
    }

    // Recalculate total nutrition
    let totalNutrition = {};
    newLogs.forEach((log) => {
      for (let key in log.nutrition_facts) {
        totalNutrition[key] =
          (totalNutrition[key] || 0) + Number(log.nutrition_facts[key]);
      }
    });

    // Update the nutrition in Supabase
    const { error: error2 } = await supabase
      .from("users")
      .upsert([{ id: user.id, nutrition: totalNutrition }]);
    if (error2) {
      toast.error("Error updating nutrition data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  } else {
    return logs.length === 0 ? (
      <h1 className="text-primary text-center font-bold text-3xl">
        Nothing to show
      </h1>
    ) : (
      <div className="mb-5">
        <LogDisplay
          logs={logs}
          time="breakfast"
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
        <LogDisplay
          logs={logs}
          time="brunch"
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
        <LogDisplay
          logs={logs}
          time="lunch"
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
        <LogDisplay
          logs={logs}
          time="dinner"
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </div>
    );
  }
}

export default Log;
