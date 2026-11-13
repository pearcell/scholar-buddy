# ScholarBuddy

This is a web app that helps you find scholarships based on your current needs and circumstances. It consists of a scholar profile form and results.

## Try it
- Working demo: https://scholar-buddy-ebon.vercel.app/
- Demo video: https://drive.google.com/file/d/1q4MfUgZfmlIIt8TlAEi8NqZJaqZ6c8uO/view?usp=sharing

## How to test it
1. Fill out the form and click submit.
2. The page should load for a while and then return results (i.e. individual scholarship cards).

## Track
Social Good

## How it works
- Trigger: The trigger is the filled out scholar profile.
- AI step: A call to an LLM API is made to generate 5 search queries based on the profile. These queries are used to search with a tool called Tavily. Results are extracted from the search and sent back to the LLM to process individual websites for scholarship information.
- Output: Individualized scholarship cards pertaining to your needs are returned (with dubious accuracy haha).

## Superpowers / Integrations
- Real-world data: I used Tavily to generate search results.
- LLM: I used an OpenRouter API to generate search queries and scholarship enforced schema outputs.

## Why it matters to me
I made this project to help those who are in need of financial aid and can't spare much time to search for and apply to scholarships. I know when I was applying to college I felt like I was already overwhelmed with work. This is one way to take some of the pressure off.

## Built with
I built this project with OpenCode and an OpenRouter API using Nemotron 3 Ultra.

## Built by
Luke Pearce