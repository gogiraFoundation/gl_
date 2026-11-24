"""Small parsers for untrusted query parameters."""


def bounded_int(value, *, default: int, minimum: int, maximum: int) -> int:
    """Parse an int and clamp it. Non-numeric input returns the default."""
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return default
    return max(minimum, min(parsed, maximum))
