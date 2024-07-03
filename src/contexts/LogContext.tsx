import { createContext, useState, useEffect } from 'react';

type LogData = {
  ip: string;
  path: string;
  method: string;
  request: any;
  response: any;
  timeStamp: number;
};

export const LogContext = createContext<LogData[]>([]);

const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogData[]>([]);

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

  return <LogContext.Provider value={logs}>{children}</LogContext.Provider>;
};

export default LogProvider;
