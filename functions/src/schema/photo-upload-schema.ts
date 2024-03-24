import { zfd } from 'zod-form-data';
import { UploadFileResultSchema } from './upload-file-result-schema';
import { z } from 'zod';

export const PhotoUploadSchema = zfd.formData(
  z
    .object({
      files: z.array(UploadFileResultSchema),
      userId: z.string(),
    })
    .strict(),
);

export type PhotoUploadRequest = z.infer<typeof PhotoUploadSchema>;
