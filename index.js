const express = require('express')

const multer = require('multer')

const tesseract = require("node-tesseract-ocr");

const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname + '/uploads')))

app.set('view engine', "ejs")

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    },
});

const upload = multer({ storage:storage })

app.get('/', (req, res) => {
    res.render('index', { data: '' })
})

app.post('/extracttextfromimage', upload.single('file'), (req, res) => {
    // console.log(req.file.path)

    const config = {
        lang: "eng", // default
        oem: 1,
        psm: 3,
    };

    tesseract
        .recognize(req.file.path, config)
        .then((text) => {
            console.log(text);
            res.render('index', { data: text })
        })
        .catch((error) => {
            console.log(error.message);
        });
})

app.listen(5001, () => {
    console.log(`OCR Listener on port 5001`)
})