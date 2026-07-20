import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  UseFormReturn,
  DefaultValues,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

export function useValidatedForm<S extends z.ZodTypeAny>(
  schema: S,
  defaultValues?: DefaultValues<z.infer<S>>,
): UseFormReturn<z.infer<S>> {
  const options: UseFormProps<z.infer<S>> = {
    resolver: zodResolver(schema),
  };
  if (defaultValues !== undefined) {
    options.defaultValues = defaultValues;
  }
  return useForm<z.infer<S>>(options);
}
