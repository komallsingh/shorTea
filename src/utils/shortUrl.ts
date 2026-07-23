export const generateShortUrl = (shortCode:string)=>{

    return `${process.env.BASE_URL}/${shortCode}`;

};