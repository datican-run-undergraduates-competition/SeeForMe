import os
import json
from dotenv import load_dotenv
from groq import Groq


load_dotenv()

def provide_guidance(detection_objects):

        client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )

        prompt = f"""
        You are providing real-time navigation guidance for someone who cannot see. Based on these object detections:
        {json.dumps(detection_objects, indent=2)}

        SCENE INTERPRETATION:
        - The image dimensions are 384x640 pixels
        - The user is positioned at the bottom center of the frame
        - [0,0] is top left, [384,640] is bottom right
        - Lower Y values = further ahead of user
        - X values left of center = objects to user's left
        - X values right of center = objects to user's right
        - Larger bounding boxes indicate closer objects

        GUIDANCE RULES:
        1. Provide a SINGLE clear instruction with direction and approximate distance
        2. Use simple phrases like "turn slightly right" or "step left"
        3. Specify people or obstacles by their position relative to the user
        4. Focus ONLY on the most immediate navigation need
        5. NO numbers, statistics, or visual descriptions
        6. NO explanations or reasoning, just direct guidance
        7. Use 15 words or fewer

        don't speak about what you will do or any internal details, just give the instructions and don't talk about what you focused only what is needed

        OUTPUT EXAMPLE: "Turn slightly right to avoid person walking toward you."
        """

        chat_completion = client.chat.completions.create(
            messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
            ],
            model="llama-3.1-8b-instant",
        )

        return chat_completion.choices[0].message.content

