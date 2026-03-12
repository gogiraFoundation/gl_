# Comment Submission Fix

## Issue
Comments were not submitting from the frontend, showing "Failed to submit comment" error.

## Root Cause
The `CommentCreateSerializer` required a `post` field, but the frontend wasn't sending it (since it's in the URL path). The view sets the post automatically, so the field should be optional.

## Fixes Applied

### 1. Backend Fix
**File**: `gogir-labs-be/apps/blog/serializers.py`

Made the `post` field optional in `CommentCreateSerializer`:
```python
class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'name', 'email', 'content']
        extra_kwargs = {
            'post': {'required': False}  # Post is set in the view, not from request data
        }
```

### 2. Improved Response Format
**File**: `gogir-labs-be/apps/blog/views.py`

Updated the response to include a success message:
```python
return Response({
    'id': comment.id,
    'name': comment.name,
    'content': comment.content,
    'created_at': comment.created_at,
    'message': 'Comment submitted successfully. It will appear after moderation.'
}, status=status.HTTP_201_CREATED)
```

### 3. Frontend Error Handling
**File**: `gogir-labs-fe/components/blog/Comments.tsx`

- Improved error messages to show specific error details
- Added console logging for debugging
- Better success message display
- Fixed mutation handling to use `mutate` instead of `mutateAsync` in `onSubmit`

## Testing

### API Test
```bash
curl -X POST 'http://localhost:8000/api/v1/blog/posts/3/comments/' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","content":"Test comment"}'
```

**Result**: ✅ Returns 201 Created with comment data

### Frontend Test
1. Navigate to any blog post
2. Fill out comment form
3. Submit comment
4. Should see success message: "✓ Comment submitted successfully!"
5. Comment appears after admin approval

## Comment Moderation Workflow

1. **User submits comment** → Comment created with `approved=False`
2. **Admin approves** → Go to Django admin > Blog > Comments
3. **Comment appears** → Approved comments show on frontend

## Status
✅ **Fixed and Working**

Comments can now be submitted successfully from the frontend. The comment will be created and will appear after admin approval.

