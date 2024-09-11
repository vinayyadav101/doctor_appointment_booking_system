import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/'); 
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = req.userData.role !== "admin" ? req.userData.id : req.query.id || Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix +'-'+ file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
  
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const pdfFilter = (req, file, cb) => {
  
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only pdf are allowed'));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
const uploadPdf = multer({
    storage: storage,
    fileFilter: pdfFilter
});

export  {
    upload,
    uploadPdf
}

