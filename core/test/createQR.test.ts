const mockQRCodeStyling = jest.fn();
jest.mock('@solana/qr-code-styling', () => ({
    __esModule: true,
    default: mockQRCodeStyling,
}));

import { createQR, createQROptions } from '../src';



describe('createQR', () => {
    it('should call QRCodeStyling with correctly configured QRCodeStyling options', () => {
        const url = "https://solanapay.com";
        const qrCode = createQR(url);
        const options = createQROptions(url);

        expect(mockQRCodeStyling).toBeCalledWith(options);
    })
});

describe('createQROptions', () => {
    it('should return default configured options to be used with QRCodeStyling', async () => {
        const url = "https://solanapay.com";
        const options = createQROptions(url);
        
        expect(options.data).toBe(url);
        // Remaining Defaults:
        expect(options?.backgroundOptions?.color).toBe('white');
        expect(options?.dotsOptions?.color).toBe('black');
        expect(options?.cornersSquareOptions?.color).toBe('black');
        expect(options?.cornersDotOptions?.color).toBe('black');
        expect(options.width).toBe(512);
        expect(options.height).toBe(512);
    });

    it('should return configured options with size to be used with QRCodeStyling', async () => {
        const url = "https://solanapay.com";
        const size = 1024;
        const options = createQROptions(url, size);

        expect(options.data).toBe(url)
        expect(options.width).toBe(size);
        expect(options.height).toBe(size);
        // Remaining Defaults:
        expect(options?.backgroundOptions?.color).toBe('white');
        expect(options?.dotsOptions?.color).toBe('black');
        expect(options?.cornersSquareOptions?.color).toBe('black');
        expect(options?.cornersDotOptions?.color).toBe('black');
    });

    it('should return configured options with size and colors to be used with QRCodeStyling', async () => {
        const url = "https://solanapay.com";
        const size = 1024;
        const color = "red";
        const background = "yellow";
        const options = createQROptions(url, size, background, color);

        expect(options.data).toBe(url)
        expect(options.width).toBe(size);
        expect(options.height).toBe(size);
        expect(options?.backgroundOptions?.color).toBe(background);
        expect(options?.dotsOptions?.color).toBe(color);
        expect(options?.cornersSquareOptions?.color).toBe(color);
        expect(options?.cornersDotOptions?.color).toBe(color);
    });
});
