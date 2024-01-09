import React, { useState, useEffect } from "react";
import { getHashrateData, HashrateData } from "../../lib/f2pool";

const HashrateComponent: React.FC = () => {
  const [data, setData] = useState<HashrateData | null>(null);

  useEffect(() => {
    getHashrateData("bitcoin", "user123").then((data) => {
      setData(data);
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hashrate Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default HashrateComponent;
