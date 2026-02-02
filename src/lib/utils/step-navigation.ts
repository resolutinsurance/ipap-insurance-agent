import type { ReadonlyURLSearchParams } from "next/navigation";

type RouterLike = {
  replace: (href: string) => void;
};

type SearchParamsLike = ReadonlyURLSearchParams | URLSearchParams;

export function goToStepInUrl(params: {
  router: RouterLike;
  pathname: string;
  searchParams: SearchParamsLike;
  step: number;
  maxStep: number;
  minStep?: number;
  stepParam?: string;
}) {
  const {
    router,
    pathname,
    searchParams,
    step,
    maxStep,
    minStep = 1,
    stepParam = "step",
  } = params;

  const nextStep = Math.max(minStep, Math.min(step, maxStep));
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set(stepParam, String(nextStep));
  router.replace(`${pathname}?${nextParams.toString()}`);
}
