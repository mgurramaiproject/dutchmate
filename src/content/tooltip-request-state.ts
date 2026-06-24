import { LookupSession } from "./lookup-session";

export type TooltipContext = "hover" | "selection";

export class TooltipRequestState<T = never> extends LookupSession<T> {}
