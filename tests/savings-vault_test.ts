// @ts-nocheck
import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.4/index.ts";
import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";

Clarinet.test({
  name: "Ensure that user can deposit sBTC",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user1 = accounts.get("wallet_1")!;
    const amount = 1000000; // 0.01 sBTC

    let block = chain.mineBlock([
      Tx.contractCall(
        "savings-vault",
        "deposit",
        [types.uint(amount)],
        user1.address,
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

    // Verify balance
    let balanceResult = chain.callReadOnlyFn(
      "savings-vault",
      "get-balance",
      [types.principal(user1.address)],
      user1.address,
    );
    balanceResult.result.expectOk().expectUint(amount);
  },
});

Clarinet.test({
  name: "Ensure that user can withdraw sBTC",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user1 = accounts.get("wallet_1")!;
    const depositAmount = 1000000;
    const withdrawAmount = 500000;

    let block = chain.mineBlock([
      Tx.contractCall(
        "savings-vault",
        "deposit",
        [types.uint(depositAmount)],
        user1.address,
      ),
      Tx.contractCall(
        "savings-vault",
        "withdraw",
        [types.uint(withdrawAmount)],
        user1.address,
      ),
    ]);

    block.receipts[1].result.expectOk().expectBool(true);

    // Verify remaining balance
    let balanceResult = chain.callReadOnlyFn(
      "savings-vault",
      "get-balance",
      [types.principal(user1.address)],
      user1.address,
    );
    balanceResult.result.expectOk().expectUint(depositAmount - withdrawAmount);
  },
});
