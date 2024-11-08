import { initializeChromaDB, queryChroma } from './chromaClient.js';
import { generateResponseWithOllama } from './ollamaClient.js';

// Initialize ChromaDB with data (run once or only when needed)
initializeChromaDB().then(() => console.log('ChromaDB initialized with sample data.'));

// Function to answer queries using ChromaDB and Ollama
async function answerQuery(userInput) {
  try {
    // Step 1: Retrieve context from ChromaDB
    const contextData = await queryChroma(userInput);
 
    // Step 2: Format the prompt with retrieved context
    //const contextText = contextData.map(doc => doc.content).join(' ');
    const contextText = contextData.documents[0].join(".\n");
    //const formattedPrompt = `Context: ${contextText}\n Question: ${userInput}`;

    const formattedPrompt = `Based on the provided context: \n ${contextText} \nAnswer the question: ${userInput}  \n  Provide only the response text directly related to the question.`;
    //const formattedPrompt = `Based on the provided context: \n ${contextText} \n\n Answer the question: ${userInput}  \n  Provide only the response text directly related to the question from context only.`;
     
    console.log("\n\n"+formattedPrompt);

    // Step 3: Generate response with Ollama
    const response = await generateResponseWithOllama(formattedPrompt);
   
    console.log("\n\n Final Answer :" +response);

  } catch (error) {
    console.error('Error answering query:', error);
  }
}

// Example usage
//answerQuery("About Ollama?");
//answerQuery("About Pacific Ocean?");
answerQuery("What was the result of Raghvind in his degree?");
