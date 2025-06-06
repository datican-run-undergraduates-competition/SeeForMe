import numpy as np
import cv2 


def process_frames(incoming_frames):

    frame_list = []

    for binary in incoming_frames:
        try:
            frame_np = np.frombuffer(binary, dtype=np.uint8)
            frame = cv2.imdecode(frame_np, cv2.IMREAD_COLOR)    
            if frame is not None:
                frame_list.append(frame)
        except Exception as e:
            print(f"Error processing frame: {e}")
    return frame_list