import { ConfirmedSignatureInfo, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { findReference } from '../src';

const reference = Keypair.generate().publicKey;
const signaturesForAddress = {
    [reference.toBase58()]: [{ signature: 'signature' } as ConfirmedSignatureInfo],
};

const connection = {
    getSignaturesForAddress: async function (reference: PublicKey) {
        return signaturesForAddress[reference.toBase58()] || [];
    },
} as Connection;

describe('findTransactionSignature', () => {
    it('should return the last signature', async () => {
        expect.assertions(1);

        const found = await findReference(connection, reference);

        expect(found).toEqual({ signature: 'signature' });
    });

    it('throws an error on signature not found', async () => {
        expect.assertions(1);

        const reference = Keypair.generate().publicKey;

        await expect(async () => await findReference(connection, reference)).rejects.toThrow('not found');
    });

    it('throws an error if findReference throw during a recursive lookup', async () => {
        jest.spyOn(connection, 'getSignaturesForAddress')
            .mockImplementationOnce(() => Promise.resolve(signaturesForAddress[reference.toBase58()]))
            .mockImplementationOnce(() => {
                throw new Error('Something went wrong');
            });

        await expect(async () => await findReference(connection, reference, { limit: 1 })).rejects.toThrow(
            'Something went wrong'
        );
    });
});
