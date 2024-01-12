# Fashionista

Levelling up your fashion recommendations, with the help of AI and LLMs.

## Technical Details

- The root of the project contains general-purpose scripts that can be used to data from images, and store them as JSON so that the same can be utilised by other applications and processes in the pipeline.
- The [`web`](./web/) folder contains a React application that can be used to view the extracted data. We make use of the [Mantine](https://mantine.dev/) library for component styling.

## Local Setup

To run the generation script, you need to create a `.env` with your `OPENAI_API_KEY` and then run `npm install && npm run index.js` to install all the dependencies and run the script.

To use the webapp, please ensure that you have a correctly generated `imageItems.json` located at [here](./web/src/data/) and then run `npm run setup && npm run dev` to install the dependencies and start the development server. The site should be live at `http://localhost:55173/`.
