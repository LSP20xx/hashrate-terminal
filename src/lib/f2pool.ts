// f2pool.ts
import fetch from "node-fetch";

const API_TOKEN = process.env.F2POOL_API_TOKEN as string;

const exampleData = {
  balance: "0.000045036645168645",
  hashes_last_day: "0",
  value: "0.000045036645168645",
  stale_hashes_rejected_last_day: "0",
  workers: [
    [
      "minerx01",
      "12650560751040",
      "0",
      "0",
      "1084452716521979904",
      "2533274790395904",
      "2018-06-19T10:02:19.810789Z",
      false,
    ] as [string, string, string, string, string, string, string, boolean],
  ],
  value_workers: {
    "08ddb9f4552c": "4.211575399188521691",
    "018": "4.211575399188521691",
  },
  value_last_day: "0",
  hashrate_history: {
    "2017-12-21T11:40:00Z": "0",
  },
  stale_hashes_rejected_last_hour: "0",
  paid: "0",
  hashes_last_hour: "0",
  worker_length_online: "0",
  payout_history: [
    [
      "2017-11-01T00:00:00Z",
      "8f8fba3134ce15e9b0001e67cba93c4a2250445310b5cdada1ac676b5a19b8b9",
      "1.01004706",
    ] as [string, string, string],
  ],
  worker_length: "0",
  hashrate: "0",
};

export interface HashrateData {
  balance: string;
  paid: string;
  payout_history: [string, string, string][];
  value: string;
  value_last_day: string;
  stale_hashes_rejected_last_day: string;
  hashes_last_day: string;
  hashrate: string;
  hashrate_history: { [key: string]: string };
  worker_length: string;
  worker_length_online: string;
  workers: [string, string, string, string, string, string, string, boolean][];
  value_workers: { [key: string]: string };
}

export async function getHashrateData(
  currency: string,
  user: string
): Promise<HashrateData | null> {
  const API_URL = `https://api.f2pool.com/${currency}/${user}`;
  const headers = {
    "Content-Type": "application/json",
    "F2P-API-SECRET": API_TOKEN,
  };
  if (user === "user123") {
    return exampleData;
  } else {
    try {
      const response = await fetch(API_URL, { headers });
      if (!response.ok) {
        throw new Error(`Error in request: ${response.status}`);
      }
      const apiData = await response.json();

      const convertToString = (value: any): any => {
        if (Array.isArray(value)) {
          return value.map(convertToString);
        } else if (value && typeof value === "object") {
          return Object.fromEntries(
            Object.entries(value).map(([key, val]) => [
              key,
              convertToString(val),
            ])
          );
        } else if (typeof value === "number") {
          return value.toString();
        }
        return value;
      };

      const data: HashrateData = convertToString(apiData);
      return data;
    } catch (error) {
      console.error("Error fetching data from F2Pool:", error);
      return null;
    }
  }
}
