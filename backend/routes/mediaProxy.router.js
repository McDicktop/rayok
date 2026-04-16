const Router = require("express");
const router = new Router();
const {s3, BUCKET} = require('../utils/s3');
const {GetObjectCommand} = require("@aws-sdk/client-s3")

router.get('/:key(*)', async (req, res) => {
    const key = req.params.key; // cover/uuid.png
    try {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key});
        const { Body, ContentType } = await s3.send(command);

        res.setHeader("Content-Type", ContentType ?? "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000");

        Body.pipe(res);
    } catch {
        res.status(404).json({message: "Not found"});
    }
})

module.exports = router;
