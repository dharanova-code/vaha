declare const migrations: {
  journal: {
    entries: Array<{
      idx: number;
      version: string;
      when: number;
      tag: string;
      breakpoints: boolean;
    }>;
  };
  migrations: Record<string, string>;
};
export default migrations;
