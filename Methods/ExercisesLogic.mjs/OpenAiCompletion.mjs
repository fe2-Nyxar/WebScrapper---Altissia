export async function OpenAiComplete(openai, question, imageHref, inspect) {
  try {
    let response;
    // console.log(question);

    if (imageHref === "no Image") {
      response = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 1.1,

        messages: [
          {
            role: "system",
            content:
              "you are a french assistance, you'll get a bunch of questions, and you need to figure out what is the correct, don't answer any question that doesn't relate to french, your output is a stringified javascript array format only, no more",
          },
        ],
        messages: [{ role: "user", content: question }],
        max_tokens: 150,
      });
    } else {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        temperature: 1.1,
        messages: [
          {
            role: "system",
            content:
              "you are a french assistance, you'll get a bunch of questions, and you need to figure out what is the correct, don't answer any question that doesn't relate to french",
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: question },
              {
                type: "image_url",
                image_url: {
                  url: imageHref,
                },
              },
            ],
          },
        ],
        max_tokens: 150,
      });
    }
    console.log(inspect(question, { depth: null }));
    console.log(inspect(response, { depth: null }));
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    return "Error:", error;
  }
}
