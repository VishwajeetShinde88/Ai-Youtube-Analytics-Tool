import OpenAI from 'openai';
import { inngest } from "./client";
import Replicate from 'replicate';
import ImageKit from 'imagekit';
import { AIThumbnailTable } from '@/configs/schema';
import { db } from '@/configs/db';
import moment from 'moment';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
//@ts-ignore
const imageKit=new ImageKit({
  //@ts-ignore
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore
  urlEndpoint:process.env.IMAGEKIT_URLENDPOINT
})

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  
});
export const replicate = new Replicate({
  auth:process.env.REPLICATE_API_KEY
});

export const GenerateAiThumbnail=inngest.createFunction(
  {
    id:'ai/generate-thumbnail'
  },
{event:'ai/generate-thumbnail'}  ,
async({event,step})=>{
  const {userEmail,refImage,faceImage,userInput} =await event.data;
  //uploadd image to cloud /Imagekit
  // await step.sleep("wait-a-moment","7s");
  // return 'Success'
  const uploadImageUrls=await step.run(
    "UploadImage",
    async()=>{

      if(refImage!=null){

      const refImageUrl=await imageKit.upload({
        file:refImage?.buffer??'',
        fileName:refImage.name,
        isPublished:true,
        useUniqueFileName:false
      })
       // const faceImageUrl=await imageKit.upload({
        //file:faceImage?.buffer??'',
       // fileName:faceImage.name,
       // isPublished:true,
       // useUniqueFileName:false
     // })

      return refImageUrl.url
    }
    else {return null;}
    }
  )
  //Generate AI prompt from AI model
  const generateThumbnailPrompt=await step.run('generateThumbnailPrompt',async()=>{
    const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": uploadImageUrls?`Refering to this thumbnail url wirte a text prompt to generate youtube thumbnail
            similar to the attaches referance image with following user input:`+userInput+'Only giive me text prompt, No other comment text':
            `Depends on user input write a text prompt to generate high quality professional Youtube Thumbnail
             and add relavant icons, illustration or images as per title. UserInput`+userInput+'Only giive me text prompt, No other comment text'
            
          },
          //@ts-ignore
          ...(uploadImageUrls
            ? [
              {
                type:"image_url",
                image_url:{
                  url:uploadImageUrls,
                },
              },
            ]
            :[])
        ],  
      },
    ],
  });
  console.log(completion.choices[0].message);
  return completion.choices[0].message
  })


  //Generate AI Image
 const generateThumbnailImage=await step.run('Generate Image',async()=>{
  const input = {
  prompt: generateThumbnailPrompt,
  aspect_ratio: "16:9",
  output_format: "png",
  safety_filter_level: "block_only_high"
};
const output = await replicate.run("google/imagen-4-fast", { input });

// To access the file URL:
//@ts-ignore
return output.url();
 })
  //Save Image to Cloud

  const uploadThumbnail=await step.run('Upload Thumbnail',async()=>{
    const imageRef=await imageKit.upload({
      file:generateThumbnailImage,
      fileName:Date.now()+'.png',
      useUniqueFileName:false
    })
    return imageRef.url
  })
  const SaveToDB=await step.run('SaveToDB',async()=>{
    const result=await db.insert(AIThumbnailTable).values({
      userInput:userInput,
      thumbnailUrl:uploadThumbnail,
      createdOn:moment().format('yyyy-mm-DD'),
      refImage:uploadImageUrls,
      userEmail:userEmail
    })
    //@ts-ignore
    .returning(AIThumbnailTable)
    return result;
  })

  //Save record to database


  return uploadThumbnail;
}
)