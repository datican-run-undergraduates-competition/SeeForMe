import eventlet
eventlet.monkey_patch() 

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from image_manipulation import process_frames
from detect_and_guide import detect_and_guide
from ultralytics import YOLO

model = YOLO("yolo11n.pt")


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")  

@app.route("/")
def index():
    return jsonify({"message": "hello from Fadexadex"})

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("send_frames_batch")
def handle_message(data):
    try:
        raw_frames = data.get("frames", [])
        processed_frames = process_frames(raw_frames)

        guidance = detect_and_guide(processed_frames,model)
        print(f"Prediction completed, here are my conclusions: {guidance}")
        emit("server_response", {"message": f"{guidance}"})
    except Exception as e:
        import traceback
        print("Error occurred:", traceback.format_exc())
        emit("server_error", {"error": str(e)})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8000)
