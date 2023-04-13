import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  const { method, body } = req

  switch (method) {
    case "POST":
      const firstPrompt =
        `Give me the ingredients for SINGLE simple meal that mean the following criteria.
        The meal must be keto-diet.
        Avoid: Grains, Bread, Sugar, Corn-syrup.
        Have only one or two sources of protein.
        The sum of the calories must be less than the caloric target.
        The meal must be composed of high-fat, and medium-protein, and low carbohydrates.
        Give the calorie and macronutrient breakdowns for each ingredient like below:

        Meal 1:
        Ingredients (1000 total calories):

        1. Salmon (200g): Calories: 696, Fat: 46g, Protein: 44g, Carbohydrates: 0g 
        2. Avocado (150g): Calories: 240, Fat: 20g, Protein: 3g, Carbohydrates: 11g 
        3. Olive Oil (1 tbsp): Calories: 120, Fat: 14g, Protein: 0g, Carbohydrates: 0g

        Total Calories: 1056, Fat: 80g, Protein: 47g, Carbohydrates: 11g

        Meal 2:
        Ingredients (950 total calories):

        Chicken Thighs (skinless, boneless, 230g): Calories: 552, Fat: 33g, Protein: 57g, Carbohydrates: 0g
        Spinach (cooked, 200g): Calories: 52, Fat: 0.8g, Protein: 5.2g, Carbohydrates: 3.6g
        Almonds (40g): Calories: 231, Fat: 20g, Protein: 8g, Carbohydrates: 7g
        Coconut Oil (1 tbsp): Calories: 121, Fat: 13.5g, Protein: 0g, Carbohydrates: 0g
        Total Calories: 956, Fat: 67.3g, Protein: 70.2g, Carbohydrates: 10.6g

        Meal 3:
        Ingredients (1100 total calories):

        Pork Chops (boneless, 220g): Calories: 616, Fat: 36g, Protein: 68g, Carbohydrates: 0g
        Asparagus (200g): Calories: 40, Fat: 0.4g, Protein: 4.4g, Carbohydrates: 8g
        Macadamia Nuts (45g): Calories: 335, Fat: 35g, Protein: 3g, Carbohydrates: 5g
        MCT Oil (1 tbsp): Calories: 130, Fat: 14g, Protein: 0g, Carbohydrates: 0g
        Total Calories: 1121, Fat: 85.4g, Protein: 75.4g, Carbohydrates: 13g

        ${body.userInput}
        Meal 4: 
        `
      console.log("API: ", firstPrompt)

      const baseCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: firstPrompt,
        temperature: 0.8,
        max_tokens: 1250,
      })
      console.log("baseCompletion", baseCompletion.data)
      /* Looks like the following.
      baseCompletion {
        id: 'cmpl-74saSMCOE07u6wA8jtDfkahu408Vk',
        object: 'text_completion',
        created: 1681397500,
        model: 'text-davinci-003',
        choices: [
          {
            text: '\n\ncreature.',
            index: 0,
            logprobs: null,
            finish_reason: 'stop'
          }
        ],
        usage: { prompt_tokens: 11, completion_tokens: 5, total_tokens: 16 }
      }
      */
      const basePromptOutput = baseCompletion.data.choices.pop()

      res.status(200).json({ output: basePromptOutput })
      break
    default:
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${method} not allowed.`)
  }
}
