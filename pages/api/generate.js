import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const poemPrompt = req.body.poemPrompt || '';
  if (poemPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid poetry prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(poemPrompt),
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    console.log(completion.data.choices[0]);
    let responseText = completion.data.choices[0].text;
    res.status(200).json({ result: responseText });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(poemPrompt) {
  return `Reply as if you are a fortune teller and write a retrofuturistic fortune in the form of a poem of approximately 50 words based up the following prompt: """${poemPrompt}"""`;
}
