import multer from 'multer'
import { MAX_RESUME_BYTES, RESUME_FIELD_NAME } from '../utils/constants.js'

const storage = multer.memoryStorage()

export const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_RESUME_BYTES },
  fileFilter(_req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  },
}).single(RESUME_FIELD_NAME)
