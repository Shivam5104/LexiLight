'use server';

/**
 * @fileOverview A Genkit flow for generating an audio summary from text.
 *
 * It includes:
 * - GenerateAudioSummaryInput: The input type for the generateAudioSummary function.
 * - GenerateAudioSummaryOutput: The output type for the generateAudioSummary function.
 * - generateAudioSummary: An async function that takes summary text and returns a data URI for the generated audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const GenerateAudioSummaryInputSchema = z.object({
  summaryText: z.string().describe('The text to be converted to speech.'),
});
export type GenerateAudioSummaryInput = z.infer<typeof GenerateAudioSummaryInputSchema>;

const GenerateAudioSummaryOutputSchema = z.object({
  audioDataUri: z.string().describe("A data URI of the generated audio file (WAV format). Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateAudioSummaryOutput = z.infer<typeof GenerateAudioSummaryOutputSchema>;

export async function generateAudioSummary(input: GenerateAudioSummaryInput): Promise<GenerateAudioSummaryOutput> {
  return generateAudioSummaryFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioSummaryFlow = ai.defineFlow(
  {
    name: 'generateAudioSummaryFlow',
    inputSchema: GenerateAudioSummaryInputSchema,
    outputSchema: GenerateAudioSummaryOutputSchema,
  },
  async ({ summaryText }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: summaryText,
    });

    if (!media) {
      throw new Error('No media returned from TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
