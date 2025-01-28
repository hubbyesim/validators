// Common validation patterns used across the application
export const patterns = {
    /**
     * (destination) - Must be 2-3 uppercase letters
     */
    destination: /^[A-Z]{2,3}$/,
    /** 
     * (size) - Validates data package size format
     * Valid examples: - "500MB" - "1GB" - "1.5GB" - "10.25MB"
    */
    size: /^[0-9]\d*(\.\d+)?(MB|GB)$/,
  } as const;