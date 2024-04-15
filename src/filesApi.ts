import { Request, Response } from 'express';
import path from 'path';
import { tempDir } from './dotenv';

export default function (req: Request, res: Response) {
    const fromUserID = req.query.fromUserID as string;
    const fileRef = req.query.fileRef as string;

    if (!fromUserID || !fileRef) {
        return res.status(400).send('Missing parameters');
    }

    const filePath = path.join(tempDir, fromUserID, fileRef);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
}
