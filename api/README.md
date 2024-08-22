# Seneca Backend API Documentation

## Overview

The Ollama backend API provides services for user authentication, communication with the LLaMA2 model, and generating PDF documents from markdown text. The API uses Flask as its backend framework, with Flask-Login for authentication. The initial version of the API is 0.0.1.

## Authentication

**Authentication** is managed using `flask-login`. The following endpoints are available under `/api/auth` for user registration, login, logout, and retrieving the current user session.

### Endpoints

### 1. `/api/auth`

Handles all authentication-related tasks.

- **GET `/@me`**

  - **Purpose**: Retrieves the current logged-in user.
  - **Response**:
    - **200 OK**: Returns user details if a user is logged in.
    - **409 Unauthorized**: If no user is logged in.
  - **Response Payload**:
    ```json
    {
      "msg": "Current user data",
      "raw_msg": "",
      "code": 200,
      "payload": {
        "username": "example_user",
        "email": "user@example.com"
      }
    }
    ```

- **GET `/logout`**

  - **Purpose**: Logs out the current user.
  - **Response**:
    - **200 OK**: Confirms the user has been logged out.
  - **Response Payload**:
    ```json
    {
      "msg": "Logged out successfully",
      "raw_msg": "",
      "code": 200,
      "payload": null
    }
    ```

- **POST `/register`**

  - **Purpose**: Registers a new user.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "username": "example_user",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    - **201 Created**: User successfully registered.
  - **Response Payload**:
    ```json
    {
      "msg": "User registered successfully",
      "raw_msg": "",
      "code": 201,
      "payload": null
    }
    ```

- **POST `/login`**
  - **Purpose**: Logs in an already registered user.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    - **200 OK**: User successfully logged in.
  - **Response Payload**:
    ```json
    {
      "msg": "Logged in successfully",
      "raw_msg": "",
      "code": 200,
      "payload": {
        "username": "example_user",
        "email": "user@example.com"
      }
    }
    ```

### 2. `/api/ollama`

Handles interaction with the LLaMA2 model to generate markdown content.

- **POST `/chat`**

  - **Purpose**: Generates a response from the LLaMA2 model based on the input query.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "query": "Your query here"
    }
    ```
  - **Response**:
    - **200 OK**: Successfully generated markdown content.
  - **Response Payload**:
    ```json
    {
      "msg": "Response from LLaMA2 model",
      "raw_msg": "Generated markdown content",
      "code": 200,
      "payload": {
        "created_at": string,
        "done": boolean,
        "done_reason": string,
        "eval_count": number,
        "eval_duration": number,
        "load_duration": number,
        "message": {
            "content": string,
            "role": "assistant"
        },
        "model": string,
        "prompt_eval_count": number,
        "prompt_eval_duration": number,
        "total_duration": number
      }
    }
    ```

- **POST `/chat`**

  - **Purpose**: Generates a response from the LLaMA2 model based on the input query.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "query": "Your query here"
    }
    ```
  - **Response**:
    - **200 OK**: Successfully generated markdown content.
  - **Response Payload**:
    ```json
    {
      "msg": "Response from LLaMA2 model",
      "raw_msg": "Generated markdown content",
      "code": 200,
      "payload": {
        "created_at": string,
        "done": boolean,
        "done_reason": string,
        "eval_count": number,
        "eval_duration": number,
        "load_duration": number,
        "message": {
            "content": string,
            "role": "assistant"
        },
        "model": string,
        "prompt_eval_count": number,
        "prompt_eval_duration": number,
        "total_duration": number
      }
    }
    ```

- **POST `/chat-stream`**

  - **Purpose**: Generates a response stream from the LLaMA2 model based on the input query.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "query": "Your query here"
    }
    ```
  - **Response**:
    - **200 OK**: Successfully generated markdown content.
  - **Response Payload**:

    During the stream

    ```json
    {
      "msg": "Response from LLaMa2 model",
      "raw_msg": "Generated markdown content",
      "code": 200,
      "payload": {
        "model": "<model-name:string>",
        "created_at": "<timestamp:string>",
        "message": {
          "role": "assistant",
          "content": "<chunk of the content in:string>"
        },
        "done": false
      }
    }
    ```

    When the stream ends

    ```json
    {
      "msg": "Response from LLaMA2 model",
      "raw_msg": "Generated markdown content",
      "code": 200,
      "payload": {
        "created_at": "<timestamp:string>",
        "done": true,
        "done_reason": "<reason:string>",
        "eval_count": "<:number>",
        "eval_duration": "<:number>",
        "load_duration": "<:number>",
        "message": {
          "content": "<last chunk of the content>",
          "role": "assistant"
        },
        "model": "<model-name:string>",
        "prompt_eval_count": "<:number>",
        "prompt_eval_duration": "<:number>",
        "total_duration": "<:number>"
      }
    }
    ```

### 3. `/api/download`

Handles downloading content generated by the LLaMA2 model as a PDF.

- **POST `/pdf`**
  - **Purpose**: Converts the provided markdown text into a PDF file.
  - **Request Headers**:
    - `Content-Type: application/json`
  - **Request Body**:
    ```json
    {
      "query": "<Markdown content to convert>"
    }
    ```
  - **Response**:
    - **200 OK**: PDF successfully generated.
  - **Response Payload**:
    - Returns the PDF file as a binary stream.

## Error Handling

All errors are handled internally within the routes, and appropriate responses are returned based on the exceptions encountered.

## Versioning

The API starts at version 0.0.1. No versioning system is implemented for now.
