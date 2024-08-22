from flask import Response, request, Blueprint
from flask_login import login_required

import json

# Custom modules
from logger import logger

from app.utils.validators import validate_none
from app.utils.responses import (
    Success,
)

# Constants
from app import ollama_client
from app.constants import STRINGS


"""
The APIs to get the current session info
"""
ollama_bp = Blueprint("ollama", __name__)


def stream_chat(query):
    messages = [
        ollama_client.message(
            role="system",
            content="Your work is to help the human get through their problem. Generate all responses in Markdown",
        ),
        ollama_client.message(
            role="user",
            content=query,
        ),
    ]

    for chunk in ollama_client.async_chat(messages=messages):
        # Convert the dictionary to a JSON string and then encode it to bytes
        chunk = json.dumps(chunk)
        # logger.info(f"Ollama: Generated chunk {chunk} | for the query: {query}")
        yield chunk.encode("utf-8")


@ollama_bp.route("/chat-stream", methods=["POST"])
def chat_stream():
    __json = request.get_json()
    query = __json["query"]
    logger.info(f"Ollama: Generating stream response for the prompt: '{query}'")
    return Response(stream_chat(query), content_type="text/event-stream")


@ollama_bp.route("/chat", methods=["POST"])
# @login_required
def chat():
    # Get the required prompt from the body of the request
    __json = request.get_json()
    query = __json["query"]

    messages = [
        ollama_client.message(
            role="system",
            content="Your work is to help the human get through their problem. Generate all responses in Markdown",
        ),
        ollama_client.message(
            role="user",
            content=query,
        ),
    ]
    logger.info(f"Ollama: Generating response for the prompt: '{query}'")
    return Success(
        msg="success", payload=ollama_client.chat(messages=messages)
    ).response
