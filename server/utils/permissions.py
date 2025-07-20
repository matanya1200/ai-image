from fastapi import HTTPException, status


def ensure_not_blocked(user: dict):
    print(user)
    if user.get("is_blocked"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is blocked"
        )


def admin_only(user: dict):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this"
        )


def self_or_admin(user: dict, resource_owner_id: int):
    if user.get("role") != "admin" and user.get("sub") != str(resource_owner_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )


def self_only(user: dict, resource_owner_id: int):
    if user.get("sub") != str(resource_owner_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
