# Seneca

Seneca was a prominent Roman philosopher, statesman, and playwright. He is best known for being the tutor and advisor to the infamous Roman emperor Nero. Seneca's teachings emphasized the importance of virtue, self-control, and the pursuit of wisdom.

## Problem

People often face challenges while drafting legal documents. One common problem is the complexity of legal language and terminology, which can be difficult for non-lawyers to understand and use correctly. Another issue is ensuring the accuracy and completeness of the document, as even minor errors or omissions can have significant legal consequences. Additionally, organizing and structuring the content in a logical and coherent manner can be a daunting task.

Finally, keeping up with the ever-changing legal landscape and incorporating the latest legal requirements and best practices can pose a challenge. Overall, drafting legal documents requires careful attention to detail, knowledge of legal principles, and the ability to effectively communicate legal concepts.

## Solution

As a solution to the problem described above, we seek to create a web application that allows a user to generate legal documents easily, without having to

- allows the user to select the type of legal document that they wish to generate
- prompts the user for relevant input required to generate that specific document
- allows the user to iteratively make changes to the generated output through natural language instructions
- allows the user to download the generated output as a PDF

## Architecture

The frontend is served as a Next.js SSR application on port `3000`. The API is made with Flask and run on port `5000`.

The API is responsible for supporting authentication and overlaying an interface over the LLM that powers the generation of legal documents. The frontend provides a user interface to interact with the API.

[`ollama`](https://ollama.com/) has been used to act as a wrapper over the `llama-3.1:13b` LLM. It exposes an API to interact with the model and implements optimization techniques such as quantisation.

## License

[MIT](LICENSE)
