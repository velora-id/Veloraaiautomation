import secrets
import hashlib
from typing import Tuple


def generate_api_key() -> Tuple[str, str]:
    """
    Generate API key and its hash

    Returns:
        Tuple of (api_key, key_hash)
        api_key: The actual key to show user (vla_...)
        key_hash: Hashed version to store in database
    """
    # Generate random key
    random_key = secrets.token_urlsafe(32)

    # Create API key with prefix
    api_key = f"vla_{random_key}"

    # Hash the key for storage
    key_hash = hash_api_key(api_key)

    return api_key, key_hash


def hash_api_key(api_key: str) -> str:
    """
    Hash API key for secure storage

    Args:
        api_key: The API key to hash

    Returns:
        SHA-256 hash of the key
    """
    return hashlib.sha256(api_key.encode()).hexdigest()


def get_api_key_prefix(api_key: str) -> str:
    """
    Get display prefix of API key (first 12 chars)

    Args:
        api_key: Full API key

    Returns:
        First 12 characters for display (e.g., "vla_abc12345...")
    """
    return api_key[:12] + "..." if len(api_key) > 12 else api_key
