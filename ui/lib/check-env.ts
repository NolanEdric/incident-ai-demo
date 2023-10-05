if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}


if (!process.env.AUDIO_STORAGE_PATH) {
    throw new Error('Invalid/Missing environment variable: "AUDIO_STORAGE_PATH"');
}

if (!process.env.AI_SERVICE) {
    throw new Error('Invalid/Missing environment variable: "AI_SERVICE"');
}


if (!process.env.MONGODB_NAME) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_NAME"')
}

if (!process.env.MONGODB_COLLECTION) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_COLLECTION"')
}

export const uri = process.env.MONGODB_URI
export const db_name = process.env.MONGODB_NAME;
export const db_collection = process.env.MONGODB_COLLECTION;
export const audio_storage_path = process.env.AUDIO_STORAGE_PATH
export const ai_service = process.env.AI_SERVICE
