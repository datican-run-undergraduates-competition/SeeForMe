from groq_service import provide_guidance


def detect_and_guide(frame_list, model):
    detected_objects = []

    try:
        for frame in frame_list:
            try:
                results = model.track(frame, persist=True, conf=0.5, tracker='bytetrack.yaml')

                if results and results[0].boxes:
                    for box, conf, cls in zip(results[0].boxes.xyxy, results[0].boxes.conf, results[0].boxes.cls):
                        x1, y1, x2, y2 = map(int, box)
                        confidence = float(conf.item())
                        object_name = model.names[int(cls.item())]

                        detected_objects.append({"name": object_name, "confidence": confidence, "box": [x1, y1, x2, y2]})

                        print(f"Object: {object_name} ({confidence:.2f}), Box: [{x1}, {y1}, {x2}, {y2}]")
            except Exception as e:
                print(f"Error processing frame: {e}")

        if detected_objects:
            try:
                llm_response = provide_guidance(detected_objects)
                print(llm_response)
                return llm_response
            except Exception as e:
                print(f"Error providing guidance: {e}")
                return "Error providing guidance"
        else:
            return "No detected objects"

    except Exception as e:
        print(f"Unexpected error: {e}")
        return "An error occurred during detection"
