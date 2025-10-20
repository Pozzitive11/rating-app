# Zod Validation Error Handling

This project uses `zod-validation-error` to provide user-friendly validation error messages.

## How It Works

1. **Zod schemas** validate incoming requests
2. If validation fails, `ZodError` is thrown
3. **Error handler** catches it and uses `zod-validation-error` to format
4. **Client receives** a clear, actionable error message

## Error Response Format

All errors return a simple, clean format:

```json
{
  "message": "Human-readable error message"
}
```

## Example Error Responses

### Missing Required Field

**Request:**

```json
POST /api/supabase/beer
{
  "brewery": "Awesome Brewery"
  // Missing "name" and "rating"
}
```

**Response (400):**

```json
{
  "message": "Validation error: Required at 'name'; Required at 'rating'"
}
```

### Invalid Rating Range

**Request:**

```json
POST /api/supabase/beer
{
  "name": "Great IPA",
  "rating": 10
}
```

**Response (400):**

```json
{
  "message": "Validation error: Number must be less than or equal to 5 at 'rating'"
}
```

### Invalid URL Format

**Request:**

```json
POST /api/supabase/beer
{
  "name": "IPA Beer",
  "rating": 4.5,
  "mainImage": "not-a-valid-url"
}
```

**Response (400):**

```json
{
  "message": "Validation error: Invalid url at 'mainImage'"
}
```

### Invalid Search Query

**Request:**

```
GET /api/beers/search/
```

**Response (400):**

```json
{
  "message": "Validation error: Search query cannot be empty at 'query'"
}
```

### Multiple Validation Errors

**Request:**

```json
POST /api/supabase/beer
{
  "name": "",
  "rating": 10,
  "mainImage": "invalid-url"
}
```

**Response (400):**

```json
{
  "message": "Validation error: String must contain at least 1 character(s) at 'name'; Number must be less than or equal to 5 at 'rating'; Invalid url at 'mainImage'"
}
```

### Not Found Error

**Response (404):**

```json
{
  "message": "No beers found for \"nonexistent\""
}
```

### Internal Server Error

**Response (500):**

```json
{
  "message": "Internal server error"
}
```

## Benefits

✅ **Simple & clean** - Just the message, no clutter  
✅ **User-friendly** - Clear, actionable error messages  
✅ **Consistent format** - All errors follow same structure  
✅ **Multiple errors** - Shows all validation issues at once  
✅ **Type-safe** - TypeScript validation at compile time + runtime

## Configuration

The error handler uses these settings:

```typescript
const validationError = fromZodError(err, {
  prefix: "Validation error",
  prefixSeparator: ": ",
});
```

You can customize the prefix and separator in `middleware/errorHandler.ts`.
