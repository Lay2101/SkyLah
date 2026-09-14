# Ma Ma Lay

# Q.1 Where did the agent make you faster, and by how much?

The agent made me faster when I asked, “Fix the existing SkyLah API integration without rebuilding the app.” It completed the changes in minutes. As a non-programmer, I estimate that understanding and attempting those changes myself would have taken several hours, and I might still have needed help.
This was more than writing something I could have written slowly. Connecting the screen to a serverless function and handling API responses were tasks I could not confidently complete independently. The agent helped me make progress while keeping the existing app.

# Q.2 Where did it cost you time, and whose fault was that?

I lost the most time repeatedly asking how to make “keyConfigured” true, even though “upstreamStatus: 200” already showed a successful connection. My instruction was unfinished: I asked to change a status without understanding whether my goal was to configure a key or display real weather.

The agent explained the difference correctly, but its repeated setup instructions also prolonged my focus on the key. I should have asked, “Is the connection working, and why is real weather not showing?” My lesson is to define the actual problem before requesting a fix.

# Q.3 Did it ever hand you something that looked right and was not? 

Yes. The agent helped build a convincing weather screen showing 28°C, a 75% chance of rain, and an umbrella recommendation. Although labelled as demo data, the precise numbers made the app look more capable than it was. When connecting the two-hour forecast API, I learned that it supplied forecast descriptions, not those temperature readings, rain percentages, or 12-hour predictions. Connecting one API would not make every feature real. My lesson was to check each displayed claim against the actual response and keep unsupported values clearly labelled or remove them.

# Q.4 What did you have to know in order to supervise it? 

