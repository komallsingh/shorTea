import { Request, Response } from "express";
import { findByShortCodeAndUser } from "../repo/url.repo";
import { generateQRCode } from "../services/qr.service";
import { AppError } from "../utils/AppError";

interface QRParams {
  shortCode: string;
}

export const generateQR = async (
  req: Request<QRParams>,
  res: Response
) => {
  const { shortCode } = req.params;

  if (!shortCode) {
    throw new AppError(
      "Short code is required",
      400
    );
  }

  const userId = req.user.id;

  const url = await findByShortCodeAndUser(
    shortCode,
    userId
  );

  if (!url) {
    throw new AppError(
      "URL not found or you are not authorized to access it",
      404
    );
  }

  const shortUrl =
    `https://shortea.onrender.com/${url.short_code}`;

  const qrCode = await generateQRCode(shortUrl);

  res.setHeader("Content-Type", "image/png");

  return res.status(200).send(qrCode);
};