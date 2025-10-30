const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
const { ec: EC } = require('elliptic');
const { SHA3 } = require('sha3');

// Configure FCL for Flow testnet
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'flow.network': 'testnet',
});

const ec = new EC('p256');

class FlowService {
  constructor() {
    this.serviceAddress = process.env.FLOW_ACCOUNT_ADDRESS;
    this.privateKey = process.env.FLOW_PRIVATE_KEY;
  }

  // Sign transaction with service account
  async signTransaction(account) {
    const keyId = 0;
    const accountKey = account.keys[keyId];

    const sign = (message) => {
      const key = ec.keyFromPrivate(Buffer.from(this.privateKey, 'hex'));
      const sig = key.sign(this.hashMsg(message));
      const n = 32;
      const r = sig.r.toArrayLike(Buffer, 'be', n);
      const s = sig.s.toArrayLike(Buffer, 'be', n);
      return Buffer.concat([r, s]).toString('hex');
    };

    return {
      ...account,
      tempId: `${account.address}-${keyId}`,
      addr: fcl.sansPrefix(account.address),
      keyId: Number(keyId),
      signingFunction: async (signable) => {
        return {
          addr: fcl.withPrefix(account.address),
          keyId: Number(keyId),
          signature: sign(signable.message),
        };
      },
    };
  }

  hashMsg(msg) {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msg, 'hex'));
    return sha.digest();
  }

  // Get FLOW balance for an address
  async getBalance(address) {
    try {
      const balanceScript = `
        import FlowToken from 0x7e60df042a9c0868
        import FungibleToken from 0x9a0766d93b6608b7

        access(all) fun main(address: Address): UFix64 {
          let account = getAccount(address)
          let vaultRef = account.capabilities
            .get<&FlowToken.Vault>(/public/flowTokenBalance)
            .borrow()
            ?? panic("Could not borrow Balance reference")
          
          return vaultRef.balance
        }
      `;

      const balance = await fcl.query({
        cadence: balanceScript,
        args: (arg, t) => [arg(address, t.Address)],
      });

      return parseFloat(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  // Verify if address exists on Flow
  async verifyAddress(address) {
    try {
      const account = await fcl.send([fcl.getAccount(address)]);
      const accountData = await fcl.decode(account);
      return accountData && accountData.address;
    } catch (error) {
      console.error('Error verifying address:', error);
      return false;
    }
  }

  // Send tip using Forte DeFi Actions
  async sendTip(fromAddress, toAddress, amount) {
    try {
      const tipTransaction = `
        import FlowToken from 0x7e60df042a9c0868
        import FungibleToken from 0x9a0766d93b6608b7
        import DeFiActions from 0x4c2ff9dd03ab442f

        transaction(recipient: Address, amount: UFix64) {
          let sentVault: @{FungibleToken.Vault}
          
          prepare(signer: auth(BorrowValue) &Account) {
            let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
              from: /storage/flowTokenVault
            ) ?? panic("Could not borrow reference to the owner's Vault!")
            
            self.sentVault <- vaultRef.withdraw(amount: amount)
          }
          
          execute {
            let recipientAccount = getAccount(recipient)
            let receiverRef = recipientAccount.capabilities
              .get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
              .borrow()
              ?? panic("Could not borrow receiver reference")
            
            receiverRef.deposit(from: <-self.sentVault)
          }
        }
      `;

      const authorization = await this.signTransaction({
        address: this.serviceAddress,
        keys: [{ keyId: 0 }],
      });

      const txId = await fcl.mutate({
        cadence: tipTransaction,
        args: (arg, t) => [
          arg(toAddress, t.Address),
          arg(amount.toFixed(8), t.UFix64),
        ],
        proposer: authorization,
        payer: authorization,
        authorizations: [authorization],
        limit: 9999,
      });

      // Wait for transaction to be sealed
      await fcl.tx(txId).onceSealed();

      return txId;
    } catch (error) {
      console.error('Error sending tip:', error);
      throw new Error('Failed to send tip on blockchain');
    }
  }

  // Execute Forte Action for composable DeFi
  async executeForteAction(actionType, params) {
    try {
      // This is a placeholder for Forte Actions integration
      // You would implement specific Forte Action calls here
      const forteActionTx = `
        import DeFiActions from 0x4c2ff9dd03ab442f
        
        transaction() {
          prepare(signer: auth(Storage) &Account) {
            // Execute Forte Action
            // Implementation depends on specific action type
          }
        }
      `;

      // Execute transaction
      // Implementation would go here
      
      return 'forte-action-tx-id';
    } catch (error) {
      console.error('Error executing Forte Action:', error);
      throw error;
    }
  }
}

module.exports = new FlowService();
