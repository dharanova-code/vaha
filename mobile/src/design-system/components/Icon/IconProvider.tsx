import React, { createContext, useContext } from "react";
import { IconRegistry, IconRegistryType } from "./IconRegistry";

interface IconContextProps {
  registry: IconRegistryType;
}

const IconContext = createContext<IconContextProps>({
  registry: IconRegistry,
});

export const IconProvider: React.FC<{ children: React.ReactNode; customRegistry?: Partial<IconRegistryType> }> = ({
  children,
  customRegistry,
}) => {
  const registry = customRegistry ? { ...IconRegistry, ...customRegistry } : IconRegistry;
  return (
    <IconContext.Provider value={{ registry }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIconRegistry = () => {
  const context = useContext(IconContext);
  return context.registry;
};
