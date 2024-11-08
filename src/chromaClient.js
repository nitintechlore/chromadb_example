import { ChromaClient }  from 'chromadb';
import sampleData from '../data/sampleData.json' assert { type: 'json' };

// Connect to ChromaDB (modify connection details as needed)
//const chromaClient = new ChromaClient({ path: "http://localhost:8000/" });

const chromaClient = new ChromaClient({
    url: "http://localhost:8000", // Ensure the URL is correct
    tenant: "default_tenant",// Specify the tenant name
    database: "default_database" //"my_vector_store"
  });

const COLLECTION_NAME = 'my_collection1_test';

// Function to initialize ChromaDB and create a collection if it doesn’t already exist
export async function initializeChromaDB() {
  try {
    
      const collection = await chromaClient.getOrCreateCollection({
        name: COLLECTION_NAME
      });
      
    // Prepare documents with IDs, text, and metadata
    const documents = sampleData.map((doc, index) => ({
        id: doc.id || `id${index + 1}`,  // Use provided ID or default to sequential IDs
        document: doc.text,
        metadata: doc.metadata
    }));

     // Upsert documents with metadata as key-value pairs
     await collection.upsert({
        documents: documents.map(d => d.document),
        ids: documents.map(d => d.id),
        metadatas: documents.map(d => d.metadata)
    });


  } catch (error) {
    console.error("Error initializing ChromaDB:", error);
  }

}

// Function to query ChromaDB
export async function queryChroma(queryText) {
  try {
    //const collection = await chromaClient.getCollection('my_vector_store');
    const collection = await chromaClient.getOrCreateCollection({
        name: COLLECTION_NAME
      });

     
    if (!collection) throw new Error(`Collection '${COLLECTION_NAME}' not found`);
    //const results = await collection.query({ input: queryText });

    const results = await collection.query({ queryTexts: queryText, nResults: 1,
        include: ['documents', 'metadatas'],//include:['distances','metadatas','embeddings','documents']
        //where: { category: 'ocean'} // Example: { color: "yellow" }
        
    });

    console.log('Chromadb Response on User Query :', JSON.stringify(results));

    return results;
  } catch (error) {
    console.error("Error querying ChromaDB:", error);
    throw error;
  }
}