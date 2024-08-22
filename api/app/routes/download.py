from flask import Blueprint, request, Response
from flask_login import current_user
from weasyprint import HTML, CSS
import markdown2
import io


# Custom modules
from logger import logger

from app.res.styles import A4_PRINT_CSS
from app.utils.validators import get_or_none, validate_none
from app.utils.responses import (
    APIBaseException,
)

# Constants
from app.constants import STRINGS


"""
The APIs to get the current session info
"""
download_bp = Blueprint("download", __name__)


@download_bp.route("/pdf", methods=["POST"])
def download_pdf():
    # Extract the json from the request
    __json = request.get_json()

    # Get Markdown content from POST request
    markdown_content = get_or_none(__json, "query")

    # If any of the fields is none, then return error
    exception = validate_none(APIBaseException, query=markdown_content)
    if exception is not None:
        return exception.response

    logger.info(
        f"Generating document/pdf for user {dict(current_user).get('id', None)} | "
    )
    # Move the buffer's file pointer to the beginning
    buffer = io.BytesIO()

    # Convert Markdown to HTML
    html_content = markdown2.markdown(markdown_content)

    # Create a BytesIO buffer to hold the PDF data
    buffer.seek(0)

    # Generate PDF from HTML content with CSS
    HTML(string=html_content).write_pdf(buffer, stylesheets=[CSS(string=A4_PRINT_CSS)])

    # Move the buffer's file pointer to the beginning
    buffer.seek(0)

    # Return the PDF file as a response
    return Response(
        buffer,
        mimetype="application/pdf",
        headers={"Content-Disposition": "attachment;filename=converted_document.pdf"},
    )
