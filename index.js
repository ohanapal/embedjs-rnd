import { PdfLoader, RAGApplicationBuilder, WebLoader, YoutubeLoader, YoutubeSearchLoader, HuggingFace, SIMPLE_MODELS, Ollama } from "@llm-tools/embedjs"
import { MongoDb } from '@llm-tools/embedjs/vectorDb/mongodb';
import OpenAI from "openai";
import 'dotenv/config'
import { ChromaDb } from '@llm-tools/embedjs/vectorDb/chroma';
import { LanceDb } from '@llm-tools/embedjs/vectorDb/lance';
import path from "path";
import readline from 'readline';

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})



const runMyRagApplication = async () => {
    // const openai = new OpenAI();
    // const SIMPLE_MODELS = {
    //     OPENAI_GPT4: new OpenAI({
    //         apiKey: process.env.OPENAI_API_KEY,
    //         modelName: 'gpt-4',
    //     }),
    //     OPENAI_GPT3_5: new OpenAI({
    //         apiKey: process.env.OPENAI_API_KEY,
    //         modelName: 'gpt-3.5-turbo',
    //     }),
    //     // other models...
    // };
    const ragApplication = await new RAGApplicationBuilder()
        .setModel(new Ollama({
            modelName: "llama3",
            baseUrl: 'http://localhost:11434'
        }))
        // .setModel(new HuggingFace({ modelName: 'mistralai/Mixtral-8x7B-v0.1' }))
        // .addLoader(new YoutubeSearchLoader({ youtubeSearchString: 'Mahinur Rahman' }))
        // .addLoader(new YoutubeChannelLoader({ youtubeChannelId: '...' }))
        // .addLoader(new YoutubeLoader({ videoIdOrUrl: 'https://youtu.be/UmcwGpb3Y5U?si=CqkD7sjRaeAO2c0t' }))
        // .addLoader(new WebLoader({ urlOrContent: 'https://github.com/mahi1212?tab=repositories' }))
        .addLoader(new PdfLoader({ filePathOrUrl: './test.pdf' }))
        // .addLoader(new PdfLoader({ url: 'https://lamport.azurewebsites.net/pubs/paxos-simple.pdf' }))
        // .setVectorDb(
        //     new MongoDb({
        //         connectionString: process.env.MONGO_CONNECTION_STRING,
        //     }),
        // )
        .setVectorDb(new LanceDb({ path: '.db' }))

        .build();


    readLine.question('Ask any quastion: ', async (question) => {
        const result = await ragApplication.query(question);
        console.log(result.content);
        readLine.close();
    })

}

runMyRagApplication();