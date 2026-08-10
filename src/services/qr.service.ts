import QRCode from "qrcode";

export const generateQRCode = async (
  url: string
): Promise<Buffer> => {
  return QRCode.toBuffer(url, {
    type: "png",
    width: 500,
    margin: 2,
    errorCorrectionLevel: "M",
  });
};