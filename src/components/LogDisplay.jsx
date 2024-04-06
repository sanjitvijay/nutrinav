import LogCard from "./LogCard";

function LogDisplay({logs, time, onDelete}) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {logs.map((log) => (
                log.time === time && <LogCard key={log.name} log={log} onDelete={onDelete}/>
            ))}
        </div>
    );
}

export default LogDisplay;