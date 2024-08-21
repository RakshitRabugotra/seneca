from flask import Blueprint, request, Response
from weasyprint import HTML, CSS
import markdown2
import io


# Custom modules
from logger import logger

from app.utils.validators import get_or_none, validate_none
from app.utils.responses import (
    NotFoundException,
)

# Constants
from app.constants import STRINGS


"""
The APIs to get the current session info
"""
download_bp = Blueprint("download", __name__)

# Define a basic CSS for styling the PDF
css = """
    body {
        font-family: Arial, sans-serif;
        margin: 1in;
        color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
        color: #007BFF;
    }
    pre {
        background-color: #f4f4f4;
        padding: 0.5em;
        border-radius: 4px;
    }
    code {
        background-color: #f4f4f4;
        padding: 0.2em;
        border-radius: 4px;
    }
    """


@download_bp.route("/pdf", methods=["POST"])
def download_pdf():
    # Extract the json from the request
    __json = request.get_json()

    # Get Markdown content from POST request
    markdown_content = get_or_none(__json, "query")

    # If any of the fields is none, then return error
    exception = validate_none(NotFoundException, query=markdown_content)
    if exception is not None:
        return exception.response

    # Move the buffer's file pointer to the beginning
    buffer = io.BytesIO()

    # Convert Markdown to HTML
    html_content = markdown2.markdown(markdown_content)

    # Create a BytesIO buffer to hold the PDF data
    buffer.seek(0)

    # Generate PDF from HTML content with CSS
    HTML(string=html_content).write_pdf(buffer, stylesheets=[CSS(string=css)])

    # Move the buffer's file pointer to the beginning
    buffer.seek(0)

    # Return the PDF file as a response
    return Response(
        buffer,
        mimetype="application/pdf",
        headers={"Content-Disposition": "attachment;filename=converted_document.pdf"},
    )
