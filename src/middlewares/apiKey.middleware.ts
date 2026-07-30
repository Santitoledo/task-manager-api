import  { Request, Response, NextFunction } from "express";


export function apiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const apiKey = req.headers["x-api-key"];

    if ( apiKey !== process.env.API_KEY){ // variable de entorno
         return res.status(401).json({
      message: "Api Key Incorrecta",
    });
  }
   next(); 
}