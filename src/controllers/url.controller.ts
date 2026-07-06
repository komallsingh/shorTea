import * as service from "../services/url.service";
import { Request, Response } from "express";

interface ShortCodeParams {
  shortCode: string;
}


export const createShortUrl = async(
    req: Request,res: Response
)=>{
    const {url} = req.body;
    const result= await service.createShortUrl(url);

    res.status(201).json(
        {
            success: true,
            data: result
        }
    );
};

export const getOriginalUrl = async(
    req: Request<ShortCodeParams>,
    res: Response
)=>{
    const {shortCode} = req.params;
    const url= await service.getOriginalUrl(shortCode);  
    res.redirect(url.original_url);
}