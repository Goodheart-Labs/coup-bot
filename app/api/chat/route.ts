import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './constants';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
      
      // Handle different content block types
      const content = response.content[0];
      let responseText = '';
      
      if ('text' in content) {
        responseText = content.text;
      } else if (typeof content === 'object' && content !== null) {
        // Convert other content types to string if needed
        responseText = JSON.stringify(content);
      }

      console.log("API Response:", responseText); // For debugging
      console.log("API Response raw:", JSON.stringify(responseText)); // For debugging exact string content
      return NextResponse.json({ text: responseText });
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
