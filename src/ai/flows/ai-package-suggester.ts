'use server';
/**
 * @fileOverview This flow provides an AI-powered tool to analyze social media objectives
 * and suggest the most effective SMM service packages.
 *
 * - aiPackageSuggester - A function that handles the social media package suggestion process.
 * - AiPackageSuggesterInput - The input type for the aiPackageSuggester function.
 * - AiPackageSuggesterOutput - The return type for the aiPackageSuggester function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiPackageSuggesterInputSchema = z.object({
  socialMediaGoals: z.string().describe('A detailed description of the user\'s social media goals and objectives.'),
});
export type AiPackageSuggesterInput = z.infer<typeof AiPackageSuggesterInputSchema>;

const ServicePackageSchema = z.object({
  name: z.string().describe('The name of the suggested SMM package.'),
  description: z.string().describe('A detailed description of what this package offers and how it helps achieve the user\'s goals.'),
  platforms: z.array(z.string()).describe('A list of social media platforms targeted by this package (e.g., "Instagram", "TikTok", "YouTube").'),
  suggestedServices: z.array(z.string()).describe('A list of specific SMM services included in this package (e.g., "1000 Instagram followers", "5000 TikTok views", "Engagement boost").'),
  estimatedImpact: z.string().describe('An estimate of the impact or results this package can achieve for the user\'s goals.'),
});

const AiPackageSuggesterOutputSchema = z.object({
  suggestedPackages: z.array(ServicePackageSchema).describe('A list of suggested SMM service packages tailored to the user\'s social media goals.'),
});
export type AiPackageSuggesterOutput = z.infer<typeof AiPackageSuggesterOutputSchema>;

export async function aiPackageSuggester(input: AiPackageSuggesterInput): Promise<AiPackageSuggesterOutput> {
  return aiPackageSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPackageSuggesterPrompt',
  input: { schema: AiPackageSuggesterInputSchema },
  output: { schema: AiPackageSuggesterOutputSchema },
  prompt: `You are an expert social media marketing strategist for an SMM Panel called TrendPulse. Your task is to analyze a user's social media goals and suggest the most effective SMM service packages to help them achieve those goals. Think step by step to identify the best platforms and services.

User's Social Media Goals: {{{socialMediaGoals}}}

Based on these goals, provide 2-3 tailored SMM service packages. For each package, include a name, a detailed description, the platforms it targets, specific suggested services, and an estimate of the impact it can have.`,
});

const aiPackageSuggesterFlow = ai.defineFlow(
  {
    name: 'aiPackageSuggesterFlow',
    inputSchema: AiPackageSuggesterInputSchema,
    outputSchema: AiPackageSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
