import { importer, ImporterOptions } from "ipfs-unixfs-importer";
import { MemoryBlockstore } from "blockstore-core/memory";
import { CID } from "multiformats/cid";

interface CustomImporterOptions extends ImporterOptions {
    hashAlg: string;
}

export const predictCID = async (file: File) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const blockstore = new MemoryBlockstore();

        let rootCid;

        for await (const result of importer([{ content: buffer }], blockstore, {
            cidVersion: 0,   
            rawLeaves: false, 
            hashAlg: 'sha2-256',
        } as CustomImporterOptions)) {
            rootCid = result.cid;
        }

        if (!rootCid) {
            throw new Error("Failed to generate CID");
        }

        const cid = CID.parse(rootCid.toString());
        return rootCid.toString()       
    } catch (err) {
        console.error("Error predicting CID:", err);
        throw err;
    }
};
