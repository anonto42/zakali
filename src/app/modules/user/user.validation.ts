import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    location: z.string({ required_error: 'Location is required' }),
    profile: z.string().optional(),
  }),
});

const createUploadPhotosSchema = z.object({
  body: z.object({
    image: z.array(z.instanceof(File)).refine(files => files.length > 0, {
      message: "At least one image is required",
    }).refine(files => files.every(file => file.size <= 10 * 1024 * 1024), {
      message: "Each image should not exceed 10MB",
    }).refine(files => files.every(file => file.type.startsWith("image/")), {
      message: "All files must be images",
    }),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

const enhanceProfileZodSchema = z.object({
  body: z.object({
    gender: z.string().optional(),
    age: z.number().optional(),
    phone: z.string().optional(),
    country: z.string().optional(),
    peferredCountry: z.string().optional(),
    education: z.string().optional(),
    language: z.string().optional(),
    religion: z.string().optional(),
    marriedStatus: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    hearColour: z.string().optional(),
    eyeColour: z.string().optional(),
    interestedIn: z.string().optional(),
    lookingFor: z.string().optional(),
    aboutMe: z.string().optional(),
    myChoice: z.array(z.string()).optional(),
  })
});

const addToListSchema = z.object({
  body: z.object({
    targetID: z.string({ required_error: 'Target ID is required' }),
  })
});

const searchProfilesSchema = z.object({
  body: z.object({
    searchQuery: z.string({ required_error: 'Search query is required' }),
    page: z.number().optional(),
    limit: z.number().optional(),
  })
});

const filterProfileSchema = z.object({
  body: z.object({
    age_from: z.number().optional(),
    age_to: z.number().optional(),
    distance: z.number().optional(),
    gender: z.string().optional(),
    interestedIn: z.string().optional(),
    lookingFor: z.string().optional(),
    preferredCountry: z.string().optional(),
    education: z.string().optional(),
    language: z.string().optional(),
    religion: z.string().optional(),
    marriedStatus: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    hearColour: z.string().optional(),
    eyeColour: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
  })
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  enhanceProfileZodSchema,
  addToListSchema,
  searchProfilesSchema,
  filterProfileSchema,
  createUploadPhotosSchema,
};
