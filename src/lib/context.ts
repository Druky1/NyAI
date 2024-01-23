import { Pinecone} from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
    const pineconeIndex = await client.index("nyai");
    const queryResponse = await pineconeIndex.query({
      vector: embeddings,
      filter: { fileKey: { $eq: fileKey } },
      topK: 5,
      includeMetadata: true,
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}


export async function getContext(query: string, fileKey: string){
 const queryEmbeddings = await getEmbeddings(query)
 const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

 const qualifyingDocs = matches.filter((match) => match.score && match.score > 0.7);

 type Metadata = {
  text: string,
  pageNumber: number
 }

 let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)
 return docs.join("\n").substring(0, 3000)
}