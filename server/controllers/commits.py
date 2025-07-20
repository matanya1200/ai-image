from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from utils.auth_utils import get_current_user
from utils.permissions import self_or_admin,self_only,admin_only,ensure_not_blocked
from database import get_connection

router = APIRouter(prefix="/commits", tags=["Commits"])



class CommitCreateRequest(BaseModel):
    comment: str
    rating: Optional[int] = None


class CommitUpdateRequest(BaseModel):
    comment: Optional[str] = None
    rating: Optional[int] = None


def get_commit_owner_id(commit_id: int) -> int:
    """Helper function to get the owner ID of a commit"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM comments WHERE id = %s", (commit_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return result[0]


def validate_rating(rating: int):
    """Helper function to validate rating value"""
    if rating is not None and not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    


@router.get("/")
def get_all_commits(page: int = 1, limit: int = 25, user=Depends(get_current_user)):
    admin_only(user)

    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 25
    
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total FROM comments")
    total_count = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT c.id, c.comment, c.rating, c.image_id, c.user_id, c.updated_at, u.name AS user_name 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT %s OFFSET %s
    """, (limit, offset))

    commits = cursor.fetchall()
    cursor.close()
    conn.close()
    
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "commits": commits,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    }


@router.get("/{commit_id}")
def get_commit_by_id(commit_id: int, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_commit_owner_id(commit_id)
    self_only(user, owner_id)

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM comments WHERE id = %s", (commit_id,))
    commit = cursor.fetchone()
    cursor.close()
    conn.close()

    if not commit:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"commit": commit}


@router.get("/image/{image_id}")
def get_commits_by_image(image_id: int, page: int = 1, limit: int = 25):
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 25
    
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total FROM comments WHERE image_id = %s", (image_id,))
    total_count = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT c.id, c.comment, c.rating, c.image_id, c.updated_at, c.user_id, u.name AS user_name 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.image_id = %s
        ORDER BY c.created_at DESC
        LIMIT %s OFFSET %s
    """, (image_id, limit, offset))

    commits = cursor.fetchall()
    cursor.close()
    conn.close()

    total_pages = (total_count + limit - 1) // limit
    
    return {
        "commits": commits,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    }



@router.post("/{image_id}")
def add_commit(image_id:int, data: CommitCreateRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    validate_rating(data.rating)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM comments WHERE image_id = %s AND user_id = %s",
        (image_id, user["sub"])
    )
    existing_comment = cursor.fetchone()
    
    if existing_comment:
        cursor.close()
        conn.close()
        raise HTTPException(
            status_code=400, 
            detail="You have already commented on this image. Use PUT to update your comment."
        )
    
    cursor.execute(
        "INSERT INTO comments (image_id, user_id, comment, rating) VALUES (%s, %s, %s, %s)",
        (image_id, user["sub"], data.comment, data.rating)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "comment added successfully"}



@router.put("/{commit_id}")
def update_commit(commit_id: int, data: CommitUpdateRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_commit_owner_id(commit_id)
    self_only(user, owner_id)

    if data.rating is not None:
        validate_rating(data.rating)

    update_fields = []
    params = []
    if data.comment is not None:
        update_fields.append("comment = %s")
        params.append(data.comment)
    if data.rating is not None:
        update_fields.append("rating = %s")
        params.append(data.rating)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    params.append(commit_id)
    sql = f"UPDATE comments SET {', '.join(update_fields)} WHERE id = %s"
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params)
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Comment updated successfully"}



@router.delete("/{commit_id}")
def delete_commit(commit_id: int, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_commit_owner_id(commit_id)
    self_or_admin(user, owner_id)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM comments WHERE id = %s", (commit_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Comment deleted successfully"}
