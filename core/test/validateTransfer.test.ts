import {
    ConfirmedSignatureInfo,
    Connection,
    Keypair,
    Message,
    TransactionError,
    TransactionResponse,
} from '@solana/web3.js';
import { validateTransfer } from '../src';
import BigNumber from 'bignumber.js';

const reference = Keypair.generate().publicKey;
const signaturesForAddress = {
    [reference.toBase58()]: [{ signature: 'signature' } as ConfirmedSignatureInfo],
};

const connection = {
    getTransaction: async function (signature, options) {
        return null;
    },
} as Connection;

describe('validateTransfer', () => {
    it('throws an error on transaction not found', async () => {
        expect.assertions(1);

        const reference = Keypair.generate().publicKey;

        await expect(
            async () =>
                await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(1) })
        ).rejects.toThrow('not found');
    });

    it('throws an error if missing meta', async () => {
        const message = {} as Message;
        const mockResponse = { transaction: { message } } as TransactionResponse;
        jest.spyOn(connection, 'getTransaction').mockImplementation(() => Promise.resolve(mockResponse));

        await expect(
            async () =>
                await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(1) })
        ).rejects.toThrow('missing meta');
    });

    it('throws an error if meta contain an error', async () => {
        const message = {} as Message;
        const err = new Error('something went wrong') as TransactionError;
        const mockResponse = { transaction: { message }, meta: { err } } as TransactionResponse;
        jest.spyOn(connection, 'getTransaction').mockImplementation(() => Promise.resolve(mockResponse));

        await expect(
            async () =>
                await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(1) })
        ).rejects.toThrow('something went wrong');
    });

    it('throws an error if recipient not found', async () => {
        const recipient = Keypair.generate().publicKey;
        const message = { accountKeys: [recipient] } as Message;
        const mockResponse = { transaction: { message }, meta: {} } as TransactionResponse;
        jest.spyOn(connection, 'getTransaction').mockImplementation(() => Promise.resolve(mockResponse));

        await expect(
            async () =>
                await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(1) })
        ).rejects.toThrow('recipient not found');
    });

    it('throws an error if amount not transferred', async () => {
        const message = { accountKeys: [reference] } as Message;
        const mockResponse = {
            transaction: { message },
            meta: { preTokenBalances: [{}], postTokenBalances: [{}], preBalances: [100], postBalances: [100] },
        } as TransactionResponse;
        jest.spyOn(connection, 'getTransaction').mockImplementation(() => Promise.resolve(mockResponse));

        await expect(
            async () =>
                await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(1) })
        ).rejects.toThrow('amount not transferred');
    });

    it('return the response', async () => {
        const message = { accountKeys: [reference] } as Message;
        const mockResponse = {
            transaction: { message },
            meta: { preTokenBalances: [{}], postTokenBalances: [{}], preBalances: [1000], postBalances: [10000] },
        } as TransactionResponse;
        jest.spyOn(connection, 'getTransaction').mockImplementation(() => Promise.resolve(mockResponse));

        const transactionResponse = await validateTransfer(connection, 'reference', { recipient: reference, amount: new BigNumber(0.000001) });
        expect(transactionResponse).toEqual(mockResponse)
    });
});
