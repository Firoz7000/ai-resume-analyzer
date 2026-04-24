import pdfParse from 'pdf-parse'

/**
 * @param {Buffer} buffer - Raw PDF bytes from multer
 * @returns {Promise<string>} Extracted plain text
 */
export async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer)
  return (data.text || '').trim()
}
