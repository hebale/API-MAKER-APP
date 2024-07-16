import { createContext, useState, useEffect } from 'react';

export type LogData = {
  ip: string;
  path: string;
  method: string;
  request: any;
  response: any;
  timeStamp: number;
};

export type LogDispatchAction = {
  clear: () => void;
};

export const LogContext = createContext<LogData[]>([]);
export const LogDispatchContext = createContext<LogDispatchAction>({
  clear: () => {},
});

const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const dispatch: LogDispatchAction = {
    clear: () => setLogs([]),
  };

  useEffect(() => {
    const eventSource = new EventSource(`/sse`, { withCredentials: true });
    eventSource.addEventListener('open', (event) => {
      console.info('SSE Connected!!');
    });

    eventSource.addEventListener('log', (event) => {
      setLogs((prev) => [...prev, JSON.parse(event.data)]);
    });

    eventSource.addEventListener('error', () => {
      console.error('is Error!!');
    });
  }, []);

  return (
    <LogDispatchContext.Provider value={dispatch}>
      <LogContext.Provider value={logs}>{children}</LogContext.Provider>
    </LogDispatchContext.Provider>
  );
};

export default LogProvider;
