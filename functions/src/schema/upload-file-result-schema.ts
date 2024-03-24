import { z } from 'zod';

export const UploadFileResultSchema = z.object({
  fileName: z.string(),
  fieldName: z.string(),
  uploadResult: z.string(),
});
