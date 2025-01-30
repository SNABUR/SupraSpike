import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

async function uploadToPinata(file: File): Promise<string> {
    try {
        console.log('uploadToPinata called with file:', file);

        const jwt_pinata = process.env.JWT_PINATA;
        if (!jwt_pinata) {

            throw new Error('Pinata JWT is not set in environment variables.');
        }

        const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        const formData = new FormData();

        const readableStream = Readable.from(file.stream() as any);

        formData.append('file', readableStream, file.name);

        const pinataResponse = await axios.post(pinataUrl, formData, {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${jwt_pinata}`,
            },
        });

        console.log('Received response from Pinata:', pinataResponse.data);
        return pinataResponse.data.IpfsHash;
    } catch (error) {
        console.error('Error in uploadToPinata:', error);
        throw error;
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData(); 
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
        if (file.size > maxSizeInBytes) {
            return NextResponse.json({ error: 'File size exceeds 1 MB' }, { status: 400 });
        }

        const ipfsHash = await uploadToPinata(file);

        return NextResponse.json({ ipfsHash }, { status: 200 });
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Failed to upload file to IPFS' }, { status: 500 });
    }
};
