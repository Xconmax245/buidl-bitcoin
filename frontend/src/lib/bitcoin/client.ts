
interface UTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  value: number;
}

const MEMPOOL_API_URL = "https://mempool.space/testnet/api"; // Force Testnet for Development

export class BitcoinClient {
  static async getUTXOs(address: string): Promise<UTXO[]> {
    try {
      const response = await fetch(`${MEMPOOL_API_URL}/address/${address}/utxo`);
      if (!response.ok) throw new Error("Failed to fetch UTXOs");
      return await response.json();
    } catch (error) {
      console.error("Error fetching UTXOs:", error);
      return [];
    }
  }

  static async getBalance(address: string): Promise<number> {
    const utxos = await this.getUTXOs(address);
    return utxos.reduce((acc, utxo) => acc + utxo.value, 0);
  }

  static async broadcastTx(txHex: string): Promise<string> {
    const response = await fetch(`${MEMPOOL_API_URL}/tx`, {
      method: 'POST',
      body: txHex,
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Broadcast failed: ${text}`);
    }
    return await response.text();
  }
  
  static async getRecommendedFees(): Promise<{ fastestFee: number, halfHourFee: number, hourFee: number }> {
      const response = await fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`);
      if (!response.ok) throw new Error("Failed to fetch fees");
      return await response.json();
  }
}
