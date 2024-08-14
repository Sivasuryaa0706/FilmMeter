import React, { createContext } from "react";

const NotificationContext = createContext();
export default function NotificationProvider({ children }) {
  const updateNotification = () => {};
  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 top-24 rounded">
        <div className=" shadow-md bg-red-400 shadow-gray-400 bounce-custom">
          <p className="text-white px-4 py-2 font-semibold">
            Something went Wrong!
          </p>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}
