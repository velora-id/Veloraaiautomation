import logging
import sys
from loguru import logger
from app.core.config import settings


def setup_logger():
    """
    Setup application logger using loguru
    """
    # Remove default handler
    logger.remove()

    # Add custom handler
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
        level="DEBUG" if settings.DEBUG else "INFO"
    )

    # Add file handler for production
    if not settings.DEBUG:
        logger.add(
            "logs/velora_{time:YYYY-MM-DD}.log",
            rotation="1 day",
            retention="30 days",
            compression="zip",
            level="INFO"
        )

    return logger


# Create global logger instance
app_logger = setup_logger()
