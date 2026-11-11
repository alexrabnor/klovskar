"use client";
import { startTransition, useActionState, type FormEvent } from "react";

/**
 * Som useActionState, men formuläret töms inte när servern svarar med ett fel.
 *
 * React 19 nollställer ett <form action={…}> efter varje anrop. Ett felmeddelande
 * ("koden finns inte", "välj ett senare datum") tömde då också lagnamn, namn och
 * valt startdatum – och den som fyllde i på nytt fick tyst 1 december i stället.
 * Här skickas formuläret via onSubmit, så fälten står kvar.
 */
export function useBehallAction<S>(action: (s: Awaited<S>, f: FormData) => S | Promise<S>, start: Awaited<S>) {
  const [svar, skicka, vantar] = useActionState<S, FormData>(action, start);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => skicka(data));
  };
  return [svar, onSubmit, vantar] as const;
}
