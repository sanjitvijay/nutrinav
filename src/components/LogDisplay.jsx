// LogDisplay.jsx
import LogCard from "./LogCard";
import { useState, useEffect } from "react";

function LogDisplay({ logs, time, onDelete, onUpdate }) {
  const [filteredLog, setFilteredLog] = useState([]);

  useEffect(() => {
    setFilteredLog(logs.filter((log) => log.time === time));
  }, [logs, time]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    filteredLog.length !== 0 && (
      <div>
        <h1 className="text-primary font-bold text-3xl">
          {capitalizeFirstLetter(time)}
        </h1>
        <div className="divider -mt-1"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 -mt-2">
          {filteredLog.map((log) => (
            <LogCard
              key={`${log.name}-${log.time}`}
              log={log}
              onDelete={onDelete}
              onUpdate={onUpdate} // Pass onUpdate to LogCard
            />
          ))}
        </div>
      </div>
    )
  );
}

export default LogDisplay;
