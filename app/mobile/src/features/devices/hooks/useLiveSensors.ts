import { useEffect } from "react";
import { useDeviceStore } from "../stores/deviceStore";
import { useDeviceClient } from "../client/DeviceClient";

export function useLiveSensors() {
  const { liveSensors, refreshSensors } = useDeviceStore();
  const client = useDeviceClient();

  useEffect(() => {
    if (!client.isConnected) return;
    
    refreshSensors();
    
    const interval = setInterval(() => {
       refreshSensors();
    }, 10000); // Fallback polling if WS isn't fully wired
    
    return () => clearInterval(interval);
  }, [client.isConnected, refreshSensors]);

  return liveSensors;
}
