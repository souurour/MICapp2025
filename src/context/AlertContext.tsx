import { createContext, useContext, useState, ReactNode } from "react";

export type AlertType = "info" | "success" | "warning" | "error";

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
  autoClose?: boolean;
}

interface AlertContextType {
  alerts: AlertMessage[];
  addAlert: (type: AlertType, message: string, autoClose?: boolean) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = (type: AlertType, message: string, autoClose = true) => {
    const id = Date.now().toString();
    const newAlert = { id, type, message, autoClose };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    if (autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
