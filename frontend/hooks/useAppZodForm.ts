// boilerplate code to utilize React Hook Form + Zod

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Resolver,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

type AnyZodObject = z.ZodType<Record<string, any>, any, any>;

type UseAppZodFormParams<TSchema extends AnyZodObject> = {
  schema: TSchema;
} & UseFormProps<z.infer<TSchema>>;

export function useAppZodForm<TSchema extends AnyZodObject>(
  params: UseAppZodFormParams<TSchema>,
): UseFormReturn<z.infer<TSchema>> {
  const { schema, ...rest } = params;

  const resolver = zodResolver(schema) as Resolver<z.infer<TSchema>>;

  return useForm<z.infer<TSchema>>({
    resolver,
    ...rest,
  });
}

export type AppZodFormValues<TSchema extends AnyZodObject> = z.infer<TSchema>;
