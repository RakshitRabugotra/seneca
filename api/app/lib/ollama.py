import subprocess
import requests
from time import sleep
from logger import logger
from typing import Literal
from ollama import Client, Message


class Ollama:
    # Create the llama client
    client = Client(host="http://localhost:11434")

    # The current model to choose
    model = "llama2"

    def __init__(self):
        """
        Initialize the chat system with Ollama
        """
        logger.info("Ollama: Initializing Ollama server")
        # Try to initialize the server
        # success = self.__init_server()
        # if not success:
        #     message = "Ollama: cannot proceed without server initialization (initialization failed)"
        #     logger.error(message)
        #     raise Exception(message)

        logger.info(f"Ollama: Initializing Ollama model: '{Ollama.model}'")
        # If successful, we will try to initialize the model
        # success = self.__init_model()
        # if not success:
        #     message = f"Ollama: cannot proceed without model('{Ollama.model}') initialization (initialization failed)"
        #     logger.error(message)
        #     raise Exception(message)

    def message(
        self, role: Literal["user", "assistant", "system", "tool"], content: str
    ):
        """
        Chat message.
        """
        return Message(role=role, content=content)

    def chat(self, messages: list[Message]):
        return self.client.chat(model=Ollama.model, messages=messages, stream=False)

    def __init_server(self):
        command = ["ollama", "serve"]
        try:
            # Start the server in a subprocess
            process = subprocess.Popen(
                command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            logger.info(
                "Ollama: Server process started, waiting for it to initialize..."
            )

            # Wait for the server to start by checking the HTTP endpoint
            for _ in range(10):
                try:
                    response = requests.get("http://localhost:11434/health")
                    if response.status_code == 200:
                        logger.info("Ollama: Server initialized successfully")
                        return True
                except requests.ConnectionError:
                    pass
                sleep(1)

            logger.error("Ollama: Server did not respond within the expected time")
            process.terminate()
            return False
        except Exception as e:
            logger.error(f"Ollama: Failed to start the server | Error: {str(e)}")
            return False

    def __init_model(self):
        command = ["ollama", "run", Ollama.model]
        try:
            # Start the model initialization in a subprocess
            process = subprocess.Popen(
                command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            logger.info(
                f"Ollama: Model '{Ollama.model}' process started, waiting for it to initialize..."
            )

            # Wait for the model to initialize by checking the output or any other validation method
            # You may need to adapt this according to how the model confirms initialization
            stdout, stderr = process.communicate(
                timeout=30
            )  # Wait up to 30 seconds for initialization

            if process.returncode == 0:
                logger.info(
                    f"Ollama: Model '{Ollama.model}' initialized successfully | STDOUT: {stdout}"
                )
                return True
            else:
                logger.error(
                    f"Ollama: Error initializing model '{Ollama.model}' | STDERR: {stderr}"
                )
                return False

        except subprocess.TimeoutExpired:
            process.terminate()
            logger.error(
                f"Ollama: Model '{Ollama.model}' initialization timed out and was terminated"
            )
            return False

        except Exception as e:
            logger.error(
                f"Ollama: Failed to start model '{Ollama.model}' | Error: {str(e)}"
            )
            return False
