import PDFDocument from 'pdfkit'

type EnvelopeForPdf = {
  document_title: string
  document_body: string
  recipient_name: string
  recipient_email: string
  business_name: string
  document_hash: string
  signature_name?: string | null
  signature_type?: string | null
  signature_data?: string | null
  signature_hash?: string | null
  signed_at?: string | null
  signer_ip?: string | null
}

function writeFooter(doc: PDFKit.PDFDocument, pageNumber: number, documentHash: string) {
  const bottom = doc.page.height - 42
  const previousBottomMargin = doc.page.margins.bottom
  doc.page.margins.bottom = 0
  doc.save()
  doc.moveTo(54, bottom - 8).lineTo(doc.page.width - 54, bottom - 8).strokeColor('#d8dee6').stroke()
  doc.font('Helvetica').fontSize(7.5).fillColor('#647180')
  doc.text(`Wolin Sign · Document ${documentHash.slice(0, 16)} · Page ${pageNumber}`, 54, bottom, {
    width: doc.page.width - 108,
    align: 'center',
    lineBreak: false,
  })
  doc.restore()
  doc.page.margins.bottom = previousBottomMargin
}

export async function createSignedPdf(envelope: EnvelopeForPdf) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 58, bottom: 62, left: 58, right: 58 }, bufferPages: true })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('error', reject)
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#214e45').text('WOLIN', { characterSpacing: 2 })
    doc.moveDown(1.1)
    doc.font('Helvetica-Bold').fontSize(23).fillColor('#17211f').text(envelope.document_title)
    doc.moveDown(0.35)
    doc.font('Helvetica').fontSize(9.5).fillColor('#647180')
      .text(`${envelope.business_name} · ${envelope.recipient_name} · ${envelope.recipient_email}`)
    doc.moveDown(1.4)

    for (const block of envelope.document_body.split(/\n\s*\n/)) {
      const paragraph = block.trim()
      if (!paragraph) continue
      if (/^\d+\.\s+[A-Z]/.test(paragraph)) {
        doc.moveDown(0.75)
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#17211f').text(paragraph, { lineGap: 2 })
        doc.moveDown(0.18)
      } else {
        doc.font('Helvetica').fontSize(9.5).fillColor('#283431').text(paragraph, { lineGap: 3, align: 'left' })
        doc.moveDown(0.72)
      }
    }

    doc.addPage()
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#214e45').text('SIGNATURE CERTIFICATE', { characterSpacing: 1.4 })
    doc.moveDown(1.2)
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#17211f').text('Completed electronic signature')
    doc.moveDown(1.1)

    const signedAt = envelope.signed_at ? new Date(envelope.signed_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'long', timeZone: 'UTC' }) : 'Not signed'
    const details = [
      ['Signer', envelope.signature_name || envelope.recipient_name],
      ['Email', envelope.recipient_email],
      ['Business', envelope.business_name],
      ['Signed', signedAt],
    ]
    for (const [label, value] of details) {
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#647180').text(label.toUpperCase(), { characterSpacing: 0.8 })
      doc.font('Helvetica').fontSize(10).fillColor('#17211f').text(value)
      doc.moveDown(0.65)
    }

    doc.moveDown(0.7)
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#647180').text('ELECTRONIC SIGNATURE', { characterSpacing: 0.8 })
    doc.roundedRect(doc.x, doc.y + 7, 320, 96, 8).fillAndStroke('#f5f7f6', '#d8dee6')
    const signatureTop = doc.y + 25
    if (envelope.signature_type === 'drawn' && envelope.signature_data?.startsWith('data:image/png;base64,')) {
      try {
        const image = Buffer.from(envelope.signature_data.split(',')[1] ?? '', 'base64')
        doc.image(image, 75, signatureTop, { fit: [280, 55], align: 'center', valign: 'center' })
      } catch {
        doc.font('Helvetica-Oblique').fontSize(24).fillColor('#17211f').text(envelope.signature_name || '', 76, signatureTop + 10)
      }
    } else {
      doc.font('Helvetica-Oblique').fontSize(24).fillColor('#17211f').text(envelope.signature_name || '', 76, signatureTop + 10)
    }
    doc.y += 118

    const pages = doc.bufferedPageRange()
    for (let index = 0; index < pages.count; index += 1) {
      doc.switchToPage(index)
      writeFooter(doc, index + 1, envelope.document_hash)
    }
    doc.end()
  })
}
