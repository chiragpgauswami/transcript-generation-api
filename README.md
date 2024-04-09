# Transcript Generation API

This project implements an API for generating transcripts from video files. It utilizes AssemblyAI for transcribing audio, ffmpeg for extracting audio from videos, and Google Translate API for translating transcripts.

## Tech Stack

The API is built using the following technologies:

- Node.js
- Express.js
- Multer
- ffmpeg
- AssemblyAI
- Google Translate API

## Features

- Transcribe audio from video files
- Convert audio to MP3 format
- Translate transcripts to different languages (e.g., Hindi)

## Usage

To use the Transcript Generation API, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/chiragpgauswami/transcript-generation-api.git
```

2. Install dependencies:

```bash
cd transcript-generation-api
npm install
```

3. Create an uploads folder in the root directory of the project:

```bash
mkdir uploads
```

4. Set up environment variables:

   - `ASSEMBLY_AI_API_KEY`: Your AssemblyAI API key.

5. Start the server:

```bash
npm start
```

6. Access the API endpoints:

- POST `/transcribe`: Upload a video file to transcribe.

## Demo Response

Upon successful transcription, the API returns a JSON object with the transcript in English and Hindi (if translated). Here's a sample response:

```json
{
  "success": true,
  "transcriptEnglish": "This is a sample transcript in English.",
  "transcriptHindi": "यह एक अंग्रेजी में नमूना प्रतिलिपि है।"
}
```

## Customization

You can customize the API by modifying the code in the `app.js` file. Feel free to add additional features or modify the existing functionality to suit your requirements.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

## Author

This project was created by [chiragpgauswami](https://github.com/chiragpgauswami).

## License

This project is licensed under the [MIT License](LICENSE).
