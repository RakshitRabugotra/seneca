from flask import Blueprint, request
from flask_login import login_required, login_user, logout_user, current_user

# Custom modules
from app import login_manager, db, bcrypt
from logger import logger
from app.models.user import User

from app.utils.validators import validate_none, validate_email, get_or_none
from app.utils.responses import (
    APIBaseException,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
    Success,
)

# Constants
from app.constants import STRINGS


"""
The APIs to get the current session info
"""
auth_bp = Blueprint("auth", __name__)


@login_manager.user_loader
def load_user(user_id) -> User:
    return User.query.get(user_id)


@auth_bp.route("/@me", methods=["GET"])
@login_required
def user_current():
    # If the current user is found, return it
    if current_user:
        return {"user": User.serialize(current_user)}, 200
    # Else, return not found
    return NotFoundException(STRINGS["user"]["not-found"]).response


@auth_bp.route("/logout", methods=["GET"])
@login_required
def user_logout():
    try:
        logout_user()
        return "OK", 200
    except Exception as e:
        return APIBaseException(msg=str(e), code=500).response


"""
The APIs for user_auth
"""


@auth_bp.route("/register", methods=["POST"])
def user_register():
    """
    Registers the user from the form data in request
    """
    # Extract the json from the request
    __json = request.get_json()

    # Get the data from the form
    username = get_or_none(__json, "username")
    email = get_or_none(__json, "email")
    password = get_or_none(__json, "password")

    # If any of the fields is none, then return error
    exception = validate_none(
        APIBaseException, username=username, email=email, password=password
    )
    if exception is not None:
        return exception.response

    # Validate the email of the user
    exception = validate_email(APIBaseException, email=email)
    if exception is not None:
        return exception.response

    # Check if the user exists
    user = User.query.filter_by(email=email).first()
    if user is not None:
        # The user already exists
        return ConflictException(STRINGS["user"]["already-exists"]).response

    # Else, this is a new user
    new_user = User(
        username=username, email=email, password=bcrypt.generate_password_hash(password)
    )
    # Add this user to the session
    db.session.add(new_user)
    db.session.commit()
    # Add this to the logs
    logger.info(msg=STRINGS["user"]["register-success"].format(new_user.email))

    return Success(
        msg="OK",
        payload={
            "username": username,
            "email": email,
        },
    ).response


@auth_bp.route("/login", methods=["POST"])
def user_login():
    """
    Logs in the already registered user
    """
    # Extract the json from the request
    __json = request.get_json()

    # Get the data from the form
    email = get_or_none(__json, "email")
    password = get_or_none(__json, "password")

    # If any of the fields is none, then return error
    exception = validate_none(APIBaseException, email=email, password=password)
    if exception is not None:
        return exception.response

    # Check if the email is found for the given user
    user = User.query.filter_by(email=email).first()
    if user is None:
        # The user doesn't exist in the database
        return NotFoundException(STRINGS["user"]["not-found"]).response

    # Else, check if the given password is valid or not
    try:
        assert bcrypt.check_password_hash(user.password, password)
    except AssertionError:
        # The password doesn't match
        return UnauthorizedException(STRINGS["user"]["unauthorized"])

    # The passwords match, and the auth is valid
    login_user(user)
    # Log this
    logger.info(msg=STRINGS["user"]["login-success"].format(user.email))

    return Success(
        msg="OK",
        payload={
            "email": email,
        },
    ).response
