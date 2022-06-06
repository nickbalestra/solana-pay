import {
    AccountInfo,
    Connection,
    Keypair,
} from '@solana/web3.js';
import { createTransfer } from '../src';
import BigNumber from 'bignumber.js';

const sender = Keypair.generate().publicKey;
const recipient = Keypair.generate().publicKey;
const accountsInfo = {
    [sender.toBase58()]: [{} as AccountInfo<Buffer>],
};

const connection = {
    getAccountInfo: async function (reference) {
        return null;
    },
} as Connection;

describe('createTransfer', () => {
    it('throws an error on sender not found', async () => {
        expect.assertions(1);

        await expect(
            async () => await createTransfer(connection, sender, { recipient, amount: new BigNumber(1) })
        ).rejects.toThrow('sender not found');
    });
});
