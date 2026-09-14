# prompts.md

## 1. First attempt at the API function
> [paste the prompt exactly as you sent it]

Came back with: a function that called the endpoint from the browser, which the
provider refuses. My prompt never said the call had to happen server-side.
Action: rewrote the prompt with a guardrail. Kept the second version.

## 2. The field name I did not check
> [paste]

Came back with code reading `data.results[0].value`. It rendered "undefined" and I
assumed I had broken the caching. The real answer had `data.items`, and I only found
it when I finally called the endpoint by hand.
Action: pasted the real response into the prompt. Worked first time after that.
Lesson: I had skipped the one step this problem set told me not to skip.

## 3. Where I stopped prompting
Setting the Vercel variable by conversation took three exchanges. Doing it in the
dashboard took twenty seconds. I stopped asking after that.
