import * as service from "../services/auth.service";
import { Request, Response } from "express";

export const registerUser= async(
    req:Request,
    res:Response
)=>{
    const {username, email, password} = req.body;
    const result= await service.registerUser({username,email,password});
    return res.status(201).json({
        success: true,
        data: result
    });
}

export const loginUser= async(
    req:Request,
    res:Response
)=>{
    const {email,password}=req.body;
    const result=await service.loginUser({email,password});
    return res.status(200).json({
        success: true,
        data: result
    });
}